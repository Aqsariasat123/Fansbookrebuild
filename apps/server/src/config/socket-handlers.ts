import type { Server, Socket } from 'socket.io';
import { prisma } from './database.js';
import { logger } from '../utils/logger.js';

const SENDER_SELECT = { id: true, username: true, displayName: true, avatar: true };

export function registerChatHandlers(io: Server, socket: Socket) {
  const userId = socket.data.userId as string;

  // Join conversation rooms for all conversations this user is in
  void joinConversationRooms(socket, userId);

  socket.on('message:send', async (data: { conversationId: string; text: string }) => {
    try {
      const { conversationId, text } = data;
      if (!conversationId || !text?.trim()) return;

      // Verify participation
      const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
      if (!conv) return;
      if (conv.participant1Id !== userId && conv.participant2Id !== userId) return;

      const message = await prisma.message.create({
        data: { conversationId, senderId: userId, text: text.trim(), mediaType: 'TEXT' },
        include: { sender: { select: SENDER_SELECT } },
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessage: text.trim(), lastMessageAt: new Date() },
      });

      // Emit to conversation room
      io.to(`conv:${conversationId}`).emit('message:new', message);

      // Also emit to the other user's personal room for conversation list update
      const otherId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
      io.to(`user:${otherId}`).emit('conversation:update', {
        conversationId,
        lastMessage: text.trim(),
        lastMessageAt: new Date(),
      });
    } catch (err) {
      logger.error({ err }, 'Error handling message:send');
    }
  });

  socket.on('message:read', async (data: { conversationId: string }) => {
    try {
      const { conversationId } = data;
      await prisma.message.updateMany({
        where: { conversationId, senderId: { not: userId }, readAt: null },
        data: { readAt: new Date() },
      });
      io.to(`conv:${conversationId}`).emit('message:read', { conversationId, readBy: userId });
    } catch (err) {
      logger.error({ err }, 'Error handling message:read');
    }
  });

  socket.on('typing:start', (data: { conversationId: string }) => {
    socket.to(`conv:${data.conversationId}`).emit('typing:indicator', {
      conversationId: data.conversationId,
      userId,
      isTyping: true,
    });
  });

  socket.on('typing:stop', (data: { conversationId: string }) => {
    socket.to(`conv:${data.conversationId}`).emit('typing:indicator', {
      conversationId: data.conversationId,
      userId,
      isTyping: false,
    });
  });
}

async function joinConversationRooms(socket: Socket, userId: string) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ participant1Id: userId }, { participant2Id: userId }] },
      select: { id: true },
    });
    for (const conv of conversations) {
      socket.join(`conv:${conv.id}`);
    }
  } catch (err) {
    logger.error({ err }, 'Error joining conversation rooms');
  }
}
