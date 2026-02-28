import { PrismaClient } from '@prisma/client';

const IMG = '/icons/dashboard';

const COMMENT_TEXTS = [
  'Absolutely stunning! 🔥',
  'You look amazing as always!',
  'Best content on Fansbook 💯',
  "Can't wait for more!",
  'This is incredible work',
  'Love this so much 😍',
  'You never disappoint!',
  'Goals!! 🙌',
  'Keep it up queen! 👑',
  'This made my day ❤️',
];

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
      commentCount: 7,
      offset: -5,
      media: [{ url: `${IMG}/post-image-main.webp`, type: 'IMAGE' as const, order: 0 }],
    },
    {
      text: 'Finally we did a romantic video \u{1F303}\u{1F90D}',
      visibility: 'PUBLIC' as const,
      likeCount: 128,
      commentCount: 9,
      offset: -10,
      media: [
        {
          url: '/videos/romantic.mp4',
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
      commentCount: 6,
      offset: -20,
      media: [],
    },
    {
      text: "Behind the scenes from yesterday's shoot. These are just for my amazing subscribers \u{1F495}",
      visibility: 'SUBSCRIBERS' as const,
      likeCount: 56,
      commentCount: 8,
      offset: -30,
      media: [{ url: `${IMG}/post-image-right-top.webp`, type: 'IMAGE' as const, order: 0 }],
    },
    {
      text: "Thank you for 1000 followers! Here's a special thank you post for everyone \u{1F389}",
      visibility: 'PUBLIC' as const,
      likeCount: 234,
      commentCount: 7,
      offset: -48,
      media: [{ url: `${IMG}/story-bg-2.webp`, type: 'IMAGE' as const, order: 0 }],
    },
  ];

  await prisma.comment.deleteMany({ where: { post: { authorId: creatorId } } });
  await prisma.postMedia.deleteMany({ where: { post: { authorId: creatorId } } });
  await prisma.post.deleteMany({ where: { authorId: creatorId } });

  // Get some commenter IDs (story creators)
  const commenters = await prisma.user.findMany({
    where: { role: 'CREATOR', id: { not: creatorId } },
    select: { id: true },
    take: 5,
  });
  const commenterIds = commenters.map((c) => c.id);

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

    // Seed real comments matching commentCount
    if (commenterIds.length > 0) {
      for (let i = 0; i < p.commentCount; i++) {
        await prisma.comment.create({
          data: {
            postId: post.id,
            authorId: commenterIds[i % commenterIds.length],
            text: COMMENT_TEXTS[i % COMMENT_TEXTS.length],
            createdAt: new Date(now + p.offset * hour + (i + 1) * 300000),
          },
        });
      }
    }
  }
}

export { seedCreatorTransactions, seedCreatorBookings } from './seed-creator-extras';
export { seedCreatorReferrals } from './seed-creator-referrals';
