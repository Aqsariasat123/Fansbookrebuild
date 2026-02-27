import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const COIN_PACKAGES = [
  { id: 'pack_100', coins: 100, price: 5, currency: 'EUR', label: '100 Coins' },
  { id: 'pack_250', coins: 250, price: 10, currency: 'EUR', label: '250 Coins', tag: 'Popular' },
  { id: 'pack_500', coins: 500, price: 20, currency: 'EUR', label: '500 Coins' },
  {
    id: 'pack_1000',
    coins: 1000,
    price: 35,
    currency: 'EUR',
    label: '1,000 Coins',
    tag: 'Best Value',
  },
  { id: 'pack_2500', coins: 2500, price: 75, currency: 'EUR', label: '2,500 Coins' },
  { id: 'pack_5000', coins: 5000, price: 125, currency: 'EUR', label: '5,000 Coins', tag: 'VIP' },
];

const purchaseSchema = z.object({ packageId: z.string().min(1) });

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

    const spendTypes = [
      'SUBSCRIPTION',
      'TIP_SENT',
      'PPV_PURCHASE',
      'MARKETPLACE_PURCHASE',
    ] as const;
    const where = { walletId: wallet.id, type: { in: [...spendTypes] } };
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

export default router;
