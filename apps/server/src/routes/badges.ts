import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/badges — All badges with user's earned status
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const [badges, earned] = await Promise.all([
      prisma.badge.findMany({ orderBy: { name: 'asc' } }),
      prisma.userBadge.findMany({
        where: { userId },
        select: { badgeId: true, earnedAt: true },
      }),
    ]);

    const earnedMap = new Map(earned.map((e) => [e.badgeId, e.earnedAt]));

    const data = badges.map((b) => ({
      ...b,
      earned: earnedMap.has(b.id),
      earnedAt: earnedMap.get(b.id) || null,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/badges/mine — User's earned badges
router.get('/mine', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const earned = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    res.json({ success: true, data: earned });
  } catch (err) {
    next(err);
  }
});

export default router;
