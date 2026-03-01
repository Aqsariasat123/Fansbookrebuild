import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
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

// ─── POST /api/posts/:id/ppv-unlock ── unlock PPV content ───
router.post('/:id/ppv-unlock', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const postId = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: { select: AUTHOR_SELECT }, media: { orderBy: { order: 'asc' } } },
    });
    if (!post) throw new AppError(404, 'Post not found');
    if (!post.ppvPrice) throw new AppError(400, 'This post is not PPV');

    const existing = await prisma.ppvPurchase.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existing) throw new AppError(409, 'Already unlocked');

    const fanWallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!fanWallet || fanWallet.balance < post.ppvPrice) {
      throw new AppError(400, 'Insufficient balance');
    }

    const creatorWallet = await prisma.wallet.findUnique({ where: { userId: post.authorId } });
    if (!creatorWallet) throw new AppError(500, 'Creator wallet not found');

    const price = post.ppvPrice!;
    const creatorAmt = price - price * (FEES.PLATFORM_FEE_PERCENT / 100);

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: fanWallet.id },
        data: { balance: { decrement: price }, totalSpent: { increment: price } },
      }),
      prisma.wallet.update({
        where: { id: creatorWallet.id },
        data: { balance: { increment: creatorAmt }, totalEarned: { increment: creatorAmt } },
      }),
      prisma.transaction.create({
        data: {
          walletId: fanWallet.id,
          type: 'PPV_PURCHASE',
          amount: price,
          description: `PPV unlock: post ${postId}`,
          status: 'COMPLETED',
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: creatorWallet.id,
          type: 'PPV_EARNING',
          amount: creatorAmt,
          description: `PPV earning: post ${postId} (${FEES.PLATFORM_FEE_PERCENT}% fee)`,
          status: 'COMPLETED',
        },
      }),
      prisma.ppvPurchase.create({ data: { userId, postId, amount: price } }),
    ]);

    logActivity(
      userId,
      'PPV_UNLOCK',
      'Post',
      postId,
      { amount: price, creatorId: post.authorId },
      req,
    );
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

export default router;
