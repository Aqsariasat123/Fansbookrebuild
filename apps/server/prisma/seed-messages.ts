import { PrismaClient } from '@prisma/client';

async function upsertUser(
  prisma: PrismaClient,
  data: {
    email: string;
    username: string;
    displayName: string;
    passwordHash: string;
    role: string;
    avatar?: string;
  },
) {
  const user = await prisma.user.upsert({
    where: { email: data.email },
    update: {},
    create: { ...data, emailVerified: true },
  });
  await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, balance: 0 },
  });
  return user;
}

async function createConv(
  prisma: PrismaClient,
  p1: string,
  p2: string,
  lastMsg: string,
  msgs: { senderId: string; text: string; offset: number }[],
) {
  const conv = await prisma.conversation.create({
    data: {
      participant1Id: p1,
      participant2Id: p2,
      lastMessage: lastMsg,
      lastMessageAt: new Date(),
    },
  });
  const now = Date.now();
  for (const m of msgs) {
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId: m.senderId,
        text: m.text,
        mediaType: 'TEXT',
        createdAt: new Date(now + m.offset * 60000),
      },
    });
  }
}

export async function seedMessages(prisma: PrismaClient, passwordHash: string) {
  const fan = await upsertUser(prisma, {
    email: 'fan@test.com',
    username: 'testfan',
    displayName: 'Test Fan',
    passwordHash,
    role: 'FAN',
  });
  const jimmy = await upsertUser(prisma, {
    email: 'jimmy_fox@fansbook.com',
    username: 'jimmy_fox',
    displayName: 'Jimmy Fox',
    passwordHash,
    role: 'CREATOR',
    avatar: '/images/creators/creator4.webp',
  });
  const sarah = await upsertUser(prisma, {
    email: 'sarah_jones@fansbook.com',
    username: 'sarah_jones',
    displayName: 'Sarah Jones',
    passwordHash,
    role: 'CREATOR',
    avatar: '/images/creators/creator1.webp',
  });
  const robert = await upsertUser(prisma, {
    email: 'robert_zak@fansbook.com',
    username: 'robert_zak',
    displayName: 'Robert Zak',
    passwordHash,
    role: 'CREATOR',
    avatar: '/images/creators/creator2.webp',
  });

  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});

  await createConv(
    prisma,
    fan.id,
    jimmy.id,
    'Maybe a behind-the-scenes look at my creative process?',
    [
      {
        senderId: jimmy.id,
        text: 'Hey! How are you doing? I saw your latest post, it was amazing! 🔥',
        offset: -5,
      },
      {
        senderId: fan.id,
        text: 'Thanks so much! I worked really hard on it. Glad you liked it 😊',
        offset: -4,
      },
      {
        senderId: jimmy.id,
        text: 'Seriously though, your content keeps getting better. Keep it up!',
        offset: -3,
      },
      {
        senderId: fan.id,
        text: 'That means a lot! Any suggestions for what I should post next?',
        offset: -2,
      },
      {
        senderId: fan.id,
        text: 'Maybe a behind-the-scenes look at my creative process?',
        offset: -1,
      },
    ],
  );

  await createConv(
    prisma,
    fan.id,
    sarah.id,
    "Can't wait to see it! Let me know if you need anything 💕",
    [
      { senderId: sarah.id, text: 'Hey there! Welcome to my page 💕', offset: -10 },
      {
        senderId: fan.id,
        text: 'Hi Sarah! I love your work, been following you for a while now',
        offset: -9,
      },
      {
        senderId: sarah.id,
        text: "That's so sweet! I have some exclusive content coming this week 🎉",
        offset: -8,
      },
      {
        senderId: fan.id,
        text: "Can't wait to see it! Let me know if you need anything 💕",
        offset: -7,
      },
    ],
  );

  await createConv(prisma, fan.id, robert.id, 'Sounds good, talk soon! 👊', [
    { senderId: robert.id, text: 'Yo! Thanks for subscribing to my channel 🙏', offset: -20 },
    {
      senderId: fan.id,
      text: 'No problem bro! Your fitness content is next level 💪',
      offset: -19,
    },
    {
      senderId: robert.id,
      text: "Appreciate that! I'm dropping a new workout series next Monday",
      offset: -18,
    },
    { senderId: fan.id, text: 'Sounds good, talk soon! 👊', offset: -17 },
  ]);
}
