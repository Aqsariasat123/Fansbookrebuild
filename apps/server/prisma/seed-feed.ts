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

const COMMENT_TEXTS = [
  'Absolutely stunning! 🔥',
  'You look amazing as always!',
  'Best content on Fansbook 💯',
  "Can't wait for more!",
  'This is incredible work',
  'Love this photo set so much 😍',
  'You never disappoint!',
  'Goals!! 🙌',
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

async function seedComments(prisma: PrismaClient, postIds: string[], authorIds: string[]) {
  let offset = 0;
  for (const postId of postIds) {
    for (let i = 0; i < 8; i++) {
      await prisma.comment.create({
        data: {
          postId,
          authorId: authorIds[i % authorIds.length],
          text: COMMENT_TEXTS[(offset + i) % COMMENT_TEXTS.length],
          createdAt: new Date(Date.now() - (8 - i) * 600000),
        },
      });
    }
    await prisma.post.update({ where: { id: postId }, data: { commentCount: 8 } });
    offset += 3;
  }
}

export async function seedFeed(prisma: PrismaClient, passwordHash: string) {
  const storyIds: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const c = await upsertCreator(prisma, {
      ...storyNames[i - 1],
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

  const sarah = await upsertCreator(prisma, {
    email: 'olivia_hart@fansbook.com',
    username: 'olivia_hart',
    displayName: 'Olivia Hart',
    avatar: '/images/creators/creator8.webp',
    passwordHash,
  });
  const chloe = await upsertCreator(prisma, {
    email: 'chloe_reign@fansbook.com',
    username: 'chloe_reign',
    displayName: 'Chloe Reign',
    avatar: '/images/creators/creator9.webp',
    passwordHash,
    isVerified: false,
  });
  for (let i = 1; i <= 7; i++) {
    await upsertCreator(prisma, {
      ...popularModelNames[i - 1],
      avatar: `${IMG}/model-${i}.webp`,
      passwordHash,
      category: 'Model',
    });
  }

  await prisma.postMedia.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.comment.deleteMany({});

  const imgPost1 = await prisma.post.create({
    data: {
      authorId: sarah.id,
      visibility: 'PUBLIC',
      likeCount: 80,
      commentCount: 8,
      text: 'Just dropped a new exclusive photo set for my subscribers! Thank you all for the amazing support on Fansbook. You guys make creating content so much fun 💕',
      createdAt: new Date(Date.now() - 7200000),
    },
  });
  const m1 = [
    `${IMG}/post-image-main.webp`,
    `${IMG}/post-image-right-top.webp`,
    `${IMG}/post-image-blur.webp`,
    `${IMG}/story-bg-1.webp`,
    `${IMG}/story-bg-2.webp`,
    `${IMG}/story-bg-3.webp`,
    `${IMG}/story-bg-4.webp`,
    `${IMG}/story-bg-5.webp`,
    '/images/creators/creator1.webp',
    '/images/creators/creator2.webp',
  ];
  for (let i = 0; i < m1.length; i++) {
    await prisma.postMedia.create({
      data: { postId: imgPost1.id, url: m1[i], type: 'IMAGE', order: i },
    });
  }

  const imgPost2 = await prisma.post.create({
    data: {
      authorId: chloe.id,
      visibility: 'PUBLIC',
      likeCount: 156,
      commentCount: 8,
      text: 'New week, new vibes! Which look is your favorite? Let me know in the comments 💋',
      createdAt: new Date(Date.now() - 3600000),
    },
  });
  const m2 = [
    '/images/creators/creator3.webp',
    '/images/creators/creator4.webp',
    '/images/creators/creator5.webp',
    '/images/creators/creator6.webp',
    '/images/creators/creator7.webp',
  ];
  for (let i = 0; i < m2.length; i++) {
    await prisma.postMedia.create({
      data: { postId: imgPost2.id, url: m2[i], type: 'IMAGE', order: i },
    });
  }

  const vidPost1 = await prisma.post.create({
    data: {
      authorId: chloe.id,
      visibility: 'PUBLIC',
      likeCount: 80,
      commentCount: 8,
      text: "Behind the scenes of today's shoot! Subscribe to see the full video. Going live tonight at 9 PM — don't miss it 🎥🔥",
      createdAt: new Date(Date.now() - 7200000),
    },
  });
  await prisma.postMedia.create({
    data: {
      postId: vidPost1.id,
      url: '/videos/sample-1.mp4',
      type: 'VIDEO',
      order: 0,
      thumbnail: `${IMG}/video-thumbnail.webp`,
    },
  });

  const vidPost2 = await prisma.post.create({
    data: {
      authorId: sarah.id,
      visibility: 'PUBLIC',
      likeCount: 210,
      commentCount: 8,
      text: 'Sneak peek of the new content dropping this weekend! Stay tuned 🔥✨',
      createdAt: new Date(Date.now() - 5400000),
    },
  });
  await prisma.postMedia.create({
    data: {
      postId: vidPost2.id,
      url: '/videos/sample-2.mp4',
      type: 'VIDEO',
      order: 0,
      thumbnail: `${IMG}/story-bg-3.webp`,
    },
  });

  const commenters = [sarah.id, chloe.id, ...storyIds.slice(0, 3)];
  await seedComments(prisma, [imgPost1.id, imgPost2.id, vidPost1.id, vidPost2.id], commenters);
}
