import { Worker, type Job } from 'bullmq';
import { sendEmail } from '../utils/email.js';
import { logger } from '../utils/logger.js';

interface EmailJob {
  to: string;
  subject: string;
  html: string;
}

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password || undefined,
  };
}

export function startEmailWorker() {
  const worker = new Worker<EmailJob>(
    'email',
    async (job: Job<EmailJob>) => {
      const { to, subject, html } = job.data;
      const success = await sendEmail(to, subject, html);
      if (!success) throw new Error(`Failed to send email to ${to}`);
    },
    { connection: parseRedisUrl(REDIS_URL), concurrency: 5 },
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Email job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Email job failed');
  });

  return worker;
}
