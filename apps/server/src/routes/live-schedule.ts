import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { getIO } from '../config/socket.js';

const router = Router();

const thumbDir = path.join(process.cwd(), 'uploads', 'live-thumbnails');
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

const thumbUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, thumbDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `${req.user?.userId ?? 'anon'}-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
});

function validateSchedule(title: string, scheduledAt: string) {
  if (!title?.trim()) return 'Title is required';
  if (!scheduledAt || isNaN(Date.parse(scheduledAt))) return 'Valid date & time required';
  if (new Date(scheduledAt) <= new Date()) return 'Scheduled time must be in the future';
  return null;
}

router.post(
  '/',
  authenticate,
  requireRole('CREATOR'),
  thumbUpload.single('thumbnail'),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { title, description, category, privacy, scheduledAt } = req.body as {
        title: string;
        description?: string;
        category?: string;
        privacy?: string;
        scheduledAt: string;
      };
      const validationError = validateSchedule(title, scheduledAt);
      if (validationError) {
        res.status(400).json({ success: false, message: validationError });
        return;
      }
      const thumbFile = req.file as Express.Multer.File | undefined;
      const thumbnail = thumbFile ? `/uploads/live-thumbnails/${thumbFile.filename}` : null;
      const session = await prisma.liveSession.create({
        data: {
          creatorId: userId,
          title: title.trim(),
          description: description?.trim() ?? null,
          category: category ?? null,
          privacy: privacy ?? 'public',
          thumbnail,
          scheduledAt: new Date(scheduledAt),
          streamKey: crypto.randomBytes(16).toString('hex'),
          status: 'SCHEDULED',
        },
      });
      try {
        getIO().emit('live:upcoming-new', { sessionId: session.id });
      } catch {
        // socket not ready
      }
      res.json({ success: true, data: { id: session.id } });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
