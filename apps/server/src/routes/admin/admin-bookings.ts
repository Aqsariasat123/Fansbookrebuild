import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { getPagination, buildDateFilter, paginatedResponse } from './query-helpers.js';

const router = Router();

const USER_SELECT = { id: true, username: true, displayName: true, avatar: true };

function buildBookingWhere(query: Record<string, unknown>) {
  const where: Record<string, unknown> = {};
  const status = query.status as string | undefined;
  if (status && status !== 'All') where.status = status;
  const search = (query.search as string)?.trim();
  if (search) {
    where.OR = [
      { creator: { username: { contains: search, mode: 'insensitive' } } },
      { creator: { displayName: { contains: search, mode: 'insensitive' } } },
      { fan: { username: { contains: search, mode: 'insensitive' } } },
      { fan: { displayName: { contains: search, mode: 'insensitive' } } },
    ];
  }
  Object.assign(where, buildDateFilter(query.from as string, query.to as string, 'date'));
  return where;
}

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const where = buildBookingWhere(req.query as Record<string, unknown>);
    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { creator: { select: USER_SELECT }, fan: { select: USER_SELECT } },
      }),
      prisma.booking.count({ where }),
    ]);
    res.json(paginatedResponse(items, total, page, limit));
  } catch (err) {
    next(err);
  }
});

export default router;
