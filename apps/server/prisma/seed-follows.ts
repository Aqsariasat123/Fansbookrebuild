import { PrismaClient } from '@prisma/client';

export async function seedFollows(prisma: PrismaClient, passwordHash: string) {
  const fan = await prisma.user.findUnique({ where: { email: 'fan@test.com' } });
  if (!fan) return;

  // Upsert creators to follow
  const creators = [
    {
      email: 'emma_joens@fansbook.com',
      username: 'emma_jones',
      displayName: 'Emma Joens',
      avatar: '/images/creators/creator1.webp',
    },
    {
      email: 'kaly_joens@fansbook.com',
      username: 'kaly_joens',
      displayName: 'Kaly Joens',
      avatar: '/images/creators/creator2.webp',
    },
    {
      email: 'fort_benny@fansbook.com',
      username: 'fort_benny',
      displayName: 'Fort Benny',
      avatar: '/images/creators/creator3.webp',
    },
    {
      email: 'fily_joens@fansbook.com',
      username: 'fily_joens',
      displayName: 'Fily Joens',
      avatar: '/images/creators/creator4.webp',
    },
    {
      email: 'jassica_joy@fansbook.com',
      username: 'jassica_joy',
      displayName: 'Jassica Joy',
      avatar: '/images/creators/creator5.webp',
    },
    {
      email: 'john_doe@fansbook.com',
      username: 'john_doe',
      displayName: 'John Doe',
      avatar: '/images/creators/creator6.webp',
    },
  ];

  const creatorIds: string[] = [];
  for (const c of creators) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { ...c, passwordHash, role: 'CREATOR', emailVerified: true },
    });
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, balance: 0 },
    });
    creatorIds.push(user.id);
  }

  // Create follows
  await prisma.follow.deleteMany({ where: { followerId: fan.id } });
  for (const cId of creatorIds) {
    await prisma.follow.create({ data: { followerId: fan.id, followingId: cId } });
  }

  // Create subscription tiers + subscriptions
  await prisma.subscription.deleteMany({ where: { subscriberId: fan.id } });

  const tiers = [
    { creatorId: creatorIds[4], name: 'Monthly', price: 15 },
    { creatorId: creatorIds[5], name: 'Yearly', price: 55 },
    { creatorId: creatorIds[4], name: 'Weekly', price: 64 },
    { creatorId: creatorIds[5], name: 'Monthly', price: 65 },
  ];

  const now = Date.now();
  const day = 86400000;

  for (const t of tiers) {
    let tier = await prisma.subscriptionTier.findFirst({
      where: { creatorId: t.creatorId, name: t.name },
    });
    if (!tier) {
      tier = await prisma.subscriptionTier.create({
        data: { creatorId: t.creatorId, name: t.name, price: t.price, isActive: true },
      });
    }

    const startOffset = tiers.indexOf(t) * -60;
    const start = new Date(now + startOffset * day);
    const end = new Date(start.getTime() + 30 * day);

    await prisma.subscription.create({
      data: {
        subscriberId: fan.id,
        creatorId: t.creatorId,
        tierId: tier.id,
        status: tiers.indexOf(t) === 1 ? 'PAST_DUE' : 'ACTIVE',
        startDate: start,
        endDate: end,
        renewalDate: end,
      },
    });
  }
}
