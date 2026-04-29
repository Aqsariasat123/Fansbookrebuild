import 'dotenv/config';
import http from 'http';
import { initSentry } from './config/sentry.js';
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma } from './config/database.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { initSocketIO } from './config/socket.js';
import { setNotifyIO } from './utils/notify.js';
import { startWorkers } from './jobs/workers.js';
import { initMediasoup } from './config/mediasoup.js';

initSentry();

const server = http.createServer(app);

async function main() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    try {
      await connectRedis();
      const io = initSocketIO(server);
      setNotifyIO(io);
      await startWorkers();
    } catch (err) {
      logger.warn({ err }, 'Redis unavailable — running without Socket.IO');
    }

    try {
      await initMediasoup();
    } catch (err) {
      logger.warn({ err }, 'mediasoup unavailable — live streaming disabled');
    }

    // On startup, mark any stale LIVE sessions as ENDED (mediasoup state is lost on restart)
    const stale = await prisma.liveSession.updateMany({
      where: { status: 'LIVE' },
      data: { status: 'ENDED', endedAt: new Date() },
    });
    if (stale.count > 0) {
      logger.info({ count: stale.count }, 'Cleaned up stale LIVE sessions on startup');
    }

    // Story cleanup cron — every hour, delete expired stories + views
    setInterval(
      async () => {
        try {
          const deleted = await prisma.story.deleteMany({
            where: { expiresAt: { lt: new Date() } },
          });
          if (deleted.count > 0) {
            logger.info({ count: deleted.count }, 'Cleaned up expired stories');
          }
        } catch (err) {
          logger.error({ err }, 'Story cleanup failed');
        }
      },
      60 * 60 * 1000,
    );

    // Support chat cleanup — daily, delete tickets+messages older than 7 days (resolved) or 30 days (any)
    setInterval(
      async () => {
        try {
          const cutoff7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const cutoff30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          const old = await prisma.supportTicket.findMany({
            where: {
              OR: [
                { status: 'RESOLVED', updatedAt: { lt: cutoff7d } },
                { updatedAt: { lt: cutoff30d } },
              ],
            },
            select: { id: true },
          });
          if (old.length > 0) {
            const ids = old.map((t) => t.id);
            await prisma.supportMessage.deleteMany({ where: { ticketId: { in: ids } } });
            await prisma.supportTicket.deleteMany({ where: { id: { in: ids } } });
            logger.info({ count: old.length }, 'Cleaned up old support tickets');
          }
        } catch (err) {
          logger.error({ err }, 'Support ticket cleanup failed');
        }
      },
      24 * 60 * 60 * 1000,
    );

    server.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

main();

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down...');
  server.close();
  await disconnectRedis().catch(() => {});
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
