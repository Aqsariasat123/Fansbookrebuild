import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = Router();
const CLIPS_DIR = path.join(process.cwd(), 'uploads', 'ai-clips');

// GET /api/admin/clips/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const [totalJobs, totalClips, queuedJobs, failedJobs] = await Promise.all([
      prisma.aIClipJob.count(),
      prisma.aIClip.count(),
      prisma.aIClipJob.count({
        where: { status: { in: ['QUEUED', 'EXTRACTING', 'ANALYZING', 'CUTTING'] } },
      }),
      prisma.aIClipJob.count({ where: { status: 'FAILED' } }),
    ]);
    const publishedClips = await prisma.aIClip.count({ where: { published: true } });
    res.json({
      success: true,
      data: { totalJobs, totalClips, publishedClips, queuedJobs, failedJobs },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/clips/queue — active/recent jobs
router.get('/queue', async (req, res, next) => {
  try {
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const jobs = await prisma.aIClipJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { id: true, username: true, displayName: true } },
        clips: { select: { id: true, published: true } },
      },
    });
    res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/clips/creators — per-creator usage
router.get('/creators', async (_req, res, next) => {
  try {
    const rows = await prisma.aIClipJob.groupBy({
      by: ['userId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const userIds = rows.map((r) => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, displayName: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const result = rows.map((r) => ({
      user: userMap[r.userId],
      jobCount: r._count.id,
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/clips/all — all generated clips
router.get('/all', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const userId = req.query.userId as string | undefined;
    const where = userId ? { userId } : {};

    const [clips, total] = await Promise.all([
      prisma.aIClip.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { job: { select: { originalName: true, status: true } } },
      }),
      prisma.aIClip.count({ where }),
    ]);
    res.json({ success: true, data: { clips, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/clips/:clipId — admin delete a clip
router.delete('/:clipId', async (req, res, next) => {
  try {
    const clip = await prisma.aIClip.findUnique({ where: { id: req.params.clipId as string } });
    if (!clip) throw new AppError(404, 'Clip not found');

    const filePath = path.join(CLIPS_DIR, path.basename(clip.filePath));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.aIClip.delete({ where: { id: clip.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
