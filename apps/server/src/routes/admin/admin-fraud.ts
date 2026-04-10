import { Router } from 'express';
import { prisma } from '../../config/database.js';

const router = Router();

// GET /api/admin/fraud?outcome=BLOCKED&page=1
router.get('/', async (req, res, next) => {
  try {
    const outcome = (req.query.outcome as string) || undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;
    const where = outcome ? { outcome } : {};

    const [items, total] = await Promise.all([
      prisma.fraudEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { id: true, username: true, email: true, avatar: true } } },
      }),
      prisma.fraudEvent.count({ where }),
    ]);

    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/fraud/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [blocked, flagged, allowed, blockedToday] = await Promise.all([
      prisma.fraudEvent.count({ where: { outcome: 'BLOCKED' } }),
      prisma.fraudEvent.count({ where: { outcome: 'FLAGGED' } }),
      prisma.fraudEvent.count({ where: { outcome: 'ALLOWED' } }),
      prisma.fraudEvent.count({ where: { outcome: 'BLOCKED', createdAt: { gte: since } } }),
    ]);
    res.json({ success: true, data: { blocked, flagged, allowed, blockedToday } });
  } catch (err) {
    next(err);
  }
});

export default router;
