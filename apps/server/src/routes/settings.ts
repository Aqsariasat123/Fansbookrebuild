import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// ─── PUT /api/settings/notifications ─────────────────────
router.put('/notifications', authenticate, async (req, res, next) => {
  try {
    const { emailNotifs, pushNotifs, inAppNotifs, dmNotifs } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { notifSettings: true },
    });
    if (!user) throw new AppError(404, 'User not found');

    const existing = (user.notifSettings as Record<string, unknown>) ?? {};
    const merged = {
      ...existing,
      ...(emailNotifs !== undefined && { emailNotifs }),
      ...(pushNotifs !== undefined && { pushNotifs }),
      ...(inAppNotifs !== undefined && { inAppNotifs }),
      ...(dmNotifs !== undefined && { dmNotifs }),
    };

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { notifSettings: merged },
    });

    res.json({ success: true, data: merged });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/settings/privacy ───────────────────────────
router.put('/privacy', authenticate, async (req, res, next) => {
  try {
    const { profileVisibility, allowDMs, showOnlineStatus } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { privacySettings: true },
    });
    if (!user) throw new AppError(404, 'User not found');

    const existing = (user.privacySettings as Record<string, unknown>) ?? {};
    const merged = {
      ...existing,
      ...(profileVisibility !== undefined && { profileVisibility }),
      ...(allowDMs !== undefined && { allowDMs }),
      ...(showOnlineStatus !== undefined && { showOnlineStatus }),
    };

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { privacySettings: merged },
    });

    res.json({ success: true, data: merged });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/settings/account ───────────────────────────
router.put('/account', authenticate, async (req, res, next) => {
  try {
    const { language, timezone } = req.body;
    const updateData: Record<string, string> = {};
    if (language) updateData.language = language;
    if (timezone) updateData.timezone = timezone;

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: updateData,
    });

    res.json({ success: true, message: 'Account settings updated' });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/settings/account ────────────────────────
router.delete('/account', authenticate, async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) throw new AppError(400, 'Password is required');

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { passwordHash: true },
    });
    if (!user) throw new AppError(404, 'User not found');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Incorrect password');

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { status: 'DEACTIVATED' },
    });

    await prisma.refreshToken.deleteMany({
      where: { userId: req.user!.userId },
    });

    res.json({ success: true, message: 'Account deactivated' });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/settings/sessions ──────────────────────────
router.get('/sessions', authenticate, async (req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.user!.userId },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastActive: true,
        createdAt: true,
      },
      orderBy: { lastActive: 'desc' },
    });

    res.json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/settings/sessions/:id ───────────────────
router.delete('/sessions/:id', authenticate, async (req, res, next) => {
  try {
    const sessionId = req.params.id as string;
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new AppError(404, 'Session not found');
    if (session.userId !== req.user!.userId) {
      throw new AppError(403, 'Not authorized to delete this session');
    }

    await prisma.session.delete({ where: { id: sessionId } });

    res.json({ success: true, message: 'Session revoked' });
  } catch (err) {
    next(err);
  }
});

export default router;
