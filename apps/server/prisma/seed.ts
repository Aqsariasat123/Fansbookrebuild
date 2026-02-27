import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { seedCreators } from './seed-creators.js';
import { seedLiveSessions } from './seed-live.js';
import { seedFeed } from './seed-feed.js';
import { seedMessages } from './seed-messages.js';
import { seedWallet } from './seed-wallet.js';
import { seedFollows } from './seed-follows.js';
import { seedNotifications } from './seed-notifications.js';
import { seedSupport } from './seed-support.js';
import { seedCreatorData } from './seed-creator-data.js';

const prisma = new PrismaClient();

async function main() {
  const defaultPasswordHash = await bcrypt.hash('Password@123', 12);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fansbook.com' },
    update: {},
    create: {
      email: 'admin@fansbook.com',
      username: 'admin',
      displayName: 'Fansbook Admin',
      passwordHash: await bcrypt.hash('Admin@1234', 12),
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, balance: 0, pendingBalance: 0, totalEarned: 0, totalSpent: 0 },
  });

  // Badges
  const badges = [
    {
      name: 'Early Adopter',
      description: 'Joined during beta',
      icon: 'rocket',
      rarity: 'RARE' as const,
      category: 'SPECIAL' as const,
    },
    {
      name: 'First Post',
      description: 'Published first post',
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
    await prisma.badge.upsert({ where: { name: badge.name }, update: {}, create: badge });
  }

  await seedCreators(prisma, defaultPasswordHash);
  await seedLiveSessions(prisma, defaultPasswordHash);
  await seedFeed(prisma, defaultPasswordHash);
  await seedMessages(prisma, await bcrypt.hash('Test12345', 12));
  await seedWallet(prisma);
  await seedFollows(prisma, await bcrypt.hash('Test12345', 12));
  await seedNotifications(prisma);
  await seedSupport();
  await seedCreatorData(prisma, await bcrypt.hash('Creator12345', 12));

  // eslint-disable-next-line no-console
  console.log('Seed completed successfully');
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
