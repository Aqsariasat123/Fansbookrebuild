import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

const VALID_REASONS = ['SPAM', 'HARASSMENT', 'NUDITY', 'COPYRIGHT', 'OTHER'];

// ─── POST /users/:id/block ─────────────────────────────

router.post('/users/:id/block', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const targetId = req.params.id as string;

    if (userId === targetId) throw new AppError(400, 'Cannot block yourself');

    const target = await prisma.user.findUnique({ where: { id: targetId } });
    if (!target) throw new AppError(404, 'User not found');

    const existing = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } },
    });
    if (existing) throw new AppError(409, 'User already blocked');

    await prisma.$transaction([
      prisma.block.create({ data: { blockerId: userId, blockedId: targetId } }),
      prisma.follow.deleteMany({
        where: {
          OR: [
            { followerId: userId, followingId: targetId },
            { followerId: targetId, followingId: userId },
          ],
        },
      }),
    ]);

    res.status(201).json({ success: true, message: 'User blocked' });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /users/:id/block ────────────────────────────

router.delete('/users/:id/block', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const targetId = req.params.id as string;

    const block = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } },
    });
    if (!block) throw new AppError(404, 'User is not blocked');

    await prisma.block.delete({ where: { id: block.id } });

    res.json({ success: true, message: 'User unblocked' });
  } catch (err) {
    next(err);
  }
});

// ─── POST /users/:id/report ────────────────────────────

router.post('/users/:id/report', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const targetId = req.params.id as string;

    if (userId === targetId) throw new AppError(400, 'Cannot report yourself');

    const { reason, description } = req.body;
    if (!reason || !VALID_REASONS.includes(reason)) {
      throw new AppError(400, `reason must be one of: ${VALID_REASONS.join(', ')}`);
    }

    const target = await prisma.user.findUnique({ where: { id: targetId } });
    if (!target) throw new AppError(404, 'User not found');

    await prisma.report.create({
      data: {
        reporterId: userId,
        reportedUserId: targetId,
        reason,
        description: description || null,
      },
    });

    res.status(201).json({ success: true, message: 'Report submitted' });
  } catch (err) {
    next(err);
  }
});

// ─── GET /users/following ───────────────────────────────

router.get('/users/following', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: userId },
        include: { following: { select: USER_SELECT } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.follow.count({ where: { followerId: userId } }),
    ]);

    const data = items.map((f) => ({ ...f.following, followedAt: f.createdAt }));

    res.json({ success: true, data, meta: { page, limit, total } });
  } catch (err) {
    next(err);
  }
});

// ─── GET /users/followers ───────────────────────────────

router.get('/users/followers', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: userId },
        include: { follower: { select: USER_SELECT } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.follow.count({ where: { followingId: userId } }),
    ]);

    const data = items.map((f) => ({ ...f.follower, followedAt: f.createdAt }));

    res.json({ success: true, data, meta: { page, limit, total } });
  } catch (err) {
    next(err);
  }
});

export default router;
