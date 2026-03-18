import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ─── GET /api/live/following ─────────────────────────────
router.get('/following', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followedIds = follows.map((f) => f.followingId);
    if (followedIds.length === 0) {
      return res.json({ success: true, data: [] });
    }
    const sessions = await prisma.liveSession.findMany({
      where: { status: 'LIVE', creatorId: { in: followedIds } },
      orderBy: { viewerCount: 'desc' },
      select: {
        id: true,
        title: true,
        viewerCount: true,
        startedAt: true,
        creator: {
          select: { id: true, username: true, displayName: true, avatar: true, category: true },
        },
      },
    });
    const items = sessions.map((s) => ({
      id: s.id,
      creatorId: s.creator.id,
      username: s.creator.username,
      displayName: s.creator.displayName,
      avatar: s.creator.avatar,
      category: s.creator.category,
      viewerCount: s.viewerCount,
      title: s.title,
      startedAt: s.startedAt?.toISOString() ?? null,
    }));
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/live/upcoming ──────────────────────────────
router.get('/upcoming', async (_req, res, next) => {
  try {
    const sessions = await prisma.liveSession.findMany({
      where: { status: 'SCHEDULED', scheduledAt: { gt: new Date() } },
      orderBy: { scheduledAt: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        thumbnail: true,
        scheduledAt: true,
        creator: { select: { id: true, username: true, displayName: true, avatar: true } },
      },
    });
    const items = sessions.map((s) => ({
      id: s.id,
      creatorId: s.creator.id,
      username: s.creator.username,
      displayName: s.creator.displayName,
      avatar: s.creator.avatar,
      title: s.title,
      description: s.description,
      category: s.category,
      thumbnail: s.thumbnail,
      scheduledAt: s.scheduledAt!.toISOString(),
    }));
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

export default router;
