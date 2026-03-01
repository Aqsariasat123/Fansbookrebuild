import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { logger } from '../utils/logger.js';
import { sendEmail } from '../utils/email.js';
import { passwordResetTemplate, emailVerificationTemplate } from '../utils/email-templates.js';

const router = Router();

const forgotPasswordSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({ token: z.string().min(1), newPassword: z.string().min(8) });
const verifyEmailSchema = z.object({ token: z.string().min(1) });
const resendVerificationSchema = z.object({ email: z.string().email() });

// ─── POST /api/auth/forgot-password ────────────────────
router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        const token = crypto.randomUUID();
        const expiry = new Date(Date.now() + 60 * 60 * 1000);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordResetToken: token, passwordResetExpiry: expiry },
        });
        logger.info(`[forgot-password] token for ${email}: ${token}`);
        const tpl = passwordResetTemplate(user.username, token);
        sendEmail(email, tpl.subject, tpl.html);
      }
      res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /api/auth/reset-password ─────────────────────
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const user = await prisma.user.findFirst({
        where: { passwordResetToken: token, passwordResetExpiry: { gt: new Date() } },
      });
      if (!user) throw new AppError(400, 'Invalid or expired reset token');
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: await bcrypt.hash(newPassword, 12),
          passwordResetToken: null,
          passwordResetExpiry: null,
        },
      });
      res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /api/auth/verify-email ───────────────────────
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
    if (!user) throw new AppError(400, 'Invalid verification token');
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null },
    });
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/resend-verification ────────────────
router.post(
  '/resend-verification',
  authLimiter,
  validate(resendVerificationSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new AppError(404, 'User not found');
      const token = crypto.randomUUID();
      await prisma.user.update({ where: { id: user.id }, data: { emailVerifyToken: token } });
      logger.info(`[resend-verification] token for ${email}: ${token}`);
      const tpl = emailVerificationTemplate(user.username, token);
      sendEmail(email, tpl.subject, tpl.html);
      res.json({ success: true, message: 'Verification email has been sent' });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
