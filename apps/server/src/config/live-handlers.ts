import type { Server, Socket } from 'socket.io';
import { prisma } from './database.js';
import { logger } from '../utils/logger.js';
import { sessionTransports, sessionProducers } from '../routes/live.js';
import type { DtlsParameters, MediaKind, RtpParameters } from 'mediasoup/types';

export function registerLiveHandlers(io: Server, socket: Socket) {
  const userId = socket.data.userId as string;

  socket.on('live:join', async (data: { sessionId: string }) => {
    try {
      const { sessionId } = data;
      socket.join(`live:${sessionId}`);
      const session = await prisma.liveSession.update({
        where: { id: sessionId },
        data: { viewerCount: { increment: 1 } },
      });
      io.to(`live:${sessionId}`).emit('live:viewer-count', {
        sessionId,
        count: session.viewerCount,
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:join');
    }
  });

  socket.on('live:leave', async (data: { sessionId: string }) => {
    try {
      const { sessionId } = data;
      socket.leave(`live:${sessionId}`);
      const session = await prisma.liveSession.update({
        where: { id: sessionId },
        data: { viewerCount: { decrement: 1 } },
      });
      io.to(`live:${sessionId}`).emit('live:viewer-count', {
        sessionId,
        count: Math.max(0, session.viewerCount),
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:leave');
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
