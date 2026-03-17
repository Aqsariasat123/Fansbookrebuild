import type { Server, Socket } from 'socket.io';
import { prisma } from './database.js';
import { logger } from '../utils/logger.js';
import { sessionTransports, sessionProducers } from '../routes/live.js';
import type { DtlsParameters, MediaKind, RtpParameters } from 'mediasoup/types';

// sessionId -> Set<userId> — tracks unique viewers to prevent refresh inflation
const sessionViewers = new Map<string, Set<string>>();

// sessionId -> boolean — tracks whether creator is currently on a private call
export const sessionOnPrivateCall = new Map<string, boolean>();

async function broadcastViewerCount(io: Server, sessionId: string) {
  const count = sessionViewers.get(sessionId)?.size ?? 0;
  await prisma.liveSession.update({ where: { id: sessionId }, data: { viewerCount: count } });
  io.to(`live:${sessionId}`).emit('live:viewer-count', { sessionId, count });
}

export function registerLiveHandlers(io: Server, socket: Socket) {
  const userId = socket.data.userId as string;

  socket.on('live:join', async (data: { sessionId: string }) => {
    try {
      const { sessionId } = data;
      socket.join(`live:${sessionId}`);
      if (!sessionViewers.has(sessionId)) sessionViewers.set(sessionId, new Set());
      sessionViewers.get(sessionId)!.add(userId);
      await broadcastViewerCount(io, sessionId);
      // Tell this new viewer if creator is already on a private call
      if (sessionOnPrivateCall.get(sessionId)) {
        socket.emit('live:on-private-call', {});
      }
    } catch (err) {
      logger.error({ err }, 'Error in live:join');
    }
  });

  socket.on('live:leave', async (data: { sessionId: string }) => {
    try {
      const { sessionId } = data;
      socket.leave(`live:${sessionId}`);
      sessionViewers.get(sessionId)?.delete(userId);
      await broadcastViewerCount(io, sessionId);
    } catch (err) {
      logger.error({ err }, 'Error in live:leave');
    }
  });

  socket.on('disconnect', () => {
    // Remove user from all sessions they were watching
    for (const [sessionId, viewers] of sessionViewers) {
      if (viewers.has(userId)) {
        viewers.delete(userId);
        broadcastViewerCount(io, sessionId).catch(() => {});
      }
    }
  });

  socket.on('live:chat', async (data: { sessionId: string; text: string }) => {
    try {
      const { sessionId, text } = data;
      if (!text?.trim()) return;
      const sender = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, displayName: true, avatar: true },
      });
      if (!sender) return;
      const msg = await prisma.liveChatMessage.create({
        data: { sessionId, senderId: userId, text: text.trim() },
      });
      io.to(`live:${sessionId}`).emit('live:chat', {
        id: msg.id,
        sessionId,
        senderId: sender.id,
        senderName: sender.displayName,
        senderAvatar: sender.avatar,
        text: msg.text,
        createdAt: msg.createdAt.toISOString(),
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:chat');
    }
  });

  socket.on('live:tip', async (data: { sessionId: string; amount: number }) => {
    try {
      const { sessionId, amount } = data;
      const sender = await prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true },
      });
      io.to(`live:${sessionId}`).emit('live:tip', {
        sessionId,
        from: sender?.displayName || 'Someone',
        amount,
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:tip');
    }
  });

  socket.on(
    'live:transport-connect',
    async (data: { sessionId: string; transportId: string; dtlsParameters: DtlsParameters }) => {
      try {
        const transports = sessionTransports.get(data.sessionId);
        if (!transports) return;
        for (const t of transports.values()) {
          if (t.id === data.transportId) {
            await t.connect({ dtlsParameters: data.dtlsParameters });
            break;
          }
        }
      } catch (err) {
        logger.error({ err }, 'Error in live:transport-connect');
      }
    },
  );

  // ─── Private Show: fan requests private call ─────────
  socket.on('live:private-request', async (data: { sessionId: string }) => {
    try {
      const session = await prisma.liveSession.findUnique({
        where: { id: data.sessionId },
        select: { creatorId: true, privateShow: true, privateShowTokens: true },
      });
      if (!session?.privateShow) return;
      const fan = await prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true },
      });
      io.to(`user:${session.creatorId}`).emit('live:private-incoming', {
        sessionId: data.sessionId,
        userId,
        userName: fan?.displayName ?? 'Fan',
        tokens: session.privateShowTokens,
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:private-request');
    }
  });

  // Creator accepts private request
  socket.on('live:private-accept', async (data: { sessionId: string; fanId: string }) => {
    try {
      const session = await prisma.liveSession.findUnique({
        where: { id: data.sessionId },
        select: { creator: { select: { displayName: true } } },
      });
      // Tell fan: creator will call them now
      io.to(`user:${data.fanId}`).emit('live:private-accepted', { sessionId: data.sessionId });
      // Track and notify all viewers "on private call"
      sessionOnPrivateCall.set(data.sessionId, true);
      io.to(`live:${data.sessionId}`).emit('live:on-private-call', {
        creatorName: session?.creator.displayName ?? 'Creator',
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:private-accept');
    }
  });

  // Creator declines private request
  socket.on('live:private-decline', (data: { fanId: string }) => {
    io.to(`user:${data.fanId}`).emit('live:private-declined', {});
  });

  // Private call ended — notify viewers
  socket.on('live:private-ended', (data: { sessionId: string }) => {
    sessionOnPrivateCall.delete(data.sessionId);
    io.to(`live:${data.sessionId}`).emit('live:private-call-ended', {});
  });

  socket.on(
    'live:produce',
    async (
      data: {
        sessionId: string;
        transportId: string;
        kind: MediaKind;
        rtpParameters: RtpParameters;
      },
      callback: (resp: { producerId: string }) => void,
    ) => {
      try {
        const transports = sessionTransports.get(data.sessionId);
        if (!transports) return;
        for (const t of transports.values()) {
          if (t.id === data.transportId) {
            const producer = await t.produce({
              kind: data.kind,
              rtpParameters: data.rtpParameters,
            });
            if (!sessionProducers.has(data.sessionId)) {
              sessionProducers.set(data.sessionId, []);
            }
            sessionProducers.get(data.sessionId)!.push(producer);
            if (callback) callback({ producerId: producer.id });
            break;
          }
        }
      } catch (err) {
        logger.error({ err }, 'Error in live:produce');
      }
    },
  );
}
