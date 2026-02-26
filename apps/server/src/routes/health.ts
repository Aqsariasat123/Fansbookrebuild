import { Router } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
      },
    });
  } catch {
    res.status(503).json({
      success: false,
      data: {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      },
    });
  }
});

export default router;
