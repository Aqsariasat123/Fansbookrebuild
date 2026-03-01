import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';
import commentsRouter from './posts-comments.js';

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
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

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

type PostVisibility = 'PUBLIC' | 'SUBSCRIBERS' | 'TIER_SPECIFIC';
const VALID_VISIBILITIES: PostVisibility[] = ['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'];

function resolveVisibility(visibility?: string): PostVisibility {
  return VALID_VISIBILITIES.includes(visibility as PostVisibility)
    ? (visibility as PostVisibility)
    : 'PUBLIC';
}

async function createPostMedia(postId: string, files: Express.Multer.File[]) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    await prisma.postMedia.create({
      data: {
        postId,
        url: `/api/posts/file/${file.filename}`,
        type: file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE',
        order: i,
      },
    });
  }
}

function parsePpvPrice(ppvPrice?: string): number | null {
  if (!ppvPrice) return null;
  const parsed = parseFloat(ppvPrice);
  if (parsed < 1 || parsed > 500) {
    throw new AppError(400, 'PPV price must be between $1 and $500');
  }
  return parsed;
}

function buildPostCreateData(userId: string, body: Record<string, string>) {
  const resolvedVis = resolveVisibility(body.visibility);
  const parsedPpv = parsePpvPrice(body.ppvPrice);

  return {
    authorId: userId,
    text: body.text?.trim() || '',
    visibility: resolvedVis,
    ...(parsedPpv && resolvedVis !== 'PUBLIC' ? { ppvPrice: parsedPpv } : {}),
    ...(body.isPinned === 'true' ? { isPinned: true } : {}),
  };
}

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

      const data = buildPostCreateData(userId, req.body);
      const post = await prisma.post.create({ data });

      if (files.length > 0) await createPostMedia(post.id, files);

      const fullPost = await prisma.post.findUnique({
        where: { id: post.id },
        include: POST_INCLUDE,
      });
      res.status(201).json({ success: true, data: fullPost });
    } catch (err) {
      next(err);
    }
  },
);

// ─── PUT /api/posts/:id ── edit post (owner only) ──────────
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized to edit this post');

    const updateData: Record<string, unknown> = {};

    if (req.body.text !== undefined) {
      if (typeof req.body.text !== 'string' || req.body.text.trim().length === 0) {
        throw new AppError(400, 'Text cannot be empty');
      }
      updateData.text = req.body.text.trim();
    }

    if (req.body.visibility !== undefined) {
      const validVisibilities = ['PUBLIC', 'SUBSCRIBERS', 'TIER_SPECIFIC'];
      if (!validVisibilities.includes(req.body.visibility)) {
        throw new AppError(400, 'Invalid visibility value');
      }
      updateData.visibility = req.body.visibility;
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: { select: AUTHOR_SELECT },
        media: { orderBy: { order: 'asc' } },
      },
    });

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
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized to delete this post');

    await prisma.post.delete({ where: { id: postId } });

    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
