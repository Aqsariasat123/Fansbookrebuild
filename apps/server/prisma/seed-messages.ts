import { PrismaClient } from '@prisma/client';

export async function seedMessages(prisma: PrismaClient, passwordHash: string) {
  const testFan = await prisma.user.upsert({
    where: { email: 'fan@test.com' },
    update: {},
    create: {
      email: 'fan@test.com',
      username: 'testfan',
      displayName: 'Test Fan',
      passwordHash,
      role: 'FAN',
      emailVerified: true,
    },
  });
  await prisma.wallet.upsert({
    where: { userId: testFan.id },
    update: {},
    create: { userId: testFan.id, balance: 0 },
  });

  const jimmyFox = await prisma.user.upsert({
    where: { email: 'jimmy_fox@fansbook.com' },
    update: {},
    create: {
      email: 'jimmy_fox@fansbook.com',
      username: 'jimmy_fox',
      displayName: 'Jimmy Fox',
      passwordHash,
      role: 'CREATOR',
      avatar: '/images/creators/creator4.webp',
      emailVerified: true,
    },
  });
  await prisma.wallet.upsert({
    where: { userId: jimmyFox.id },
    update: {},
    create: { userId: jimmyFox.id, balance: 0 },
  });

  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});

  const conv = await prisma.conversation.create({
    data: {
      participant1Id: testFan.id,
      participant2Id: jimmyFox.id,
      lastMessage: 'Lorem Ipsum is simply dummy text.',
      lastMessageAt: new Date(),
    },
  });

  const now = Date.now();
  const msgs = [
    {
      senderId: jimmyFox.id,
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      offset: -5,
    },
    { senderId: testFan.id, text: 'Lorem Ipsum is simply dummy text.', offset: -4 },
    {
      senderId: jimmyFox.id,
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      offset: -3,
    },
    { senderId: testFan.id, text: 'Lorem Ipsum is simply dummy text.', offset: -2 },
    { senderId: testFan.id, text: 'Lorem Ipsum is simply dummy text.', offset: -1 },
  ];

  for (const m of msgs) {
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId: m.senderId,
        text: m.text,
        mediaType: 'TEXT',
        createdAt: new Date(now + m.offset * 60000),
        readAt: m.senderId === jimmyFox.id ? new Date() : null,
      },
    });
  }
}
