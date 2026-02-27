import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';

/* ─── Upload directories ─── */
export const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const coversDir = path.join(process.cwd(), 'uploads', 'covers');
if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true });

/* ─── MIME → extension map ─── */
export const MIME_EXT: Record<string, string> = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

/* ─── Avatar multer ─── */
const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = MIME_EXT[file.mimetype] ?? '.bin';
    cb(null, `${req.user!.userId}-${Date.now()}${ext}`);
  },
});

export const upload = multer({
  storage: avatarStorage,
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

/* ─── Cover multer ─── */
const coverStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, coversDir),
  filename: (req, file, cb) => {
    const ext = MIME_EXT[file.mimetype] ?? '.bin';
    cb(null, `${req.user!.userId}-${Date.now()}${ext}`);
  },
});

export const coverUpload = multer({
  storage: coverStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
    else cb(new AppError(400, 'Only JPEG, PNG, WebP images'));
  },
});

/* ─── Prisma select shape ─── */
export const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  displayName: true,
  firstName: true,
  lastName: true,
  mobileNumber: true,
  secondaryEmail: true,
  role: true,
  avatar: true,
  cover: true,
  bio: true,
  location: true,
  website: true,
  isVerified: true,
  createdAt: true,
} as const;

/* ─── Zod schemas ─── */
export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  firstName: z.string().max(50).optional().or(z.literal('')),
  lastName: z.string().max(50).optional().or(z.literal('')),
  mobileNumber: z.string().max(20).optional().or(z.literal('')),
  bio: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().max(200).optional().or(z.literal('')),
});

export const changePasswordSchema = z
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

/* ─── Profile update helpers ─── */
const PROFILE_FIELDS = ['displayName', 'bio', 'location', 'website'] as const;
const NULLABLE_FIELDS = ['firstName', 'lastName', 'mobileNumber'] as const;

export function buildProfileUpdate(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const f of PROFILE_FIELDS) if (body[f] !== undefined) data[f] = body[f];
  for (const f of NULLABLE_FIELDS) if (body[f] !== undefined) data[f] = body[f] || null;
  return data;
}

export async function generateUsername(
  firstName: string,
  lastName: string,
  userId: string,
  findUnique: (args: { where: { username: string } }) => Promise<{ id: string } | null>,
): Promise<string | null> {
  const base = `${firstName}_${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 30);
  if (!base) return null;
  const existing = await findUnique({ where: { username: base } });
  if (!existing || existing.id === userId) return base;
  // Add random 3-digit suffix
  for (let i = 0; i < 10; i++) {
    const suffix = Math.floor(100 + Math.random() * 900);
    const candidate = `${base}_${suffix}`;
    const taken = await findUnique({ where: { username: candidate } });
    if (!taken) return candidate;
  }
  return `${base}_${Date.now() % 10000}`;
}
