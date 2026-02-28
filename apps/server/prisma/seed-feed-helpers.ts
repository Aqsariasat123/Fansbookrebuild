import { PrismaClient } from '@prisma/client';

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

export async function upsertCreator(
  prisma: PrismaClient,
  opts: {
    email: string;
    username: string;
    displayName: string;
    avatar: string;
    passwordHash: string;
    isVerified?: boolean;
    category?: string;
    cover?: string;
    bio?: string;
  },
) {
  const c = await prisma.user.upsert({
    where: { email: opts.email },
    update: {
      avatar: opts.avatar,
      isVerified: opts.isVerified ?? true,
      cover: opts.cover,
      bio: opts.bio,
    },
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
      cover: opts.cover,
      bio: opts.bio,
    },
  });
  await prisma.wallet.upsert({
    where: { userId: c.id },
    update: {},
    create: { userId: c.id, balance: 0 },
  });
  return c;
}

export async function seedComments(prisma: PrismaClient, postIds: string[], authorIds: string[]) {
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

export async function seedSubscriptionTiers(
  prisma: PrismaClient,
  creators: { id: string; name: string; price: number }[],
) {
  for (const creator of creators) {
    const existing = await prisma.subscriptionTier.findFirst({ where: { creatorId: creator.id } });
    if (!existing) {
      await prisma.subscriptionTier.create({
        data: {
          creatorId: creator.id,
          name: 'Basic',
          price: creator.price,
          description: `Here you can place additional information about your package`,
          benefits: JSON.stringify([
            'Public posts only',
            'Occasional behind-the-scenes content',
            'Behind the scene Content',
          ]),
          isActive: true,
        },
      });
      await prisma.subscriptionTier.create({
        data: {
          creatorId: creator.id,
          name: 'Premium',
          price: creator.price + 10,
          description: `Here you can place additional information about your package`,
          benefits: JSON.stringify([
            'Public posts only',
            'Full Length Cooking Toturials',
            'Private Chat With me',
          ]),
          isActive: true,
        },
      });
      await prisma.subscriptionTier.create({
        data: {
          creatorId: creator.id,
          name: 'VIP',
          price: creator.price + 30,
          description: `Here you can place additional information about your package`,
          benefits: JSON.stringify([
            'Public posts only',
            'One-to-one Video Stream',
            'Access to private live stream',
          ]),
          isActive: true,
        },
      });
    }
  }
}
