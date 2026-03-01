import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = Router();

const USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  role: true,
};

function parseDateRange(from?: string, to?: string) {
  if (!from && !to) return undefined;
  const filter: Record<string, Date> = {};
  if (from) {
    const d = new Date(from);
    if (isNaN(d.getTime())) throw new AppError(400, 'Invalid from date');
    filter.gte = d;
  }
  if (to) {
    const d = new Date(to);
    if (isNaN(d.getTime())) throw new AppError(400, 'Invalid to date');
    d.setHours(23, 59, 59, 999);
    filter.lte = d;
  }
  return filter;
}

// ─── GET /api/admin/finance/subscriptions ────────────────
router.get('/subscriptions', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const search = (req.query.search as string)?.trim();

    const where: Record<string, unknown> = {};
    const dateRange = parseDateRange(req.query.from as string, req.query.to as string);
    if (dateRange) where.createdAt = dateRange;

    if (search) {
      where.OR = [
        { subscriber: { username: { contains: search, mode: 'insensitive' } } },
        { creator: { username: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          subscriber: { select: USER_SELECT },
          creator: { select: USER_SELECT },
          tier: { select: { id: true, name: true, price: true } },
        },
      }),
      prisma.subscription.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/finance/withdrawals ──────────────────
router.get('/withdrawals', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const search = (req.query.search as string)?.trim();

    const where: Record<string, unknown> = {};
    const dateRange = parseDateRange(req.query.from as string, req.query.to as string);
    if (dateRange) where.createdAt = dateRange;

    if (search) {
      where.creator = {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { creator: { select: USER_SELECT } },
      }),
      prisma.withdrawal.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/finance/payouts ──────────────────────
router.get('/payouts', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const search = (req.query.search as string)?.trim();

    const where: Record<string, unknown> = {
      status: 'COMPLETED',
    };
    const dateRange = parseDateRange(req.query.from as string, req.query.to as string);
    if (dateRange) where.processedAt = dateRange;

    if (search) {
      where.creator = {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        orderBy: { processedAt: 'desc' },
        skip,
        take: limit,
        include: { creator: { select: USER_SELECT } },
      }),
      prisma.withdrawal.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
