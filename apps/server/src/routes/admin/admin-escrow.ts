import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { MarketplacePurchase } from '@prisma/client';

const router = Router();

const PURCHASE_INCLUDE = {
  listing: { select: { id: true, title: true, images: true } },
  buyer: { select: { id: true, username: true, displayName: true, avatar: true } },
  seller: { select: { id: true, username: true, displayName: true, avatar: true } },
};

async function releaseToSeller(purchase: MarketplacePurchase, note: string | undefined) {
  const sellerWallet = await prisma.wallet.findUnique({ where: { userId: purchase.sellerId } });
  if (!sellerWallet) throw new AppError(500, 'Seller wallet not found');
  await prisma.$transaction([
    prisma.marketplacePurchase.update({
      where: { id: purchase.id },
      data: { status: 'RELEASED', adminNote: note ?? null, resolvedAt: new Date() },
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
        description: `Admin released escrow: ${purchase.id}`,
        referenceId: purchase.id,
        status: 'COMPLETED',
      },
    }),
  ]);
}

async function refundToBuyer(purchase: MarketplacePurchase, note: string | undefined) {
  const buyerWallet = await prisma.wallet.findUnique({ where: { userId: purchase.buyerId } });
  if (!buyerWallet) throw new AppError(500, 'Buyer wallet not found');
  await prisma.$transaction([
    prisma.marketplacePurchase.update({
      where: { id: purchase.id },
      data: { status: 'REFUNDED', adminNote: note ?? null, resolvedAt: new Date() },
    }),
    prisma.wallet.update({
      where: { id: buyerWallet.id },
      data: { balance: { increment: purchase.amount } },
    }),
    prisma.transaction.create({
      data: {
        walletId: buyerWallet.id,
        type: 'ESCROW_REFUND',
        amount: purchase.amount,
        description: `Admin refunded escrow: ${purchase.id}`,
        referenceId: purchase.id,
        status: 'COMPLETED',
      },
    }),
  ]);
}

// GET /api/admin/escrow — all escrow transactions
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const where = status ? { status: status as never } : {};
    const [items, total] = await Promise.all([
      prisma.marketplacePurchase.findMany({
        where,
        include: PURCHASE_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.marketplacePurchase.count({ where }),
    ]);
    const stats = await prisma.marketplacePurchase.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { amount: true },
    });
    res.json({ success: true, data: { items, total, page, limit, stats } });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/escrow/disputes — disputed purchases only
router.get('/disputes', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.marketplacePurchase.findMany({
        where: { status: 'DISPUTED' },
        include: PURCHASE_INCLUDE,
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.marketplacePurchase.count({ where: { status: 'DISPUTED' } }),
    ]);
    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/escrow/:id/resolve — release to seller OR refund to buyer
router.post('/:id/resolve', async (req, res, next) => {
  try {
    const { action, note } = req.body as { action: 'RELEASE' | 'REFUND'; note?: string };
    if (!['RELEASE', 'REFUND'].includes(action)) throw new AppError(400, 'Invalid action');
    const purchase = await prisma.marketplacePurchase.findUnique({
      where: { id: req.params.id as string },
    });
    if (!purchase) throw new AppError(404, 'Purchase not found');
    if (purchase.status !== 'DISPUTED') throw new AppError(400, 'Purchase is not disputed');
    if (action === 'RELEASE') await releaseToSeller(purchase, note);
    else await refundToBuyer(purchase, note);
    res.json({
      success: true,
      message: `Purchase ${action === 'RELEASE' ? 'released to seller' : 'refunded to buyer'}`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
