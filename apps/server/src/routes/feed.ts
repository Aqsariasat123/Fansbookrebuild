import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ─── GET /api/feed ──────────────────────────────────────
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
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
        likes: {
          where: { userId },
          select: { id: true },
          take: 1,
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
      isLiked: post.likes.length > 0,
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

    // Group stories by author
    const groupMap = new Map<
      string,
      {
        authorId: string;
        username: string;
        displayName: string;
        avatar: string | null;
        stories: { id: string; mediaUrl: string; mediaType: string; createdAt: Date }[];
      }
    >();

    for (const s of stories) {
      const existing = groupMap.get(s.authorId);
      const storyItem = {
        id: s.id,
        mediaUrl: s.mediaUrl,
        mediaType: s.mediaType,
        createdAt: s.createdAt,
      };
      if (existing) {
        existing.stories.push(storyItem);
      } else {
        groupMap.set(s.authorId, {
          authorId: s.author.id,
          username: s.author.username,
          displayName: s.author.displayName,
          avatar: s.author.avatar,
          stories: [storyItem],
        });
      }
    }

    res.json({ success: true, data: Array.from(groupMap.values()) });
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
