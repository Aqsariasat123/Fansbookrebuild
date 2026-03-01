import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    res.json({ success: true, data: { items, total, unreadCount, page, limit } });
  } catch (err) {
    next(err);
  }
});

// IMPORTANT: /read-all must be above /:id/read to avoid matching "read-all" as an id
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
