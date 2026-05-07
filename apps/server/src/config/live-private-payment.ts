import { prisma } from './database.js';

export interface PrivatePaymentResult {
  ok: boolean;
  required: number;
  balance: number;
}

export async function chargePrivateShow(
  fanId: string,
  sessionId: string,
  creatorId: string,
  creatorName: string,
  tokens: number,
): Promise<PrivatePaymentResult> {
  if (tokens <= 0) return { ok: true, required: 0, balance: 0 };
  const fanWallet = await prisma.wallet.findUnique({ where: { userId: fanId } });
  if (!fanWallet || fanWallet.balance < tokens) {
    return { ok: false, required: tokens, balance: fanWallet?.balance ?? 0 };
  }
  await prisma.$transaction(async (tx) => {
    const creatorWallet = await tx.wallet.upsert({
      where: { userId: creatorId },
      create: { userId: creatorId, balance: 0 },
      update: {},
    });
    await tx.wallet.update({
      where: { id: fanWallet.id },
      data: { balance: { decrement: tokens }, totalSpent: { increment: tokens } },
    });
    await tx.wallet.update({
      where: { id: creatorWallet.id },
      data: { balance: { increment: tokens }, totalEarned: { increment: tokens } },
    });
    await tx.transaction.create({
      data: {
        walletId: fanWallet.id,
        type: 'TIP_SENT',
        amount: tokens,
        description: `Private show with ${creatorName}`,
        referenceId: sessionId,
        status: 'COMPLETED',
      },
    });
    await tx.transaction.create({
      data: {
        walletId: creatorWallet.id,
        type: 'TIP_RECEIVED',
        amount: tokens,
        description: 'Private show payment',
        referenceId: sessionId,
        status: 'COMPLETED',
      },
    });
  });
  return { ok: true, required: tokens, balance: fanWallet.balance - tokens };
}

export async function checkPrivateShowAffordable(
  fanId: string,
  tokens: number,
): Promise<PrivatePaymentResult> {
  if (tokens <= 0) return { ok: true, required: 0, balance: 0 };
  const wallet = await prisma.wallet.findUnique({
    where: { userId: fanId },
    select: { balance: true },
  });
  const balance = wallet?.balance ?? 0;
  return { ok: balance >= tokens, required: tokens, balance };
}
