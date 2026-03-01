import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logActivity } from '../../utils/audit.js';
import { createNotification } from '../../utils/notify.js';

const router = Router();

// GET /api/admin/badges — list badges with search + pagination
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const search = ((req.query.search as string) || '').trim();

    const where: Record<string, unknown> = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.badge.findMany({
        where,
        include: { _count: { select: { users: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.badge.count({ where }),
    ]);

    const mapped = items.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      icon: b.icon,
      rarity: b.rarity,
      category: b.category,
      earnedCount: b._count.users,
      createdAt: b.createdAt,
    }));

    res.json({
      success: true,
      data: { items: mapped, total, totalPages: Math.ceil(total / limit), page, limit },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/badges — create badge
router.post('/', async (req, res, next) => {
  try {
    const { name, description, icon, rarity, category, criteria } = req.body;
    if (!name?.trim() || !description?.trim()) {
      throw new AppError(400, 'Name and description are required');
    }

    const badge = await prisma.badge.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        icon: icon || '',
        rarity: rarity || 'COMMON',
        category: category || 'SPECIAL',
        criteria: criteria || null,
      },
    });

    logActivity(req.user!.userId, 'BADGE_CREATE', 'Badge', badge.id, { name }, req);
    res.status(201).json({ success: true, data: badge });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/badges/:id — update badge
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, icon, rarity, category, criteria } = req.body;
    const badge = await prisma.badge.findUnique({ where: { id: req.params.id as string } });
    if (!badge) throw new AppError(404, 'Badge not found');

    const updated = await prisma.badge.update({
      where: { id: badge.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(description ? { description: description.trim() } : {}),
        ...(icon !== undefined ? { icon } : {}),
        ...(rarity ? { rarity } : {}),
        ...(category ? { category } : {}),
        ...(criteria !== undefined ? { criteria } : {}),
      },
    });

    logActivity(req.user!.userId, 'BADGE_UPDATE', 'Badge', badge.id, { name }, req);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/badges/:id — delete badge
router.delete('/:id', async (req, res, next) => {
  try {
    const badge = await prisma.badge.findUnique({ where: { id: req.params.id as string } });
    if (!badge) throw new AppError(404, 'Badge not found');

    await prisma.userBadge.deleteMany({ where: { badgeId: badge.id } });
    await prisma.badge.delete({ where: { id: badge.id } });

    logActivity(req.user!.userId, 'BADGE_DELETE', 'Badge', badge.id, { name: badge.name }, req);
    res.json({ success: true, message: 'Badge deleted' });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/badges/:id/award — award badge to user
router.post('/:id/award', async (req, res, next) => {
  try {
    const badgeId = req.params.id as string;
    const { userId } = req.body;
    if (!userId) throw new AppError(400, 'userId is required');

    const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) throw new AppError(404, 'Badge not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'User not found');

    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
    });
    if (existing) throw new AppError(409, 'User already has this badge');

    await prisma.userBadge.create({ data: { userId, badgeId } });

    createNotification({
      userId,
      type: 'BADGE',
      actorId: req.user!.userId,
      entityId: badgeId,
      entityType: 'Badge',
      message: `You were awarded the "${badge.name}" badge!`,
    });

    logActivity(
      req.user!.userId,
      'BADGE_AWARD',
      'Badge',
      badgeId,
      { userId, badgeName: badge.name },
      req,
    );
    res.json({ success: true, message: 'Badge awarded' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/badges/:badgeId/revoke/:userId — revoke badge
router.delete('/:badgeId/revoke/:userId', async (req, res, next) => {
  try {
    const { badgeId, userId } = req.params;
    const ub = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId: userId as string, badgeId: badgeId as string } },
    });
    if (!ub) throw new AppError(404, 'User does not have this badge');

    await prisma.userBadge.delete({ where: { id: ub.id } });

    logActivity(req.user!.userId, 'BADGE_REVOKE', 'Badge', badgeId as string, { userId }, req);
    res.json({ success: true, message: 'Badge revoked' });
  } catch (err) {
    next(err);
  }
});

export default router;
