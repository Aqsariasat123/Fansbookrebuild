import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router({ mergeParams: true });

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

// ─── GET /api/posts/:id/comments ── get comments with threading + isLiked
router.get('/:id/comments', authenticate, async (req, res, next) => {
  try {
    const postId = req.params.id as string;
    const userId = req.user!.userId;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');

    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: AUTHOR_SELECT },
        commentLikes: { where: { userId }, select: { id: true } },
        children: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: AUTHOR_SELECT },
            commentLikes: { where: { userId }, select: { id: true } },
          },
        },
      },
    });

    const mapped = comments.map((c) => ({
      ...c,
      isLiked: c.commentLikes.length > 0,
      commentLikes: undefined,
      children: c.children.map((ch) => ({
        ...ch,
        isLiked: ch.commentLikes.length > 0,
        commentLikes: undefined,
      })),
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/posts/:id/comment ── add comment ────────────
router.post('/:id/comment', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const { text, parentId } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new AppError(400, 'Comment text is required');
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');

    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent) throw new AppError(404, 'Parent comment not found');
      if (parent.postId !== postId)
        throw new AppError(400, 'Parent comment does not belong to this post');
    }

    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          postId,
          authorId: userId,
          text: text.trim(),
          parentId: parentId || null,
        },
        include: {
          author: { select: AUTHOR_SELECT },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);

    res.status(201).json({ success: true, data: { ...comment, isLiked: false } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/posts/:id/comments/:commentId/like ── like a comment
router.post('/:id/comments/:commentId/like', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const commentId = req.params.commentId as string;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new AppError(404, 'Comment not found');

    const existing = await prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Already liked' });
    }

    await prisma.$transaction([
      prisma.commentLike.create({ data: { commentId, userId } }),
      prisma.comment.update({ where: { id: commentId }, data: { likeCount: { increment: 1 } } }),
    ]);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/posts/:id/comments/:commentId/like ── unlike a comment
router.delete('/:id/comments/:commentId/like', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const commentId = req.params.commentId as string;

    const existing = await prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Not liked' });
    }

    await prisma.$transaction([
      prisma.commentLike.delete({ where: { id: existing.id } }),
      prisma.comment.update({ where: { id: commentId }, data: { likeCount: { decrement: 1 } } }),
    ]);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
