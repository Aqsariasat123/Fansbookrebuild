import { Worker, type Job } from 'bullmq';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { storyExpiryQueue } from './queue.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
  };
}

export function startStoryExpiryWorker() {
  const worker = new Worker(
    'story-expiry',
    async (_job: Job) => {
      const result = await prisma.story.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      if (result.count > 0) {
        logger.info({ count: result.count }, 'Expired stories cleaned up');
      }
    },
    { connection: parseRedisUrl(REDIS_URL) },
  );

  worker.on('failed', (_job, err) => {
    logger.error({ err }, 'Story expiry job failed');
  });

  // Schedule repeating job every 15 minutes
  storyExpiryQueue.upsertJobScheduler(
    'story-cleanup',
    { every: 15 * 60 * 1000 },
    { name: 'cleanup-expired-stories' },
  );

  return worker;
}
