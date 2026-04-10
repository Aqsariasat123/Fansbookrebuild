import { Worker } from 'bullmq';
import { checkVideoModerationJob } from '../services/rekognitionService.js';
import { videoModerationQueue } from './queue.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const MAX_ATTEMPTS = 20; // 20 × 30s = 10 minutes max
const POLL_DELAY_MS = 30_000;

function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
  };
}

export function startVideoModerationWorker() {
  const worker = new Worker(
    'video-moderation',
    async (job) => {
      const { jobId, postMediaId, s3TempKey, attempt } = job.data as {
        jobId: string;
        postMediaId: string;
        s3TempKey: string;
        attempt: number;
      };

      const done = await checkVideoModerationJob(jobId, postMediaId, s3TempKey);

      if (!done) {
        if (attempt < MAX_ATTEMPTS) {
          await videoModerationQueue.add(
            'poll',
            { jobId, postMediaId, s3TempKey, attempt: attempt + 1 },
            { delay: POLL_DELAY_MS },
          );
        } else {
          await prisma.postMedia.update({
            where: { id: postMediaId },
            data: { moderationStatus: 'SKIPPED' },
          });
          logger.warn({ postMediaId, jobId }, 'Video moderation job timed out — marked SKIPPED');
        }
      }
    },
    { connection: parseRedisUrl(REDIS_URL) },
  );

  worker.on('failed', (job, err) =>
    logger.error({ err, jobId: job?.id }, 'Video moderation worker job failed'),
  );

  logger.info('Video moderation worker started');
}
