import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';
import commentsRouter from './posts-comments.js';

const router = Router();

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

// Mount comments sub-router
router.use('/', commentsRouter);

// ─── POST /api/posts ── create post (CREATOR only) ─────────
router.post('/', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { text, visibility } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new AppError(400, 'Text is required');
    }

    const validVisibilities = ['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'];
    const postVisibility =
      visibility && validVisibilities.includes(visibility) ? visibility : 'PUBLIC';

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        text: text.trim(),
        visibility: postVisibility,
      },
      include: {
        author: { select: AUTHOR_SELECT },
        media: { orderBy: { order: 'asc' } },
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/posts/:id ── edit post (owner only) ──────────
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized to edit this post');

    const updateData: Record<string, unknown> = {};

    if (req.body.text !== undefined) {
      if (typeof req.body.text !== 'string' || req.body.text.trim().length === 0) {
        throw new AppError(400, 'Text cannot be empty');
      }
      updateData.text = req.body.text.trim();
    }

    if (req.body.visibility !== undefined) {
      const validVisibilities = ['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'];
      if (!validVisibilities.includes(req.body.visibility)) {
        throw new AppError(400, 'Invalid visibility value');
      }
      updateData.visibility = req.body.visibility;
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: { select: AUTHOR_SELECT },
        media: { orderBy: { order: 'asc' } },
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/posts/:id ── delete post (owner only) ─────
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized to delete this post');

    await prisma.post.delete({ where: { id: postId } });

    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/posts/:id/pin ── toggle pin (owner only) ─────
router.put('/:id/pin', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized to pin this post');

    const updated = await prisma.post.update({
      where: { id: postId },
      data: { isPinned: !post.isPinned },
      include: {
        author: { select: AUTHOR_SELECT },
        media: { orderBy: { order: 'asc' } },
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/posts/:id/like ── like post ─────────────────
router.post('/:id/like', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');

    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) throw new AppError(409, 'Already liked');

    await prisma.$transaction([
      prisma.like.create({ data: { postId, userId } }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    res.status(201).json({ success: true, message: 'Post liked' });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/posts/:id/like ── unlike post ──────────────
router.delete('/:id/like', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (!existing) throw new AppError(404, 'Like not found');

    await prisma.$transaction([
      prisma.like.delete({ where: { id: existing.id } }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    res.json({ success: true, message: 'Post unliked' });
  } catch (err) {
    next(err);
  }
});

export default router;
