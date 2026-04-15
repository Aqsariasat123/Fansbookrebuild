import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/live/:id/pinned-item — get currently pinned item (any authenticated user)
router.get('/:id/pinned-item', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const session = await prisma.liveSession.findUnique({
      where: { id },
      select: {
        pinnedItem: {
          select: { id: true, title: true, price: true, images: true },
        },
      },
    });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session.pinnedItem ?? null });
  } catch (err) {
    next(err);
  }
});

// GET /api/live/:id/shop-listings — creator's active listings for pin panel
router.get('/:id/shop-listings', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const session = await prisma.liveSession.findUnique({
      where: { id },
      select: { creatorId: true },
    });
    if (!session || session.creatorId !== req.user!.userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    const listings = await prisma.marketplaceListing.findMany({
      where: { sellerId: req.user!.userId, status: 'ACTIVE' },
      select: { id: true, title: true, price: true, images: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: listings });
  } catch (err) {
    next(err);
  }
});

export default router;
