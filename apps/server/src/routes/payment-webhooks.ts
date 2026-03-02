import { Router } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ─── Helper: process webhook result ───────────────────────────────────
async function processWebhookResult(
  paymentId: string,
  expectedGateway: 'CCBILL' | 'MIREXPAY',
  status: string,
) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment) {
    throw new AppError(404, 'Payment not found');
  }
  if (payment.gateway !== expectedGateway) {
    throw new AppError(400, `Payment gateway mismatch: expected ${expectedGateway}`);
  }
  if (payment.status !== 'PENDING') {
    throw new AppError(400, `Payment already processed: ${payment.status}`);
  }

  if (status === 'approved') {
    const wallet = await prisma.wallet.upsert({
      where: { userId: payment.userId },
      create: { userId: payment.userId, balance: 0 },
      update: {},
    });

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount: payment.amount,
          description: `${expectedGateway} webhook deposit — ${payment.type}`,
          referenceId: paymentId,
          status: 'COMPLETED',
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: payment.amount },
          totalEarned: { increment: payment.amount },
        },
      }),
    ]);

    logger.info(
      `Webhook ${expectedGateway}: payment ${paymentId} approved, $${payment.amount} credited`,
    );
    return { paymentId, status: 'COMPLETED', credited: payment.amount };
  }

  // denied / failed
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'FAILED' },
  });

  logger.info(`Webhook ${expectedGateway}: payment ${paymentId} denied`);
  return { paymentId, status: 'FAILED', credited: 0 };
}

// ─── POST /api/payments/webhook/ccbill ── simulated CCBill IPN ───────
router.post('/ccbill', async (req, res, next) => {
  try {
    const { transactionId, paymentId, status } = req.body;

    if (!paymentId || typeof paymentId !== 'string') {
      throw new AppError(400, 'paymentId is required');
    }
    if (!status || !['approved', 'denied'].includes(status)) {
      throw new AppError(400, 'status must be "approved" or "denied"');
    }

    logger.info(
      `CCBill webhook received: txn=${transactionId}, payment=${paymentId}, status=${status}`,
    );

    const result = await processWebhookResult(paymentId, 'CCBILL', status);

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/payments/webhook/mirexpay ── simulated MirexPay callback
router.post('/mirexpay', async (req, res, next) => {
  try {
    const { transactionId, paymentId, status } = req.body;

    if (!paymentId || typeof paymentId !== 'string') {
      throw new AppError(400, 'paymentId is required');
    }
    if (!status || !['approved', 'denied'].includes(status)) {
      throw new AppError(400, 'status must be "approved" or "denied"');
    }

    logger.info(
      `MirexPay webhook received: txn=${transactionId}, payment=${paymentId}, status=${status}`,
    );

    const result = await processWebhookResult(paymentId, 'MIREXPAY', status);

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
