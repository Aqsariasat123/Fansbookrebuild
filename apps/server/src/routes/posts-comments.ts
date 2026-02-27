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

// ─── GET /api/posts/:id/comments ── get comments with threading
router.get('/:id/comments', authenticate, async (req, res, next) => {
  try {
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');

    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: AUTHOR_SELECT },
        children: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: AUTHOR_SELECT },
          },
        },
      },
    });

    res.json({ success: true, data: comments });
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

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
});

export default router;
