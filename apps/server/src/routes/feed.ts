import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

async function getBlockedIds(userId: string): Promise<string[]> {
  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true },
  });
  const ids = new Set<string>();
  for (const b of blocks) {
    if (b.blockerId !== userId) ids.add(b.blockerId);
    if (b.blockedId !== userId) ids.add(b.blockedId);
  }
  return Array.from(ids);
}

// ─── GET /api/feed ──────────────────────────────────────
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const cursor = req.query.cursor as string | undefined;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);

    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followedIds = follows.map((f) => f.followingId);
    followedIds.push(userId);

    // Get blocked user IDs to exclude
    const blockedIds = await getBlockedIds(userId);

    const posts = await prisma.post.findMany({
      where: {
        visibility: 'PUBLIC',
        authorId: { in: followedIds, notIn: blockedIds.length > 0 ? blockedIds : undefined },
        deletedAt: null,
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
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
          select: { id: true, url: true, type: true, order: true, thumbnail: true },
        },
        likes: { where: { userId }, select: { id: true }, take: 1 },
        bookmarks: { where: { userId }, select: { id: true }, take: 1 },
      },
    });

    const formatted = posts.map((post) => ({
      id: post.id,
      text: post.text,
      isPinned: post.isPinned,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      shareCount: 15,
      createdAt: post.createdAt,
      author: post.author,
      media: post.media,
      isLiked: post.likes.length > 0,
      isBookmarked: post.bookmarks.length > 0,
    }));

    const nextCursor =
      formatted.length === limit ? (formatted[formatted.length - 1]?.id ?? null) : null;

    res.json({ success: true, data: { posts: formatted, nextCursor } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/feed/explore ── trending posts (P2-4) ─────
router.get('/explore', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const cursor = req.query.cursor as string | undefined;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);
    const blockedIds = await getBlockedIds(userId);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const posts = await prisma.post.findMany({
      where: {
        visibility: 'PUBLIC',
        deletedAt: null,
        createdAt: { gte: oneDayAgo },
        ...(blockedIds.length > 0 ? { authorId: { notIn: blockedIds } } : {}),
      },
      orderBy: [{ likeCount: 'desc' }, { commentCount: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
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
          select: { id: true, url: true, type: true, order: true, thumbnail: true },
        },
        likes: { where: { userId }, select: { id: true }, take: 1 },
        bookmarks: { where: { userId }, select: { id: true }, take: 1 },
      },
    });

    const formatted = posts.map((post) => ({
      id: post.id,
      text: post.text,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt,
      author: post.author,
      media: post.media,
      isLiked: post.likes.length > 0,
      isBookmarked: post.bookmarks.length > 0,
    }));

    const nextCursor =
      formatted.length === limit ? (formatted[formatted.length - 1]?.id ?? null) : null;

    res.json({ success: true, data: { posts: formatted, nextCursor } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/feed/stories ── (extracted to feed-stories.ts)
import feedStoriesRouter from './feed-stories.js';
router.use('/stories', feedStoriesRouter);

// ─── GET /api/feed/popular-models ───────────────────────
router.get('/popular-models', authenticate, async (_req, res, next) => {
  try {
    const models = await prisma.user.findMany({
      where: { role: 'CREATOR', category: 'Model', avatar: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 7,
      select: { id: true, username: true, displayName: true, avatar: true, isVerified: true },
    });

    res.json({ success: true, data: models });
  } catch (err) {
    next(err);
  }
});

export default router;
