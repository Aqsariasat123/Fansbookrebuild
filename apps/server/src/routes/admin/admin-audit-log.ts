import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { parsePagination, paginatedResponse } from './masters/crud-helper.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip, search } = parsePagination(req);
    const action = req.query.action as string | undefined;
    const adminId = req.query.adminId as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { targetType: { contains: search, mode: 'insensitive' } },
        { admin: { username: { contains: search, mode: 'insensitive' } } },
        { admin: { displayName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (action) where.action = action;
    if (adminId) where.adminId = adminId;
    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { admin: { select: { id: true, username: true, displayName: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json(paginatedResponse(items, total, page, limit));
  } catch (err) {
    next(err);
  }
});

export default router;
