import { PrismaClient } from '@prisma/client';

const IMG = '/icons/dashboard';

const storyNames = [
  { email: 'bella1@fansbook.com', username: 'bella_rose_1', displayName: 'Bella Rose' },
  { email: 'nina2@fansbook.com', username: 'nina_pearl_2', displayName: 'Nina Pearl' },
  { email: 'aria3@fansbook.com', username: 'aria_sky_3', displayName: 'Aria Sky' },
  { email: 'zara4@fansbook.com', username: 'zara_luxe_4', displayName: 'Zara Luxe' },
  { email: 'ivy5@fansbook.com', username: 'ivy_bloom_5', displayName: 'Ivy Bloom' },
];

const popularModelNames = [
  { email: 'dani_nova@fansbook.com', username: 'dani_nova', displayName: 'Dani Nova' },
  { email: 'lexi_mae@fansbook.com', username: 'lexi_mae', displayName: 'Lexi Mae' },
  { email: 'ruby_voss@fansbook.com', username: 'ruby_voss', displayName: 'Ruby Voss' },
  { email: 'maya_quinn@fansbook.com', username: 'maya_quinn', displayName: 'Maya Quinn' },
  { email: 'tessa_lane@fansbook.com', username: 'tessa_lane', displayName: 'Tessa Lane' },
  { email: 'jade_fox@fansbook.com', username: 'jade_fox', displayName: 'Jade Fox' },
  { email: 'kira_blaze@fansbook.com', username: 'kira_blaze', displayName: 'Kira Blaze' },
];

async function upsertCreator(
  prisma: PrismaClient,
  opts: {
    email: string;
    username: string;
    displayName: string;
    avatar: string;
    passwordHash: string;
    isVerified?: boolean;
    category?: string;
  },
) {
  const c = await prisma.user.upsert({
    where: { email: opts.email },
    update: { avatar: opts.avatar, isVerified: opts.isVerified ?? true },
    create: {
      email: opts.email,
      username: opts.username,
      displayName: opts.displayName,
      passwordHash: opts.passwordHash,
      role: 'CREATOR',
      avatar: opts.avatar,
      isVerified: opts.isVerified ?? true,
      emailVerified: true,
      category: opts.category,
    },
  });
  await prisma.wallet.upsert({
    where: { userId: c.id },
    update: {},
    create: { userId: c.id, balance: 0 },
  });
  return c;
}

export async function seedFeed(prisma: PrismaClient, passwordHash: string) {
  // Stories
  const storyIds: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const sn = storyNames[i - 1];
    const c = await upsertCreator(prisma, {
      ...sn,
      avatar: `/images/creators/creator${i + 5 > 10 ? i : i + 5}.webp`,
      passwordHash,
    });
    storyIds.push(c.id);
  }
  await prisma.story.deleteMany({});
  for (let i = 0; i < storyIds.length; i++) {
    await prisma.story.create({
      data: {
        authorId: storyIds[i],
        mediaUrl: `${IMG}/story-bg-${i + 1}.webp`,
        mediaType: 'IMAGE',
        expiresAt: new Date(Date.now() + 86400000),
        viewCount: Math.floor(Math.random() * 500) + 100,
      },
    });
  }

  // Post creators
  const sarah = await upsertCreator(prisma, {
    email: 'olivia_hart@fansbook.com',
    username: 'olivia_hart',
    displayName: 'Olivia Hart',
    avatar: '/images/creators/creator8.webp',
    passwordHash,
  });
  const emlia = await upsertCreator(prisma, {
    email: 'chloe_reign@fansbook.com',
    username: 'chloe_reign',
    displayName: 'Chloe Reign',
    avatar: '/images/creators/creator9.webp',
    passwordHash,
    isVerified: false,
  });

  // Popular models
  for (let i = 1; i <= 7; i++) {
    await upsertCreator(prisma, {
      ...popularModelNames[i - 1],
      avatar: `/images/creators/creator${i}.webp`,
      passwordHash,
      category: 'Model',
    });
  }

  // Posts
  await prisma.postMedia.deleteMany({});
  await prisma.post.deleteMany({});
  const imagePost = await prisma.post.create({
    data: {
      authorId: sarah.id,
      text: 'Just dropped a new exclusive photo set for my subscribers! Thank you all for the amazing support on Fansbook. You guys make creating content so much fun 💕',
      visibility: 'PUBLIC',
      likeCount: 80,
      commentCount: 24,
      createdAt: new Date(Date.now() - 7200000),
    },
  });

  const media = [
    { url: `${IMG}/post-image-main.webp`, type: 'IMAGE' as const, order: 0 },
    { url: `${IMG}/post-image-right-top.webp`, type: 'IMAGE' as const, order: 1 },
    { url: `${IMG}/post-image-blur.webp`, type: 'IMAGE' as const, order: 2 },
  ];
  for (const m of media) {
    await prisma.postMedia.create({ data: { postId: imagePost.id, ...m } });
  }

  const videoPost = await prisma.post.create({
    data: {
      authorId: emlia.id,
      text: "Behind the scenes of today's shoot! Subscribe to see the full video. Going live tonight at 9 PM — don't miss it 🎥🔥",
      visibility: 'PUBLIC',
      likeCount: 80,
      commentCount: 24,
      createdAt: new Date(Date.now() - 7200000),
    },
  });
  await prisma.postMedia.create({
    data: {
      postId: videoPost.id,
      url: `${IMG}/video-thumbnail.webp`,
      type: 'VIDEO',
      order: 0,
      thumbnail: `${IMG}/video-thumbnail.webp`,
    },
  });
}
