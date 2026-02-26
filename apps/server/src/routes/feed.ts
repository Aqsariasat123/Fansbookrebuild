import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ─── GET /api/feed ──────────────────────────────────────
router.get('/', authenticate, async (_req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { visibility: 'PUBLIC' },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
          },
        },
        media: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            url: true,
            type: true,
            order: true,
            thumbnail: true,
          },
        },
      },
    });

    const formatted = posts.map((post) => ({
      id: post.id,
      text: post.text,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      shareCount: 15,
      createdAt: post.createdAt,
      author: post.author,
      media: post.media,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/feed/stories ──────────────────────────────
router.get('/stories', authenticate, async (_req, res, next) => {
  try {
    const stories = await prisma.story.findMany({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    const formatted = stories.map((s) => ({
      id: s.id,
      mediaUrl: s.mediaUrl,
      mediaType: s.mediaType,
      viewCount: s.viewCount,
      author: s.author,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/feed/popular-models ───────────────────────
router.get('/popular-models', authenticate, async (_req, res, next) => {
  try {
    const models = await prisma.user.findMany({
      where: {
        role: 'CREATOR',
        category: 'Model',
        avatar: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: 7,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        isVerified: true,
      },
    });

    res.json({ success: true, data: models });
  } catch (err) {
    next(err);
  }
});

export default router;
