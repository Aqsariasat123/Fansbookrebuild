import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All routes require auth + CREATOR role
router.use(authenticate, requireRole('CREATOR'));

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function getPeriodStart(period?: string): Date {
  const d = new Date();
  switch (period) {
    case '7d':
      d.setDate(d.getDate() - 7);
      break;
    case '90d':
      d.setMonth(d.getMonth() - 3);
      d.setDate(1);
      break;
    case 'all':
      return new Date(0);
    case '30d':
    default:
      d.setMonth(d.getMonth() - 6);
      d.setDate(1);
      break;
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

function groupByMonth<T extends { createdAt: Date }>(
  records: T[],
  valueKey: 'amount' | 'count',
): { month: string; [key: string]: string | number }[] {
  const buckets = new Map<string, number>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.set(MONTH_NAMES[d.getMonth()], 0);
  }

  for (const record of records) {
    const key = MONTH_NAMES[record.createdAt.getMonth()];
    if (buckets.has(key)) {
      const prev = buckets.get(key) ?? 0;
      const increment =
        valueKey === 'amount' ? (record as unknown as { amount: number }).amount : 1;
      buckets.set(key, prev + increment);
    }
  }

  const field = valueKey === 'amount' ? 'earnings' : 'count';
  return Array.from(buckets.entries()).map(([month, val]) => ({
    month,
    [field]: Math.round(val * 100) / 100,
  }));
}

// ─── GET /api/creator/dashboard/stats ── aggregated stats ────
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const [wallet, totalSubscribers, totalPosts, stories, totalFollowers] = await Promise.all([
      prisma.wallet.findUnique({ where: { userId } }),
      prisma.subscription.count({
        where: { creatorId: userId, status: 'ACTIVE' },
      }),
      prisma.post.count({ where: { authorId: userId } }),
      prisma.story.aggregate({
        where: { authorId: userId },
        _sum: { viewCount: true },
      }),
      prisma.follow.count({ where: { followingId: userId } }),
    ]);

    res.json({
      success: true,
      data: {
        totalEarnings: wallet?.totalEarned ?? 0,
        totalSubscribers,
        totalPosts,
        totalViews: stories._sum.viewCount ?? 0,
        totalFollowers,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/creator/dashboard/analytics ── chart data ──────
router.get('/analytics', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const period = req.query.period as string | undefined;
    const sixMonthsAgo = getPeriodStart(period);

    const wallet = await prisma.wallet.findUnique({ where: { userId } });

    const [transactions, topPosts, subscriptions, recentActivity] = await Promise.all([
      wallet
        ? prisma.transaction.findMany({
            where: { walletId: wallet.id, createdAt: { gte: sixMonthsAgo } },
            select: { amount: true, createdAt: true },
          })
        : Promise.resolve([]),
      prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { likeCount: 'desc' },
        take: 5,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
          media: true,
        },
      }),
      prisma.subscription.findMany({
        where: { creatorId: userId, createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          message: true,
          read: true,
          actorId: true,
          entityId: true,
          entityType: true,
          createdAt: true,
        },
      }),
    ]);

    const earningsHistory = groupByMonth(
      transactions as Array<{ amount: number; createdAt: Date }>,
      'amount',
    );
    const subscriberGrowth = groupByMonth(subscriptions, 'count');

    res.json({
      success: true,
      data: {
        earningsHistory,
        topPosts,
        subscriberGrowth,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
