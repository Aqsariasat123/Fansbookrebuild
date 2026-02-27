import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { generateAndStoreTokens, ME_SELECT } from '../utils/tokens.js';

const router = Router();

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    accountType: z.enum(['creator', 'fan']).default('fan'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
});

// ─── POST /api/auth/register ──────────────────────────────

router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { username, email, password, accountType } = req.body;
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) {
      throw new AppError(409, `${existing.email === email ? 'Email' : 'Username'} already taken`);
    }
    const role = accountType === 'creator' ? 'CREATOR' : 'FAN';
    const user = await prisma.user.create({
      data: {
        username,
        email,
        displayName: username,
        passwordHash: await bcrypt.hash(password, 12),
        role,
        avatar: '/images/creators/default-avatar.webp',
      },
      select: ME_SELECT,
    });
    await prisma.wallet.create({ data: { userId: user.id, balance: 0 } });
    const tokens = await generateAndStoreTokens(user.id, user.role);
    res.status(201).json({ success: true, data: { user, ...tokens } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/login ────────────────────────────────

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] },
    });
    if (!user) throw new AppError(401, 'Invalid credentials');
    if (user.status !== 'ACTIVE') throw new AppError(403, 'Account is suspended or deactivated');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');
    const tokens = await generateAndStoreTokens(user.id, user.role);
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: ME_SELECT,
    });
    res.json({
      success: true,
      data: {
        user: profile,
        ...tokens,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/me ────────────────────────────────────

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: ME_SELECT,
    });
    if (!user) throw new AppError(404, 'User not found');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/refresh ──────────────────────────────

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError(400, 'Refresh token required');
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
      role: string;
    };
    const stored = await prisma.refreshToken.findFirst({
      where: { token: refreshToken, userId: payload.userId, expiresAt: { gt: new Date() } },
    });
    if (!stored) throw new AppError(401, 'Invalid refresh token');
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const tokens = await generateAndStoreTokens(payload.userId, payload.role);
    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/logout ──────────────────────────────

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await prisma.refreshToken.deleteMany({ where: { userId: req.user!.userId } });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
