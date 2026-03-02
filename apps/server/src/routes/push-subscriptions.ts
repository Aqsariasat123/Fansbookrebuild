import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { vapidPublicKey } from '../config/web-push.js';

const router = Router();

/** GET /api/push/vapid-key — public VAPID key for the browser */
router.get('/vapid-key', authenticate, (_req, res) => {
  res.json({ success: true, publicKey: vapidPublicKey });
});

/** POST /api/push/subscribe — save a push subscription */
router.post('/subscribe', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { endpoint, keys } = req.body as {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
    };

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      res.status(400).json({ success: false, message: 'Missing endpoint or keys (p256dh, auth)' });
      return;
    }

    await prisma.pushSubscription.upsert({
      where: { userId_endpoint: { userId, endpoint } },
      update: { p256dh: keys.p256dh, auth: keys.auth },
      create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    });

    res.json({ success: true, message: 'Push subscription saved' });
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/push/unsubscribe — remove a push subscription */
router.delete('/unsubscribe', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { endpoint } = req.body as { endpoint?: string };

    if (!endpoint) {
      res.status(400).json({ success: false, message: 'Missing endpoint' });
      return;
    }

    await prisma.pushSubscription.deleteMany({
      where: { userId, endpoint },
    });

    res.json({ success: true, message: 'Push subscription removed' });
  } catch (err) {
    next(err);
  }
});

/** GET /api/push/status — check if the current user has an active subscription */
router.get('/status', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const count = await prisma.pushSubscription.count({ where: { userId } });
    res.json({ success: true, subscribed: count > 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
