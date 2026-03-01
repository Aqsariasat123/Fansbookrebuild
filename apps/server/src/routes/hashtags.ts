import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

// GET /api/hashtags/:tag/posts — paginated posts containing #tag
router.get('/:tag/posts', authenticate, async (req, res, next) => {
  try {
    const tag = req.params.tag as string;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const where = {
      text: { contains: `#${tag}`, mode: 'insensitive' as const },
      visibility: 'PUBLIC' as const,
    };

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { author: { select: AUTHOR_SELECT }, media: { orderBy: { order: 'asc' } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({ success: true, data: { items, total, page, limit, tag } });
  } catch (err) {
    next(err);
  }
});

// GET /api/hashtags/trending — top 10 hashtags by post count (last 7 days)
router.get('/trending', authenticate, async (_req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const posts = await prisma.post.findMany({
      where: { visibility: 'PUBLIC', createdAt: { gte: sevenDaysAgo } },
      select: { text: true },
    });

    const tagCounts = new Map<string, number>();
    for (const p of posts) {
      const tags = p.text?.match(/#\w+/g) || [];
      for (const tag of tags) {
        const lower = tag.toLowerCase();
        tagCounts.set(lower, (tagCounts.get(lower) || 0) + 1);
      }
    }

    const trending = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, postCount: count }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 10);

    res.json({ success: true, data: trending });
  } catch (err) {
    next(err);
  }
});

export default router;
