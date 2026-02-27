import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();
const storiesDir = path.join(process.cwd(), 'uploads', 'stories');
if (!fs.existsSync(storiesDir)) fs.mkdirSync(storiesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, storiesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user!.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^(image|video)\//;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Only image and video files are allowed') as unknown as Error);
    }
  },
});

// Serve uploaded story files
router.get('/file/:filename', (req, res, next) => {
  try {
    const sanitized = path.basename(req.params.filename);
    const filePath = path.join(storiesDir, sanitized);
    if (!fs.existsSync(filePath)) throw new AppError(404, 'File not found');
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

// Create a story (CREATOR only)
router.post(
  '/',
  authenticate,
  requireRole('CREATOR'),
  upload.single('media'),
  async (req, res, next) => {
    try {
      if (!req.file) throw new AppError(400, 'Media file required');

      const mediaType = req.file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';
      const mediaUrl = `/api/stories/file/${req.file.filename}`;

      const story = await prisma.story.create({
        data: {
          authorId: req.user!.userId,
          mediaUrl,
          mediaType,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        include: {
          author: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
        },
      });

      res.status(201).json({ success: true, data: story });
    } catch (err) {
      next(err);
    }
  },
);

// Delete own story
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const storyId = req.params.id as string;
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new AppError(404, 'Story not found');
    if (story.authorId !== req.user!.userId) {
      throw new AppError(403, 'Can only delete your own stories');
    }

    // Clean up file if it's an uploaded file (not a seed/static file)
    if (story.mediaUrl.startsWith('/api/stories/file/')) {
      const filename = story.mediaUrl.split('/').pop()!;
      const filePath = path.join(storiesDir, filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.story.delete({ where: { id: story.id } });
    res.json({ success: true, message: 'Story deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
