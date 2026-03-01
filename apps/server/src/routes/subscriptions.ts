import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../utils/notify.js';
import { logActivity } from '../utils/audit.js';
import { subscribeSchema, FEES } from '@fansbook/shared';

const router = Router();

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// ─── GET /api/subscriptions ── list fan's subscriptions ─────
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = { subscriberId: userId };
    if (status && ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PAST_DUE'].includes(status)) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          creator: { select: { id: true, username: true, displayName: true, avatar: true } },
          tier: { select: { name: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscription.count({ where }),
    ]);

    const data = items.map((s) => ({
      id: s.id,
      creatorId: s.creatorId,
      creatorName: s.creator.displayName,
      creatorUsername: s.creator.username,
      creatorAvatar: s.creator.avatar,
      amount: s.tier.price,
      planName: s.tier.name,
      startDate: s.startDate,
      endDate: s.endDate,
      renewalDate: s.renewalDate,
      status: s.status,
    }));

    res.json({ success: true, data: { items: data, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/subscriptions ── fan subscribes to a tier ────
router.post('/', authenticate, validate(subscribeSchema), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { tierId } = req.body;

    const tier = await prisma.subscriptionTier.findUnique({
      where: { id: tierId },
      include: { creator: { select: { id: true, displayName: true } } },
    });
    if (!tier || !tier.isActive) throw new AppError(404, 'Tier not found or inactive');
    if (tier.creatorId === userId) throw new AppError(400, 'Cannot subscribe to yourself');

    const existing = await prisma.subscription.findFirst({
      where: { subscriberId: userId, creatorId: tier.creatorId, status: 'ACTIVE' },
    });
    if (existing) throw new AppError(409, 'Already subscribed to this creator');

    const fanWallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!fanWallet || fanWallet.balance < tier.price) {
      throw new AppError(400, 'Insufficient balance');
    }

    const creatorWallet = await prisma.wallet.upsert({
      where: { userId: tier.creatorId },
      create: { userId: tier.creatorId, balance: 0 },
      update: {},
    });

    const commission = tier.price * (FEES.PLATFORM_FEE_PERCENT / 100);
    const creatorAmount = tier.price - commission;
    const endDate = new Date(Date.now() + THIRTY_DAYS_MS);

    const [subscription] = await prisma.$transaction([
      prisma.subscription.create({
        data: {
          subscriberId: userId,
          creatorId: tier.creatorId,
          tierId,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate,
          renewalDate: endDate,
        },
      }),
      prisma.wallet.update({
        where: { id: fanWallet.id },
        data: { balance: { decrement: tier.price }, totalSpent: { increment: tier.price } },
      }),
      prisma.wallet.update({
        where: { id: creatorWallet.id },
        data: { balance: { increment: creatorAmount }, totalEarned: { increment: creatorAmount } },
      }),
      prisma.transaction.create({
        data: {
          walletId: fanWallet.id,
          type: 'SUBSCRIPTION',
          amount: tier.price,
          description: `Subscribed to ${tier.creator.displayName} (${tier.name})`,
          status: 'COMPLETED',
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: creatorWallet.id,
          type: 'SUBSCRIPTION',
          amount: creatorAmount,
          description: `Subscription from fan (${tier.name}) — ${FEES.PLATFORM_FEE_PERCENT}% fee applied`,
          status: 'COMPLETED',
        },
      }),
    ]);

    createNotification({
      userId: tier.creatorId,
      type: 'SUBSCRIBE',
      actorId: userId,
      entityId: subscription.id,
      message: `Someone subscribed to your ${tier.name} plan!`,
    });

    logActivity(
      userId,
      'SUBSCRIBE',
      'Subscription',
      subscription.id,
      {
        tierId,
        amount: tier.price,
        commission,
      },
      req,
    );

    res
      .status(201)
      .json({ success: true, data: { id: subscription.id, status: 'ACTIVE', endDate } });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/subscriptions/:id ── cancel subscription ───
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const subId = req.params.id as string;

    const sub = await prisma.subscription.findUnique({ where: { id: subId } });
    if (!sub) throw new AppError(404, 'Subscription not found');
    if (sub.subscriberId !== userId) throw new AppError(403, 'Not your subscription');
    if (sub.status !== 'ACTIVE') throw new AppError(400, 'Subscription is not active');

    await prisma.subscription.update({
      where: { id: subId },
      data: { status: 'CANCELLED', renewalDate: null },
    });

    logActivity(userId, 'UNSUBSCRIBE', 'Subscription', subId, null, req);
    res.json({
      success: true,
      message: 'Subscription cancelled. Access continues until end date.',
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/subscriptions/check/:creatorId ── check status ─
router.get('/check/:creatorId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const creatorId = req.params.creatorId as string;

    const sub = await prisma.subscription.findFirst({
      where: { subscriberId: userId, creatorId, status: 'ACTIVE' },
      select: { id: true, endDate: true, tier: { select: { name: true } } },
    });

    res.json({
      success: true,
      data: {
        isSubscribed: !!sub,
        subscriptionId: sub?.id ?? null,
        endDate: sub?.endDate ?? null,
        tierName: sub?.tier.name ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Expire stale subscriptions utility ─────────────────────
export async function expireSubscriptions() {
  const result = await prisma.subscription.updateMany({
    where: {
      status: 'ACTIVE',
      endDate: { lte: new Date() },
    },
    data: { status: 'EXPIRED' },
  });
  return result.count;
}

export default router;
