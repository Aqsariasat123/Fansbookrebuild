import { PrismaClient } from '@prisma/client';

export async function seedWallet(prisma: PrismaClient) {
  const fan = await prisma.user.findUnique({ where: { email: 'fan@test.com' } });
  if (!fan) return;

  const wallet = await prisma.wallet.upsert({
    where: { userId: fan.id },
    update: { balance: 350, totalSpent: 650, totalEarned: 1000 },
    create: { userId: fan.id, balance: 350, totalSpent: 650, totalEarned: 1000 },
  });

  await prisma.transaction.deleteMany({ where: { walletId: wallet.id } });

  const now = Date.now();
  const day = 86400000;

  // Coin purchases (DEPOSIT)
  const purchases = [
    { amount: 500, desc: 'Purchased 500 coins', ref: '#11223345', amountPaid: 10, offset: -2 },
    { amount: 500, desc: 'Purchased 500 coins', ref: '#12356667', amountPaid: 26, offset: -30 },
    { amount: 200, desc: 'Purchased 200 coins', ref: '#12890012', amountPaid: 5, offset: -45 },
    { amount: 300, desc: 'Purchased 300 coins', ref: '#13445566', amountPaid: 8, offset: -60 },
  ];

  for (const p of purchases) {
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount: p.amount,
        description: `${p.desc}|€${p.amountPaid.toFixed(2)}`,
        referenceId: p.ref,
        status: 'COMPLETED',
        createdAt: new Date(now + p.offset * day),
      },
    });
  }

  // Coin spending
  const spending = [
    { amount: 500, type: 'TIP_SENT' as const, desc: 'Jassica Joy|Tip', offset: -2 },
    { amount: 100, type: 'TIP_SENT' as const, desc: 'Jassica Joy|Tip', offset: -30 },
    { amount: 50, type: 'SUBSCRIPTION' as const, desc: 'Sarah Jones|Subscription', offset: -15 },
  ];

  for (const s of spending) {
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: s.type,
        amount: s.amount,
        description: s.desc,
        status: 'COMPLETED',
        createdAt: new Date(now + s.offset * day),
      },
    });
  }
}
