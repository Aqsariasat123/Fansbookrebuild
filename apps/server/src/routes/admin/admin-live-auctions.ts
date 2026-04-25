import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = Router();

const PLATFORM_FEE_PCT = 0.05;

const AUCTION_INCLUDE = {
  listing: { select: { id: true, title: true, images: true } },
  creator: { select: { id: true, username: true, displayName: true } },
  winner: { select: { id: true, username: true, displayName: true } },
  session: { select: { id: true, title: true, startedAt: true } },
} as const;

// GET /api/admin/live-auctions
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const where = status ? { status: status as never } : {};

    const [items, total] = await Promise.all([
      prisma.liveAuction.findMany({
        where,
        include: AUCTION_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.liveAuction.count({ where }),
    ]);

    const stats = await prisma.liveAuction.aggregate({
      where: { status: 'ENDED', winnerId: { not: null } },
      _sum: { winnerAmount: true, platformFee: true },
      _count: { id: true },
    });

    res.json({ success: true, data: { items, total, page, limit, stats } });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/live-auctions/:id/release — release escrow to creator (minus 5%)
router.post('/:id/release', async (req, res, next) => {
  try {
    const auction = await prisma.liveAuction.findUnique({
      where: { id: req.params.id as string },
      include: { listing: { select: { title: true } } },
    });
    if (!auction) throw new AppError(404, 'Auction not found');
    if (auction.status !== 'ENDED' || !auction.purchaseId || !auction.winnerAmount) {
      throw new AppError(400, 'Auction not eligible for release');
    }

    const purchase = await prisma.marketplacePurchase.findUnique({
      where: { id: auction.purchaseId },
    });
    if (!purchase) throw new AppError(404, 'Purchase not found');
    if (purchase.status !== 'HELD') throw new AppError(400, 'Purchase already processed');

    const fee = Math.round(auction.winnerAmount * PLATFORM_FEE_PCT * 100) / 100;
    const sellerAmount = auction.winnerAmount - fee;

    const sellerWallet = await prisma.wallet.findUnique({ where: { userId: auction.creatorId } });
    if (!sellerWallet) throw new AppError(500, 'Seller wallet not found');

    await prisma.$transaction([
      prisma.marketplacePurchase.update({
        where: { id: purchase.id },
        data: { status: 'RELEASED', resolvedAt: new Date() },
      }),
      prisma.wallet.update({
        where: { id: sellerWallet.id },
        data: { balance: { increment: sellerAmount }, totalEarned: { increment: sellerAmount } },
      }),
      prisma.transaction.create({
        data: {
          walletId: sellerWallet.id,
          type: 'LIVE_AUCTION_FEE',
          amount: sellerAmount,
          description: `Live auction sale (5% fee deducted): ${auction.listing.title}`,
          referenceId: auction.id,
          status: 'COMPLETED',
        },
      }),
      prisma.liveAuction.update({
        where: { id: auction.id },
        data: { platformFee: fee },
      }),
    ]);

    res.json({ success: true, message: `Released ${sellerAmount} coins to creator (fee: ${fee})` });
  } catch (err) {
    next(err);
  }
});

export default router;
