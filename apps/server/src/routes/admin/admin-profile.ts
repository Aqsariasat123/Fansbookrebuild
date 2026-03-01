import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = Router();

const PROFILE_SELECT = {
  id: true,
  email: true,
  username: true,
  displayName: true,
  firstName: true,
  lastName: true,
  avatar: true,
  mobileNumber: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

// ─── GET /api/admin/profile ── get admin profile ─────────
router.get('/', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: PROFILE_SELECT,
    });
    if (!user) throw new AppError(404, 'User not found');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/admin/profile ── update admin profile ──────
router.put('/', async (req, res, next) => {
  try {
    const { firstName, lastName, username, mobileNumber, email } = req.body;
    const data: Record<string, unknown> = {};

    if (firstName !== undefined) data.firstName = firstName.trim();
    if (lastName !== undefined) data.lastName = lastName.trim();
    if (mobileNumber !== undefined) data.mobileNumber = mobileNumber.trim();

    if (username !== undefined) {
      const existing = await prisma.user.findFirst({
        where: {
          username: username.trim(),
          NOT: { id: req.user!.userId },
        },
      });
      if (existing) throw new AppError(409, 'Username already taken');
      data.username = username.trim();
      data.displayName = username.trim();
    }

    if (email !== undefined) {
      const existing = await prisma.user.findFirst({
        where: {
          email: email.trim().toLowerCase(),
          NOT: { id: req.user!.userId },
        },
      });
      if (existing) throw new AppError(409, 'Email already in use');
      data.email = email.trim().toLowerCase();
    }

    if (Object.keys(data).length === 0) {
      throw new AppError(400, 'No fields to update');
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: PROFILE_SELECT,
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/admin/profile/password ── change password ───
router.put('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError(400, 'Current and new password are required');
    }
    if (newPassword.length < 8) {
      throw new AppError(400, 'Password must be at least 8 characters');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { passwordHash: true },
    });
    if (!user) throw new AppError(404, 'User not found');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new AppError(400, 'Current password is incorrect');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { passwordHash },
    });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
