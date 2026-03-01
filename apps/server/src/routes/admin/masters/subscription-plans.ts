import { Router } from 'express';
import { prisma } from '../../../config/database.js';
import { AppError } from '../../../middleware/errorHandler.js';
import { parsePagination, paginatedResponse } from './crud-helper.js';

const router = Router();

const USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
};

// ─── GET / ── list subscription tiers ────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip, search } = parsePagination(req);
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { creator: { username: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.subscriptionTier.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { creator: { select: USER_SELECT } },
      }),
      prisma.subscriptionTier.count({ where }),
    ]);

    res.json(paginatedResponse(items, total, page, limit));
  } catch (err) {
    next(err);
  }
});

// ─── POST / ── create tier ───────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { creatorId, name, price, description, benefits } = req.body;
    if (!creatorId || !name || price == null) {
      throw new AppError(400, 'creatorId, name, and price are required');
    }
    const item = await prisma.subscriptionTier.create({
      data: { creatorId, name, price, description, benefits },
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /:id ── update tier ─────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.subscriptionTier.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError(404, 'Subscription tier not found');

    const item = await prisma.subscriptionTier.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /:id ── delete tier ──────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.subscriptionTier.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError(404, 'Subscription tier not found');

    await prisma.subscriptionTier.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
});

export default router;
