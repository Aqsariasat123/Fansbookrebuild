import { startEmailWorker } from './email-worker.js';
import { startStoryExpiryWorker } from './story-expiry-worker.js';
import { startAuctionCloseWorker } from './auction-close-worker.js';
import { startToneLearningWorker } from './tone-learning-worker.js';
import { startVideoModerationWorker } from './video-moderation-worker.js';
import { startEscrowReleaseWorker } from './escrow-release-worker.js';
import { startAIClipsWorker } from './ai-clips-worker.js';
import { logger } from '../utils/logger.js';

export async function startWorkers() {
  startEmailWorker();
  startStoryExpiryWorker();
  startAuctionCloseWorker();
  startToneLearningWorker();
  startVideoModerationWorker();
  startEscrowReleaseWorker();
  await startAIClipsWorker();
  logger.info(
    'BullMQ workers started (email, story-expiry, auction-close, tone-learning, video-moderation, escrow-release, ai-clips)',
  );
}
