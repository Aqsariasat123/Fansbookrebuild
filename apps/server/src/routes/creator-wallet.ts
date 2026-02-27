import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// All routes require auth + CREATOR role
router.use(authenticate, requireRole('CREATOR'));

const EUR_CONVERSION_RATE = 0.92;

// ─── GET /api/creator/wallet/balance ── get balance info ────
router.get('/balance', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const wallet = await prisma.wallet.findUnique({ where: { userId } });

    if (!wallet) {
      return res.json({
        success: true,
        data: {
          balance: 0,
          pendingBalance: 0,
          totalEarned: 0,
          eurEquivalent: 0,
        },
      });
    }

    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        pendingBalance: wallet.pendingBalance,
        totalEarned: wallet.totalEarned,
        eurEquivalent: parseFloat((wallet.balance * EUR_CONVERSION_RATE).toFixed(2)),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/creator/wallet/withdrawals ── withdrawal history
router.get('/withdrawals', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where = { creatorId: userId };

    const [items, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          paymentMethod: true,
          status: true,
          processedAt: true,
          rejectionReason: true,
          createdAt: true,
        },
      }),
      prisma.withdrawal.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/creator/wallet/withdraw ── request withdrawal
router.post('/withdraw', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { amount, paymentMethod } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new AppError(400, 'Amount must be a positive number');
    }

    if (!paymentMethod || typeof paymentMethod !== 'string') {
      throw new AppError(400, 'Payment method is required');
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new AppError(404, 'Wallet not found');

    if (wallet.balance < amount) {
      throw new AppError(400, 'Insufficient balance');
    }

    const [withdrawal] = await prisma.$transaction([
      prisma.withdrawal.create({
        data: {
          creatorId: userId,
          amount,
          paymentMethod: paymentMethod.trim(),
          status: 'PENDING',
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
          pendingBalance: { increment: amount },
        },
      }),
    ]);

    res.status(201).json({
      success: true,
      data: {
        id: withdrawal.id,
        amount: withdrawal.amount,
        paymentMethod: withdrawal.paymentMethod,
        status: withdrawal.status,
        createdAt: withdrawal.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
