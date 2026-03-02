import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logActivity } from '../../utils/audit.js';

const router = Router();

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
};

// GET /api/admin/content/posts — list posts with search, status filter, pagination
router.get('/posts', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const search = ((req.query.search as string) || '').trim();
    const status = (req.query.status as string) || '';

    const where: Record<string, unknown> = {};
    if (status === 'deleted') {
      where.deletedAt = { not: null };
    } else if (status === 'active') {
      where.deletedAt = null;
    }
    if (search) {
      where.OR = [
        { text: { contains: search, mode: 'insensitive' } },
        { author: { username: { contains: search, mode: 'insensitive' } } },
        { author: { displayName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { author: { select: AUTHOR_SELECT }, _count: { select: { media: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const mapped = items.map((p) => ({
      id: p.id,
      authorName: p.author.displayName,
      authorUsername: p.author.username,
      text: p.text ? (p.text.length > 80 ? p.text.slice(0, 80) + '…' : p.text) : '(no text)',
      mediaCount: p._count.media,
      status: p.deletedAt ? 'Deleted' : 'Active',
      createdAt: p.createdAt,
      deletedAt: p.deletedAt,
    }));

    res.json({
      success: true,
      data: { items: mapped, total, totalPages: Math.ceil(total / limit), page, limit },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/content/posts/:id — soft-delete post
router.delete('/posts/:id', async (req, res, next) => {
  try {
    const postId = req.params.id as string;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.deletedAt) throw new AppError(400, 'Post already deleted');

    await prisma.post.update({ where: { id: postId }, data: { deletedAt: new Date() } });
    logActivity(req.user!.userId, 'CONTENT_DELETE', 'Post', postId, null, req);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/content/posts/:id/restore — restore deleted post
router.put('/posts/:id/restore', async (req, res, next) => {
  try {
    const postId = req.params.id as string;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (!post.deletedAt) throw new AppError(400, 'Post is not deleted');

    await prisma.post.update({ where: { id: postId }, data: { deletedAt: null } });
    logActivity(req.user!.userId, 'CONTENT_RESTORE', 'Post', postId, null, req);
    res.json({ success: true, message: 'Post restored' });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/content/posts/bulk-action
router.post('/posts/bulk-action', async (req, res, next) => {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(400, 'ids array is required');
    }
    if (!['delete', 'restore'].includes(action)) {
      throw new AppError(400, 'action must be "delete" or "restore"');
    }

    const data = action === 'delete' ? { deletedAt: new Date() } : { deletedAt: null };
    const auditAction = action === 'delete' ? 'BULK_CONTENT_DELETE' : 'BULK_CONTENT_RESTORE';

    await prisma.$transaction(async (tx) => {
      await tx.post.updateMany({ where: { id: { in: ids } }, data });
      for (const id of ids) {
        await tx.auditLog.create({
          data: {
            adminId: req.user!.userId,
            action: auditAction,
            targetType: 'Post',
            targetId: id,
            details: { bulkCount: ids.length },
          },
        });
      }
    });

    res.json({ success: true, message: `${ids.length} posts ${action}d` });
  } catch (err) {
    next(err);
  }
});

export default router;
