import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { aiClipsQueue } from '../jobs/queue.js';

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'ai-clip-source');
const CLIPS_DIR = path.join(process.cwd(), 'uploads', 'ai-clips');
const THUMBS_DIR = path.join(process.cwd(), 'uploads', 'ai-thumbs');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Video files only'));
  },
});

// POST /api/creator/clips/upload — upload video and start AI processing
router.post('/upload', authenticate, upload.single('video'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, 'No video file provided');
    const userId = req.user!.userId;

    const job = await prisma.aIClipJob.create({
      data: {
        userId,
        originalFile: req.file.path,
        originalName: req.file.originalname,
        status: 'QUEUED',
      },
    });

    await aiClipsQueue.add('process', { jobId: job.id }, { jobId: job.id });

    res.json({ success: true, data: { jobId: job.id } });
  } catch (err) {
    next(err);
  }
});

// GET /api/creator/clips/jobs — all processing jobs for this creator
router.get('/jobs', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const jobs = await prisma.aIClipJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { clips: { orderBy: { createdAt: 'asc' } } },
    });
    res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
});

// GET /api/creator/clips/jobs/:id — poll job status
router.get('/jobs/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const job = await prisma.aIClipJob.findUnique({
      where: { id: req.params.id as string },
      include: { clips: { orderBy: { createdAt: 'asc' } } },
    });
    if (!job || job.userId !== userId) throw new AppError(404, 'Job not found');
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// POST /api/creator/clips/:clipId/publish — publish clip as a post
router.post('/:clipId/publish', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { caption, isPaid, price } = req.body as {
      caption?: string;
      isPaid?: boolean;
      price?: number;
    };

    const clip = await prisma.aIClip.findUnique({ where: { id: req.params.clipId as string } });
    if (!clip || clip.userId !== userId) throw new AppError(404, 'Clip not found');
    if (clip.published) throw new AppError(400, 'Already published');

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        text: caption?.trim() || clip.title,
        ppvPrice: isPaid ? (price ?? null) : null,
        media: {
          create: {
            url: clip.filePath,
            type: 'VIDEO',
            thumbnail: clip.thumbnailPath ?? null,
          },
        },
      },
    });

    await prisma.aIClip.update({
      where: { id: clip.id },
      data: { published: true, postId: post.id },
    });

    res.json({ success: true, data: { postId: post.id } });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/creator/clips/:clipId — discard a clip
router.delete('/:clipId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const clip = await prisma.aIClip.findUnique({ where: { id: req.params.clipId as string } });
    if (!clip || clip.userId !== userId) throw new AppError(404, 'Clip not found');

    const full = path.join(CLIPS_DIR, path.basename(clip.filePath));
    if (fs.existsSync(full)) fs.unlinkSync(full);

    await prisma.aIClip.delete({ where: { id: clip.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/creator/clips/file/:filename — serve clip video file
router.get('/file/:filename', (req, res) => {
  const filePath = path.join(CLIPS_DIR, req.params.filename as string);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  res.sendFile(filePath);
});

// GET /api/creator/clips/thumb/:filename — serve thumbnail
router.get('/thumb/:filename', (req, res) => {
  const filePath = path.join(THUMBS_DIR, req.params.filename as string);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  res.sendFile(filePath);
});

export default router;
