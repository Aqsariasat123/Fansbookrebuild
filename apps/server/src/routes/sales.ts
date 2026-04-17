import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const INCLUDE_LISTING = {
  listing: { select: { id: true, title: true, images: true, category: true } },
  buyer: { select: { id: true, username: true, displayName: true, avatar: true } },
};

// GET /api/sales/my — creator's sales history
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.marketplacePurchase.findMany({
        where: { sellerId: userId },
        include: INCLUDE_LISTING,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.marketplacePurchase.count({ where: { sellerId: userId } }),
    ]);

    // Aggregate totals
    const agg = await prisma.marketplacePurchase.aggregate({
      where: { sellerId: userId },
      _sum: { amount: true },
    });
    const pendingAgg = await prisma.marketplacePurchase.aggregate({
      where: { sellerId: userId, status: { in: ['HELD', 'DELIVERED'] } },
      _sum: { amount: true },
    });

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalEarned: agg._sum.amount ?? 0,
        pendingEscrow: pendingAgg._sum.amount ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sales/:id/delivered — creator marks item as delivered
router.post('/:id/delivered', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const purchase = await prisma.marketplacePurchase.findUnique({
      where: { id: req.params.id as string },
    });
    if (!purchase) throw new AppError(404, 'Purchase not found');
    if (purchase.sellerId !== userId) throw new AppError(403, 'Forbidden');
    if (purchase.status !== 'HELD') throw new AppError(400, 'Purchase is not in escrow');

    await prisma.marketplacePurchase.update({
      where: { id: purchase.id },
      data: { status: 'DELIVERED', deliveredAt: new Date() },
    });

    res.json({ success: true, message: 'Marked as delivered. Buyer has 48 hours to confirm.' });
  } catch (err) {
    next(err);
  }
});

export default router;
