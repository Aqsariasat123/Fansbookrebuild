import { PrismaClient } from '@prisma/client';

const IMG = '/icons/dashboard';

const storyNames = [
  { email: 'emma1@fansbook.com', username: 'emma_joens_1', displayName: 'Emma Joens' },
  { email: 'emma2@fansbook.com', username: 'emma_joens_2', displayName: 'Emma Joens' },
  { email: 'emma3@fansbook.com', username: 'emma_joens_3', displayName: 'Emma Joens' },
  { email: 'emma4@fansbook.com', username: 'emma_joens_4', displayName: 'Emma Joens' },
  { email: 'emma5@fansbook.com', username: 'emma_joens_5', displayName: 'Emma Joens' },
];

const popularModelNames = [
  { email: 'evilia1@fansbook.com', username: 'evilia_1', displayName: 'Evilia' },
  { email: 'evilia2@fansbook.com', username: 'evilia_2', displayName: 'Evilia' },
  { email: 'evilia3@fansbook.com', username: 'evilia_3', displayName: 'Evilia' },
  { email: 'evilia4@fansbook.com', username: 'evilia_4', displayName: 'Evilia' },
  { email: 'evilia5@fansbook.com', username: 'evilia_5', displayName: 'Evilia' },
  { email: 'evilia6@fansbook.com', username: 'evilia_6', displayName: 'Evilia' },
  { email: 'evilia7@fansbook.com', username: 'evilia_7', displayName: 'Evilia' },
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
      avatar: `${IMG}/story-avatar-${i}.webp`,
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
      avatar: `${IMG}/model-${i}.webp`,
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
