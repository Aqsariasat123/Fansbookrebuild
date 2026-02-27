import { PrismaClient } from '@prisma/client';

const IMG = '/icons/dashboard';

// ─── Seed subscription tiers ──────────────────────────────
export async function seedCreatorTiers(prisma: PrismaClient, creatorId: string) {
  const tiers = [
    {
      name: 'Monthly',
      price: 15,
      order: 0,
      benefits: ['Access to all posts', 'Direct messages', 'Monthly exclusive content'],
    },
    {
      name: '3-Month Bundle',
      price: 55,
      order: 1,
      benefits: ['All Monthly benefits', 'Priority DM responses', 'Exclusive live access'],
    },
    {
      name: 'Yearly VIP',
      price: 65,
      order: 2,
      benefits: ['All 3-Month benefits', 'Free video calls', 'Custom content requests'],
    },
  ];
  for (const t of tiers) {
    const existing = await prisma.subscriptionTier.findFirst({
      where: { creatorId, name: t.name },
    });
    if (!existing) {
      await prisma.subscriptionTier.create({
        data: {
          creatorId,
          name: t.name,
          price: t.price,
          order: t.order,
          benefits: t.benefits,
          isActive: true,
        },
      });
    }
  }
}

// ─── Seed posts with media ────────────────────────────────
export async function seedCreatorPosts(prisma: PrismaClient, creatorId: string) {
  const now = Date.now();
  const hour = 3600000;
  const posts = [
    {
      text: "Just finished an amazing photoshoot today! Can't wait to share all the behind-the-scenes shots with my subscribers \u{1F4F8}",
      visibility: 'PUBLIC' as const,
      likeCount: 42,
      commentCount: 8,
      offset: -5,
      media: [{ url: `${IMG}/post-image-main.webp`, type: 'IMAGE' as const, order: 0 }],
    },
    {
      text: 'Morning routine vlog is now up! Check it out and let me know your favorite part \u{1F305}',
      visibility: 'PUBLIC' as const,
      likeCount: 128,
      commentCount: 23,
      offset: -10,
      media: [
        {
          url: `${IMG}/video-thumbnail.webp`,
          type: 'VIDEO' as const,
          order: 0,
          thumbnail: `${IMG}/video-thumbnail.webp`,
        },
      ],
    },
    {
      text: 'Exclusive subscriber content dropping tonight! Get ready for something special \u2728',
      visibility: 'SUBSCRIBERS' as const,
      likeCount: 89,
      commentCount: 15,
      offset: -20,
      media: [],
    },
    {
      text: "Behind the scenes from yesterday's shoot. These are just for my amazing subscribers \u{1F495}",
      visibility: 'SUBSCRIBERS' as const,
      likeCount: 56,
      commentCount: 12,
      offset: -30,
      media: [{ url: `${IMG}/post-image-right-top.webp`, type: 'IMAGE' as const, order: 0 }],
    },
    {
      text: "Thank you for 1000 followers! Here's a special thank you post for everyone \u{1F389}",
      visibility: 'PUBLIC' as const,
      likeCount: 234,
      commentCount: 45,
      offset: -48,
      media: [{ url: `${IMG}/story-bg-2.webp`, type: 'IMAGE' as const, order: 0 }],
    },
  ];

  await prisma.postMedia.deleteMany({ where: { post: { authorId: creatorId } } });
  await prisma.post.deleteMany({ where: { authorId: creatorId } });

  for (const p of posts) {
    const post = await prisma.post.create({
      data: {
        authorId: creatorId,
        text: p.text,
        visibility: p.visibility,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        createdAt: new Date(now + p.offset * hour),
      },
    });
    for (const m of p.media) {
      await prisma.postMedia.create({
        data: {
          postId: post.id,
          url: m.url,
          type: m.type,
          order: m.order,
          thumbnail: 'thumbnail' in m ? m.thumbnail : undefined,
        },
      });
    }
  }
}

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

// ─── Seed referral users ──────────────────────────────────
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
