import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = { subscriberId: userId };
    if (status && ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PAST_DUE'].includes(status)) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          creator: { select: { id: true, username: true, displayName: true, avatar: true } },
          tier: { select: { name: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscription.count({ where }),
    ]);

    const data = items.map((s) => ({
      id: s.id,
      creatorName: s.creator.displayName,
      creatorAvatar: s.creator.avatar,
      amount: s.tier.price,
      planName: s.tier.name,
      startDate: s.startDate,
      endDate: s.endDate,
      renewalDate: s.renewalDate,
      status: s.status,
    }));

    res.json({ success: true, data: { items: data, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

export default router;
