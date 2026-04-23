import { Router } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const config = await prisma.platformConfig.findUnique({ where: { id: 'singleton' } });
    const settings = (config?.homeSettings as Record<string, unknown>) ?? {};
    res.json({ success: true, data: settings.makeMoneyItems ?? null });
  } catch (err) {
    next(err);
  }
});

export default router;
