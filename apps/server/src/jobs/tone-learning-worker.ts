import { Worker, type Job } from 'bullmq';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { updateToneProfile } from '../services/botService.js';
import { toneLearningQueue } from './queue.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
  };
}

async function processCreator(creatorId: string) {
  try {
    await updateToneProfile(creatorId);
  } catch (err) {
    logger.error({ err, creatorId }, 'Tone profile update failed for creator');
  }
}

export function startToneLearningWorker() {
  const worker = new Worker(
    'tone-learning',
    async (_job: Job) => {
      const creators = await prisma.user.findMany({
        where: {
          role: 'CREATOR',
          creatorBot: { suggestEnabled: true },
        },
        select: { id: true },
      });

      logger.info({ count: creators.length }, 'Tone learning job started');

      // Process max 3 at a time to avoid Claude API rate limits
      for (let i = 0; i < creators.length; i += 3) {
        const batch = creators.slice(i, i + 3);
        await Promise.all(batch.map((c) => processCreator(c.id)));
      }

      logger.info({ count: creators.length }, 'Tone learning job completed');
    },
    { connection: parseRedisUrl(REDIS_URL) },
  );

  worker.on('failed', (_job, err) => {
    logger.error({ err }, 'Tone learning job failed');
  });

  // Run every Sunday at 2am UTC
  toneLearningQueue.upsertJobScheduler(
    'weekly-tone-learning',
    { pattern: '0 2 * * 0' },
    { name: 'learn-creator-tones' },
  );

  return worker;
}
