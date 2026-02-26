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

const router = Router();

// ─── Schemas ──────────────────────────────────────────────

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  accountType: z.enum(['creator', 'fan']).default('fan'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Helpers ──────────────────────────────────────────────

function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign(
    { userId, role },
    env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const refreshToken = jwt.sign(
    { userId, role },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' },
  );

  return { accessToken, refreshToken };
}

// ─── POST /api/auth/register ──────────────────────────────

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  async (req, res, next) => {
    try {
      const { username, email, password, accountType } = req.body;

      // Check existing user
      const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (existing) {
        const field = existing.email === email ? 'Email' : 'Username';
        throw new AppError(409, `${field} already taken`);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user (default rectangular avatar for Creators page)
      const role = accountType === 'creator' ? 'CREATOR' : 'FAN';
      const defaultAvatar = '/images/creators/default-avatar.webp';

      const user = await prisma.user.create({
        data: {
          username,
          email,
          displayName: username,
          passwordHash,
          role,
          avatar: defaultAvatar,
        },
        select: {
          id: true,
          username: true,
          email: true,
          displayName: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
      });

      // Create wallet
      await prisma.wallet.create({
        data: { userId: user.id, balance: 0 },
      });

      // Generate tokens
      const tokens = generateTokens(user.id, user.role);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.status(201).json({
        success: true,
        data: { user, ...tokens },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /api/auth/login ────────────────────────────────

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const { emailOrUsername, password } = req.body;

      // Find user by email or username
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: emailOrUsername },
            { username: emailOrUsername },
          ],
        },
      });

      if (!user) {
        throw new AppError(401, 'Invalid credentials');
      }

      if (user.status !== 'ACTIVE') {
        throw new AppError(403, 'Account is suspended or deactivated');
      }

      // Verify password
      const valid = await bcrypt.compare(password, user.passwordHash);

      if (!valid) {
        throw new AppError(401, 'Invalid credentials');
      }

      // Generate tokens
      const tokens = generateTokens(user.id, user.role);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt,
          },
          ...tokens,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /api/auth/me ────────────────────────────────────

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        avatar: true,
        cover: true,
        bio: true,
        location: true,
        website: true,
        emailVerified: true,
        twoFactorEnabled: true,
        onboardingStep: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/refresh ──────────────────────────────

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(400, 'Refresh token required');
    }

    // Verify token
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
      role: string;
    };

    // Check if token exists in DB
    const stored = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!stored) {
      throw new AppError(401, 'Invalid refresh token');
    }

    // Delete old token
    await prisma.refreshToken.delete({ where: { id: stored.id } });

    // Generate new tokens
    const tokens = generateTokens(payload.userId, payload.role);

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/logout ──────────────────────────────

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    // Delete all refresh tokens for this user
    await prisma.refreshToken.deleteMany({
      where: { userId: req.user!.userId },
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
