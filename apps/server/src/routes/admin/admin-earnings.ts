import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { getPagination, buildDateFilter, paginatedResponse } from './query-helpers.js';

const router = Router();

function buildEarningsWhere(query: Record<string, unknown>) {
  const where: Record<string, unknown> = {};
  const type = query.type as string | undefined;
  if (type && type !== 'All') where.type = type;
  const search = (query.search as string)?.trim();
  if (search) where.description = { contains: search, mode: 'insensitive' };
  Object.assign(where, buildDateFilter(query.from as string, query.to as string));
  return where;
}

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const where = buildEarningsWhere(req.query as Record<string, unknown>);
    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          wallet: {
            select: {
              user: { select: { id: true, username: true, displayName: true, role: true } },
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);
    const mapped = items.map((t) => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      referenceId: t.referenceId,
      status: t.status,
      user: t.wallet.user,
      createdAt: t.createdAt,
    }));
    res.json(paginatedResponse(mapped, total, page, limit));
  } catch (err) {
    next(err);
  }
});

export default router;
