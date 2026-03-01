import { Router } from 'express';
import { prisma } from '../../config/database.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalFans,
      totalCreators,
      activeUsers24h,
      totalPosts,
      totalMessages,
      totalRevenue,
      pendingWithdrawals,
      pendingReports,
      totalSubscriptions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'FAN' } }),
      prisma.user.count({ where: { role: 'CREATOR' } }),
      prisma.session.count({ where: { lastActive: { gte: oneDayAgo } } }).catch(() => 0),
      prisma.post.count(),
      prisma.message.count(),
      prisma.transaction.aggregate({
        where: { type: { in: ['SUBSCRIPTION', 'TIP_RECEIVED', 'PPV_EARNING'] } },
        _sum: { amount: true },
      }),
      prisma.withdrawal.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFans,
        totalCreators,
        activeUsers24h,
        totalPosts,
        totalMessages,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingWithdrawals,
        pendingReports,
        totalSubscriptions,
      },
    });
  } catch (err) {
    next(err);
  }
});

async function countMetric(metric: string, dayStart: Date, dayEnd: Date): Promise<number> {
  const dateRange = { gte: dayStart, lte: dayEnd };
  if (metric === 'users') return prisma.user.count({ where: { createdAt: dateRange } });
  if (metric === 'posts') return prisma.post.count({ where: { createdAt: dateRange } });
  if (metric === 'messages') return prisma.message.count({ where: { createdAt: dateRange } });
  if (metric === 'revenue') {
    const agg = await prisma.transaction.aggregate({
      where: {
        createdAt: dateRange,
        type: { in: ['SUBSCRIPTION', 'TIP_RECEIVED', 'PPV_EARNING'] },
      },
      _sum: { amount: true },
    });
    return Number(agg._sum.amount || 0);
  }
  return 0;
}

router.get('/chart', async (req, res, next) => {
  try {
    const metric = (req.query.metric as string) || 'users';
    const period = (req.query.period as string) || '30d';
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const points: { date: string; count: number }[] = [];
    for (let i = 0; i < days; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const count = await countMetric(metric, dayStart, dayEnd);
      points.push({ date: dayStart.toISOString().split('T')[0], count });
    }

    res.json({ success: true, data: { metric, period, points } });
  } catch (err) {
    next(err);
  }
});

export default router;
