import type { Server } from 'socket.io';
import { prisma } from './database.js';
import { logger } from '../utils/logger.js';

const PLATFORM_FEE_PCT = 0.05;

export const auctionTimers = new Map<string, ReturnType<typeof setTimeout>>();

async function commitWinnerPurchase(
  auctionId: string,
  a: {
    listingId: string;
    creatorId: string;
    currentBidderId: string;
    currentBid: number;
    listing: { title: string };
  },
) {
  const fee = Math.round(a.currentBid * PLATFORM_FEE_PCT * 100) / 100;
  const purchase = await prisma.$transaction(async (tx) => {
    const p = await tx.marketplacePurchase.create({
      data: {
        listingId: a.listingId,
        buyerId: a.currentBidderId,
        sellerId: a.creatorId,
        amount: a.currentBid,
        status: 'HELD',
        autoReleaseAt: new Date(Date.now() + 48 * 3600 * 1000),
      },
    });
    const w = await tx.wallet.update({
      where: { userId: a.currentBidderId },
      data: { balance: { decrement: a.currentBid }, totalSpent: { increment: a.currentBid } },
    });
    await tx.transaction.create({
      data: {
        walletId: w.id,
        type: 'LIVE_AUCTION_WIN',
        amount: a.currentBid,
        description: `Won live auction: ${a.listing.title}`,
        referenceId: p.id,
        status: 'COMPLETED',
      },
    });
    await tx.liveAuction.update({
      where: { id: auctionId },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
        winnerId: a.currentBidderId,
        winnerAmount: a.currentBid,
        platformFee: fee,
        purchaseId: p.id,
      },
    });
    return p;
  });
  return { purchase, platformFee: fee };
}

export async function settleAuction(io: Server, auctionId: string) {
  auctionTimers.delete(auctionId);
  try {
    const auction = await prisma.liveAuction.findUnique({
      where: { id: auctionId },
      include: { listing: { select: { title: true } } },
    });
    if (!auction || auction.status !== 'ACTIVE') return;
    if (!auction.currentBidderId || !auction.currentBid) {
      await prisma.liveAuction.update({
        where: { id: auctionId },
        data: { status: 'ENDED', endedAt: new Date() },
      });
      io.to(`live:${auction.sessionId}`).emit('live:auction-ended', {
        auctionId,
        winnerId: null,
        winnerName: null,
        amount: null,
        itemTitle: auction.listing.title,
      });
      return;
    }
    const wallet = await prisma.wallet.findUnique({ where: { userId: auction.currentBidderId } });
    if (!wallet || wallet.balance < auction.currentBid) {
      await prisma.liveAuction.update({
        where: { id: auctionId },
        data: { status: 'CANCELLED', endedAt: new Date() },
      });
      io.to(`live:${auction.sessionId}`).emit('live:auction-cancelled', { auctionId });
      return;
    }
    const winner = await prisma.user.findUnique({
      where: { id: auction.currentBidderId },
      select: { displayName: true },
    });
    const { purchase } = await commitWinnerPurchase(auctionId, {
      ...auction,
      currentBidderId: auction.currentBidderId,
      currentBid: auction.currentBid,
    });
    io.to(`live:${auction.sessionId}`).emit('live:auction-ended', {
      auctionId,
      winnerId: auction.currentBidderId,
      winnerName: winner?.displayName ?? 'A fan',
      amount: auction.currentBid,
      itemTitle: auction.listing.title,
      purchaseId: purchase.id,
    });
    io.to(`user:${auction.currentBidderId}`).emit('live:auction-won', {
      auctionId,
      itemTitle: auction.listing.title,
      amount: auction.currentBid,
    });
  } catch (err) {
    logger.error({ err, auctionId }, 'Failed to settle live auction');
  }
}

export function scheduleAuctionEnd(io: Server, auctionId: string, endsAt: Date) {
  const existing = auctionTimers.get(auctionId);
  if (existing) clearTimeout(existing);
  const msLeft = endsAt.getTime() - Date.now();
  const settle = () =>
    settleAuction(io, auctionId).catch((err) => logger.error({ err }, 'settleAuction error'));
  if (msLeft <= 0) {
    settle();
    return;
  }
  auctionTimers.set(auctionId, setTimeout(settle, msLeft));
}
