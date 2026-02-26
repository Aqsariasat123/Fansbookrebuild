import { PrismaClient } from '@prisma/client';

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

function streamKey(prefix: string, id: string) {
  return `${prefix}_${id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function seedLiveSessions(prisma: PrismaClient, passwordHash: string) {
  const liveCreators = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    select: { id: true },
    take: 6,
  });
  const viewerCounts = [1300, 2250, 2210, 1300, 2250, 2210];
  const offsets = [30, 45, 20, 60, 15, 50];

  await prisma.liveSession.deleteMany({});

  for (let i = 0; i < liveCreators.length; i++) {
    await prisma.liveSession.create({
      data: {
        creatorId: liveCreators[i].id,
        title: "Let's talk - Ask Me Anything!",
        streamKey: streamKey('stream', liveCreators[i].id),
        status: 'LIVE',
        viewerCount: viewerCounts[i],
        startedAt: new Date(Date.now() - offsets[i] * 60 * 1000),
      },
    });
  }

  const upIds: string[] = [];
  for (const data of upcomingCreatorsData) {
    const c = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: { ...data, passwordHash, role: 'CREATOR', emailVerified: true },
    });
    upIds.push(c.id);
    await prisma.wallet.upsert({
      where: { userId: c.id },
      update: {},
      create: { userId: c.id, balance: 0, pendingBalance: 0, totalEarned: 0, totalSpent: 0 },
    });
  }

  const today = new Date();
  const times = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 30),
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 15),
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 0),
  ];
  const titles = ['Evening Chill Session', 'Art & Chat Night', 'Cosplay Q&A Live'];

  for (let i = 0; i < upIds.length; i++) {
    await prisma.liveSession.create({
      data: {
        creatorId: upIds[i],
        title: titles[i],
        streamKey: streamKey('upcoming', upIds[i]),
        status: 'SCHEDULED',
        viewerCount: 0,
        createdAt: times[i],
      },
    });
  }
}
