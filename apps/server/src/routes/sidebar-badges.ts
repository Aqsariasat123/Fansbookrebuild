import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/sidebar-badges — counts for sidebar pills
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { userId, role } = req.user!;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [wallet, sales, referrals, subscriptions] = await Promise.all([
      prisma.wallet.findUnique({ where: { userId }, select: { balance: true } }),
      role === 'CREATOR'
        ? prisma.marketplacePurchase.count({
            where: { sellerId: userId, createdAt: { gte: sevenDaysAgo } },
          })
        : Promise.resolve(0),
      role === 'CREATOR'
        ? prisma.referral.count({ where: { referrerId: userId } })
        : Promise.resolve(0),
      role === 'CREATOR'
        ? prisma.subscription.count({ where: { creatorId: userId, status: 'ACTIVE' } })
        : Promise.resolve(0),
    ]);

    res.json({
      success: true,
      data: {
        wallet: Math.floor(wallet?.balance ?? 0),
        sales,
        referrals,
        subscriptions,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
