import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// All routes require auth + CREATOR role
router.use(authenticate, requireRole('CREATOR'));

const EARNING_TYPES = ['TIP_RECEIVED', 'SUBSCRIPTION', 'PPV_EARNING', 'REFERRAL'] as const;

interface EarningsQuery {
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

function parseDateFilter(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return undefined;
  const filter: Record<string, Date> = {};
  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) throw new AppError(400, 'Invalid startDate format');
    filter.gte = start;
  }
  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) throw new AppError(400, 'Invalid endDate format');
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }
  return filter;
}

function buildEarningsFilter(walletId: string, query: EarningsQuery): Record<string, unknown> {
  const { category, search, startDate, endDate } = query;
  const isValidCategory =
    category &&
    category !== 'All' &&
    EARNING_TYPES.includes(category as (typeof EARNING_TYPES)[number]);
  const where: Record<string, unknown> = {
    walletId,
    type: isValidCategory ? category : { in: [...EARNING_TYPES] },
  };
  if (search && search.trim()) {
    where.description = { contains: search.trim(), mode: 'insensitive' };
  }
  const dateFilter = parseDateFilter(startDate, endDate);
  if (dateFilter) where.createdAt = dateFilter;
  return where;
}

// ─── GET /api/creator/earnings ── paginated earnings ────────
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // Find wallet first
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return res.json({
        success: true,
        data: { items: [], total: 0, page, limit },
      });
    }

    const where = buildEarningsFilter(wallet.id, {
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    });

    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          referenceId: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: { items, total, page, limit },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
