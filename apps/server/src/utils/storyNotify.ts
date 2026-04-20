import { prisma } from '../config/database.js';

export async function createStoryNotification(
  ownerId: string,
  actorId: string,
  storyId: string,
  message: string,
) {
  const actor = await prisma.user.findUnique({
    where: { id: actorId },
    select: { displayName: true, username: true, avatar: true },
  });
  const name = actor?.displayName || actor?.username || 'Someone';
  await prisma.notification.create({
    data: {
      userId: ownerId,
      type: 'STORY',
      actorId,
      entityId: storyId,
      entityType: `avatar:${actor?.avatar || ''}`,
      message: message.replace('{name}', name),
    },
  });
}
