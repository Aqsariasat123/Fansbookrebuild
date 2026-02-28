import { Router } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

interface PostsQueryParams {
  creatorId: string;
  isSubscriber: boolean;
  tab: string;
}

function buildPostsWhere(params: PostsQueryParams): Record<string, unknown> {
  const where: Record<string, unknown> = { authorId: params.creatorId };

  // Non-subscribers only see PUBLIC posts
  if (!params.isSubscriber) {
    where.visibility = 'PUBLIC';
  }

  // Tab-based filtering for media type
  if (params.tab === 'photos') {
    where.media = { some: { type: 'IMAGE' } };
  } else if (params.tab === 'videos') {
    where.media = { some: { type: 'VIDEO' } };
  }

  return where;
}

// ─── GET /api/creator-profile/:username ── public profile + stats + tiers
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;

    const creator = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        cover: true,
        bio: true,
        location: true,
        website: true,
        category: true,
        isVerified: true,
        aboutMe: true,
        socialLinks: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
        subscriptionTiers: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            benefits: true,
          },
        },
      },
    });

    if (!creator) throw new AppError(404, 'Creator not found');

    // Check if authenticated user is following this creator
    let isFollowing = false;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = await import('jsonwebtoken');
        const { env } = await import('../config/env.js');
        const payload = jwt.default.verify(authHeader.slice(7), env.JWT_SECRET) as {
          userId: string;
        };
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: payload.userId,
              followingId: creator.id,
            },
          },
        });
        isFollowing = !!follow;
      } catch {
        // Token invalid or expired, isFollowing stays false
      }
    }

    const { _count, subscriptionTiers, ...profile } = creator;
    res.json({
      success: true,
      data: {
        ...profile,
        followersCount: _count.followers,
        followingCount: _count.following,
        postsCount: _count.posts,
        tiers: subscriptionTiers,
        isFollowing,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/creator-profile/:username/posts ── paginated posts
router.get('/:username/posts', async (req, res, next) => {
  try {
    const { username } = req.params;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const tab = (req.query.tab as string) || 'feed';
    const skip = (page - 1) * limit;

    const creator = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!creator) throw new AppError(404, 'Creator not found');

    // Determine if the requesting user is a subscriber
    let isSubscriber = false;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = await import('jsonwebtoken');
        const { env } = await import('../config/env.js');
        const payload = jwt.default.verify(authHeader.slice(7), env.JWT_SECRET) as {
          userId: string;
        };

        if (payload.userId === creator.id) {
          isSubscriber = true;
        } else {
          const subscription = await prisma.subscription.findFirst({
            where: {
              subscriberId: payload.userId,
              creatorId: creator.id,
              status: 'ACTIVE',
            },
          });
          isSubscriber = !!subscription;
        }
      } catch {
        // Token invalid, treat as non-subscriber
      }
    }

    const where = buildPostsWhere({ creatorId: creator.id, isSubscriber, tab });

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: {
          author: { select: AUTHOR_SELECT },
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
      }),
      prisma.post.count({ where }),
    ]);

    const items = posts.map(
      ({ id, text, visibility, isPinned, likeCount, commentCount, createdAt, author, media }) => ({
        id,
        text,
        visibility,
        isPinned,
        likeCount,
        commentCount,
        shareCount: 15,
        isLiked: false,
        createdAt,
        author,
        media,
      }),
    );

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
