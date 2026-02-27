import { PrismaClient } from '@prisma/client';

export async function seedNotifications(prisma: PrismaClient) {
  const fan = await prisma.user.findUnique({ where: { email: 'fan@test.com' } });
  if (!fan) return;

  await prisma.notification.deleteMany({ where: { userId: fan.id } });

  const actors = [
    { name: 'Jimmy Fox', avatar: '/images/creators/creator1.webp' },
    { name: 'Allen Sin', avatar: '/images/creators/creator2.webp' },
    { name: 'Kerry Zilly', avatar: '/images/creators/creator3.webp' },
    { name: 'Finny Pory', avatar: '/images/creators/creator4.webp' },
    { name: 'Binora Mell', avatar: '/images/creators/creator5.webp' },
    { name: 'Robert Zak', avatar: '/images/creators/creator6.webp' },
  ];

  const now = Date.now();
  const min = 60_000;

  const notifications = [
    { type: 'FOLLOW' as const, message: `${actors[0].name} Followed You`, read: false, offset: 3 },
    {
      type: 'COMMENT' as const,
      message: `${actors[1].name} commented on your post`,
      read: false,
      offset: 5,
    },
    { type: 'LIKE' as const, message: `${actors[2].name} Like Your Photo`, read: false, offset: 6 },
    {
      type: 'MENTION' as const,
      message: `${actors[3].name} mentioned you`,
      read: false,
      offset: 7,
    },
    {
      type: 'LIKE' as const,
      message: `${actors[4].name} like your comment`,
      read: false,
      offset: 8,
    },
    {
      type: 'SUBSCRIBE' as const,
      message: `${actors[5].name} Subscribed You`,
      read: false,
      offset: 9,
    },
  ];

  for (let i = 0; i < notifications.length; i++) {
    const n = notifications[i];
    await prisma.notification.create({
      data: {
        userId: fan.id,
        type: n.type,
        message: n.message,
        read: n.read,
        entityType: `avatar:${actors[i].avatar}|name:${actors[i].name}`,
        createdAt: new Date(now - n.offset * min),
      },
    });
  }
}
