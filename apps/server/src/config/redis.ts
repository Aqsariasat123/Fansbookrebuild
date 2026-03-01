import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 5) return null;
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

export const redisSub = redis.duplicate();

redis.on('error', (err) => logger.error({ err }, 'Redis connection error'));
redis.on('connect', () => logger.info('Redis connected'));

export async function connectRedis() {
  await redis.connect();
  await redisSub.connect();
}

export async function disconnectRedis() {
  await redis.quit().catch(() => {});
  await redisSub.quit().catch(() => {});
}
