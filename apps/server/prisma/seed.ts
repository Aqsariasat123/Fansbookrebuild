import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  const defaultPasswordHash = await hashPassword('Password@123');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fansbook.com' },
    update: {},
    create: {
      email: 'admin@fansbook.com',
      username: 'admin',
      displayName: 'Fansbook Admin',
      passwordHash: await hashPassword('Admin@1234'),
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  // Create admin wallet
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalSpent: 0,
    },
  });

  // Create sample badges
  const badges = [
    {
      name: 'Early Adopter',
      description: 'Joined the platform during beta',
      icon: 'rocket',
      rarity: 'RARE' as const,
      category: 'SPECIAL' as const,
    },
    {
      name: 'First Post',
      description: 'Published your first post',
      icon: 'pencil',
      rarity: 'COMMON' as const,
      category: 'CONTENT' as const,
    },
    {
      name: 'Popular Creator',
      description: 'Reached 1000 followers',
      icon: 'star',
      rarity: 'EPIC' as const,
      category: 'SOCIAL' as const,
    },
    {
      name: 'Super Tipper',
      description: 'Sent over $500 in tips',
      icon: 'gem',
      rarity: 'LEGENDARY' as const,
      category: 'REVENUE' as const,
    },
    {
      name: 'Engaged Fan',
      description: 'Liked 100 posts',
      icon: 'heart',
      rarity: 'COMMON' as const,
      category: 'ENGAGEMENT' as const,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }

  // ─── Creator Profiles ────────────────────────────────────

  const creatorsData = [
    {
      email: 'miamokala@fansbook.com',
      username: 'miamokala',
      displayName: 'Miamokala',
      avatar: '/images/creators/creator1.webp',
      gender: 'FEMALE',
      country: 'United States',
      category: 'Artist',
      isVerified: true,
      statusText: 'Available now',
      bio: 'Digital artist and painter. Sharing my creative journey.',
      tierPrice: 17.67,
    },
    {
      email: 'kiasyap@fansbook.com',
      username: 'kiasyap',
      displayName: 'Kiasyap',
      avatar: '/images/creators/creator2.webp',
      gender: 'FEMALE',
      country: 'United Kingdom',
      category: 'Model',
      isVerified: false,
      statusText: 'Available for call',
      bio: 'Fashion model and lifestyle content creator.',
      tierPrice: 14.99,
    },
    {
      email: 'sappie@fansbook.com',
      username: 'sappie',
      displayName: 'Sappie',
      avatar: '/images/creators/creator3.webp',
      gender: 'FEMALE',
      country: 'Canada',
      category: 'Adult Creator',
      isVerified: true,
      statusText: "DM's open",
      bio: 'Exclusive content and personal chats.',
      tierPrice: 24.99,
    },
    {
      email: 'jourty@fansbook.com',
      username: 'jourty',
      displayName: 'Jourty',
      avatar: '/images/creators/creator4.webp',
      gender: 'MALE',
      country: 'Australia',
      category: 'Personal Trainer',
      isVerified: false,
      statusText: 'Available for custom videos.',
      bio: 'Fitness coach & nutrition expert. Custom workout plans.',
      tierPrice: 9.99,
    },
    {
      email: 'olicvia@fansbook.com',
      username: 'olicvia',
      displayName: 'Olicvia',
      avatar: '/images/creators/creator5.webp',
      gender: 'FEMALE',
      country: 'United States',
      category: 'Artist',
      isVerified: true,
      statusText: 'Available now',
      bio: 'Watercolor & illustration. Daily art posts.',
      tierPrice: 12.99,
    },
    {
      email: 'joneymeo@fansbook.com',
      username: 'joneymeo',
      displayName: 'Joneymeo',
      avatar: '/images/creators/creator6.webp',
      gender: 'MALE',
      country: 'United States',
      category: 'Comedian',
      isVerified: false,
      statusText: 'Send me a tip',
      bio: 'Stand-up clips & behind the scenes.',
      tierPrice: 7.99,
    },
    {
      email: 'alexfit@fansbook.com',
      username: 'alexfit',
      displayName: 'AlexFit',
      avatar: '/images/creators/creator7.webp',
      gender: 'MALE',
      country: 'Germany',
      category: 'Personal Trainer',
      isVerified: true,
      statusText: 'New content daily',
      bio: 'HIIT & bodyweight workouts. No gym needed.',
      tierPrice: 19.99,
    },
    {
      email: 'lunastyle@fansbook.com',
      username: 'lunastyle',
      displayName: 'LunaStyle',
      avatar: '/images/creators/creator8.webp',
      gender: 'FEMALE',
      country: 'United Kingdom',
      category: 'Model',
      isVerified: true,
      statusText: 'Booking shoots',
      bio: 'High fashion & editorial model.',
      tierPrice: 29.99,
    },
    {
      email: 'djmarcus@fansbook.com',
      username: 'djmarcus',
      displayName: 'DJ Marcus',
      avatar: '/images/creators/creator9.webp',
      gender: 'MALE',
      country: 'Canada',
      category: 'Musician',
      isVerified: false,
      statusText: 'Live sets every Friday',
      bio: 'Electronic music producer. Weekly mixes.',
      tierPrice: 11.99,
    },
    {
      email: 'chefmaria@fansbook.com',
      username: 'chefmaria',
      displayName: 'Chef Maria',
      avatar: '/images/creators/creator10.webp',
      gender: 'FEMALE',
      country: 'Australia',
      category: 'Chef',
      isVerified: true,
      statusText: 'New recipe dropping soon',
      bio: 'Mediterranean cuisine. Secret recipes & cooking tips.',
      tierPrice: 8.99,
    },
  ];

  for (const data of creatorsData) {
    const { tierPrice, ...userData } = data;

    const creator = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        gender: userData.gender,
        country: userData.country,
        category: userData.category,
        isVerified: userData.isVerified,
        statusText: userData.statusText,
      },
      create: {
        ...userData,
        passwordHash: defaultPasswordHash,
        role: 'CREATOR',
        emailVerified: true,
      },
    });

    // Create wallet
    await prisma.wallet.upsert({
      where: { userId: creator.id },
      update: {},
      create: {
        userId: creator.id,
        balance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalSpent: 0,
      },
    });

    // Create subscription tier
    const existingTier = await prisma.subscriptionTier.findFirst({
      where: { creatorId: creator.id },
    });

    if (!existingTier) {
      await prisma.subscriptionTier.create({
        data: {
          creatorId: creator.id,
          name: 'Basic',
          price: tierPrice,
          description: `Subscribe to ${userData.displayName} for exclusive content`,
          benefits: JSON.stringify(['Exclusive posts', 'Direct messages', 'Behind the scenes']),
          isActive: true,
        },
      });
    }
  }

  // Create some follow relationships for variety
  const allCreators = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    select: { id: true },
  });

  // Each creator follows some other creators (just for follower counts)
  for (let i = 0; i < allCreators.length; i++) {
    for (let j = i + 1; j < allCreators.length && j < i + 4; j++) {
      await prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: allCreators[i].id,
            followingId: allCreators[j].id,
          },
        },
        update: {},
        create: {
          followerId: allCreators[i].id,
          followingId: allCreators[j].id,
        },
      });
    }
  }

  // ─── Live Sessions (6 live + 3 upcoming) ─────────────────

  // Get creators for live sessions (reuse existing ones)
  const liveCreators = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    select: { id: true, username: true },
    take: 6,
  });

  const liveSessionsData = [
    {
      creatorId: liveCreators[0]?.id,
      title: "Let's talk - Ask Me Anything!",
      viewerCount: 1300,
      status: 'LIVE' as const,
      startedAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      creatorId: liveCreators[1]?.id,
      title: "Let's talk - Ask Me Anything!",
      viewerCount: 2250,
      status: 'LIVE' as const,
      startedAt: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      creatorId: liveCreators[2]?.id,
      title: "Let's talk - Ask Me Anything!",
      viewerCount: 2210,
      status: 'LIVE' as const,
      startedAt: new Date(Date.now() - 20 * 60 * 1000),
    },
    {
      creatorId: liveCreators[3]?.id,
      title: "Let's talk - Ask Me Anything!",
      viewerCount: 1300,
      status: 'LIVE' as const,
      startedAt: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      creatorId: liveCreators[4]?.id,
      title: "Let's talk - Ask Me Anything!",
      viewerCount: 2250,
      status: 'LIVE' as const,
      startedAt: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      creatorId: liveCreators[5]?.id,
      title: "Let's talk - Ask Me Anything!",
      viewerCount: 2210,
      status: 'LIVE' as const,
      startedAt: new Date(Date.now() - 50 * 60 * 1000),
    },
  ];

  // Create 3 creators for upcoming sessions
  const upcomingCreatorsData = [
    {
      email: 'sofialove@fansbook.com',
      username: 'SofiaLove',
      displayName: 'Sofia Love',
      avatar: '/images/creators/creator1.webp',
      gender: 'FEMALE',
      country: 'United States',
      category: 'Model',
    },
    {
      email: 'noriarose@fansbook.com',
      username: 'NoriaRose',
      displayName: 'Noria Rose',
      avatar: '/images/creators/creator2.webp',
      gender: 'FEMALE',
      country: 'United Kingdom',
      category: 'Artist',
    },
    {
      email: 'miracosplay@fansbook.com',
      username: 'MiraCosplay',
      displayName: 'Mira Cosplay',
      avatar: '/images/creators/creator3.webp',
      gender: 'FEMALE',
      country: 'Canada',
      category: 'Artist',
    },
  ];

  const upcomingCreatorIds: string[] = [];
  for (const data of upcomingCreatorsData) {
    const creator = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        passwordHash: defaultPasswordHash,
        role: 'CREATOR',
        emailVerified: true,
      },
    });
    upcomingCreatorIds.push(creator.id);

    await prisma.wallet.upsert({
      where: { userId: creator.id },
      update: {},
      create: {
        userId: creator.id,
        balance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalSpent: 0,
      },
    });
  }

  // Clear old live sessions to avoid duplicates on re-seed
  await prisma.liveSession.deleteMany({});

  // Create live sessions
  for (const session of liveSessionsData) {
    if (!session.creatorId) continue;
    await prisma.liveSession.create({
      data: {
        creatorId: session.creatorId,
        title: session.title,
        streamKey: `stream_${session.creatorId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        status: session.status,
        viewerCount: session.viewerCount,
        startedAt: session.startedAt,
      },
    });
  }

  // Scheduled times for upcoming lives (today at 6:30pm, 7:15pm, 9:00pm)
  const today = new Date();
  const scheduledTimes = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 30),
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 15),
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 0),
  ];

  const upcomingTitles = [
    'Evening Chill Session',
    'Art & Chat Night',
    'Cosplay Q&A Live',
  ];

  for (let i = 0; i < upcomingCreatorIds.length; i++) {
    await prisma.liveSession.create({
      data: {
        creatorId: upcomingCreatorIds[i],
        title: upcomingTitles[i],
        streamKey: `upcoming_${upcomingCreatorIds[i]}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        status: 'SCHEDULED',
        viewerCount: 0,
        createdAt: scheduledTimes[i],
      },
    });
  }

  // ─── Feed Demo Data (Figma exact) ───────────────────────

  const IMG = '/icons/dashboard';

  // Story creators (5 different creators) - rectangular images for Creators page
  const storyCreators: string[] = [];
  const storyNames = [
    { email: 'bella1@fansbook.com', username: 'bella_rose_1', displayName: 'Bella Rose' },
    { email: 'nina2@fansbook.com', username: 'nina_pearl_2', displayName: 'Nina Pearl' },
    { email: 'aria3@fansbook.com', username: 'aria_sky_3', displayName: 'Aria Sky' },
    { email: 'zara4@fansbook.com', username: 'zara_luxe_4', displayName: 'Zara Luxe' },
    { email: 'ivy5@fansbook.com', username: 'ivy_bloom_5', displayName: 'Ivy Bloom' },
  ];
  for (let i = 1; i <= 5; i++) {
    const sn = storyNames[i - 1];
    const c = await prisma.user.upsert({
      where: { email: sn.email },
      update: { avatar: `/images/creators/creator${i + 5 > 10 ? i : i + 5}.webp` },
      create: {
        email: sn.email,
        username: sn.username,
        displayName: sn.displayName,
        passwordHash: defaultPasswordHash,
        role: 'CREATOR',
        avatar: `/images/creators/creator${i + 5 > 10 ? i : i + 5}.webp`,
        isVerified: true,
        emailVerified: true,
      },
    });
    await prisma.wallet.upsert({
      where: { userId: c.id },
      update: {},
      create: { userId: c.id, balance: 0 },
    });
    storyCreators.push(c.id);
  }

  // Create stories
  await prisma.story.deleteMany({});
  for (let i = 0; i < storyCreators.length; i++) {
    await prisma.story.create({
      data: {
        authorId: storyCreators[i],
        mediaUrl: `${IMG}/story-bg-${i + 1}.webp`,
        mediaType: 'IMAGE',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        viewCount: Math.floor(Math.random() * 500) + 100,
      },
    });
  }

  // Olivia Hart - image post creator (rectangular avatar for Creators page)
  const sarah = await prisma.user.upsert({
    where: { email: 'olivia_hart@fansbook.com' },
    update: { avatar: '/images/creators/creator8.webp', isVerified: true },
    create: {
      email: 'olivia_hart@fansbook.com',
      username: 'olivia_hart',
      displayName: 'Olivia Hart',
      passwordHash: defaultPasswordHash,
      role: 'CREATOR',
      avatar: '/images/creators/creator8.webp',
      isVerified: true,
      emailVerified: true,
    },
  });
  await prisma.wallet.upsert({
    where: { userId: sarah.id },
    update: {},
    create: { userId: sarah.id, balance: 0 },
  });

  // Chloe Reign - video post creator (rectangular avatar for Creators page)
  const emlia = await prisma.user.upsert({
    where: { email: 'chloe_reign@fansbook.com' },
    update: { avatar: '/images/creators/creator9.webp' },
    create: {
      email: 'chloe_reign@fansbook.com',
      username: 'chloe_reign',
      displayName: 'Chloe Reign',
      passwordHash: defaultPasswordHash,
      role: 'CREATOR',
      avatar: '/images/creators/creator9.webp',
      isVerified: false,
      emailVerified: true,
    },
  });
  await prisma.wallet.upsert({
    where: { userId: emlia.id },
    update: {},
    create: { userId: emlia.id, balance: 0 },
  });

  // Popular models (7 unique names) - use rectangular creator images as avatar
  // (Popular Models feed section applies rounded-full via CSS)
  const popularModelNames = [
    { email: 'dani_nova@fansbook.com', username: 'dani_nova', displayName: 'Dani Nova' },
    { email: 'lexi_mae@fansbook.com', username: 'lexi_mae', displayName: 'Lexi Mae' },
    { email: 'ruby_voss@fansbook.com', username: 'ruby_voss', displayName: 'Ruby Voss' },
    { email: 'maya_quinn@fansbook.com', username: 'maya_quinn', displayName: 'Maya Quinn' },
    { email: 'tessa_lane@fansbook.com', username: 'tessa_lane', displayName: 'Tessa Lane' },
    { email: 'jade_fox@fansbook.com', username: 'jade_fox', displayName: 'Jade Fox' },
    { email: 'kira_blaze@fansbook.com', username: 'kira_blaze', displayName: 'Kira Blaze' },
  ];
  for (let i = 1; i <= 7; i++) {
    const pm = popularModelNames[i - 1];
    const m = await prisma.user.upsert({
      where: { email: pm.email },
      update: { avatar: `/images/creators/creator${i}.webp` },
      create: {
        email: pm.email,
        username: pm.username,
        displayName: pm.displayName,
        passwordHash: defaultPasswordHash,
        role: 'CREATOR',
        avatar: `/images/creators/creator${i}.webp`,
        isVerified: true,
        emailVerified: true,
        category: 'Model',
      },
    });
    await prisma.wallet.upsert({
      where: { userId: m.id },
      update: {},
      create: { userId: m.id, balance: 0 },
    });
  }

  // Delete old demo posts
  await prisma.postMedia.deleteMany({});
  await prisma.post.deleteMany({});

  // Image post by Olivia Hart
  const imagePost = await prisma.post.create({
    data: {
      authorId: sarah.id,
      text: "Just dropped a new exclusive photo set for my subscribers! Thank you all for the amazing support on Fansbook. You guys make creating content so much fun 💕",
      visibility: 'PUBLIC',
      likeCount: 80,
      commentCount: 24,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  });

  const imagePostMedia = [
    { url: `${IMG}/post-image-main.webp`, type: 'IMAGE' as const, order: 0 },
    { url: `${IMG}/post-image-right-top.webp`, type: 'IMAGE' as const, order: 1 },
    { url: `${IMG}/post-image-blur.webp`, type: 'IMAGE' as const, order: 2 },
  ];
  for (const m of imagePostMedia) {
    await prisma.postMedia.create({
      data: { postId: imagePost.id, url: m.url, type: m.type, order: m.order },
    });
  }

  // Video post by Chloe Reign
  const videoPost = await prisma.post.create({
    data: {
      authorId: emlia.id,
      text: "Behind the scenes of today's shoot! Subscribe to see the full video. Going live tonight at 9 PM — don't miss it 🎥🔥",
      visibility: 'PUBLIC',
      likeCount: 80,
      commentCount: 24,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
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

  // eslint-disable-next-line no-console
  console.log('Seed completed: all data + feed demo (stories, posts, popular models)');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
