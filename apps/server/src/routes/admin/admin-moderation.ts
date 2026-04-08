import { Router } from 'express';
import { prisma } from '../../config/database.js';

const router = Router();

// GET /api/admin/moderation?status=FLAGGED&page=1
router.get('/', async (req, res, next) => {
  try {
    const status = (req.query.status as string) || 'FLAGGED';
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.postMedia.findMany({
        where: { moderationStatus: status },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          post: {
            select: {
              id: true,
              authorId: true,
              author: { select: { username: true, displayName: true, avatar: true } },
            },
          },
        },
      }),
      prisma.postMedia.count({ where: { moderationStatus: status } }),
    ]);

    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/moderation/stats
router.get('/stats', async (_req, res, next) => {
  try {
    const [flagged, pending, safe, skipped] = await Promise.all([
      prisma.postMedia.count({ where: { moderationStatus: 'FLAGGED' } }),
      prisma.postMedia.count({ where: { moderationStatus: 'PENDING' } }),
      prisma.postMedia.count({ where: { moderationStatus: 'SAFE' } }),
      prisma.postMedia.count({ where: { moderationStatus: 'SKIPPED' } }),
    ]);
    res.json({ success: true, data: { flagged, pending, safe, skipped } });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/moderation/:id/approve  — mark safe, keep post
router.post('/:id/approve', async (req, res, next) => {
  try {
    await prisma.postMedia.update({
      where: { id: req.params.id },
      data: { moderationStatus: 'SAFE' },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/moderation/:id/remove  — delete the post entirely
router.post('/:id/remove', async (req, res, next) => {
  try {
    const media = await prisma.postMedia.findUnique({ where: { id: req.params.id } });
    if (media) await prisma.post.delete({ where: { id: media.postId } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
