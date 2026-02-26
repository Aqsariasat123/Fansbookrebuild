import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const sendMessageSchema = z.object({
  text: z.string().min(1).max(5000),
});

// ─── GET /api/messages/conversations ─────────────────────

router.get('/conversations', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      include: {
        participant1: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        participant2: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    const result = await Promise.all(
      conversations.map(async (c) => {
        const other = c.participant1Id === userId ? c.participant2 : c.participant1;
        const unreadCount = await prisma.message.count({
          where: { conversationId: c.id, senderId: { not: userId }, readAt: null },
        });
        return {
          id: c.id,
          other,
          lastMessage: c.lastMessage,
          lastMessageAt: c.lastMessageAt,
          unreadCount,
        };
      }),
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/messages/:conversationId ───────────────────

router.get('/:conversationId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.conversationId as string;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) throw new AppError(404, 'Conversation not found');

    const isParticipant =
      conversation.participant1Id === userId || conversation.participant2Id === userId;
    if (!isParticipant) throw new AppError(403, 'Not a participant');

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    const otherId =
      conversation.participant1Id === userId
        ? conversation.participant2Id
        : conversation.participant1Id;
    const other = await prisma.user.findUnique({
      where: { id: otherId },
      select: { id: true, username: true, displayName: true, avatar: true },
    });

    res.json({ success: true, data: { messages, other } });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/messages/:conversationId ──────────────────

router.post(
  '/:conversationId',
  authenticate,
  validate(sendMessageSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const conversationId = req.params.conversationId as string;
      const { text } = req.body;

      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) throw new AppError(404, 'Conversation not found');

      const isParticipant =
        conversation.participant1Id === userId || conversation.participant2Id === userId;
      if (!isParticipant) throw new AppError(403, 'Not a participant');

      const message = await prisma.message.create({
        data: { conversationId, senderId: userId, text, mediaType: 'TEXT' },
        include: {
          sender: {
            select: { id: true, username: true, displayName: true, avatar: true },
          },
        },
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessage: text, lastMessageAt: new Date() },
      });

      res.status(201).json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  },
);

// ─── PUT /api/messages/:conversationId/read ──────────────

router.put('/:conversationId/read', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.conversationId as string;

    await prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
});

export default router;
