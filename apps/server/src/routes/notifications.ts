import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

async function enrichWithActors(items: { actorId: string | null }[]) {
  const actorIds = [...new Set(items.map((n) => n.actorId).filter(Boolean))] as string[];
  if (actorIds.length === 0) return new Map<string, { username: string; avatar: string | null }>();
  const actors = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, username: true, avatar: true },
  });
  return new Map(actors.map((a) => [a.id, { username: a.username, avatar: a.avatar }]));
}

// GET /notifications?archived=true (default: non-archived)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const archived = req.query.archived === 'true';

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId, archived },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId, archived } }),
      prisma.notification.count({ where: { userId, read: false, archived: false } }),
    ]);

    const actorMap = await enrichWithActors(items);
    const enriched = items.map((n) => {
      const actor = n.actorId ? actorMap.get(n.actorId) : null;
      return { ...n, actorAvatar: actor?.avatar ?? null, actorUsername: actor?.username ?? null };
    });

    res.json({ success: true, data: { items: enriched, total, unreadCount, page, limit } });
  } catch (err) {
    next(err);
  }
});

// IMPORTANT: named routes must come before /:id to avoid param collision
router.put('/read-all', authenticate, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.put('/archive-all', authenticate, async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, archived: false },
      data: { archived: true, read: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.put('/bulk-archive', authenticate, async (req, res, next) => {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'ids required' });
      return;
    }
    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId: req.user!.userId },
      data: { archived: true, read: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/bulk-delete', authenticate, async (req, res, next) => {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'ids required' });
      return;
    }
    await prisma.notification.deleteMany({
      where: { id: { in: ids }, userId: req.user!.userId },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    await prisma.notification.updateMany({ where: { id, userId }, data: { read: true } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/archive', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    await prisma.notification.updateMany({
      where: { id, userId },
      data: { archived: true, read: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    await prisma.notification.deleteMany({ where: { id, userId } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
