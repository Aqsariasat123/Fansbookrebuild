import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

type StoryItem = {
  id: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: Date;
  viewCount: number;
};
type StoryGroup = {
  authorId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  stories: StoryItem[];
};

router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followedIds = follows.map((f) => f.followingId);
    followedIds.push(userId);

    // Get active subscriptions to filter SUBSCRIBERS-only stories
    const activeSubs = await prisma.subscription.findMany({
      where: { subscriberId: userId, status: 'ACTIVE' },
      select: { creatorId: true },
    });
    const subscribedCreatorIds = new Set(activeSubs.map((s) => s.creatorId));

    const stories = await prisma.story.findMany({
      where: { expiresAt: { gt: new Date() }, authorId: { in: followedIds } },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    const groupMap = new Map<string, StoryGroup>();
    for (const s of stories) {
      // Skip SUBSCRIBERS-only stories unless viewer is subscribed or is the author
      if (
        s.visibility === 'SUBSCRIBERS' &&
        s.authorId !== userId &&
        !subscribedCreatorIds.has(s.authorId)
      ) {
        continue;
      }
      const item: StoryItem = {
        id: s.id,
        mediaUrl: s.mediaUrl,
        mediaType: s.mediaType,
        createdAt: s.createdAt,
        viewCount: s.viewCount,
      };
      const existing = groupMap.get(s.authorId);
      if (existing) {
        existing.stories.push(item);
      } else {
        groupMap.set(s.authorId, {
          authorId: s.author.id,
          username: s.author.username,
          displayName: s.author.displayName,
          avatar: s.author.avatar,
          stories: [item],
        });
      }
    }

    res.json({ success: true, data: Array.from(groupMap.values()) });
  } catch (err) {
    next(err);
  }
});

export default router;
