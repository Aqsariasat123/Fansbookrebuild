import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.use(authenticate, requireRole('CREATOR'));

// ─── PUT /api/creator/profile/message-price ── set message price for fans
router.put('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { price } = req.body;
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      throw new AppError(400, 'price must be a non-negative number');
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { privacySettings: true },
    });
    const current = (user?.privacySettings as Record<string, unknown>) || {};
    const settings = { ...current, messagePrice: price ?? 0 };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        privacySettings: settings as unknown as import('@prisma/client').Prisma.InputJsonValue,
      },
      select: { id: true, privacySettings: true },
    });
    const ps = updated.privacySettings as Record<string, unknown>;
    res.json({ success: true, data: { messagePrice: ps.messagePrice } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/creator/profile/message-price ── get message price
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { privacySettings: true },
    });
    const settings = (user?.privacySettings as Record<string, unknown>) || {};
    res.json({ success: true, data: { messagePrice: settings.messagePrice ?? 0 } });
  } catch (err) {
    next(err);
  }
});

export default router;
