import { Router } from 'express';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  upload,
  coverUpload,
  uploadsDir,
  coversDir,
  USER_SELECT,
  updateProfileSchema,
  changePasswordSchema,
  buildProfileUpdate,
  generateUsername,
} from './profile-helpers.js';
import onboardingRouter from './profile-onboarding.js';
import { logActivity } from '../utils/audit.js';

const router = Router();
router.use('/', onboardingRouter);

router.put('/', authenticate, validate(updateProfileSchema), async (req, res, next) => {
  try {
    const updateData = buildProfileUpdate(req.body);

    // Auto-update username when firstName+lastName change
    const fn = (req.body.firstName || '').trim();
    const ln = (req.body.lastName || '').trim();
    if (fn && ln) {
      const newUsername = await generateUsername(fn, ln, req.user!.userId, (args) =>
        prisma.user.findUnique({ where: args.where, select: { id: true } }),
      );
      if (newUsername) updateData.username = newUsername;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: updateData,
      select: USER_SELECT,
    });
    logActivity(
      req.user!.userId,
      'PROFILE_UPDATE',
      'User',
      req.user!.userId,
      { fields: Object.keys(req.body) },
      req,
    );
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.put('/password', authenticate, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { passwordHash: true },
    });
    if (!user) throw new AppError(404, 'User not found');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new AppError(400, 'Current password is incorrect');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user!.userId }, data: { passwordHash } });
    logActivity(req.user!.userId, 'PASSWORD_CHANGE', 'User', req.user!.userId, null, req);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});

function deleteOldAvatarFile(avatarPath: string | null) {
  if (!avatarPath?.includes('/api/profile/avatar/')) return;
  const oldId = avatarPath.split('/').pop() ?? '';
  const files = fs.readdirSync(uploadsDir);
  const oldFile = files.find((f) => f.startsWith(oldId));
  if (oldFile) fs.unlinkSync(path.join(uploadsDir, oldFile));
}

router.post('/avatar', authenticate, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, 'No image file provided');
    const avatarUrl = `/api/profile/avatar/${path.parse(req.file.filename).name}`;
    const current = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { avatar: true },
    });
    deleteOldAvatarFile(current?.avatar ?? null);
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { avatar: avatarUrl },
      select: USER_SELECT,
    });
    logActivity(req.user!.userId, 'AVATAR_UPLOAD', 'User', req.user!.userId, null, req);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.get('/avatar/:id', (req, res, next) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const match = files.find((f) => f.startsWith(req.params.id));
    if (!match) throw new AppError(404, 'Avatar not found');
    res.sendFile(path.join(uploadsDir, match));
  } catch (err) {
    next(err);
  }
});

router.post('/cover', authenticate, coverUpload.single('cover'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, 'No image file provided');
    const nameNoExt = path.parse(req.file.filename).name;
    const coverUrl = `/api/profile/cover/${nameNoExt}`;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { cover: coverUrl },
      select: USER_SELECT,
    });
    logActivity(req.user!.userId, 'COVER_UPLOAD', 'User', req.user!.userId, null, req);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.delete('/cover', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { cover: null },
      select: USER_SELECT,
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.get('/cover/:id', (req, res, next) => {
  try {
    const files = fs.readdirSync(coversDir);
    const match = files.find((f) => f.startsWith(req.params.id));
    if (!match) throw new AppError(404, 'Cover not found');
    res.sendFile(path.join(coversDir, match));
  } catch (err) {
    next(err);
  }
});

router.delete('/avatar', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { avatar: null },
      select: USER_SELECT,
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Secondary email
router.put('/secondary-email', authenticate, async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError(400, 'Please enter a valid email address');
    }
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { secondaryEmail: email },
      select: USER_SELECT,
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.delete('/secondary-email', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { secondaryEmail: null },
      select: USER_SELECT,
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
