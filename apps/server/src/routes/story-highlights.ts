import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// List highlights for a user (public)
router.get('/:userId', async (req, res, next) => {
  try {
    const highlights = await prisma.storyHighlight.findMany({
      where: { userId: req.params.userId },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: highlights });
  } catch (err) {
    next(err);
  }
});

// Create highlight (authenticated creator only)
router.post('/', authenticate, requireRole('CREATOR'), async (req, res, next) => {
  try {
    const { name, coverUrl, storyIds } = req.body;
    if (!name?.trim()) throw new AppError(400, 'Highlight name is required');

    const count = await prisma.storyHighlight.count({
      where: { userId: req.user!.userId },
    });

    const highlight = await prisma.storyHighlight.create({
      data: {
        userId: req.user!.userId,
        name: name.trim(),
        coverUrl: coverUrl || null,
        storyIds: Array.isArray(storyIds) ? storyIds : [],
        order: count,
      },
    });
    res.status(201).json({ success: true, data: highlight });
  } catch (err) {
    next(err);
  }
});

// Update highlight (ownership check)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const highlight = await prisma.storyHighlight.findUnique({
      where: { id: req.params.id as string },
    });
    if (!highlight) throw new AppError(404, 'Highlight not found');
    if (highlight.userId !== req.user!.userId) {
      throw new AppError(403, 'Can only edit your own highlights');
    }

    const { name, coverUrl, storyIds, order } = req.body;
    const updated = await prisma.storyHighlight.update({
      where: { id: req.params.id as string },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(storyIds !== undefined && { storyIds }),
        ...(order !== undefined && { order }),
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// Delete highlight (ownership check)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const highlight = await prisma.storyHighlight.findUnique({
      where: { id: req.params.id as string },
    });
    if (!highlight) throw new AppError(404, 'Highlight not found');
    if (highlight.userId !== req.user!.userId) {
      throw new AppError(403, 'Can only delete your own highlights');
    }

    await prisma.storyHighlight.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Highlight deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
