import { prisma } from '../config/database.js';
import { BADGE_CRITERIA } from './badge-criteria.js';
import { createNotification } from './notify.js';
import { logger } from './logger.js';

export function checkBadges(userId: string) {
  // Fire-and-forget — errors logged silently
  runBadgeChecks(userId).catch((err) => {
    logger.error({ err, userId }, 'Badge check failed');
  });
}

async function runBadgeChecks(userId: string) {
  const allBadges = await prisma.badge.findMany();
  const earned = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedIds = new Set(earned.map((e) => e.badgeId));

  for (const criterion of BADGE_CRITERIA) {
    const badge = allBadges.find((b) => b.name === criterion.badgeName);
    if (!badge || earnedIds.has(badge.id)) continue;

    const met = await criterion.check(prisma, userId);
    if (!met) continue;

    await prisma.userBadge.create({
      data: { userId, badgeId: badge.id },
    });

    createNotification({
      userId,
      type: 'BADGE',
      message: `You earned the "${badge.name}" badge!`,
      entityId: badge.id,
      entityType: 'Badge',
    });
  }
}
