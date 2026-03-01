import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { emitToUser } from '../utils/notify.js';
import { logActivity } from '../utils/audit.js';

const router = Router();
const msgUploadsDir = path.join(process.cwd(), 'uploads', 'messages');
if (!fs.existsSync(msgUploadsDir)) fs.mkdirSync(msgUploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, msgUploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user!.userId}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const SENDER_SELECT = { id: true, username: true, displayName: true, avatar: true };
const sendMessageSchema = z.object({ text: z.string().min(1).max(5000) });

async function verifyParticipant(conversationId: string, userId: string) {
  const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conv) throw new AppError(404, 'Conversation not found');
  if (conv.participant1Id !== userId && conv.participant2Id !== userId) {
    throw new AppError(403, 'Not a participant');
  }
  return conv;
}

router.get('/file/:filename', (req, res, next) => {
  try {
    const filePath = path.join(msgUploadsDir, req.params.filename);
    if (!fs.existsSync(filePath)) throw new AppError(404, 'File not found');
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

// Conversation endpoints (find/create + list) extracted to messages-conversations.ts
import messagesConvRouter from './messages-conversations.js';
router.use('/conversations', messagesConvRouter);

router.get('/:conversationId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.conversationId as string;
    const conv = await verifyParticipant(conversationId, userId);
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: SENDER_SELECT } },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
    const otherId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
    const other = await prisma.user.findUnique({ where: { id: otherId }, select: SENDER_SELECT });
    res.json({ success: true, data: { messages, other } });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:conversationId',
  authenticate,
  validate(sendMessageSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const conversationId = req.params.conversationId as string;
      await verifyParticipant(conversationId, userId);
      const { text } = req.body;
      const message = await prisma.message.create({
        data: { conversationId, senderId: userId, text, mediaType: 'TEXT' },
        include: { sender: { select: SENDER_SELECT } },
      });
      const conv = await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessage: text, lastMessageAt: new Date() },
      });
      // Emit real-time message to the other participant
      const otherId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
      emitToUser(otherId, 'message:new', message);
      emitToUser(otherId, 'conversation:update', {
        conversationId,
        lastMessage: text,
        lastMessageAt: new Date(),
      });
      logActivity(
        userId,
        'MESSAGE_SEND',
        'Conversation',
        conversationId,
        { recipientId: otherId },
        req,
      );
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/:conversationId/image',
  authenticate,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const conversationId = req.params.conversationId as string;
      await verifyParticipant(conversationId, userId);
      if (!req.file) throw new AppError(400, 'Image required');
      const mediaUrl = `/api/messages/file/${req.file.filename}`;
      const caption = req.body.caption || null;
      const message = await prisma.message.create({
        data: { conversationId, senderId: userId, text: caption, mediaUrl, mediaType: 'IMAGE' },
        include: { sender: { select: SENDER_SELECT } },
      });
      const preview = caption ? `📷 ${caption}` : '📷 Image';
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessage: preview, lastMessageAt: new Date() },
      });
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  },
);

router.delete('/message/:messageId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const messageId = req.params.messageId as string;
    const mode = (req.query.mode as string) || 'forEveryone';
    const msg = await prisma.message.findUnique({ where: { id: messageId } });
    if (!msg) throw new AppError(404, 'Message not found');
    await verifyParticipant(msg.conversationId, userId);
    if (mode === 'forEveryone' && msg.senderId !== userId) {
      throw new AppError(403, 'Can only delete your own messages for everyone');
    }
    await prisma.message.delete({ where: { id: messageId } });
    logActivity(userId, 'MESSAGE_DELETE', 'Message', messageId, { mode }, req);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
});

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
