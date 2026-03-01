import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const CREATOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

async function fetchSubscribers(limit: number) {
  const rows = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    select: { ...CREATOR_SELECT, _count: { select: { followers: true } } },
    orderBy: { followers: { _count: 'desc' } },
    take: limit,
  });
  return rows.map((u, i) => ({
    rank: i + 1,
    ...u,
    value: u._count.followers,
  }));
}

async function fetchEarnings(limit: number) {
  const wallets = await prisma.wallet.findMany({
    where: { user: { role: 'CREATOR' } },
    select: { totalEarned: true, user: { select: CREATOR_SELECT } },
    orderBy: { totalEarned: 'desc' },
    take: limit,
  });
  return wallets.map((w, i) => ({
    rank: i + 1,
    ...w.user,
    value: w.totalEarned,
  }));
}

async function fetchPosts(limit: number, periodStart: Date) {
  const postsFilter =
    periodStart.getTime() > 0 ? { where: { createdAt: { gte: periodStart } } } : true;
  const creators = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    select: { ...CREATOR_SELECT, _count: { select: { posts: postsFilter } } },
    orderBy: { posts: { _count: 'desc' } },
    take: limit,
  });
  return creators.map((u, i) => ({
    rank: i + 1,
    ...u,
    value: u._count.posts,
    _count: undefined,
  }));
}

async function fetchRising(limit: number, periodStart: Date) {
  const follows = await prisma.follow.groupBy({
    by: ['followingId'],
    where: periodStart.getTime() > 0 ? { createdAt: { gte: periodStart } } : {},
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: limit,
  });
  const userIds = follows.map((f) => f.followingId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: CREATOR_SELECT,
  });
  const userMap = new Map(users.map((u) => [u.id, u]));
  return follows.map((f, i) => ({
    rank: i + 1,
    ...userMap.get(f.followingId),
    value: f._count.id,
  }));
}

const typeHandlers: Record<string, (limit: number, periodStart: Date) => Promise<unknown[]>> = {
  subscribers: (limit) => fetchSubscribers(limit),
  earnings: (limit) => fetchEarnings(limit),
  posts: fetchPosts,
  rising: fetchRising,
};

// GET /api/leaderboard?type=subscribers|earnings|posts|rising&period=week|month|all
router.get('/', authenticate, async (req, res, next) => {
  try {
    const type = (req.query.type as string) || 'subscribers';
    const period = (req.query.period as string) || 'month';
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const periodStart = getPeriodStart(period);

    const handler = typeHandlers[type];
    const items = handler ? await handler(limit, periodStart) : [];

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

function getPeriodStart(period: string): Date {
  const d = new Date();
  if (period === 'week') d.setDate(d.getDate() - 7);
  else if (period === 'month') d.setMonth(d.getMonth() - 1);
  else return new Date(0);
  return d;
}

export default router;
