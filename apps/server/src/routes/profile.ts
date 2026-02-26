import { Router } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// ─── Multer config for avatar uploads ─────────────────────

const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const MIME_EXT: Record<string, string> = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = MIME_EXT[file.mimetype] ?? '.bin';
    cb(null, `${req.user!.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Only JPEG, PNG, WebP and GIF images are allowed'));
    }
  },
});

const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  displayName: true,
  role: true,
  avatar: true,
  cover: true,
  bio: true,
  location: true,
  website: true,
  isVerified: true,
  createdAt: true,
} as const;

// ─── Schemas ──────────────────────────────────────────────

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().max(200).optional().or(z.literal('')),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[a-z]/, 'Must contain lowercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── PUT /api/profile ─────────────────────────────────────

router.put('/', authenticate, validate(updateProfileSchema), async (req, res, next) => {
  try {
    const { displayName, bio, location, website } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
      },
      select: USER_SELECT,
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/profile/password ────────────────────────────

router.put('/password', authenticate, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new AppError(400, 'Current password is incorrect');
    }

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

// ─── POST /api/profile/avatar ─────────────────────────────

router.post('/avatar', authenticate, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No image file provided');
    }

    // Store URL without extension to avoid Nginx static file regex
    const nameNoExt = path.parse(req.file.filename).name;
    const avatarUrl = `/api/profile/avatar/${nameNoExt}`;

    // Delete old avatar file if it's an upload (not default)
    const current = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { avatar: true },
    });

    if (current?.avatar?.includes('/api/profile/avatar/')) {
      const oldId = current.avatar.split('/').pop() ?? '';
      const files = fs.readdirSync(uploadsDir);
      const oldFile = files.find((f) => f.startsWith(oldId));
      if (oldFile) fs.unlinkSync(path.join(uploadsDir, oldFile));
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { avatar: avatarUrl },
      select: USER_SELECT,
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/profile/avatar/:filename ────────────────────

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

export default router;
