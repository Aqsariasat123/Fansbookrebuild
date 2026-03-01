import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../utils/notify.js';

const router = Router();

function validateAuctionListing(
  listing: { type: string; status: string; sellerId: string } | null,
  userId: string,
) {
  if (!listing) throw new AppError(404, 'Listing not found');
  if (listing.type !== 'AUCTION') throw new AppError(400, 'Not an auction');
  if (listing.status !== 'ACTIVE') throw new AppError(400, 'Listing not active');
  if (listing.sellerId === userId) throw new AppError(400, 'Cannot bid on your own listing');
}

async function validateBidAmount(listingId: string, amount: number) {
  const highestBid = await prisma.bid.findFirst({
    where: { listingId },
    orderBy: { amount: 'desc' },
  });
  if (highestBid && amount <= highestBid.amount) {
    throw new AppError(400, `Bid must be higher than $${highestBid.amount}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BidOps = { ops: any[]; prevBidderId: string | null; prevAmount: number };

async function releasePreviousBidHold(listingId: string, title: string): Promise<BidOps> {
  const prevHighest = await prisma.bid.findFirst({
    where: { listingId },
    orderBy: { amount: 'desc' },
  });
  if (!prevHighest) return { ops: [], prevBidderId: null, prevAmount: 0 };

  const prevWallet = await prisma.wallet.findUnique({
    where: { userId: prevHighest.bidderId },
  });
  if (!prevWallet)
    return { ops: [], prevBidderId: prevHighest.bidderId, prevAmount: prevHighest.amount };

  const ops: BidOps['ops'] = [
    prisma.wallet.update({
      where: { id: prevWallet.id },
      data: { balance: { increment: prevHighest.amount } },
    }),
    prisma.transaction.create({
      data: {
        walletId: prevWallet.id,
        type: 'BID_RELEASE',
        amount: prevHighest.amount,
        description: `Outbid on: ${title}`,
        status: 'COMPLETED',
      },
    }),
  ];
  return { ops, prevBidderId: prevHighest.bidderId, prevAmount: prevHighest.amount };
}

// POST /api/marketplace/:id/bid — Place bid (with hold/release)
router.post('/:id/bid', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const listingId = req.params.id as string;
    const amount = parseFloat(req.body.amount);
    if (!amount || amount <= 0) throw new AppError(400, 'Invalid bid amount');

    const listing = await prisma.marketplaceListing.findUnique({ where: { id: listingId } });
    validateAuctionListing(listing, userId);

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < amount) throw new AppError(400, 'Insufficient balance');

    await validateBidAmount(listingId, amount);

    const { ops, prevBidderId, prevAmount } = await releasePreviousBidHold(
      listingId,
      listing!.title,
    );

    ops.push(
      prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: amount } } }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'BID_HOLD',
          amount,
          description: `Bid hold: ${listing!.title}`,
          status: 'COMPLETED',
        },
      }),
      prisma.bid.create({ data: { listingId, bidderId: userId, amount } }),
    );

    await prisma.$transaction(ops);

    if (prevBidderId && prevBidderId !== userId) {
      createNotification({
        userId: prevBidderId,
        type: 'MARKETPLACE',
        message: `You were outbid on "${listing!.title}". Your $${prevAmount} hold was released.`,
        entityId: listingId,
        entityType: 'MarketplaceListing',
      });
    }

    res.status(201).json({ success: true, message: 'Bid placed successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
