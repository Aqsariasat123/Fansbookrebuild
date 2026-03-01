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

async function searchCreators(q: string, skip: number, limit: number) {
  const where = {
    role: 'CREATOR' as const,
    OR: [
      { displayName: { contains: q, mode: 'insensitive' as const } },
      { username: { contains: q, mode: 'insensitive' as const } },
    ],
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { ...AUTHOR_SELECT, aboutMe: true, _count: { select: { followers: true } } },
      skip,
      take: limit,
      orderBy: { followers: { _count: 'desc' } },
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total };
}

async function searchPosts(q: string, skip: number, limit: number) {
  const where = {
    text: { contains: q, mode: 'insensitive' as const },
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
  return { items, total };
}

async function searchHashtags(q: string, skip: number, limit: number) {
  const posts = await prisma.post.findMany({
    where: { text: { contains: `#${q}`, mode: 'insensitive' }, visibility: 'PUBLIC' },
    select: { text: true },
  });
  const tagCounts = new Map<string, number>();
  const lowerQ = `#${q.toLowerCase()}`;
  for (const p of posts) {
    const tags = p.text?.match(/#\w+/g) || [];
    for (const tag of tags) {
      const lower = tag.toLowerCase();
      if (lower.includes(lowerQ)) {
        tagCounts.set(lower, (tagCounts.get(lower) || 0) + 1);
      }
    }
  }
  const items = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, postCount: count }))
    .sort((a, b) => b.postCount - a.postCount)
    .slice(skip, skip + limit);
  return { items, total: tagCounts.size };
}

const searchHandlers: Record<
  string,
  (q: string, skip: number, limit: number) => Promise<{ items: unknown[]; total: number }>
> = {
  creators: searchCreators,
  posts: searchPosts,
  hashtags: searchHashtags,
};

// GET /api/search?q=&type=creators|posts|hashtags&page=&limit=
router.get('/', authenticate, async (req, res, next) => {
  try {
    const q = ((req.query.q as string) || '').trim();
    const type = (req.query.type as string) || 'creators';
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    if (!q) {
      return res.json({ success: true, data: { items: [], total: 0, page, limit } });
    }

    const handler = searchHandlers[type];
    const result = handler ? await handler(q, skip, limit) : { items: [], total: 0 };

    res.json({ success: true, data: { ...result, page, limit } });
  } catch (err) {
    next(err);
  }
});

export default router;
