import type { Server, Socket } from 'socket.io';
import { prisma } from './database.js';
import { logger } from '../utils/logger.js';
import { auctionTimers, scheduleAuctionEnd } from './live-auction-settle.js';

const EXTENSION_THRESHOLD_SEC = 5;
const EXTENSION_SEC = 10;

async function validateBid(
  auction: {
    status: string;
    sessionId: string;
    creatorId: string;
    endsAt: Date;
    currentBid: number | null;
    startingBid: number;
  } | null,
  sessionId: string,
  creatorId: string,
  userId: string,
  amount: number,
) {
  if (!auction || auction.status !== 'ACTIVE' || auction.sessionId !== sessionId)
    return 'Auction is no longer active.';
  if (auction.creatorId === userId) return 'You cannot bid on your own auction.';
  if (Date.now() > auction.endsAt.getTime()) return 'Auction has ended.';
  const minBid = (auction.currentBid ?? auction.startingBid - 1) + 1;
  if (amount < minBid) return `Minimum bid is ${minBid} coins.`;
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet || wallet.balance < amount) return "You don't have enough coins to place this bid.";
  void creatorId;
  return null;
}

async function handleAuctionBid(
  io: Server,
  socket: Socket,
  userId: string,
  data: { sessionId: string; auctionId: string; amount: number },
) {
  const { sessionId, auctionId, amount } = data;
  const auction = await prisma.liveAuction.findUnique({ where: { id: auctionId } });
  const err = await validateBid(auction, sessionId, auction?.creatorId ?? '', userId, amount);
  if (err) {
    socket.emit('live:auction-bid-error', { message: err });
    return;
  }
  const bidder = await prisma.user.findUnique({
    where: { id: userId },
    select: { displayName: true },
  });
  let newEndsAt = auction!.endsAt;
  if ((auction!.endsAt.getTime() - Date.now()) / 1000 <= EXTENSION_THRESHOLD_SEC)
    newEndsAt = new Date(Date.now() + EXTENSION_SEC * 1000);
  await prisma.$transaction([
    prisma.liveAuctionBid.create({ data: { auctionId, bidderId: userId, amount } }),
    prisma.liveAuction.update({
      where: { id: auctionId },
      data: { currentBid: amount, currentBidderId: userId, endsAt: newEndsAt },
    }),
  ]);
  if (newEndsAt.getTime() !== auction!.endsAt.getTime())
    scheduleAuctionEnd(io, auctionId, newEndsAt);
  io.to(`live:${sessionId}`).emit('live:auction-update', {
    auctionId,
    bidderName: bidder?.displayName ?? 'A fan',
    amount,
    endsAt: newEndsAt.toISOString(),
  });
}

async function handleAuctionStart(
  io: Server,
  userId: string,
  data: { sessionId: string; listingId: string; startingBid: number; durationSec: number },
) {
  const { sessionId, listingId, startingBid, durationSec } = data;
  const session = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    select: { creatorId: true },
  });
  if (!session || session.creatorId !== userId) return;
  const item = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
    select: { id: true, title: true, images: true, sellerId: true },
  });
  if (!item || item.sellerId !== userId) return;
  const existing = await prisma.liveAuction.findFirst({ where: { sessionId, status: 'ACTIVE' } });
  if (existing) {
    const t = auctionTimers.get(existing.id);
    if (t) clearTimeout(t);
    auctionTimers.delete(existing.id);
    await prisma.liveAuction.update({
      where: { id: existing.id },
      data: { status: 'CANCELLED', endedAt: new Date() },
    });
  }
  const clampedDur = Math.min(120, Math.max(30, durationSec));
  const endsAt = new Date(Date.now() + clampedDur * 1000);
  const auction = await prisma.liveAuction.create({
    data: {
      sessionId,
      listingId,
      creatorId: userId,
      startingBid: Math.max(1, startingBid),
      durationSec: clampedDur,
      endsAt,
    },
  });
  await prisma.liveSession.update({ where: { id: sessionId }, data: { pinnedItemId: listingId } });
  scheduleAuctionEnd(io, auction.id, endsAt);
  io.to(`live:${sessionId}`).emit('live:auction-started', {
    auction: {
      id: auction.id,
      sessionId,
      startingBid: auction.startingBid,
      currentBid: null,
      endsAt: endsAt.toISOString(),
    },
    item: { id: item.id, title: item.title, image: item.images[0] ?? null },
  });
}

export function registerAuctionHandlers(io: Server, socket: Socket, userId: string) {
  socket.on('live:auction-start', async (d) => {
    try {
      await handleAuctionStart(io, userId, d as Parameters<typeof handleAuctionStart>[2]);
    } catch (err) {
      logger.error({ err }, 'live:auction-start');
    }
  });
  socket.on('live:auction-bid', async (d) => {
    try {
      await handleAuctionBid(io, socket, userId, d as Parameters<typeof handleAuctionBid>[3]);
    } catch (err) {
      logger.error({ err }, 'live:auction-bid');
    }
  });
  socket.on('live:auction-cancel', async (d: { sessionId: string; auctionId: string }) => {
    try {
      const s = await prisma.liveSession.findUnique({
        where: { id: d.sessionId },
        select: { creatorId: true },
      });
      if (!s || s.creatorId !== userId) return;
      const t = auctionTimers.get(d.auctionId);
      if (t) clearTimeout(t);
      auctionTimers.delete(d.auctionId);
      await prisma.liveAuction.update({
        where: { id: d.auctionId },
        data: { status: 'CANCELLED', endedAt: new Date() },
      });
      io.to(`live:${d.sessionId}`).emit('live:auction-cancelled', { auctionId: d.auctionId });
    } catch (err) {
      logger.error({ err }, 'live:auction-cancel');
    }
  });
}
