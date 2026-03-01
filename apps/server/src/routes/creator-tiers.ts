import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';
import { LIMITS } from '@fansbook/shared';

const router = Router();

// All routes require auth + CREATOR role
router.use(authenticate, requireRole('CREATOR'));

interface TierBody {
  name?: unknown;
  price?: unknown;
  description?: unknown;
  benefits?: unknown;
}

function validateName(name: unknown, required: boolean) {
  if (required && (!name || typeof name !== 'string' || !(name as string).trim()))
    throw new AppError(400, 'Tier name is required');
  if (!required && name !== undefined && (typeof name !== 'string' || !(name as string).trim()))
    throw new AppError(400, 'Tier name cannot be empty');
}

function validatePrice(price: unknown, required: boolean) {
  if (required && (price === undefined || typeof price !== 'number' || price < 0))
    throw new AppError(400, 'Price must be a non-negative number');
  if (!required && price !== undefined && (typeof price !== 'number' || price < 0))
    throw new AppError(400, 'Price must be a non-negative number');
}

function validateTierData(body: TierBody, isCreate: boolean) {
  validateName(body.name, isCreate);
  validatePrice(body.price, isCreate);
  if (body.benefits !== undefined && !Array.isArray(body.benefits))
    throw new AppError(400, 'Benefits must be an array');
}

function buildTierData(body: TierBody): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) {
    data.name = (body.name as string).trim();
  }
  if (body.price !== undefined) {
    data.price = body.price;
  }
  if (body.description !== undefined) {
    data.description =
      typeof body.description === 'string' ? (body.description as string).trim() : null;
  }
  if (body.benefits !== undefined) {
    data.benefits = body.benefits;
  }

  return data;
}

// ─── GET /api/creator/tiers ── list own tiers ───────────────
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const tiers = await prisma.subscriptionTier.findMany({
      where: { creatorId: userId, isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        benefits: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { subscriptions: true },
        },
      },
    });

    const data = tiers.map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
      description: t.description,
      benefits: t.benefits,
      order: t.order,
      isActive: t.isActive,
      subscriberCount: t._count.subscriptions,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/creator/tiers ── create tier ─────────────────
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    validateTierData(req.body, true);
    const tierData = buildTierData(req.body);

    // Enforce max tier limit
    const activeCount = await prisma.subscriptionTier.count({
      where: { creatorId: userId, isActive: true },
    });
    if (activeCount >= LIMITS.MAX_SUBSCRIPTION_TIERS) {
      throw new AppError(400, `Maximum ${LIMITS.MAX_SUBSCRIPTION_TIERS} tiers allowed`);
    }

    // Get next order value
    const lastTier = await prisma.subscriptionTier.findFirst({
      where: { creatorId: userId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const tier = await prisma.subscriptionTier.create({
      data: {
        creatorId: userId,
        name: tierData.name as string,
        price: tierData.price as number,
        description: (tierData.description as string) || null,
        benefits: (tierData.benefits as string[]) || [],
        order: (lastTier?.order ?? -1) + 1,
      },
    });

    res.status(201).json({ success: true, data: tier });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/creator/tiers/:id ── update tier ──────────────
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const tierId = req.params.id as string;

    const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } });
    if (!tier) throw new AppError(404, 'Tier not found');
    if (tier.creatorId !== userId) throw new AppError(403, 'Not authorized to update this tier');

    validateTierData(req.body, false);
    const updateData = buildTierData(req.body);

    const updated = await prisma.subscriptionTier.update({
      where: { id: tierId },
      data: updateData,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/creator/tiers/reorder ── reorder tiers ────────
router.put('/reorder', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const items = req.body.items as { id: string; order: number }[];
    if (!Array.isArray(items)) throw new AppError(400, 'items must be an array');

    for (const item of items) {
      const tier = await prisma.subscriptionTier.findUnique({ where: { id: item.id } });
      if (!tier || tier.creatorId !== userId) continue;
      await prisma.subscriptionTier.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }

    res.json({ success: true, message: 'Tiers reordered' });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/creator/tiers/:id ── soft delete tier ──────
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const tierId = req.params.id as string;

    const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } });
    if (!tier) throw new AppError(404, 'Tier not found');
    if (tier.creatorId !== userId) throw new AppError(403, 'Not authorized to delete this tier');

    const activeSubs = await prisma.subscription.count({
      where: { tierId, status: 'ACTIVE' },
    });
    if (activeSubs > 0) {
      throw new AppError(400, `Cannot deactivate tier with ${activeSubs} active subscriber(s)`);
    }

    await prisma.subscriptionTier.update({
      where: { id: tierId },
      data: { isActive: false },
    });

    res.json({ success: true, message: 'Tier deactivated' });
  } catch (err) {
    next(err);
  }
});

export default router;
