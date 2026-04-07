import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
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
      res
        .status(403)
        .json({
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
    const signature =
      (req.headers['x-signature'] as string) || (req.headers['x-sha2-signature'] as string) || '';
    await handleDiditWebhook(
      req.body as Buffer,
      signature,
      JSON.parse((req.body as Buffer).toString()),
    );
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}
