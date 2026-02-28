import { PrismaClient } from '@prisma/client';

const COVERS = [
  '/icons/dashboard/story-bg-1.webp',
  '/icons/dashboard/story-bg-2.webp',
  '/icons/dashboard/story-bg-3.webp',
  '/icons/dashboard/story-bg-4.webp',
  '/icons/dashboard/story-bg-5.webp',
];

const creatorsData = [
  {
    email: 'miamokala@fansbook.com',
    username: 'miamokala',
    displayName: 'Miamokala',
    avatar: '/images/creators/creator1.webp',
    cover: COVERS[0],
    gender: 'FEMALE',
    country: 'United States',
    category: 'Artist',
    isVerified: true,
    statusText: 'Available now',
    bio: 'Digital artist and painter.',
    tierPrice: 17.67,
  },
  {
    email: 'kiasyap@fansbook.com',
    username: 'kiasyap',
    displayName: 'Kiasyap',
    avatar: '/images/creators/creator2.webp',
    cover: COVERS[1],
    gender: 'FEMALE',
    country: 'United Kingdom',
    category: 'Model',
    isVerified: false,
    statusText: 'Available for call',
    bio: 'Fashion model.',
    tierPrice: 14.99,
  },
  {
    email: 'sappie@fansbook.com',
    username: 'sappie',
    displayName: 'Sappie',
    avatar: '/images/creators/creator3.webp',
    cover: COVERS[2],
    gender: 'FEMALE',
    country: 'Canada',
    category: 'Adult Creator',
    isVerified: true,
    statusText: "DM's open",
    bio: 'Exclusive content.',
    tierPrice: 24.99,
  },
  {
    email: 'jourty@fansbook.com',
    username: 'jourty',
    displayName: 'Jourty',
    avatar: '/images/creators/creator4.webp',
    cover: COVERS[3],
    gender: 'MALE',
    country: 'Australia',
    category: 'Personal Trainer',
    isVerified: false,
    statusText: 'Available for custom videos.',
    bio: 'Fitness coach.',
    tierPrice: 9.99,
  },
  {
    email: 'olicvia@fansbook.com',
    username: 'olicvia',
    displayName: 'Olicvia',
    avatar: '/images/creators/creator5.webp',
    cover: COVERS[4],
    gender: 'FEMALE',
    country: 'United States',
    category: 'Artist',
    isVerified: true,
    statusText: 'Available now',
    bio: 'Watercolor & illustration.',
    tierPrice: 12.99,
  },
  {
    email: 'joneymeo@fansbook.com',
    username: 'joneymeo',
    displayName: 'Joneymeo',
    avatar: '/images/creators/creator6.webp',
    cover: COVERS[0],
    gender: 'MALE',
    country: 'United States',
    category: 'Comedian',
    isVerified: false,
    statusText: 'Send me a tip',
    bio: 'Stand-up clips.',
    tierPrice: 7.99,
  },
  {
    email: 'alexfit@fansbook.com',
    username: 'alexfit',
    displayName: 'AlexFit',
    avatar: '/images/creators/creator7.webp',
    cover: COVERS[1],
    gender: 'MALE',
    country: 'Germany',
    category: 'Personal Trainer',
    isVerified: true,
    statusText: 'New content daily',
    bio: 'HIIT workouts.',
    tierPrice: 19.99,
  },
  {
    email: 'lunastyle@fansbook.com',
    username: 'lunastyle',
    displayName: 'LunaStyle',
    avatar: '/images/creators/creator8.webp',
    cover: COVERS[2],
    gender: 'FEMALE',
    country: 'United Kingdom',
    category: 'Model',
    isVerified: true,
    statusText: 'Booking shoots',
    bio: 'High fashion model.',
    tierPrice: 29.99,
  },
  {
    email: 'djmarcus@fansbook.com',
    username: 'djmarcus',
    displayName: 'DJ Marcus',
    avatar: '/images/creators/creator9.webp',
    cover: COVERS[3],
    gender: 'MALE',
    country: 'Canada',
    category: 'Musician',
    isVerified: false,
    statusText: 'Live sets every Friday',
    bio: 'Electronic music producer.',
    tierPrice: 11.99,
  },
  {
    email: 'chefmaria@fansbook.com',
    username: 'chefmaria',
    displayName: 'Chef Maria',
    avatar: '/images/creators/creator10.webp',
    cover: COVERS[4],
    gender: 'FEMALE',
    country: 'Australia',
    category: 'Chef',
    isVerified: true,
    statusText: 'New recipe dropping soon',
    bio: 'Mediterranean cuisine.',
    tierPrice: 8.99,
  },
];

export async function seedCreators(prisma: PrismaClient, passwordHash: string) {
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
        cover: userData.cover,
        bio: userData.bio,
      },
      create: { ...userData, passwordHash, role: 'CREATOR', emailVerified: true },
    });
    await prisma.wallet.upsert({
      where: { userId: creator.id },
      update: {},
      create: { userId: creator.id, balance: 0, pendingBalance: 0, totalEarned: 0, totalSpent: 0 },
    });
    const existing = await prisma.subscriptionTier.findFirst({ where: { creatorId: creator.id } });
    if (!existing) {
      await prisma.subscriptionTier.create({
        data: {
          creatorId: creator.id,
          name: 'Basic',
          price: tierPrice,
          description: `Subscribe to ${userData.displayName}`,
          benefits: JSON.stringify(['Exclusive posts', 'Direct messages', 'Behind the scenes']),
          isActive: true,
        },
      });
    }
  }

  // Follow relationships
  const all = await prisma.user.findMany({ where: { role: 'CREATOR' }, select: { id: true } });
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length && j < i + 4; j++) {
      await prisma.follow.upsert({
        where: { followerId_followingId: { followerId: all[i].id, followingId: all[j].id } },
        update: {},
        create: { followerId: all[i].id, followingId: all[j].id },
      });
    }
  }
}
