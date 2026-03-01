import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../utils/notify.js';
import { logActivity } from '../utils/audit.js';
import { FEES } from '@fansbook/shared';

const router = Router();

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
  isVerified: true,
};

// ─── PUT /api/posts/:id/pin ── toggle pin (owner only) ─────
router.put('/:id/pin', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId !== userId) throw new AppError(403, 'Not authorized to pin this post');
    const updated = await prisma.post.update({
      where: { id: postId },
      data: { isPinned: !post.isPinned },
      include: { author: { select: AUTHOR_SELECT }, media: { orderBy: { order: 'asc' } } },
    });
    logActivity(userId, 'POST_PIN', 'Post', postId, { isPinned: !post.isPinned }, req);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/posts/:id/like ── like post ─────────────────
router.post('/:id/like', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    const existing = await prisma.like.findUnique({ where: { postId_userId: { postId, userId } } });
    if (existing) throw new AppError(409, 'Already liked');
    await prisma.$transaction([
      prisma.like.create({ data: { postId, userId } }),
      prisma.post.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } }),
    ]);
    // Notify post author
    if (post.authorId !== userId) {
      const actor = await prisma.user.findUnique({
        where: { id: userId },
        select: { displayName: true },
      });
      createNotification({
        userId: post.authorId,
        type: 'LIKE',
        actorId: userId,
        entityId: postId,
        message: `${actor?.displayName || 'Someone'} liked your post`,
      });
    }
    logActivity(userId, 'POST_LIKE', 'Post', postId, null, req);
    res.status(201).json({ success: true, message: 'Post liked' });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/posts/:id/like ── unlike post ──────────────
router.delete('/:id/like', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const existing = await prisma.like.findUnique({ where: { postId_userId: { postId, userId } } });
    if (!existing) throw new AppError(404, 'Like not found');
    await prisma.$transaction([
      prisma.like.delete({ where: { id: existing.id } }),
      prisma.post.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } }),
    ]);
    logActivity(userId, 'POST_UNLIKE', 'Post', postId, null, req);
    res.json({ success: true, message: 'Post unliked' });
  } catch (err) {
    next(err);
  }
});

async function notifyTip(authorId: string, actorId: string, postId: string, amount: number) {
  const actor = await prisma.user.findUnique({
    where: { id: actorId },
    select: { displayName: true },
  });
  createNotification({
    userId: authorId,
    type: 'TIP',
    actorId,
    entityId: postId,
    message: `${actor?.displayName || 'Someone'} tipped $${amount} on your post`,
  });
}

// ─── POST /api/posts/:id/tip ── send tip to post author ──────
router.post('/:id/tip', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;
    const amount = Number(req.body.amount);
    if (!amount || amount < 1) throw new AppError(400, 'Minimum tip is $1');

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.authorId === userId) throw new AppError(400, 'Cannot tip yourself');

    const fanWallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!fanWallet || fanWallet.balance < amount) {
      throw new AppError(400, 'Insufficient balance');
    }

    const creatorWallet = await prisma.wallet.findUnique({ where: { userId: post.authorId } });
    if (!creatorWallet) throw new AppError(500, 'Creator wallet not found');

    const creatorAmt = amount - amount * (FEES.PLATFORM_FEE_PERCENT / 100);

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: fanWallet.id },
        data: { balance: { decrement: amount }, totalSpent: { increment: amount } },
      }),
      prisma.wallet.update({
        where: { id: creatorWallet.id },
        data: { balance: { increment: creatorAmt }, totalEarned: { increment: creatorAmt } },
      }),
      prisma.transaction.create({
        data: {
          walletId: fanWallet.id,
          type: 'TIP_SENT',
          amount,
          description: 'Tip on post',
          status: 'COMPLETED',
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: creatorWallet.id,
          type: 'TIP_RECEIVED',
          amount: creatorAmt,
          description: `Tip on post (${FEES.PLATFORM_FEE_PERCENT}% fee)`,
          status: 'COMPLETED',
        },
      }),
    ]);

    notifyTip(post.authorId, userId, postId, amount);
    logActivity(userId, 'TIP', 'Post', postId, { amount, creatorId: post.authorId }, req);
    res.json({ success: true, message: 'Tip sent!' });
  } catch (err) {
    next(err);
  }
});

export default router;
