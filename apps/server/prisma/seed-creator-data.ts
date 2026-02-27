import { PrismaClient } from '@prisma/client';
import {
  seedCreatorTiers,
  seedCreatorPosts,
  seedCreatorTransactions,
  seedCreatorBookings,
  seedCreatorReferrals,
} from './seed-creator-helpers.js';

const IMG = '/icons/dashboard';

export async function seedCreatorData(prisma: PrismaClient, passwordHash: string) {
  try {
    // ─── 1. Upsert testcreator user ───────────────────────
    const creator = await prisma.user.upsert({
      where: { email: 'creator@test.com' },
      update: {
        displayName: 'Sarah Creative',
        role: 'CREATOR',
        isVerified: true,
        bio: 'Professional content creator | \u{1F3A8} Art & Lifestyle | Subscribe for exclusive content',
        location: 'Los Angeles, CA',
        category: 'Model',
        gender: 'Female',
        country: 'US',
        aboutMe:
          "Hey there! I'm Sarah, a professional content creator specializing in lifestyle, fashion, and art photography. Subscribe to get access to my exclusive behind-the-scenes content!",
        referralCode: 'SARAH2024',
        avatar: `${IMG}/user-avatar-olivia.webp`,
        cover: `${IMG}/story-bg-1.webp`,
        profileType: 'Premium',
        region: 'North America',
        emailVerified: true,
        firstName: 'Sarah',
        lastName: 'Creative',
        socialLinks: JSON.stringify([
          { platform: 'Instagram', url: 'https://instagram.com/sarahcreative' },
          { platform: 'Twitter', url: 'https://twitter.com/sarahcreative' },
        ]),
        blockedCountries: JSON.stringify([]),
      },
      create: {
        email: 'creator@test.com',
        username: 'testcreator',
        displayName: 'Sarah Creative',
        passwordHash,
        role: 'CREATOR',
        isVerified: true,
        bio: 'Professional content creator | \u{1F3A8} Art & Lifestyle | Subscribe for exclusive content',
        location: 'Los Angeles, CA',
        category: 'Model',
        gender: 'Female',
        country: 'US',
        aboutMe:
          "Hey there! I'm Sarah, a professional content creator specializing in lifestyle, fashion, and art photography. Subscribe to get access to my exclusive behind-the-scenes content!",
        referralCode: 'SARAH2024',
        avatar: `${IMG}/user-avatar-olivia.webp`,
        cover: `${IMG}/story-bg-1.webp`,
        profileType: 'Premium',
        region: 'North America',
        emailVerified: true,
        firstName: 'Sarah',
        lastName: 'Creative',
        socialLinks: JSON.stringify([
          { platform: 'Instagram', url: 'https://instagram.com/sarahcreative' },
          { platform: 'Twitter', url: 'https://twitter.com/sarahcreative' },
        ]),
        blockedCountries: JSON.stringify([]),
      },
    });

    // ─── 2. Create wallet for testcreator ─────────────────
    const wallet = await prisma.wallet.upsert({
      where: { userId: creator.id },
      update: { balance: 2450.0, pendingBalance: 350.0, totalEarned: 8750.0, totalSpent: 0 },
      create: {
        userId: creator.id,
        balance: 2450.0,
        pendingBalance: 350.0,
        totalEarned: 8750.0,
        totalSpent: 0,
      },
    });

    // ─── 3-8. Seed related data via helpers ───────────────
    await seedCreatorTiers(prisma, creator.id);
    await seedCreatorPosts(prisma, creator.id);
    await seedCreatorTransactions(prisma, wallet.id);

    // Withdrawals
    await prisma.withdrawal.deleteMany({ where: { creatorId: creator.id } });
    const now = Date.now();
    const day = 86400000;
    await prisma.withdrawal.create({
      data: {
        creatorId: creator.id,
        amount: 500,
        paymentMethod: 'Bank Transfer',
        status: 'COMPLETED',
        processedAt: new Date(now - 7 * day),
        createdAt: new Date(now - 10 * day),
      },
    });
    await prisma.withdrawal.create({
      data: {
        creatorId: creator.id,
        amount: 200,
        paymentMethod: 'Bank Transfer',
        status: 'PENDING',
        createdAt: new Date(now - 2 * day),
      },
    });
    await prisma.withdrawal.create({
      data: {
        creatorId: creator.id,
        amount: 350,
        paymentMethod: 'PayPal',
        status: 'PROCESSING',
        createdAt: new Date(now - 1 * day),
      },
    });

    await seedCreatorBookings(prisma, creator.id);
    await seedCreatorReferrals(prisma, creator.id, passwordHash);

    // eslint-disable-next-line no-console
    console.log('Creator seed data completed: testcreator (creator@test.com)');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error seeding creator data:', error);
    throw error;
  }
}
