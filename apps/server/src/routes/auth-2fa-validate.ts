import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { generateAndStoreTokens, ME_SELECT, REFRESH_EXPIRY_MS } from '../utils/tokens.js';
import { logActivity } from '../utils/audit.js';
import { setRefreshCookie } from '../utils/cookies.js';

const router = Router();
const REMEMBER_ME_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

async function verifyBackupCode(user: { id: string; backupCodes: string[] }, backupCode: string) {
  const updatedCodes = [...user.backupCodes];
  for (let i = 0; i < updatedCodes.length; i++) {
    const isMatch = await bcrypt.compare(backupCode.toUpperCase(), updatedCodes[i]);
    if (isMatch) {
      updatedCodes.splice(i, 1);
      await prisma.user.update({ where: { id: user.id }, data: { backupCodes: updatedCodes } });
      return true;
    }
  }
  return false;
}

async function verifyTotpCode(secret: string, code: string) {
  const speakeasy = (await import('speakeasy')).default;
  return speakeasy.totp.verify({ secret, encoding: 'base32', token: code, window: 2 });
}

router.post('/validate', loginLimiter, async (req, res, next) => {
  try {
    const { userId, code, backupCode, rememberMe } = req.body;
    if (!userId) throw new AppError(400, 'User ID is required');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) throw new AppError(400, '2FA not configured');

    if (backupCode) {
      const matched = await verifyBackupCode(user, backupCode);
      if (!matched) throw new AppError(400, 'Invalid backup code');
    } else {
      if (!code) throw new AppError(400, 'Verification code is required');
      const valid = await verifyTotpCode(user.twoFactorSecret, code);
      if (!valid) throw new AppError(400, 'Invalid verification code');
    }

    const expiryMs = rememberMe ? REMEMBER_ME_EXPIRY_MS : REFRESH_EXPIRY_MS;
    const tokens = await generateAndStoreTokens(user.id, user.role, expiryMs);
    const profile = await prisma.user.findUnique({ where: { id: user.id }, select: ME_SELECT });
    logActivity(user.id, 'LOGIN', 'User', user.id, { method: '2fa' }, req);

    setRefreshCookie(res, tokens.refreshToken, expiryMs);
    res.json({ success: true, data: { user: profile, accessToken: tokens.accessToken } });
  } catch (err) {
    next(err);
  }
});

export default router;
