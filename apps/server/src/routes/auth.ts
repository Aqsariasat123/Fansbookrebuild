import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit.js';
import { generateAndStoreTokens, ME_SELECT, REFRESH_EXPIRY_MS } from '../utils/tokens.js';
import { sendEmail } from '../utils/email.js';
import { welcomeTemplate } from '../utils/email-templates.js';
import { generateOtp, sendOtpEmail } from '../utils/otp.js';
import { logActivity } from '../utils/audit.js';
import { setRefreshCookie, clearRefreshCookie } from '../utils/cookies.js';

const router = Router();

const REMEMBER_ME_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const registerSchema = z
  .object({
    displayName: z.string().min(1).max(50),
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
  rememberMe: z.boolean().optional(),
});

function slugifyUsername(displayName: string): string {
  return displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 25);
}

async function generateUniqueUsername(displayName: string): Promise<string> {
  const base = slugifyUsername(displayName) || 'user';
  const existing = await prisma.user.findUnique({ where: { username: base } });
  if (!existing) return base;
  for (let i = 0; i < 20; i++) {
    const suffix = Math.floor(Math.random() * 9000 + 1000);
    const candidate = `${base}_${suffix}`;
    const taken = await prisma.user.findUnique({ where: { username: candidate } });
    if (!taken) return candidate;
  }
  return `${base}_${Date.now()}`;
}

// ─── POST /api/auth/register ──────────────────────────────

router.post('/register', registerLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { displayName, email, password, accountType } = req.body;
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new AppError(409, 'Email already taken');

    const username = await generateUniqueUsername(displayName);
    const role = accountType === 'creator' ? 'CREATOR' : 'FAN';
    const user = await prisma.user.create({
      data: {
        username,
        email,
        displayName,
        passwordHash: await bcrypt.hash(password, 12),
        role,
        avatar: null,
      },
      select: ME_SELECT,
    });
    await prisma.wallet.create({ data: { userId: user.id, balance: 0 } });

    // Send welcome email
    const welcome = welcomeTemplate(username);
    sendEmail(email, welcome.subject, welcome.html);

    // Generate and send OTP for email verification
    await generateOtp(user.id, 'EMAIL_VERIFY');
    await sendOtpEmail(user.id);

    const tokens = await generateAndStoreTokens(user.id, user.role);
    logActivity(user.id, 'REGISTER', 'User', user.id, { username, email, role }, req);

    setRefreshCookie(res, tokens.refreshToken, REFRESH_EXPIRY_MS);
    res.status(201).json({
      success: true,
      data: { user, accessToken: tokens.accessToken },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/login ────────────────────────────────

router.post('/login', loginLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { emailOrUsername, password, rememberMe } = req.body;
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] },
    });
    if (!user) throw new AppError(401, 'Invalid credentials');
    if (user.status !== 'ACTIVE') throw new AppError(403, 'Account is suspended or deactivated');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      logActivity(user.id, 'LOGIN_2FA_REQUIRED', 'User', user.id, { method: 'password' }, req);
      return res.json({
        success: true,
        data: { requires2FA: true, userId: user.id },
      });
    }

    const expiryMs = rememberMe ? REMEMBER_ME_EXPIRY_MS : REFRESH_EXPIRY_MS;
    const tokens = await generateAndStoreTokens(user.id, user.role, expiryMs);
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: ME_SELECT,
    });
    logActivity(user.id, 'LOGIN', 'User', user.id, { method: 'password' }, req);

    setRefreshCookie(res, tokens.refreshToken, expiryMs);
    res.json({
      success: true,
      data: { user: profile, accessToken: tokens.accessToken },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/2fa/validate ── (extracted to auth-2fa-validate.ts)

import auth2faValidateRouter from './auth-2fa-validate.js';
router.use('/2fa', auth2faValidateRouter);

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
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
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

    const remainingMs = stored.expiresAt.getTime() - Date.now();
    const expiryMs = remainingMs > REFRESH_EXPIRY_MS ? REMEMBER_ME_EXPIRY_MS : REFRESH_EXPIRY_MS;
    const tokens = await generateAndStoreTokens(payload.userId, payload.role, expiryMs);

    setRefreshCookie(res, tokens.refreshToken, expiryMs);
    res.json({ success: true, data: { accessToken: tokens.accessToken } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/logout ──────────────────────────────

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await prisma.refreshToken.deleteMany({ where: { userId: req.user!.userId } });
    logActivity(req.user!.userId, 'LOGOUT', 'User', req.user!.userId, null, req);
    clearRefreshCookie(res);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
