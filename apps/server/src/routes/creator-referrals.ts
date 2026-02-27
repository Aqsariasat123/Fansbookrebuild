import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// All routes require auth + CREATOR role
router.use(authenticate, requireRole('CREATOR'));

const REFERRED_USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
};

// ─── GET /api/creator/referrals ── referral history ─────────
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        referred: { select: REFERRED_USER_SELECT },
      },
    });

    const data = referrals.map((r) => ({
      id: r.id,
      referredUser: {
        id: r.referred.id,
        username: r.referred.username,
        displayName: r.referred.displayName,
        avatar: r.referred.avatar,
      },
      earnings: r.earnings,
      createdAt: r.createdAt,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/creator/referrals/code ── get or generate referral code
router.get('/code', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, username: true },
    });

    if (user?.referralCode) {
      return res.json({ success: true, data: { referralCode: user.referralCode } });
    }

    // Generate a unique referral code
    const code = `${user!.username}-${crypto.randomBytes(4).toString('hex')}`.toUpperCase();

    await prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });

    res.json({ success: true, data: { referralCode: code } });
  } catch (err) {
    next(err);
  }
});

export default router;
