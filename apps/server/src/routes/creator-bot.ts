import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { getBotConfig, upsertBotConfig, generateBotReply } from '../services/botService.js';

const router = Router();

const updateSchema = z.object({
  enabled: z.boolean().optional(),
  persona: z.string().max(2000).optional(),
  greeting: z.string().max(500).optional(),
  explicitAllowed: z.boolean().optional(),
});

// GET /api/creator/bot — get current bot config
router.get('/', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const config = await getBotConfig(req.user!.userId);
    res.json({
      success: true,
      data: config ?? {
        enabled: false,
        persona: '',
        greeting: '',
        explicitAllowed: false,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/creator/bot — save bot config
router.post('/', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid input' });
      return;
    }
    const config = await upsertBotConfig(req.user!.userId, parsed.data);
    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
});

// POST /api/creator/bot/test — test a reply in the creator's own chat
router.post('/test', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const message = (req.body.message as string)?.trim();
    if (!message) {
      res.status(400).json({ success: false, message: 'message required' });
      return;
    }
    const reply = await generateBotReply({
      creatorId: req.user!.userId,
      conversationId: 'test',
      fanMessage: message,
      history: [],
    });
    if (!reply) {
      res.status(400).json({
        success: false,
        message: 'Bot is disabled or ANTHROPIC_API_KEY not configured',
      });
      return;
    }
    res.json({ success: true, data: { reply } });
  } catch (err) {
    next(err);
  }
});

export default router;
