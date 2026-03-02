import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { createNotification } from '../utils/notify.js';

const router = Router();

// ─── POST /api/live/:id/notify-followers — Notify followers that creator is live ──

router.post(
  '/:id/notify-followers',
  authenticate,
  requireRole('CREATOR'),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const userId = req.user!.userId;

      const session = await prisma.liveSession.findUnique({ where: { id } });
      if (!session || session.creatorId !== userId) {
        return res.status(403).json({ success: false, error: 'Forbidden' });
      }

      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        select: { followerId: true },
      });

      const creator = await prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true },
      });
      const name = creator?.displayName ?? 'A creator';

      await Promise.allSettled(
        followers.map((f) =>
          createNotification({
            userId: f.followerId,
            type: 'LIVE',
            actorId: userId,
            entityId: id,
            entityType: 'LiveSession',
            message: `${name} is now live: ${session.title}`,
          }),
        ),
      );

      res.json({ success: true, data: { notified: followers.length } });
    } catch (err) {
      next(err);
    }
  },
);

// ─── PUT /api/live/:id/recording — Set recording URL (creator only) ──

router.put('/:id/recording', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const { recordingUrl } = req.body as { recordingUrl: string };

    const session = await prisma.liveSession.findUnique({ where: { id } });
    if (!session || session.creatorId !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    await prisma.liveSession.update({
      where: { id },
      data: { recordingUrl },
    });

    res.json({ success: true, data: { recordingUrl } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/live/:id/recording — Get recording URL ──

router.get('/:id/recording', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const session = await prisma.liveSession.findUnique({
      where: { id },
      select: { recordingUrl: true, status: true },
    });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: { recordingUrl: session.recordingUrl } });
  } catch (err) {
    next(err);
  }
});

export default router;
