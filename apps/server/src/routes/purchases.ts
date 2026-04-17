import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { escrowQueue } from '../jobs/queue.js';

const router = Router();

const INCLUDE_LISTING = {
  listing: { select: { id: true, title: true, images: true, category: true } },
  seller: { select: { id: true, username: true, displayName: true, avatar: true } },
};

// GET /api/purchases/my — fan's purchase history
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.marketplacePurchase.findMany({
        where: { buyerId: userId },
        include: INCLUDE_LISTING,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.marketplacePurchase.count({ where: { buyerId: userId } }),
    ]);

    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

// POST /api/purchases/:id/confirm — fan confirms delivery → release funds to seller
router.post('/:id/confirm', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const purchase = await prisma.marketplacePurchase.findUnique({
      where: { id: req.params.id as string },
    });
    if (!purchase) throw new AppError(404, 'Purchase not found');
    if (purchase.buyerId !== userId) throw new AppError(403, 'Forbidden');
    if (purchase.status !== 'DELIVERED')
      throw new AppError(400, 'Item not marked as delivered yet');

    const sellerWallet = await prisma.wallet.findUnique({ where: { userId: purchase.sellerId } });
    if (!sellerWallet) throw new AppError(500, 'Seller wallet not found');

    await prisma.$transaction([
      prisma.marketplacePurchase.update({
        where: { id: purchase.id },
        data: { status: 'RELEASED', confirmedAt: new Date() },
      }),
      prisma.wallet.update({
        where: { id: sellerWallet.id },
        data: {
          balance: { increment: purchase.amount },
          totalEarned: { increment: purchase.amount },
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: sellerWallet.id,
          type: 'ESCROW_RELEASE',
          amount: purchase.amount,
          description: `Escrow released: ${purchase.id}`,
          referenceId: purchase.id,
          status: 'COMPLETED',
        },
      }),
    ]);

    res.json({ success: true, message: 'Delivery confirmed. Payment released to seller.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/purchases/:id/dispute — fan raises a dispute
router.post('/:id/dispute', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { reason } = req.body as { reason?: string };
    if (!reason?.trim()) throw new AppError(400, 'Dispute reason is required');

    const purchase = await prisma.marketplacePurchase.findUnique({
      where: { id: req.params.id as string },
    });
    if (!purchase) throw new AppError(404, 'Purchase not found');
    if (purchase.buyerId !== userId) throw new AppError(403, 'Forbidden');
    if (!['HELD', 'DELIVERED'].includes(purchase.status)) {
      throw new AppError(400, 'Cannot dispute at this stage');
    }

    await prisma.marketplacePurchase.update({
      where: { id: purchase.id },
      data: { status: 'DISPUTED', disputeReason: reason.trim() },
    });

    // Cancel auto-release job for this purchase
    const jobs = await escrowQueue.getJobs(['delayed']);
    for (const job of jobs) {
      if (job.data?.purchaseId === purchase.id) await job.remove();
    }

    res.json({ success: true, message: 'Dispute raised. Admin will review within 24 hours.' });
  } catch (err) {
    next(err);
  }
});

export default router;
