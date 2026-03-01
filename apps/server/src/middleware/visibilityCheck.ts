import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from './errorHandler.js';

async function requireSubscription(userId: string, creatorId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { subscriberId: userId, creatorId, status: 'ACTIVE' },
  });
  if (!sub) throw new AppError(403, 'Subscription required to view this post');
}

function isRestrictedVisibility(v: string) {
  return v === 'SUBSCRIBERS' || v === 'TIER_SPECIFIC';
}

export async function checkPostVisibility(req: Request, _res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const postId = req.params.id as string | undefined;
    if (!postId) return next();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, visibility: true, deletedAt: true },
    });

    if (!post || post.deletedAt) throw new AppError(404, 'Post not found');
    if (post.visibility === 'PUBLIC' || post.authorId === userId) return next();
    if (!userId) throw new AppError(401, 'Authentication required');
    if (isRestrictedVisibility(post.visibility)) await requireSubscription(userId, post.authorId);

    next();
  } catch (err) {
    next(err);
  }
}
