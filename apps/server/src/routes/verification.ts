import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import {
  createVerificationSession,
  getVerificationStatus,
  handleDiditWebhook,
} from '../services/verificationService.js';

const router = Router();

// POST /api/verification/start
router.post('/start', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, dob } = req.body as {
      firstName?: string;
      lastName?: string;
      dob?: string;
    };
    if (!firstName || !lastName || !dob) {
      res.status(400).json({ success: false, message: 'firstName, lastName and dob are required' });
      return;
    }
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    const result = await createVerificationSession(userId, firstName, lastName, dob);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message === 'MAX_RETRIES') {
      res.status(403).json({
        success: false,
        message: 'Maximum verification attempts reached. Contact support.',
      });
      return;
    }
    next(err);
  }
});

// GET /api/verification/status
router.get('/status', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    const data = await getVerificationStatus(userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;

// Webhook handler — registered separately with express.raw()
export async function verificationWebhookHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const contentType = req.headers['content-type'] ?? '';
    const bodyLen = Buffer.isBuffer(req.body) ? req.body.length : 0;
    logger.info({ contentType, bodyLen }, 'Didit webhook received');

    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      logger.warn({ contentType }, 'Didit webhook: empty or non-buffer body');
      res.json({ received: true });
      return;
    }

    const signature =
      (req.headers['x-signature-v2'] as string) ||
      (req.headers['x-signature-simple'] as string) ||
      (req.headers['x-signature'] as string) ||
      '';
    const payload = JSON.parse(req.body.toString()) as unknown;
    logger.info({ payload }, 'Didit webhook payload');
    await handleDiditWebhook(req.body, signature, payload);
    res.json({ received: true });
  } catch (err) {
    logger.error({ err }, 'Didit webhook error');
    next(err);
  }
}
