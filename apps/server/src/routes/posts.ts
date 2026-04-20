import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';
import commentsRouter from './posts-comments.js';
import { logActivity } from '../utils/audit.js';
import { checkBadges } from '../utils/check-badges.js';
import { createPostMedia } from '../utils/postMedia.js';
import { buildPostCreateData } from '../utils/postHelpers.js';

const router = Router();
const postsUploadsDir = path.join(process.cwd(), 'uploads', 'posts');
if (!fs.existsSync(postsUploadsDir)) fs.mkdirSync(postsUploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, postsUploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${req.user!.userId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}${ext}`);
  },
});
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ALLOWED_MIME.has(file.mimetype)),
});

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

const POST_INCLUDE = {
  author: { select: AUTHOR_SELECT },
  media: { orderBy: { order: 'asc' as const } },
};

// Mount comments sub-router
router.use('/', commentsRouter);

// ─── GET /api/posts/file/:filename ── serve uploaded files ──
router.get('/file/:filename', (req, res, next) => {
  try {
    const sanitized = path.basename(req.params.filename);
    const filePath = path.join(postsUploadsDir, sanitized);
    if (!fs.existsSync(filePath)) throw new AppError(404, 'File not found');
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/posts ── create post (CREATOR only) ─────────
router.post(
  '/',
  authenticate,
  requireRole('CREATOR'),
  upload.array('media', 10),
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const files = (req.files as Express.Multer.File[]) || [];

      if ((!req.body.text || !req.body.text.trim()) && files.length === 0) {
        throw new AppError(400, 'Text or media is required');
      }

      const creator = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });
      const username = creator?.username ?? userId;
      const data = buildPostCreateData(userId, req.body);
      const post = await prisma.post.create({ data });

      if (files.length > 0) await createPostMedia(post.id, files, username);

      const fullPost = await prisma.post.findUnique({
        where: { id: post.id },
        include: POST_INCLUDE,
      });
      logActivity(
        userId,
        'POST_CREATE',
        'Post',
        post.id,
        { visibility: data.visibility, hasMedia: files.length > 0 },
        req,
      );
      res.status(201).json({ success: true, data: fullPost });
      checkBadges(userId);
    } catch (err) {
      next(err);
    }
  },
);

function buildPostUpdate(body: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (body.text !== undefined) {
    if (typeof body.text !== 'string' || (body.text as string).trim().length === 0)
      throw new AppError(400, 'Text cannot be empty');
    data.text = (body.text as string).trim();
  }
  if (body.visibility !== undefined) {
    if (!['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'].includes(body.visibility as string))
      throw new AppError(400, 'Invalid visibility value');
    data.visibility = body.visibility;
  }
  if (body.ppvPrice !== undefined) {
    const price = parseFloat(body.ppvPrice as string);
    data.ppvPrice = isNaN(price) || price <= 0 ? null : price;
  }
  return data;
}

// ─── PUT /api/posts/:id ── edit post (owner only) ──────────
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized to edit this post');

    // 24-hour edit restriction
    const hoursSinceCreation = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      throw new AppError(403, 'Posts can only be edited within 24 hours of creation');
    }

    const updateData = buildPostUpdate(req.body as Record<string, unknown>);

    const updated = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: { select: AUTHOR_SELECT },
        media: { orderBy: { order: 'asc' } },
      },
    });

    logActivity(userId, 'POST_UPDATE', 'Post', postId, { fields: Object.keys(updateData) }, req);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/posts/:id/pin ── pin/unpin post (owner only) ─
router.patch('/:id/pin', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const { isPinned } = req.body as { isPinned: boolean };
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized');
    if (isPinned) {
      await prisma.post.updateMany({
        where: { authorId: userId, isPinned: true },
        data: { isPinned: false },
      });
    }
    const updated = await prisma.post.update({ where: { id: postId }, data: { isPinned } });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/posts/:id ── delete post (owner only) ─────
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.deletedAt) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized to delete this post');

    // Soft delete
    await prisma.post.update({ where: { id: postId }, data: { deletedAt: new Date() } });

    logActivity(userId, 'POST_DELETE', 'Post', postId, null, req);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
