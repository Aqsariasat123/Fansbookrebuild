import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { createWebRtcTransport, getTransportOptions } from '../config/mediasoup.js';
import type { Producer, Consumer, WebRtcTransport } from 'mediasoup/types';
import { logger } from '../utils/logger.js';
import liveStreamRouter from './live-stream.js';

const router = Router();

// In-memory maps for active sessions (cleared on server restart)
export const sessionTransports = new Map<string, Map<string, WebRtcTransport>>();
export const sessionProducers = new Map<string, Producer[]>();
export const sessionConsumers = new Map<string, Consumer[]>();

export function cleanupSession(sessionId: string) {
  const transports = sessionTransports.get(sessionId);
  if (transports) {
    for (const t of transports.values()) t.close();
    sessionTransports.delete(sessionId);
  }
  sessionProducers.delete(sessionId);
  sessionConsumers.delete(sessionId);
  logger.info({ sessionId }, 'Cleaned up mediasoup session');
}

const liveQuerySchema = z.object({
  category: z.string().optional(),
  gender: z.string().optional(),
  region: z.string().optional(),
  sortBy: z.enum(['viewers', 'newest']).default('viewers'),
});

// ─── GET /api/live — Currently live sessions ─────────────

router.get('/', validate(liveQuerySchema, 'query'), async (req, res, next) => {
  try {
    const { category, gender, region, sortBy } = req.query as unknown as z.infer<
      typeof liveQuerySchema
    >;
    const creatorWhere: Record<string, unknown> = { role: 'CREATOR', status: 'ACTIVE' };
    if (gender) creatorWhere.gender = gender;
    if (region) creatorWhere.country = region;
    if (category) creatorWhere.category = category;
    const orderBy: Record<string, string> =
      sortBy === 'viewers' ? { viewerCount: 'desc' } : { startedAt: 'desc' };
    const sessions = await prisma.liveSession.findMany({
      where: { status: 'LIVE', creator: creatorWhere },
      orderBy,
      select: {
        id: true,
        title: true,
        viewerCount: true,
        startedAt: true,
        creator: {
          select: { id: true, username: true, displayName: true, avatar: true, category: true },
        },
      },
    });
    const items = sessions.map((s) => ({
      id: s.id,
      creatorId: s.creator.id,
      username: s.creator.username,
      displayName: s.creator.displayName,
      avatar: s.creator.avatar,
      category: s.creator.category,
      viewerCount: s.viewerCount,
      title: s.title,
      startedAt: s.startedAt?.toISOString() ?? null,
    }));
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/live/upcoming ──────────────────────────────

router.get('/upcoming', async (_req, res, next) => {
  try {
    const sessions = await prisma.liveSession.findMany({
      where: { status: 'SCHEDULED' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        creator: { select: { id: true, username: true, avatar: true } },
      },
    });
    const items = sessions.map((s) => ({
      id: s.id,
      creatorId: s.creator.id,
      username: s.creator.username,
      avatar: s.creator.avatar,
      title: s.title,
      scheduledAt: s.createdAt.toISOString(),
    }));
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/live/start — Creator starts a live session ──

router.post('/start', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { title } = req.body as { title?: string };
    const session = await prisma.liveSession.create({
      data: {
        creatorId: userId,
        title: title || 'Live Session',
        streamKey: crypto.randomBytes(16).toString('hex'),
        status: 'LIVE',
        startedAt: new Date(),
      },
    });
    const transport = await createWebRtcTransport();
    if (!sessionTransports.has(session.id)) sessionTransports.set(session.id, new Map());
    sessionTransports.get(session.id)!.set('producer', transport);
    res.json({
      success: true,
      data: { sessionId: session.id, transportOptions: getTransportOptions(transport) },
    });
  } catch (err) {
    next(err);
  }
});

// Mount streaming sub-routes (transport, produce, consume, end, chat, router-capabilities)
router.use('/', liveStreamRouter);

export default router;
