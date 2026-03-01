import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const SENDER_SELECT = { id: true, username: true, displayName: true, avatar: true };

// Find or create a conversation with a user by username
router.post('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { username } = req.body;
    if (!username) throw new AppError(400, 'username is required');

    const otherUser = await prisma.user.findUnique({
      where: { username },
      select: SENDER_SELECT,
    });
    if (!otherUser) throw new AppError(404, 'User not found');
    if (otherUser.id === userId) throw new AppError(400, 'Cannot message yourself');

    let conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: otherUser.id },
          { participant1Id: otherUser.id, participant2Id: userId },
        ],
      },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: { participant1Id: userId, participant2Id: otherUser.id },
      });
    }

    res.json({ success: true, data: { conversationId: conv.id, other: otherUser } });
  } catch (err) {
    next(err);
  }
});

// List all conversations
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ participant1Id: userId }, { participant2Id: userId }] },
      include: {
        participant1: { select: SENDER_SELECT },
        participant2: { select: SENDER_SELECT },
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

export default router;
