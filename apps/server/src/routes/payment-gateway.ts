import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateReceipt } from '../utils/invoice.js';
import crypto from 'crypto';

const router = Router();

const VALID_GATEWAYS = ['CCBILL', 'MIREXPAY'] as const;
type Gateway = (typeof VALID_GATEWAYS)[number];

function isValidGateway(value: string): value is Gateway {
  return VALID_GATEWAYS.includes(value as Gateway);
}

// ─── POST /api/payments/initiate ── create payment & return checkout URL ──
router.post('/initiate', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { amount, gateway, type } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new AppError(400, 'Amount must be a positive number');
    }
    if (amount > 50000) {
      throw new AppError(400, 'Maximum payment amount is $50,000');
    }
    if (!gateway || !isValidGateway(gateway)) {
      throw new AppError(400, 'Gateway must be CCBILL or MIREXPAY');
    }
    if (!type || typeof type !== 'string') {
      throw new AppError(400, 'Payment type is required');
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        gateway,
        type: type.trim(),
        status: 'PENDING',
        gatewayTransactionId: crypto.randomUUID(),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        paymentId: payment.id,
        redirectUrl: `/payment/checkout/${payment.id}`,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/payments/:id ── get payment status ──────────────────────
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }
    if (payment.userId !== userId) {
      throw new AppError(403, 'Not authorised to view this payment');
    }

    res.json({
      success: true,
      data: {
        id: payment.id,
        amount: payment.amount,
        gateway: payment.gateway,
        gatewayTransactionId: payment.gatewayTransactionId,
        status: payment.status,
        type: payment.type,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/payments/:id/receipt ── JSON receipt for completed payment ──
router.get('/:id/receipt', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }
    if (payment.userId !== userId) {
      throw new AppError(403, 'Not authorised to view this receipt');
    }
    if (payment.status !== 'COMPLETED') {
      throw new AppError(400, 'Receipt is only available for completed payments');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const receipt = generateReceipt(payment, user);

    res.json({ success: true, data: receipt });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/payments/:id/simulate-complete ── DEV: simulate success ──
router.post('/:id/simulate-complete', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new AppError(404, 'Payment not found');
    }
    if (payment.userId !== userId) {
      throw new AppError(403, 'Not authorised to complete this payment');
    }
    if (payment.status !== 'PENDING') {
      throw new AppError(400, `Payment is already ${payment.status.toLowerCase()}`);
    }

    const wallet = await prisma.wallet.upsert({
      where: { userId },
      create: { userId, balance: 0 },
      update: {},
    });

    await prisma.$transaction([
      prisma.payment.update({
        where: { id },
        data: { status: 'COMPLETED' },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount: payment.amount,
          description: `${payment.gateway} deposit — ${payment.type}`,
          referenceId: payment.id,
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

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        status: 'COMPLETED',
        walletCredited: payment.amount,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
