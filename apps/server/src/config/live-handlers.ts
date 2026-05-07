import type { Server, Socket } from 'socket.io';
import { prisma } from './database.js';
import { logger } from '../utils/logger.js';
import { registerShoppingHandlers } from './live-shopping-handlers.js';
import { registerMediasoupHandlers } from './live-mediasoup-handlers.js';
import { chargePrivateShow, checkPrivateShowAffordable } from './live-private-payment.js';

const sessionViewers = new Map<string, Set<string>>();
export const sessionOnPrivateCall = new Map<string, boolean>();

async function broadcastViewerCount(io: Server, sessionId: string) {
  const session = await prisma.liveSession.findUnique({
    where: { id: sessionId },
    select: { creatorId: true },
  });
  const viewers = sessionViewers.get(sessionId);
  const total = viewers?.size ?? 0;
  const creatorIsIn = !!(session && viewers?.has(session.creatorId));
  const count = Math.max(0, total - (creatorIsIn ? 1 : 0));
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

  socket.on('live:private-request', async (data: { sessionId: string }) => {
    try {
      const session = await prisma.liveSession.findUnique({
        where: { id: data.sessionId },
        select: { creatorId: true, privateShow: true, privateShowTokens: true },
      });
      if (!session?.privateShow) return;
      const tokens = session.privateShowTokens ?? 0;
      const afford = await checkPrivateShowAffordable(userId, tokens);
      if (!afford.ok) {
        socket.emit('live:private-insufficient', {
          required: afford.required,
          balance: afford.balance,
        });
        return;
      }
      const fan = await prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true },
      });
      io.to(`user:${session.creatorId}`).emit('live:private-incoming', {
        sessionId: data.sessionId,
        userId,
        userName: fan?.displayName ?? 'Fan',
        tokens,
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:private-request');
    }
  });

  socket.on('live:private-accept', async (data: { sessionId: string; fanId: string }) => {
    try {
      const session = await prisma.liveSession.findUnique({
        where: { id: data.sessionId },
        select: {
          creatorId: true,
          privateShowTokens: true,
          creator: { select: { displayName: true } },
        },
      });
      if (!session) return;
      const result = await chargePrivateShow(
        data.fanId,
        data.sessionId,
        session.creatorId,
        session.creator.displayName ?? 'creator',
        session.privateShowTokens ?? 0,
      );
      if (!result.ok) {
        io.to(`user:${data.fanId}`).emit('live:private-insufficient', {
          required: result.required,
          balance: result.balance,
        });
        socket.emit('live:private-payment-failed', { fanId: data.fanId });
        return;
      }
      io.to(`user:${data.fanId}`).emit('live:private-accepted', { sessionId: data.sessionId });
      sessionOnPrivateCall.set(data.sessionId, true);
      io.to(`live:${data.sessionId}`).emit('live:on-private-call', {
        creatorName: session.creator.displayName ?? 'Creator',
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:private-accept');
    }
  });

  socket.on('live:private-decline', (data: { fanId: string }) => {
    io.to(`user:${data.fanId}`).emit('live:private-declined', {});
  });

  socket.on('live:private-ended', (data: { sessionId: string }) => {
    sessionOnPrivateCall.delete(data.sessionId);
    io.to(`live:${data.sessionId}`).emit('live:private-call-ended', {});
  });

  registerShoppingHandlers(io, socket, userId);
  registerMediasoupHandlers(socket);
}
