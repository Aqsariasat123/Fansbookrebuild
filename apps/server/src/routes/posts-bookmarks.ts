import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

// ─── GET /api/posts/bookmarks/list ── user's bookmarked posts ──
router.get('/bookmarks/list', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            author: { select: AUTHOR_SELECT },
            media: { orderBy: { order: 'asc' as const } },
          },
        },
      },
    });
    const posts = bookmarks.map((b) => ({
      ...b.post,
      isBookmarked: true,
      bookmarkedAt: b.createdAt,
    }));
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/posts/:id ── single post with full details ────
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: AUTHOR_SELECT },
        media: { orderBy: { order: 'asc' } },
        comments: { orderBy: { createdAt: 'asc' }, include: { author: { select: AUTHOR_SELECT } } },
        likes: { where: { userId }, select: { id: true }, take: 1 },
        bookmarks: { where: { userId }, select: { id: true }, take: 1 },
      },
    });
    if (!post) throw new AppError(404, 'Post not found');
    res.json({
      success: true,
      data: {
        id: post.id,
        text: post.text,
        visibility: post.visibility,
        isPinned: post.isPinned,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        media: post.media,
        comments: post.comments,
        isLiked: post.likes.length > 0,
        isBookmarked: post.bookmarks.length > 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/posts/:id/bookmark ── bookmark a post ────────
router.post('/:id/bookmark', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    const existing = await prisma.bookmark.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) throw new AppError(409, 'Already bookmarked');
    await prisma.bookmark.create({ data: { postId, userId } });
    res.status(201).json({ success: true, message: 'Post bookmarked' });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/posts/:id/bookmark ── remove bookmark ──────
router.delete('/:id/bookmark', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const existing = await prisma.bookmark.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (!existing) throw new AppError(404, 'Bookmark not found');
    await prisma.bookmark.delete({ where: { id: existing.id } });
    res.json({ success: true, message: 'Bookmark removed' });
  } catch (err) {
    next(err);
  }
});

export default router;
