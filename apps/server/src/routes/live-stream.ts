import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { createWebRtcTransport, getTransportOptions, getRouter } from '../config/mediasoup.js';
import type { MediaKind, RtpParameters, RtpCapabilities } from 'mediasoup/types';
import { sessionTransports, sessionProducers, sessionConsumers, cleanupSession } from './live.js';

const router = Router();

// ─── POST /api/live/:id/transport — Viewer creates recv transport ──

router.post('/:id/transport', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const session = await prisma.liveSession.findUnique({ where: { id } });
    if (!session || session.status !== 'LIVE') {
      return res.status(404).json({ success: false, error: 'Session not found or not live' });
    }
    const transport = await createWebRtcTransport();
    if (!sessionTransports.has(id)) sessionTransports.set(id, new Map());
    sessionTransports.get(id)!.set(`consumer-${userId}`, transport);
    res.json({ success: true, data: { transportOptions: getTransportOptions(transport) } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/live/:id/produce — Creator sends media tracks ──

router.post('/:id/produce', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const { kind, rtpParameters } = req.body as { kind: MediaKind; rtpParameters: RtpParameters };
    const transports = sessionTransports.get(id);
    const transport = transports?.get('producer');
    if (!transport) {
      return res.status(400).json({ success: false, error: 'No producer transport' });
    }
    const producer = await transport.produce({ kind, rtpParameters });
    if (!sessionProducers.has(id)) sessionProducers.set(id, []);
    sessionProducers.get(id)!.push(producer);
    res.json({ success: true, data: { producerId: producer.id } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/live/:id/consume — Viewer subscribes to stream ──

router.post('/:id/consume', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const { producerId, rtpCapabilities } = req.body as {
      producerId: string;
      rtpCapabilities: RtpCapabilities;
    };
    const msRouter = getRouter();
    if (!msRouter.canConsume({ producerId, rtpCapabilities })) {
      return res.status(400).json({ success: false, error: 'Cannot consume' });
    }
    const transports = sessionTransports.get(id);
    const transport = transports?.get(`consumer-${userId}`);
    if (!transport) {
      return res.status(400).json({ success: false, error: 'No consumer transport' });
    }
    const consumer = await transport.consume({ producerId, rtpCapabilities, paused: true });
    if (!sessionConsumers.has(id)) sessionConsumers.set(id, []);
    sessionConsumers.get(id)!.push(consumer);
    res.json({
      success: true,
      data: {
        consumerId: consumer.id,
        producerId: consumer.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/live/:id/end — End live session ──────────

router.post('/:id/end', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const session = await prisma.liveSession.findUnique({ where: { id } });
    if (!session || session.creatorId !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    await prisma.liveSession.update({
      where: { id },
      data: { status: 'ENDED', endedAt: new Date() },
    });
    cleanupSession(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/live/:id/chat — Recent live chat messages ──

router.get('/:id/chat', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const messages = await prisma.liveChatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { sender: { select: { id: true, displayName: true, avatar: true } } },
    });
    const data = messages.reverse().map((m) => ({
      id: m.id,
      sessionId: m.sessionId,
      senderId: m.sender.id,
      senderName: m.sender.displayName,
      senderAvatar: m.sender.avatar,
      text: m.text,
      createdAt: m.createdAt.toISOString(),
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/live/:id/router-capabilities ──

router.get('/:id/router-capabilities', authenticate, async (_req, res, next) => {
  try {
    const msRouter = getRouter();
    res.json({ success: true, data: msRouter.rtpCapabilities });
  } catch (err) {
    next(err);
  }
});

export default router;
