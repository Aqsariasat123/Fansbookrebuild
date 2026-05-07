import { Router, Request } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../utils/notify.js';
import { logActivity } from '../utils/audit.js';

const router = Router();

function validateTip(receiverId: string, tipAmount: number, userId: string) {
  if (!receiverId) throw new AppError(400, 'receiverId is required');
  if (!tipAmount || tipAmount < 1) throw new AppError(400, 'Minimum tip is $1');
  if (tipAmount > 10000) throw new AppError(400, 'Maximum tip is $10,000');
  if (receiverId === userId) throw new AppError(400, 'Cannot tip yourself');
}

async function getWallets(userId: string, receiverId: string, tipAmount: number) {
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { id: true, displayName: true },
  });
  if (!receiver) throw new AppError(404, 'User not found');

  const fanWallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!fanWallet || fanWallet.balance < tipAmount) {
    throw new AppError(400, 'Insufficient balance');
  }

  const creatorWallet = await prisma.wallet.upsert({
    where: { userId: receiverId },
    create: { userId: receiverId, balance: 0 },
    update: {},
  });

  return { fanWallet, creatorWallet };
}

async function notifyTipSent(userId: string, receiverId: string, tipAmount: number) {
  const actor = await prisma.user.findUnique({
    where: { id: userId },
    select: { displayName: true, avatar: true },
  });
  createNotification({
    userId: receiverId,
    type: 'TIP',
    actorId: userId,
    entityType: `TIP|avatar:${actor?.avatar || ''}`,
    message: `${actor?.displayName || 'Someone'} sent you a $${tipAmount} tip!`,
  });
}

// POST /api/tips - send a direct tip to a creator
router.post('/', authenticate, async (req: Request, res, next) => {
  try {
    const userId = req.user!.userId;
    const { receiverId, amount, message } = req.body;
    const tipAmount = Number(amount);

    validateTip(receiverId, tipAmount, userId);
    const { fanWallet, creatorWallet } = await getWallets(userId, receiverId, tipAmount);

    // Creator receives the full tip — platform fee is taken at withdrawal time
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: fanWallet.id },
        data: { balance: { decrement: tipAmount }, totalSpent: { increment: tipAmount } },
      }),
      prisma.wallet.update({
        where: { id: creatorWallet.id },
        data: { balance: { increment: tipAmount }, totalEarned: { increment: tipAmount } },
      }),
      prisma.tip.create({
        data: { senderId: userId, receiverId, amount: tipAmount },
      }),
      prisma.transaction.create({
        data: {
          walletId: fanWallet.id,
          type: 'TIP_SENT',
          amount: tipAmount,
          description: message || 'Direct tip',
          status: 'COMPLETED',
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: creatorWallet.id,
          type: 'TIP_RECEIVED',
          amount: tipAmount,
          description: message || 'Direct tip received',
          referenceId: userId,
          status: 'COMPLETED',
        },
      }),
    ]);

    notifyTipSent(userId, receiverId, tipAmount);
    logActivity(userId, 'TIP', 'User', receiverId, { amount: tipAmount }, req);
    res.json({ success: true, message: 'Tip sent!' });
  } catch (err) {
    next(err);
  }
});

export default router;
