import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import speakeasy from 'speakeasy';
import crypto from 'crypto';

const router = Router();

async function hashBackupCodes(codes: string[]): Promise<string[]> {
  return Promise.all(codes.map((c) => bcrypt.hash(c, 10)));
}

// POST /api/auth/2fa/setup — Generate TOTP secret and QR URI
router.post('/setup', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'User not found');
    if (user.twoFactorEnabled) throw new AppError(400, '2FA already enabled');

    const secret = speakeasy.generateSecret({
      name: `Fansbook (${user.email})`,
      issuer: 'Fansbook',
    });

    // Generate 10 backup codes
    const plainCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase(),
    );
    const hashedCodes = await hashBackupCodes(plainCodes);

    // Store secret + hashed codes (not enabled until verified)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        backupCodes: hashedCodes,
      },
    });

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        otpAuthUrl: secret.otpauth_url,
        backupCodes: plainCodes,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/2fa/verify-setup — Verify first code, enable 2FA
router.post('/verify-setup', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { code } = req.body;
    if (!code) throw new AppError(400, 'Verification code is required');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) throw new AppError(400, 'Setup not started');

    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!valid) throw new AppError(400, 'Invalid verification code');

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (err) {
    next(err);
  }
});

async function verifyBackupCode(user: { id: string; backupCodes: string[] }, code: string) {
  const updatedCodes = [...user.backupCodes];
  for (let i = 0; i < updatedCodes.length; i++) {
    const isMatch = await bcrypt.compare(code.toUpperCase(), updatedCodes[i]);
    if (isMatch) {
      updatedCodes.splice(i, 1);
      await prisma.user.update({ where: { id: user.id }, data: { backupCodes: updatedCodes } });
      return true;
    }
  }
  return false;
}

// POST /api/auth/2fa/verify — Verify TOTP on login (legacy - still works)
router.post('/verify', async (req, res, next) => {
  try {
    const { userId, code, backupCode } = req.body;
    if (!userId) throw new AppError(400, 'User ID is required');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) throw new AppError(400, '2FA not configured');

    if (backupCode) {
      const matched = await verifyBackupCode(user, backupCode);
      if (!matched) throw new AppError(400, 'Invalid backup code');
      return res.json({ success: true, message: '2FA verified via backup code' });
    }

    if (!code) throw new AppError(400, 'Verification code is required');

    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!valid) throw new AppError(400, 'Invalid verification code');

    res.json({ success: true, message: '2FA verified' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/2fa/disable — Require password, disable 2FA
router.post('/disable', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'User not found');
    if (!user.twoFactorEnabled) throw new AppError(400, '2FA not enabled');

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: [],
      },
    });

    res.json({ success: true, message: '2FA disabled' });
  } catch (err) {
    next(err);
  }
});

export default router;
