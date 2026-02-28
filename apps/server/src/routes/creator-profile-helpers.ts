import { Request } from 'express';
import { prisma } from '../config/database.js';

export const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

/**
 * Try to extract the authenticated viewer's userId from the
 * Authorization header. Returns null when no valid token is present.
 */
export async function tryExtractViewer(req: Request): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const jwt = await import('jsonwebtoken');
    const { env } = await import('../config/env.js');
    const payload = jwt.default.verify(authHeader.slice(7), env.JWT_SECRET) as {
      userId: string;
    };
    return payload.userId;
  } catch {
    return null;
  }
}

/**
 * Check whether `viewerId` currently follows `targetId`.
 */
export async function checkIsFollowing(viewerId: string, targetId: string): Promise<boolean> {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: viewerId,
        followingId: targetId,
      },
    },
  });
  return !!follow;
}

/**
 * Check whether `viewerId` has an active subscription to `creatorId`,
 * or is the creator themselves.
 */
export async function checkIsSubscriber(viewerId: string, creatorId: string): Promise<boolean> {
  if (viewerId === creatorId) return true;

  const subscription = await prisma.subscription.findFirst({
    where: {
      subscriberId: viewerId,
      creatorId,
      status: 'ACTIVE',
    },
  });
  return !!subscription;
}

export interface PostsQueryParams {
  creatorId: string;
  isSubscriber: boolean;
  tab: string;
}

export function buildPostsWhere(params: PostsQueryParams): Record<string, unknown> {
  const where: Record<string, unknown> = { authorId: params.creatorId };

  if (!params.isSubscriber) {
    where.visibility = 'PUBLIC';
  }

  if (params.tab === 'photos') {
    where.media = { some: { type: 'IMAGE' } };
  } else if (params.tab === 'videos') {
    where.media = { some: { type: 'VIDEO' } };
  }

  return where;
}
