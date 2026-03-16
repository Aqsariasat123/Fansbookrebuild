import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  COIN_PACKAGES,
  purchaseSchema,
  customPurchaseSchema,
  VALID_TX_TYPES,
} from './wallet-constants.js';

const router = Router();

router.get('/balance', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return res.json({ success: true, data: { balance: 0, totalEarned: 0, totalSpent: 0 } });
    }
    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        totalEarned: wallet.totalEarned,
        totalSpent: wallet.totalSpent,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/purchases', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return res.json({ success: true, data: { items: [], total: 0, page, limit } });

    const where = { walletId: wallet.id, type: 'DEPOSIT' as const };
    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);
    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

router.get('/spending', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return res.json({ success: true, data: { items: [], total: 0, page, limit } });

    const where = {
      walletId: wallet.id,
      type: {
        in: ['SUBSCRIPTION', 'TIP_SENT', 'PPV_PURCHASE', 'MARKETPLACE_PURCHASE'] as (
          | 'SUBSCRIPTION'
          | 'TIP_SENT'
          | 'PPV_PURCHASE'
          | 'MARKETPLACE_PURCHASE'
        )[],
      },
    };
    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);
    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

router.get('/transactions', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const typeFilter = req.query.type as string | undefined;

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return res.json({ success: true, data: { items: [], total: 0, page, limit } });

    const where: Record<string, unknown> = { walletId: wallet.id };
    if (
      typeFilter &&
      typeFilter !== 'ALL' &&
      VALID_TX_TYPES.includes(typeFilter as (typeof VALID_TX_TYPES)[number])
    ) {
      where.type = typeFilter;
    }

    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

router.get('/packages', authenticate, (_req, res) => {
  res.json({ success: true, data: COIN_PACKAGES });
});

router.post('/purchase', authenticate, validate(purchaseSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { packageId } = req.body;
    const pkg = COIN_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) throw new AppError(400, 'Invalid package');

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new AppError(404, 'Wallet not found');

    const txId = `#${Date.now().toString(36).toUpperCase()}`;

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: pkg.coins }, totalEarned: { increment: pkg.coins } },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount: pkg.coins,
          description: `Purchased ${pkg.coins} coins|€${pkg.price.toFixed(2)}`,
          referenceId: txId,
          status: 'COMPLETED',
        },
      }),
    ]);

    const updated = await prisma.wallet.findUnique({ where: { id: wallet.id } });
    res.status(201).json({
      success: true,
      data: { balance: updated!.balance, coins: pkg.coins, price: pkg.price, transactionId: txId },
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/purchase-custom',
  authenticate,
  validate(customPurchaseSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { coins } = req.body as { coins: number };

      const wallet = await prisma.wallet.findUnique({ where: { userId } });
      if (!wallet) throw new AppError(404, 'Wallet not found');

      const txId = `#${Date.now().toString(36).toUpperCase()}`;

      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: coins }, totalEarned: { increment: coins } },
        }),
        prisma.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEPOSIT',
            amount: coins,
            description: `Purchased ${coins} coins|€${coins.toFixed(2)}`,
            referenceId: txId,
            status: 'COMPLETED',
          },
        }),
      ]);

      const updated = await prisma.wallet.findUnique({ where: { id: wallet.id } });
      res.status(201).json({
        success: true,
        data: { balance: updated!.balance, coins, price: coins, transactionId: txId },
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
