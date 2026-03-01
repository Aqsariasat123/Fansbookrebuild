import type { Server, Socket } from 'socket.io';
import { prisma } from './database.js';
import { logger } from '../utils/logger.js';

async function insertCallMessage(callerId: string, calleeId: string, text: string) {
  const conv = await prisma.conversation.findFirst({
    where: {
      OR: [
        { participant1Id: callerId, participant2Id: calleeId },
        { participant1Id: calleeId, participant2Id: callerId },
      ],
    },
  });
  if (!conv) return null;
  const msg = await prisma.message.create({
    data: { conversationId: conv.id, senderId: callerId, text, mediaType: 'CALL' },
    include: { sender: { select: { id: true, username: true, displayName: true, avatar: true } } },
  });
  await prisma.conversation.update({
    where: { id: conv.id },
    data: { lastMessage: text, lastMessageAt: new Date() },
  });
  return { msg, conversationId: conv.id };
}

export function registerCallHandlers(io: Server, socket: Socket) {
  const userId = socket.data.userId as string;

  socket.on('call:initiate', async (data: { calleeId: string; mode?: string }) => {
    try {
      const caller = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, displayName: true, avatar: true },
      });
      if (!caller) return;

      const mode = data.mode === 'audio' ? 'audio' : 'video';
      const call = await prisma.videoCall.create({
        data: { callerId: userId, calleeId: data.calleeId, status: 'RINGING', mode },
      });

      io.to(`user:${data.calleeId}`).emit('call:incoming', {
        callId: call.id,
        callerId: caller.id,
        callerName: caller.displayName,
        callerAvatar: caller.avatar,
        mode,
      });

      socket.emit('call:initiated', { callId: call.id });
    } catch (err) {
      logger.error({ err }, 'Error in call:initiate');
    }
  });

  socket.on('call:accept', async (data: { callId: string }) => {
    try {
      const call = await prisma.videoCall.update({
        where: { id: data.callId },
        data: { status: 'ACTIVE', startedAt: new Date() },
      });
      io.to(`user:${call.callerId}`).emit('call:accepted', { callId: call.id });
    } catch (err) {
      logger.error({ err }, 'Error in call:accept');
    }
  });

  socket.on('call:reject', async (data: { callId: string }) => {
    try {
      const call = await prisma.videoCall.update({
        where: { id: data.callId },
        data: { status: 'REJECTED' },
      });
      io.to(`user:${call.callerId}`).emit('call:rejected', { callId: call.id });
      const label = call.mode === 'audio' ? 'Audio' : 'Video';
      const result = await insertCallMessage(call.callerId, call.calleeId, `Missed ${label} Call`);
      if (result) {
        io.to(`user:${call.callerId}`).to(`user:${call.calleeId}`).emit('chat:message', {
          conversationId: result.conversationId,
          message: result.msg,
        });
      }
    } catch (err) {
      logger.error({ err }, 'Error in call:reject');
    }
  });

  socket.on('call:end', async (data: { callId: string }) => {
    try {
      const call = await prisma.videoCall.findUnique({ where: { id: data.callId } });
      if (!call) return;
      const duration = call.startedAt
        ? Math.floor((Date.now() - call.startedAt.getTime()) / 1000)
        : 0;
      await prisma.videoCall.update({
        where: { id: data.callId },
        data: { status: 'ENDED', endedAt: new Date(), duration },
      });
      const otherId = call.callerId === userId ? call.calleeId : call.callerId;
      io.to(`user:${otherId}`).emit('call:ended', { callId: call.id });
      const label = call.mode === 'audio' ? 'Audio' : 'Video';
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      const dur = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      const text = duration > 0 ? `${label} Call · ${dur}` : `Missed ${label} Call`;
      const result = await insertCallMessage(call.callerId, call.calleeId, text);
      if (result) {
        io.to(`user:${call.callerId}`).to(`user:${call.calleeId}`).emit('chat:message', {
          conversationId: result.conversationId,
          message: result.msg,
        });
      }
    } catch (err) {
      logger.error({ err }, 'Error in call:end');
    }
  });

  // WebRTC signaling relay
  socket.on('call:offer', async (data: { callId: string; sdp: unknown }) => {
    try {
      const call = await prisma.videoCall.findUnique({ where: { id: data.callId } });
      if (!call) return;
      const otherId = call.callerId === userId ? call.calleeId : call.callerId;
      io.to(`user:${otherId}`).emit('call:offer', { callId: data.callId, sdp: data.sdp });
    } catch (err) {
      logger.error({ err }, 'Error in call:offer');
    }
  });

  socket.on('call:answer', async (data: { callId: string; sdp: unknown }) => {
    try {
      const call = await prisma.videoCall.findUnique({ where: { id: data.callId } });
      if (!call) return;
      const otherId = call.callerId === userId ? call.calleeId : call.callerId;
      io.to(`user:${otherId}`).emit('call:answer', { callId: data.callId, sdp: data.sdp });
    } catch (err) {
      logger.error({ err }, 'Error in call:answer');
    }
  });

  socket.on('call:ice-candidate', async (data: { callId: string; candidate: unknown }) => {
    try {
      const call = await prisma.videoCall.findUnique({ where: { id: data.callId } });
      if (!call) return;
      const otherId = call.callerId === userId ? call.calleeId : call.callerId;
      io.to(`user:${otherId}`).emit('call:ice-candidate', {
        callId: data.callId,
        candidate: data.candidate,
      });
    } catch (err) {
      logger.error({ err }, 'Error in call:ice-candidate');
    }
  });
}
