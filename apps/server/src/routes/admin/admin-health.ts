import { Router } from 'express';
import { prisma } from '../../config/database.js';
import os from 'os';

const router = Router();

// GET /api/admin/health — detailed system health
router.get('/', async (_req, res, next) => {
  try {
    const uptime = process.uptime();
    const mem = process.memoryUsage();
    const cpus = os.cpus();
    const loadAvg = os.loadavg();

    // Database check
    let dbOk = false;
    let dbLatency = 0;
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - start;
      dbOk = true;
    } catch {
      dbOk = false;
    }

    // Redis check (optional — wrap in try/catch)
    let redisOk = false;
    try {
      const { default: Redis } = await import('ioredis');
      const redis = new Redis({ lazyConnect: true, connectTimeout: 2000 });
      await redis.ping();
      redisOk = true;
      await redis.quit();
    } catch {
      redisOk = false;
    }

    // Quick DB stats
    const [userCount, postCount, activeSessionCount] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.session.count({
        where: { lastActive: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        status: dbOk ? 'healthy' : 'degraded',
        uptime: Math.floor(uptime),
        memory: {
          rss: Math.round(mem.rss / 1024 / 1024),
          heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
          external: Math.round(mem.external / 1024 / 1024),
        },
        cpu: {
          cores: cpus.length,
          model: cpus[0]?.model || 'unknown',
          loadAvg: loadAvg.map((l: number) => Math.round(l * 100) / 100),
        },
        database: { connected: dbOk, latencyMs: dbLatency },
        redis: { connected: redisOk },
        counts: { users: userCount, posts: postCount, activeSessions24h: activeSessionCount },
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
