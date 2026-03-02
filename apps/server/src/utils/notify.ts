import { prisma } from '../config/database.js';
import { logger } from './logger.js';
import { queueEmail } from './email.js';
import { notificationEmailTemplate } from './email-templates.js';
import { sendPushNotification } from '../config/web-push.js';
import type { Server } from 'socket.io';
import type { NotificationType } from '@prisma/client';

let ioInstance: Server | null = null;

export function setNotifyIO(io: Server) {
  ioInstance = io;
}

interface NotifyParams {
  userId: string;
  type: NotificationType;
  actorId?: string;
  entityId?: string;
  entityType?: string;
  message: string;
}

async function getUserPref(userId: string, type: NotificationType) {
  const pref = await prisma.notificationPreference.findUnique({
    where: { userId_type: { userId, type } },
  });
  return { inApp: pref?.inApp ?? true, email: pref?.email ?? false };
}

async function writeAndEmit(params: NotifyParams) {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      actorId: params.actorId ?? null,
      entityId: params.entityId ?? null,
      entityType: params.entityType ?? null,
      message: params.message,
    },
  });
  if (ioInstance) {
    ioInstance.to(`user:${params.userId}`).emit('notification:new', notification);
  }
  return notification;
}

async function sendNotifEmail(userId: string, type: string, message: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user?.email) return;
  const { subject, html } = notificationEmailTemplate(type, message);
  queueEmail(user.email, subject, html);
}

async function sendWebPush(userId: string, type: string, message: string) {
  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });
  if (subs.length === 0) return;

  const payload = { title: 'Fansbook', body: message, tag: type, url: '/' };
  const expiredIds: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      const ok = await sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      );
      if (!ok) expiredIds.push(sub.id);
    }),
  );

  if (expiredIds.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { id: { in: expiredIds } } });
  }
}

async function tryGroupNotification(params: NotifyParams): Promise<boolean> {
  if (!params.entityId) return false;

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const existing = await prisma.notification.findFirst({
    where: {
      userId: params.userId,
      type: params.type,
      entityId: params.entityId,
      read: false,
      createdAt: { gte: oneHourAgo },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (!existing) return false;

  const othersMatch = existing.message.match(/ and (\d+) others?$/);
  const currentCount = othersMatch ? parseInt(othersMatch[1]) : 0;
  const newCount = currentCount + 1;

  let baseMessage = existing.message;
  if (othersMatch) {
    baseMessage = baseMessage.replace(/ and \d+ others?$/, '');
  }
  const suffix = newCount === 1 ? ' and 1 other' : ` and ${newCount} others`;
  const groupedMessage = baseMessage + suffix;

  const updated = await prisma.notification.update({
    where: { id: existing.id },
    data: { message: groupedMessage, createdAt: new Date() },
  });

  if (ioInstance) {
    ioInstance.to(`user:${params.userId}`).emit('notification:updated', updated);
  }
  return true;
}

export async function createNotification(params: NotifyParams) {
  try {
    const pref = await getUserPref(params.userId, params.type);

    if (pref.inApp) {
      const grouped = await tryGroupNotification(params);
      if (!grouped) await writeAndEmit(params);
    }

    if (pref.email) await sendNotifEmail(params.userId, params.type, params.message);
    // Web push — fire-and-forget, runs for all notification types
    sendWebPush(params.userId, params.type, params.message).catch((err) => {
      logger.error({ err }, 'Web push delivery failed');
    });
    return null;
  } catch (err) {
    logger.error({ err }, 'Failed to create notification');
    return null;
  }
}

/** Emit an event to a specific user's room (no DB write) */
export function emitToUser(userId: string, event: string, data: unknown) {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, data);
  }
}
