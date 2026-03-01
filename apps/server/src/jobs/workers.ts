import { startEmailWorker } from './email-worker.js';
import { startStoryExpiryWorker } from './story-expiry-worker.js';
import { logger } from '../utils/logger.js';

export function startWorkers() {
  startEmailWorker();
  startStoryExpiryWorker();
  logger.info('BullMQ workers started (email, story-expiry)');
}
