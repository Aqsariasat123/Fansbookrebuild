import { startEmailWorker } from './email-worker.js';
import { startStoryExpiryWorker } from './story-expiry-worker.js';
import { startAuctionCloseWorker } from './auction-close-worker.js';
import { logger } from '../utils/logger.js';

export function startWorkers() {
  startEmailWorker();
  startStoryExpiryWorker();
  startAuctionCloseWorker();
  logger.info('BullMQ workers started (email, story-expiry, auction-close)');
}
