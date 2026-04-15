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
import { getIO } from '../config/socket.js';
import liveStreamRouter from './live-stream.js';
import liveExtrasRouter from './live-extras.js';
import liveScheduleRouter from './live-schedule.js';
import liveBrowseRouter from './live-browse.js';
import liveShoppingRouter from './live-shopping.js';

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
  q: z.string().optional(),
  category: z.string().optional(),
  gender: z.string().optional(),
  region: z.string().optional(),
  sortBy: z.enum(['viewers', 'newest']).default('viewers'),
});

// ─── GET /api/live — Currently live sessions ─────────────

router.get('/', validate(liveQuerySchema, 'query'), async (req, res, next) => {
  try {
    const { q, category, gender, region, sortBy } = req.query as unknown as z.infer<
      typeof liveQuerySchema
    >;
    const creatorWhere: Record<string, unknown> = { role: 'CREATOR', status: 'ACTIVE' };
    if (gender) creatorWhere.gender = gender;
    if (region) creatorWhere.country = region;
    if (category) creatorWhere.category = category;
    if (q) {
      creatorWhere.OR = [
        { displayName: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
      ];
    }
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

// ─── POST /api/live/start — Creator starts a live session ──

router.post('/start', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { title, privateShow, privateShowTokens } = req.body as {
      title?: string;
      privateShow?: boolean;
      privateShowTokens?: number;
    };
    // End any existing LIVE sessions for this creator before starting a new one
    const existing = await prisma.liveSession.findMany({
      where: { creatorId: userId, status: 'LIVE' },
      select: { id: true },
    });
    if (existing.length > 0) {
      await prisma.liveSession.updateMany({
        where: { creatorId: userId, status: 'LIVE' },
        data: { status: 'ENDED', endedAt: new Date() },
      });
      for (const s of existing) cleanupSession(s.id);
    }
    const session = await prisma.liveSession.create({
      data: {
        creatorId: userId,
        title: title || 'Live Session',
        streamKey: crypto.randomBytes(16).toString('hex'),
        status: 'LIVE',
        startedAt: new Date(),
        privateShow: privateShow ?? false,
        privateShowTokens: privateShowTokens ?? 0,
      },
    });
    const transport = await createWebRtcTransport();
    if (!sessionTransports.has(session.id)) sessionTransports.set(session.id, new Map());
    sessionTransports.get(session.id)!.set('producer', transport);
    // Notify all connected users so their live browse updates without refresh
    try {
      getIO().emit('live:new-session', { sessionId: session.id });
    } catch {
      /* Socket.IO not available */
    }
    res.json({
      success: true,
      data: { sessionId: session.id, transportOptions: getTransportOptions(transport) },
    });
  } catch (err) {
    next(err);
  }
});

router.use('/schedule', liveScheduleRouter);
router.use('/', liveBrowseRouter);
router.use('/', liveExtrasRouter);
router.use('/', liveShoppingRouter);

// Mount streaming sub-routes (transport, produce, consume, end, chat, router-capabilities)
router.use('/', liveStreamRouter);

export default router;
