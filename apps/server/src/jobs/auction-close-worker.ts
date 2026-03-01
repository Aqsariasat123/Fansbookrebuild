import { Worker, type Job } from 'bullmq';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { createNotification } from '../utils/notify.js';
import { auctionQueue } from './queue.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
  };
}

async function closeAuction(listing: { id: string; title: string; sellerId: string }) {
  const bids = await prisma.bid.findMany({
    where: { listingId: listing.id },
    orderBy: { amount: 'desc' },
  });

  if (bids.length === 0) {
    await prisma.marketplaceListing.update({
      where: { id: listing.id },
      data: { status: 'EXPIRED' },
    });
    createNotification({
      userId: listing.sellerId,
      type: 'MARKETPLACE',
      message: `Your auction "${listing.title}" expired with no bids`,
      entityId: listing.id,
      entityType: 'MarketplaceListing',
    });
    return;
  }

  const winner = bids[0];
  const losers = bids.slice(1);

  // Winner's balance already held via BID_HOLD — credit seller
  const sellerWallet = await prisma.wallet.findUnique({ where: { userId: listing.sellerId } });
  if (!sellerWallet) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ops: any[] = [
    prisma.wallet.update({
      where: { id: sellerWallet.id },
      data: { balance: { increment: winner.amount }, totalEarned: { increment: winner.amount } },
    }),
    prisma.transaction.create({
      data: {
        walletId: sellerWallet.id,
        type: 'MARKETPLACE_EARNING',
        amount: winner.amount,
        description: `Auction won: ${listing.title}`,
        status: 'COMPLETED',
      },
    }),
    prisma.marketplaceListing.update({
      where: { id: listing.id },
      data: { status: 'SOLD' },
    }),
  ];

  // Release holds for losing bidders
  for (const bid of losers) {
    const wallet = await prisma.wallet.findUnique({ where: { userId: bid.bidderId } });
    if (!wallet) continue;
    ops.push(
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: bid.amount } },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'BID_RELEASE',
          amount: bid.amount,
          description: `Bid released: ${listing.title}`,
          status: 'COMPLETED',
        },
      }),
    );
  }

  await prisma.$transaction(ops);

  // Notify winner + seller
  createNotification({
    userId: winner.bidderId,
    type: 'MARKETPLACE',
    message: `You won the auction "${listing.title}" for $${winner.amount}!`,
    entityId: listing.id,
    entityType: 'MarketplaceListing',
  });
  createNotification({
    userId: listing.sellerId,
    type: 'MARKETPLACE',
    message: `Your auction "${listing.title}" sold for $${winner.amount}!`,
    entityId: listing.id,
    entityType: 'MarketplaceListing',
  });

  // Notify losing bidders
  for (const bid of losers) {
    createNotification({
      userId: bid.bidderId,
      type: 'MARKETPLACE',
      message: `You were outbid on "${listing.title}". Your $${bid.amount} hold has been released.`,
      entityId: listing.id,
      entityType: 'MarketplaceListing',
    });
  }
}

export function startAuctionCloseWorker() {
  const worker = new Worker(
    'auction-close',
    async (_job: Job) => {
      const expired = await prisma.marketplaceListing.findMany({
        where: { status: 'ACTIVE', type: 'AUCTION', endsAt: { lt: new Date() } },
      });
      for (const listing of expired) {
        try {
          await closeAuction(listing);
          logger.info({ listingId: listing.id }, 'Auction closed');
        } catch (err) {
          logger.error({ err, listingId: listing.id }, 'Failed to close auction');
        }
      }
    },
    { connection: parseRedisUrl(REDIS_URL) },
  );

  worker.on('failed', (_job, err) => {
    logger.error({ err }, 'Auction close job failed');
  });

  auctionQueue.upsertJobScheduler(
    'auction-close-check',
    { every: 5 * 60 * 1000 },
    { name: 'close-expired-auctions' },
  );

  return worker;
}
