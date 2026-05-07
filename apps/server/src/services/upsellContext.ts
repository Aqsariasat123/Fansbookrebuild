import { prisma } from '../config/database.js';

export async function collectCreatorContext(creatorId: string): Promise<string> {
  const now = new Date();
  const days30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const days7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const days14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [creator, recentPosts, tips30d, activeFans, dormantFans, subCount, ppvSales] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: creatorId },
        select: { displayName: true, username: true, category: true },
      }),
      prisma.post.findMany({
        where: { authorId: creatorId, createdAt: { gte: days30 } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { createdAt: true, likeCount: true, commentCount: true, ppvPrice: true },
      }),
      prisma.tip.aggregate({
        where: { receiverId: creatorId, createdAt: { gte: days30 } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.subscription.count({
        where: { creatorId, status: 'ACTIVE', updatedAt: { gte: days7 } },
      }),
      prisma.subscription.findMany({
        where: { creatorId, status: 'ACTIVE', updatedAt: { lte: days14 } },
        take: 5,
        select: { subscriberId: true },
      }),
      prisma.subscription.count({ where: { creatorId, status: 'ACTIVE' } }),
      prisma.ppvPurchase.count({
        where: { post: { authorId: creatorId }, createdAt: { gte: days30 } },
      }),
    ]);

  const daysSinceLastPost =
    recentPosts.length > 0
      ? Math.floor((now.getTime() - recentPosts[0].createdAt.getTime()) / 86400000)
      : 999;

  const avgEngagement =
    recentPosts.length > 0
      ? Math.round(
          recentPosts.reduce((s, p) => s + p.likeCount + p.commentCount, 0) / recentPosts.length,
        )
      : 0;

  const hasPpvPosts = recentPosts.some((p) => p.ppvPrice && p.ppvPrice > 0);

  return `Creator: ${creator?.displayName} (@${creator?.username}), Category: ${creator?.category ?? 'general'}
Active subscribers: ${subCount}
Subscribers active in last 7 days: ${activeFans}
Dormant subscribers (no activity 14+ days): ${dormantFans.length}
Posts in last 30 days: ${recentPosts.length}
Days since last post: ${daysSinceLastPost}
Average engagement per post (likes + comments): ${avgEngagement}
Tips received in 30 days: ${tips30d._count} tips worth $${((tips30d._sum as { amount?: number | null }).amount ?? 0).toFixed(2)}
PPV sales in 30 days: ${ppvSales}
Has PPV content: ${hasPpvPosts ? 'yes' : 'no'}`;
}
