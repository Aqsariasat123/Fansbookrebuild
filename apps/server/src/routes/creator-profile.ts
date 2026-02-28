import { Router } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { tryExtractViewer, checkIsFollowing } from './creator-profile-helpers.js';

const router = Router();

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

    const viewerId = await tryExtractViewer(req);
    const isFollowing = viewerId ? await checkIsFollowing(viewerId, creator.id) : false;

    const { _count, subscriptionTiers, ...profile } = creator;
    res.json({
      success: true,
      data: {
        ...profile,
        followersCount: _count.followers,
        followingCount: _count.following,
        postsCount: _count.posts,
        tiers: subscriptionTiers.map((t) => ({
          ...t,
          benefits: typeof t.benefits === 'string' ? JSON.parse(t.benefits) : t.benefits,
        })),
        isFollowing,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/creator-profile/:username/suggestions ── random creators
router.get('/:username/suggestions', async (req, res, next) => {
  try {
    const { username } = req.params;

    const creators = await prisma.user.findMany({
      where: {
        role: 'CREATOR',
        username: { not: username },
        avatar: { not: null },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        cover: true,
        isVerified: true,
        _count: { select: { followers: true } },
      },
    });

    // Shuffle and pick 5
    const shuffled = creators.sort(() => Math.random() - 0.5).slice(0, 5);

    res.json({
      success: true,
      data: shuffled.map((c) => ({
        id: c.id,
        username: c.username,
        displayName: c.displayName,
        avatar: c.avatar,
        cover: c.cover,
        isVerified: c.isVerified,
        followersCount: c._count.followers,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
