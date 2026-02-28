import { PrismaClient } from '@prisma/client';

export async function seedCreatorReferrals(
  prisma: PrismaClient,
  creatorId: string,
  passwordHash: string,
) {
  const ref1 = await upsertReferralUser(
    prisma,
    'referral1@fansbook.com',
    'referral_user1',
    'Alex Referred',
    passwordHash,
  );
  const ref2 = await upsertReferralUser(
    prisma,
    'referral2@fansbook.com',
    'referral_user2',
    'Jordan Referred',
    passwordHash,
  );

  await prisma.referral.upsert({
    where: { referrerId_referredId: { referrerId: creatorId, referredId: ref1.id } },
    update: { earnings: 25.0 },
    create: { referrerId: creatorId, referredId: ref1.id, earnings: 25.0 },
  });
  await prisma.referral.upsert({
    where: { referrerId_referredId: { referrerId: creatorId, referredId: ref2.id } },
    update: { earnings: 15.5 },
    create: { referrerId: creatorId, referredId: ref2.id, earnings: 15.5 },
  });
}

async function upsertReferralUser(
  prisma: PrismaClient,
  email: string,
  username: string,
  displayName: string,
  passwordHash: string,
) {
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, username, displayName, passwordHash, role: 'FAN', emailVerified: true },
  });
  await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, balance: 0 },
  });
  return user;
}
