import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.use(authenticate, requireRole('CREATOR'));

const EARNING_TYPES = ['TIP_RECEIVED', 'SUBSCRIPTION', 'PPV_EARNING'] as const;

// Map frontend category labels → DB types
const CATEGORY_MAP: Record<string, string> = {
  Tips: 'TIP_RECEIVED',
  Subscriptions: 'SUBSCRIPTION',
  'PPV / Post Purchase': 'PPV_EARNING',
  TIP_RECEIVED: 'TIP_RECEIVED',
  SUBSCRIPTION: 'SUBSCRIPTION',
  PPV_EARNING: 'PPV_EARNING',
};

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
  const mappedType = category && category !== 'All' ? CATEGORY_MAP[category] : undefined;
  const isValidType =
    mappedType && EARNING_TYPES.includes(mappedType as (typeof EARNING_TYPES)[number]);
  const where: Record<string, unknown> = {
    walletId,
    type: isValidType ? mappedType : { in: [...EARNING_TYPES] },
  };
  if (search && search.trim()) {
    where.description = { contains: search.trim(), mode: 'insensitive' };
  }
  const dateFilter = parseDateFilter(startDate, endDate);
  if (dateFilter) where.createdAt = dateFilter;
  return where;
}

const SOURCE_LABELS: Record<string, string> = {
  TIP_RECEIVED: 'Tips',
  SUBSCRIPTION: 'Subscriptions',
  PPV_EARNING: 'PPV / Post Purchase',
};

// ─── GET /api/creator/earnings ── paginated earnings ────────
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return res.json({ success: true, data: { items: [], total: 0, page, limit } });
    }

    const where = buildEarningsFilter(wallet.id, {
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    });

    const [transactions, total] = await Promise.all([
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

    // Batch-lookup senders via referenceId (user ID stored at transaction creation)
    const senderIds = [
      ...new Set(transactions.map((t) => t.referenceId).filter(Boolean)),
    ] as string[];
    const senders = senderIds.length
      ? await prisma.user.findMany({
          where: { id: { in: senderIds } },
          select: { id: true, username: true, displayName: true },
        })
      : [];
    const senderMap = Object.fromEntries(senders.map((u) => [u.id, u]));

    const items = transactions.map((t) => ({
      id: t.id,
      createdAt: t.createdAt,
      amount: t.amount,
      type: t.type,
      source: SOURCE_LABELS[t.type] ?? t.type,
      description: t.description,
      status: t.status,
      fromUser: t.referenceId ? (senderMap[t.referenceId] ?? null) : null,
    }));

    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

export default router;
