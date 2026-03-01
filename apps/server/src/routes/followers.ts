import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../utils/notify.js';
import { logActivity } from '../utils/audit.js';

const router = Router();

const USER_SELECT = { id: true, username: true, displayName: true, avatar: true };

router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { select: USER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
    const data = follows.map((f) => ({
      id: f.following.id,
      username: f.following.username,
      displayName: f.following.displayName,
      avatar: f.following.avatar,
      followedAt: f.createdAt,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.post('/:creatorId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const creatorId = req.params.creatorId as string;
    if (userId === creatorId) throw new AppError(400, 'Cannot follow yourself');
    const creator = await prisma.user.findUnique({ where: { id: creatorId } });
    if (!creator) throw new AppError(404, 'User not found');
    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId: creatorId } },
    });
    if (existing) throw new AppError(409, 'Already following');
    await prisma.follow.create({ data: { followerId: userId, followingId: creatorId } });
    // Notify the creator
    const actor = await prisma.user.findUnique({
      where: { id: userId },
      select: { displayName: true },
    });
    createNotification({
      userId: creatorId,
      type: 'FOLLOW',
      actorId: userId,
      message: `${actor?.displayName || 'Someone'} started following you`,
    });
    logActivity(userId, 'FOLLOW', 'User', creatorId, null, req);
    res.status(201).json({ success: true, message: 'Followed' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:creatorId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const creatorId = req.params.creatorId as string;
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId: creatorId } },
    });
    if (!follow) throw new AppError(404, 'Not following');
    await prisma.follow.delete({ where: { id: follow.id } });
    logActivity(userId, 'UNFOLLOW', 'User', creatorId, null, req);
    res.json({ success: true, message: 'Unfollowed' });
  } catch (err) {
    next(err);
  }
});

export default router;
