import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import jwt from 'jsonwebtoken';
import { redis, redisSub } from './redis.js';
import { prisma } from './database.js';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
import { registerChatHandlers } from './socket-handlers.js';
import { registerLiveHandlers } from './live-handlers.js';
import { registerCallHandlers } from './call-handlers.js';
import type { AuthPayload } from '../middleware/auth.js';

let io: Server | null = null;

const ONLINE_KEY = 'online_users';

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export function initSocketIO(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
  });

  io.adapter(createAdapter(redis, redisSub));

  // JWT authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) return next(new Error('Authentication required'));

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
      socket.data.userId = payload.userId;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.userId as string;
    logger.info({ userId, socketId: socket.id }, 'Socket connected');

    // Join personal room
    socket.join(`user:${userId}`);

    // Mark online
    await redis.sadd(ONLINE_KEY, userId);
    io!.emit('user:online', { userId });

    // Send full online users list to newly connected socket
    const onlineUserIds = await redis.smembers(ONLINE_KEY);
    socket.emit('user:online_list', { userIds: onlineUserIds });

    // Register event handlers
    registerChatHandlers(io!, socket);
    registerLiveHandlers(io!, socket);
    registerCallHandlers(io!, socket);

    socket.on('disconnect', async () => {
      logger.info({ userId, socketId: socket.id }, 'Socket disconnected');

      // Check if user has other connections
      const rooms = await io!.in(`user:${userId}`).fetchSockets();
      if (rooms.length === 0) {
        await redis.srem(ONLINE_KEY, userId);
        io!.emit('user:offline', { userId });

        // End any active/ringing calls for this user
        try {
          const activeCalls = await prisma.videoCall.findMany({
            where: {
              OR: [
                { callerId: userId, status: { in: ['ACTIVE', 'RINGING'] } },
                { calleeId: userId, status: { in: ['ACTIVE', 'RINGING'] } },
              ],
            },
          });
          for (const call of activeCalls) {
            const duration = call.startedAt
              ? Math.floor((Date.now() - call.startedAt.getTime()) / 1000)
              : 0;
            await prisma.videoCall.update({
              where: { id: call.id },
              data: { status: 'ENDED', endedAt: new Date(), duration },
            });
            const otherId = call.callerId === userId ? call.calleeId : call.callerId;
            io!.to(`user:${otherId}`).emit('call:ended', { callId: call.id });
            logger.info({ callId: call.id, otherId }, 'call:ended on disconnect');
          }
        } catch (err) {
          logger.error({ err }, 'Error ending calls on disconnect');
        }
      }
    });
  });

  logger.info('Socket.IO initialized with Redis adapter');
  return io;
}

export async function getOnlineUsers(): Promise<string[]> {
  return redis.smembers(ONLINE_KEY);
}
