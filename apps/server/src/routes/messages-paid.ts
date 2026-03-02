import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/audit.js';

const router = Router();

async function verifyParticipant(conversationId: string, userId: string) {
  const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conv) throw new AppError(404, 'Conversation not found');
  if (conv.participant1Id !== userId && conv.participant2Id !== userId) {
    throw new AppError(403, 'Not a participant');
  }
  return conv;
}

// Check if first message to a creator requires payment
export async function checkPaidMessage(conversationId: string, senderId: string) {
  const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conv) return { required: false, price: 0 };

  const otherId = conv.participant1Id === senderId ? conv.participant2Id : conv.participant1Id;
  const other = await prisma.user.findUnique({
    where: { id: otherId },
    select: { role: true, privacySettings: true },
  });
  if (!other || other.role !== 'CREATOR') return { required: false, price: 0 };

  const settings = (other.privacySettings as Record<string, unknown>) || {};
  const messagePrice = Number(settings.messagePrice) || 0;
  if (messagePrice <= 0) return { required: false, price: 0 };

  // Check if conversation already has messages (already unlocked)
  const existingCount = await prisma.message.count({ where: { conversationId } });
  if (existingCount > 0) return { required: false, price: 0 };

  return { required: true, price: messagePrice, creatorId: otherId };
}

// GET /:conversationId/unlock-price — check if conversation requires payment
router.get('/:conversationId/unlock-price', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.conversationId as string;
    await verifyParticipant(conversationId, userId);
    const result = await checkPaidMessage(conversationId, userId);
    res.json({ success: true, data: { required: result.required, price: result.price } });
  } catch (err) {
    next(err);
  }
});

// POST /:conversationId/unlock — pay to unlock conversation
router.post('/:conversationId/unlock', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const conversationId = req.params.conversationId as string;
    await verifyParticipant(conversationId, userId);

    const { required, price, creatorId } = await checkPaidMessage(conversationId, userId);
    if (!required) {
      return res.json({ success: true, message: 'Conversation already unlocked' });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < price) {
      throw new AppError(400, `Insufficient balance. Need ${price} coins.`);
    }

    // Deduct from fan wallet and credit creator
    await prisma.$transaction([
      prisma.wallet.update({
        where: { userId },
        data: { balance: { decrement: price }, totalSpent: { increment: price } },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'TIP_SENT',
          amount: price,
          description: `Message unlock fee`,
          status: 'COMPLETED',
        },
      }),
      ...(creatorId
        ? [
            prisma.wallet.upsert({
              where: { userId: creatorId },
              create: { userId: creatorId, balance: price, totalEarned: price },
              update: { balance: { increment: price }, totalEarned: { increment: price } },
            }),
          ]
        : []),
    ]);

    logActivity(
      userId,
      'MESSAGE_UNLOCK',
      'Conversation',
      conversationId,
      { price, creatorId },
      req,
    );
    res.json({ success: true, message: 'Conversation unlocked' });
  } catch (err) {
    next(err);
  }
});

export default router;
