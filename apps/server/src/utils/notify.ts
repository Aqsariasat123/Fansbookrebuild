import { prisma } from '../config/database.js';
import { logger } from './logger.js';
import type { Server } from 'socket.io';
import type { NotificationType } from '@prisma/client';

/** Holder for IO instance — set from index.ts after init */
let ioInstance: Server | null = null;

export function setNotifyIO(io: Server) {
  ioInstance = io;
}

interface NotifyParams {
  userId: string;
  type: NotificationType;
  actorId?: string;
  entityId?: string;
  message: string;
}

export async function createNotification(params: NotifyParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        actorId: params.actorId ?? null,
        entityId: params.entityId ?? null,
        message: params.message,
      },
    });

    // Push via Socket.IO if available
    if (ioInstance) {
      ioInstance.to(`user:${params.userId}`).emit('notification:new', notification);
    }

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
