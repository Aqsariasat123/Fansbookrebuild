import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';
import { embedWatermark } from '../utils/imageProcessing.js';
import { createStoryNotification } from '../utils/storyNotify.js';

const STORY_LIMIT = 20;
const router = Router();
const storiesDir = path.join(process.cwd(), 'uploads', 'stories');
if (!fs.existsSync(storiesDir)) fs.mkdirSync(storiesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, storiesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user!.userId}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) cb(null, true);
    else cb(new AppError(400, 'Only image and video files are allowed') as unknown as Error);
  },
});

router.get('/file/:filename', (req, res, next) => {
  try {
    const filePath = path.join(storiesDir, path.basename(req.params.filename));
    if (!fs.existsSync(filePath)) throw new AppError(404, 'File not found');
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  authenticate,
  requireRole('CREATOR'),
  upload.single('media'),
  async (req, res, next) => {
    try {
      if (!req.file) throw new AppError(400, 'Media file required');
      const userId = req.user!.userId;

      const activeCount = await prisma.story.count({
        where: { authorId: userId, expiresAt: { gt: new Date() } },
      });
      if (activeCount >= STORY_LIMIT)
        throw new AppError(400, `Maximum ${STORY_LIMIT} active stories allowed`);

      const mediaType = req.file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';
      const mediaUrl = `/api/stories/file/${req.file.filename}`;
      const visibility = req.body.visibility === 'SUBSCRIBERS' ? 'SUBSCRIBERS' : 'PUBLIC';

      if (mediaType === 'IMAGE') {
        const author = await prisma.user.findUnique({
          where: { id: userId },
          select: { username: true },
        });
        await embedWatermark(
          path.join(storiesDir, req.file.filename),
          author?.username ?? userId,
        ).catch(() => {});
      }

      const story = await prisma.story.create({
        data: {
          authorId: userId,
          mediaUrl,
          mediaType,
          visibility,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        include: {
          author: { select: { id: true, username: true, displayName: true, avatar: true } },
        },
      });
      res.status(201).json({ success: true, data: story });
    } catch (err) {
      next(err);
    }
  },
);

router.post('/:id/view', authenticate, async (req, res, next) => {
  try {
    const storyId = req.params.id as string;
    const viewerId = req.user!.userId;
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new AppError(404, 'Story not found');
    if (story.expiresAt < new Date()) throw new AppError(410, 'Story has expired');
    const existing = await prisma.storyView.findUnique({
      where: { storyId_viewerId: { storyId, viewerId } },
    });
    if (!existing) {
      await prisma.$transaction([
        prisma.storyView.create({ data: { storyId, viewerId } }),
        prisma.story.update({ where: { id: storyId }, data: { viewCount: { increment: 1 } } }),
      ]);
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const storyId = req.params.id as string;
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new AppError(404, 'Story not found');
    if (story.authorId !== req.user!.userId)
      throw new AppError(403, 'Can only delete your own stories');
    if (story.mediaUrl.startsWith('/api/stories/file/')) {
      const filePath = path.join(storiesDir, story.mediaUrl.split('/').pop()!);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await prisma.story.delete({ where: { id: story.id } });
    res.json({ success: true, message: 'Story deleted' });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/react', authenticate, async (req, res, next) => {
  try {
    const storyId = req.params.id as string;
    const emoji = req.body.emoji || '❤️';
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new AppError(404, 'Story not found');
    const reactorId = req.user!.userId;
    await prisma.storyReaction.upsert({
      where: { storyId_userId: { storyId, userId: reactorId } },
      update: { emoji },
      create: { storyId, userId: reactorId, emoji },
    });
    if (reactorId !== story.authorId) {
      await createStoryNotification(
        story.authorId,
        reactorId,
        story.id,
        `{name} reacted to your story ${emoji}`,
      );
    }
    res.json({ success: true, data: { emoji } });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/reply', authenticate, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) throw new AppError(400, 'Reply text is required');
    const storyId = req.params.id as string;
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) throw new AppError(404, 'Story not found');
    const senderId = req.user!.userId;
    const receiverId = story.authorId;
    if (senderId === receiverId) throw new AppError(400, 'Cannot reply to your own story');
    let conv = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: senderId, participant2Id: receiverId },
          { participant1Id: receiverId, participant2Id: senderId },
        ],
      },
    });
    if (!conv)
      conv = await prisma.conversation.create({
        data: { participant1Id: senderId, participant2Id: receiverId },
      });
    const replyText = `Replied to your story: ${text.trim()}`;
    await prisma.message.create({
      data: { conversationId: conv.id, senderId, text: replyText, mediaType: 'TEXT' },
    });
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { lastMessage: replyText, lastMessageAt: new Date() },
    });
    await createStoryNotification(receiverId, senderId, story.id, '{name} replied to your story');
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
