import { PrismaClient } from '@prisma/client';

// ─── Seed transactions ────────────────────────────────────
export async function seedCreatorTransactions(prisma: PrismaClient, walletId: string) {
  await prisma.transaction.deleteMany({ where: { walletId } });
  const now = Date.now();
  const day = 86400000;
  const txns = [
    { type: 'TIP_RECEIVED' as const, amount: 25, desc: 'Tip from fan123', offset: -2 },
    { type: 'TIP_RECEIVED' as const, amount: 50, desc: 'Tip from superfan_mike', offset: -5 },
    { type: 'TIP_RECEIVED' as const, amount: 15, desc: 'Tip from newbie_jane', offset: -8 },
    { type: 'TIP_RECEIVED' as const, amount: 100, desc: 'Tip from big_spender_99', offset: -12 },
    { type: 'TIP_RECEIVED' as const, amount: 30, desc: 'Tip from loyal_viewer', offset: -15 },
    { type: 'SUBSCRIPTION' as const, amount: 15, desc: 'Subscription from fan123', offset: -3 },
    {
      type: 'SUBSCRIPTION' as const,
      amount: 55,
      desc: 'Subscription from premium_user',
      offset: -10,
    },
    {
      type: 'SUBSCRIPTION' as const,
      amount: 15,
      desc: 'Subscription from new_subscriber',
      offset: -20,
    },
    { type: 'WITHDRAWAL' as const, amount: -500, desc: 'Withdrawal to bank account', offset: -7 },
    { type: 'WITHDRAWAL' as const, amount: -200, desc: 'Withdrawal to PayPal', offset: -14 },
  ];
  for (const t of txns) {
    await prisma.transaction.create({
      data: {
        walletId,
        type: t.type,
        amount: t.amount,
        description: t.desc,
        status: 'COMPLETED',
        createdAt: new Date(now + t.offset * day),
      },
    });
  }
}

// ─── Seed bookings + follow ───────────────────────────────
export async function seedCreatorBookings(prisma: PrismaClient, creatorId: string) {
  const fan = await prisma.user.findUnique({ where: { email: 'fan@test.com' } });
  if (!fan) return;

  await prisma.booking.deleteMany({ where: { creatorId } });
  const now = Date.now();
  const day = 86400000;
  const bookings = [
    {
      date: new Date(now + 7 * day),
      timeSlot: '10:00 AM - 11:00 AM',
      status: 'ACCEPTED' as const,
      notes: 'Photo review session',
    },
    {
      date: new Date(now + 14 * day),
      timeSlot: '2:00 PM - 3:00 PM',
      status: 'ACCEPTED' as const,
      notes: 'Custom content discussion',
    },
    {
      date: new Date(now + 3 * day),
      timeSlot: '11:00 AM - 12:00 PM',
      status: 'PENDING' as const,
      notes: 'Video call request',
    },
    {
      date: new Date(now - 5 * day),
      timeSlot: '3:00 PM - 4:00 PM',
      status: 'COMPLETED' as const,
      notes: 'Completed fan meetup',
    },
    {
      date: new Date(now + 2 * day),
      timeSlot: '4:00 PM - 5:00 PM',
      status: 'REJECTED' as const,
      notes: 'Schedule conflict',
    },
  ];
  for (const b of bookings) {
    await prisma.booking.create({
      data: {
        creatorId,
        fanId: fan.id,
        date: b.date,
        timeSlot: b.timeSlot,
        status: b.status,
        notes: b.notes,
      },
    });
  }

  const existingFollow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: fan.id, followingId: creatorId } },
  });
  if (!existingFollow) {
    await prisma.follow.create({ data: { followerId: fan.id, followingId: creatorId } });
  }
}
