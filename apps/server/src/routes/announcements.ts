import { Router } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

// GET /api/announcements — active announcements (limit 10, newest first)
router.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, title: true, content: true, createdAt: true },
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

export default router;
