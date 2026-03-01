import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { passwordResetLimiter, otpResendLimiter, authLimiter } from '../middleware/rateLimit.js';
import { generateOtp, verifyOtp, maskEmail } from '../utils/otp.js';
import { sendEmail } from '../utils/email.js';
import { logger } from '../utils/logger.js';

const router = Router();

const forgotPasswordSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});
const validateTokenSchema = z.object({ token: z.string().min(1) });
const verifyEmailOtpSchema = z.object({
  userId: z.string().min(1),
  otp: z.string().length(6),
});
const resendOtpSchema = z.object({ userId: z.string().min(1) });

// ─── POST /api/auth/forgot-password ────────────────────
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        const otp = await generateOtp(user.id, 'PASSWORD_RESET');
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #f8f8f8;">Password Reset</h2>
            <p style="color: #ccc;">Hi ${user.username}, your password reset code is:</p>
            <div style="text-align: center; padding: 20px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #01adf1;">${otp}</span>
            </div>
            <p style="color: #999; font-size: 13px;">This code expires in 5 minutes.</p>
          </div>
        `;
        sendEmail(email, 'Fansbook - Password Reset Code', html);
        logger.info(`[forgot-password] OTP sent for ${email}`);
      }
      res.json({ success: true, message: 'If that email exists, a reset code has been sent' });
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /api/auth/validate-reset-token ───────────────
router.post(
  '/validate-reset-token',
  authLimiter,
  validate(validateTokenSchema),
  async (req, res, next) => {
    try {
      const { token } = req.body;
      const user = await prisma.user.findFirst({
        where: { passwordResetToken: token, passwordResetExpiry: { gt: new Date() } },
      });
      res.json({ success: true, data: { valid: !!user } });
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /api/auth/reset-password ─────────────────────
router.post(
  '/reset-password',
  passwordResetLimiter,
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

// ─── POST /api/auth/verify-email ── OTP-based ──────────
router.post(
  '/verify-email',
  authLimiter,
  validate(verifyEmailOtpSchema),
  async (req, res, next) => {
    try {
      const { userId, otp } = req.body;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new AppError(404, 'User not found');
      if (user.emailVerified) {
        return res.json({ success: true, message: 'Email already verified' });
      }

      const valid = await verifyOtp(userId, otp, 'EMAIL_VERIFY');
      if (!valid) throw new AppError(400, 'Invalid or expired OTP');

      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true, emailVerifyToken: null },
      });
      res.json({ success: true, message: 'Email verified successfully' });
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /api/auth/resend-otp ─────────────────────────
router.post('/resend-otp', otpResendLimiter, validate(resendOtpSchema), async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, emailVerified: true },
    });
    if (!user) throw new AppError(404, 'User not found');
    if (user.emailVerified) {
      return res.json({ success: true, message: 'Email already verified' });
    }

    const otp = await generateOtp(user.id, 'EMAIL_VERIFY');
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #f8f8f8;">Email Verification</h2>
          <p style="color: #ccc;">Hi ${user.username}, your new verification code is:</p>
          <div style="text-align: center; padding: 20px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #01adf1;">${otp}</span>
          </div>
          <p style="color: #999; font-size: 13px;">This code expires in 5 minutes.</p>
        </div>
      `;
    sendEmail(user.email, 'Fansbook - New Verification Code', html);
    logger.info(`[resend-otp] New OTP sent for user ${userId}`);

    res.json({
      success: true,
      message: 'New verification code sent',
      data: { maskedEmail: maskEmail(user.email) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/resend-verification (legacy support) ──
router.post('/resend-verification', otpResendLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'Email is required');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError(404, 'User not found');
    if (user.emailVerified) {
      return res.json({ success: true, message: 'Email already verified' });
    }

    const otp = await generateOtp(user.id, 'EMAIL_VERIFY');
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #f8f8f8;">Email Verification</h2>
        <p style="color: #ccc;">Hi ${user.username}, your verification code is:</p>
        <div style="text-align: center; padding: 20px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #01adf1;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 13px;">This code expires in 5 minutes.</p>
      </div>
    `;
    sendEmail(user.email, 'Fansbook - Verification Code', html);
    res.json({ success: true, message: 'Verification code sent' });
  } catch (err) {
    next(err);
  }
});

export default router;
