import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  getBotConfig,
  upsertBotConfig,
  generateSuggestions,
  polishMessage,
  updateToneProfile,
  getMonthlyUsage,
} from '../services/botService.js';

const router = Router();
router.use(authenticate, requireRole('CREATOR'));

// ─── GET /api/creator/ai/settings ── get AI settings ────
router.get('/settings', async (req, res, next) => {
  try {
    const config = await getBotConfig(req.user!.userId);
    res.json({
      success: true,
      data: config ?? {
        suggestEnabled: true,
        polishEnabled: true,
        persona: null,
        toneProfile: null,
        greeting: null,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/creator/ai/settings ── save AI settings ──
router.post('/settings', async (req, res, next) => {
  try {
    const { suggestEnabled, polishEnabled, persona, greeting } = req.body as {
      suggestEnabled?: boolean;
      polishEnabled?: boolean;
      persona?: string;
      greeting?: string;
    };

    if (persona !== undefined && typeof persona === 'string' && persona.length > 500) {
      throw new AppError(400, 'Persona must be under 500 characters');
    }

    const config = await upsertBotConfig(req.user!.userId, {
      suggestEnabled,
      polishEnabled,
      persona,
      greeting,
    });

    res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/creator/ai/suggest ── get 3 reply suggestions
router.post('/suggest', async (req, res, next) => {
  try {
    const { conversationId } = req.body as { conversationId: string };
    if (!conversationId) throw new AppError(400, 'conversationId is required');

    const creatorId = req.user!.userId;

    // Verify creator is participant of this conversation
    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) throw new AppError(404, 'Conversation not found');
    if (conv.participant1Id !== creatorId && conv.participant2Id !== creatorId) {
      throw new AppError(403, 'Not a participant');
    }

    const suggestions = await generateSuggestions(creatorId, conversationId);
    res.json({ success: true, data: { suggestions } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/creator/ai/polish ── polish a rough message
router.post('/polish', async (req, res, next) => {
  try {
    const { text } = req.body as { text: string };
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new AppError(400, 'text is required');
    }
    if (text.length > 1000) throw new AppError(400, 'text must be under 1000 characters');

    const polished = await polishMessage(req.user!.userId, text.trim());
    if (!polished) throw new AppError(503, 'Polish unavailable — please try again');

    res.json({ success: true, data: { polished } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/creator/ai/tone-refresh ── re-learn tone from message history
router.post('/tone-refresh', async (req, res, next) => {
  try {
    const profile = await updateToneProfile(req.user!.userId);
    if (!profile) {
      throw new AppError(
        400,
        'Not enough message history to learn tone (need at least 10 sent messages)',
      );
    }
    res.json({ success: true, data: { toneProfile: profile } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/creator/ai/usage ── monthly token usage stats
router.get('/usage', async (req, res, next) => {
  try {
    const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
    const usage = await getMonthlyUsage(req.user!.userId, month);
    res.json({ success: true, data: usage });
  } catch (err) {
    next(err);
  }
});

export default router;
