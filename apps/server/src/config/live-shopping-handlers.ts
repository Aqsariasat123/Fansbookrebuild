import type { Server, Socket } from 'socket.io';
import { prisma } from './database.js';
import { logger } from '../utils/logger.js';
import { registerAuctionHandlers } from './live-auction-handlers.js';

export function registerShoppingHandlers(io: Server, socket: Socket, userId: string) {
  socket.on('live:pin-item', async (data: { sessionId: string; itemId: string }) => {
    try {
      const session = await prisma.liveSession.findUnique({
        where: { id: data.sessionId },
        select: { creatorId: true },
      });
      if (!session || session.creatorId !== userId) return;
      const item = await prisma.marketplaceListing.findUnique({
        where: { id: data.itemId },
        select: { id: true, title: true, price: true, images: true, sellerId: true },
      });
      if (!item || item.sellerId !== userId) return;
      await prisma.liveSession.update({
        where: { id: data.sessionId },
        data: { pinnedItemId: data.itemId },
      });
      io.to(`live:${data.sessionId}`).emit('live:item-pinned', {
        item: { id: item.id, title: item.title, price: item.price, image: item.images[0] ?? null },
      });
    } catch (err) {
      logger.error({ err }, 'Error in live:pin-item');
    }
  });

  socket.on('live:unpin-item', async (data: { sessionId: string }) => {
    try {
      const session = await prisma.liveSession.findUnique({
        where: { id: data.sessionId },
        select: { creatorId: true },
      });
      if (!session || session.creatorId !== userId) return;
      await prisma.liveSession.update({
        where: { id: data.sessionId },
        data: { pinnedItemId: null },
      });
      io.to(`live:${data.sessionId}`).emit('live:item-unpinned', {});
    } catch (err) {
      logger.error({ err }, 'Error in live:unpin-item');
    }
  });

  registerAuctionHandlers(io, socket, userId);
}
