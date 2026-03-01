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
      startWorkers();
    } catch (err) {
      logger.warn({ err }, 'Redis unavailable — running without Socket.IO');
    }

    try {
      await initMediasoup();
    } catch (err) {
      logger.warn({ err }, 'mediasoup unavailable — live streaming disabled');
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
