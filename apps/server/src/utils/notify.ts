import { prisma } from '../config/database.js';
import { logger } from './logger.js';
import { queueEmail } from './email.js';
import { notificationEmailTemplate } from './email-templates.js';
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

export async function createNotification(params: NotifyParams) {
  try {
    const pref = await getUserPref(params.userId, params.type);
    const notification = pref.inApp ? await writeAndEmit(params) : null;
    if (pref.email) await sendNotifEmail(params.userId, params.type, params.message);
    return notification;
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
