import type { PrismaClient } from '@prisma/client';

export interface BadgeCriterion {
  badgeName: string;
  check: (prisma: PrismaClient, userId: string) => Promise<boolean>;
}

export const BADGE_CRITERIA: BadgeCriterion[] = [
  {
    badgeName: 'First Post',
    check: async (prisma, userId) => {
      const count = await prisma.post.count({
        where: { authorId: userId, deletedAt: null },
      });
      return count >= 1;
    },
  },
  {
    badgeName: 'Popular Creator',
    check: async (prisma, userId) => {
      const count = await prisma.follow.count({
        where: { followingId: userId },
      });
      return count >= 1000;
    },
  },
  {
    badgeName: 'Super Tipper',
    check: async (prisma, userId) => {
      const result = await prisma.tip.aggregate({
        where: { senderId: userId },
        _sum: { amount: true },
      });
      return (result._sum.amount ?? 0) >= 500;
    },
  },
  {
    badgeName: 'Engaged Fan',
    check: async (prisma, userId) => {
      const count = await prisma.like.count({
        where: { userId },
      });
      return count >= 100;
    },
  },
  // "Early Adopter" is admin-only (manual award), not in auto-check list
];
