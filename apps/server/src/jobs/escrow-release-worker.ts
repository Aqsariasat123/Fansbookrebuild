import { Worker } from 'bullmq';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
  };
}

export function startEscrowReleaseWorker() {
  const worker = new Worker(
    'escrow-release',
    async (job) => {
      const { purchaseId } = job.data as { purchaseId: string };

      const purchase = await prisma.marketplacePurchase.findUnique({
        where: { id: purchaseId },
      });

      if (!purchase) {
        logger.warn({ purchaseId }, 'Escrow auto-release: purchase not found');
        return;
      }

      // Only auto-release if still DELIVERED (not confirmed/disputed/resolved)
      if (purchase.status !== 'DELIVERED') {
        logger.info({ purchaseId, status: purchase.status }, 'Escrow auto-release: skipped');
        return;
      }

      const sellerWallet = await prisma.wallet.findUnique({
        where: { userId: purchase.sellerId },
      });
      if (!sellerWallet) {
        logger.error({ purchaseId }, 'Escrow auto-release: seller wallet not found');
        return;
      }

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
            description: `Auto-released escrow: ${purchase.id}`,
            referenceId: purchase.id,
            status: 'COMPLETED',
          },
        }),
      ]);

      logger.info({ purchaseId, amount: purchase.amount }, 'Escrow auto-released to seller');
    },
    { connection: parseRedisUrl(REDIS_URL) },
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Escrow release job failed');
  });

  return worker;
}
