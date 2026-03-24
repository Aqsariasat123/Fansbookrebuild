import { Router } from 'express';
import { prisma } from '../../config/database.js';

const router = Router();

// GET /api/admin/ai-usage?month=2026-03
router.get('/usage', async (req, res, next) => {
  try {
    const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
    const [year, mon] = month.split('-').map(Number);
    const from = new Date(year, mon - 1, 1);
    const to = new Date(year, mon, 1);

    const logs = await prisma.aIUsageLog.findMany({
      where: { createdAt: { gte: from, lt: to } },
      include: { creator: { select: { username: true, displayName: true } } },
    });

    const totals = { inputTokens: 0, outputTokens: 0, cost: 0 };
    const byFeature: Record<string, { count: number; cost: number }> = {};
    const creatorMap: Record<
      string,
      {
        username: string;
        displayName: string;
        inputTokens: number;
        outputTokens: number;
        cost: number;
        byFeature: Record<string, number>;
        lastUsed: Date;
      }
    > = {};

    for (const log of logs) {
      totals.inputTokens += log.inputTokens;
      totals.outputTokens += log.outputTokens;
      totals.cost += log.cost;

      if (!byFeature[log.feature]) byFeature[log.feature] = { count: 0, cost: 0 };
      byFeature[log.feature].count++;
      byFeature[log.feature].cost += log.cost;

      if (!creatorMap[log.creatorId]) {
        creatorMap[log.creatorId] = {
          username: log.creator.username,
          displayName: log.creator.displayName,
          inputTokens: 0,
          outputTokens: 0,
          cost: 0,
          byFeature: {},
          lastUsed: log.createdAt,
        };
      }
      const c = creatorMap[log.creatorId];
      c.inputTokens += log.inputTokens;
      c.outputTokens += log.outputTokens;
      c.cost += log.cost;
      c.byFeature[log.feature] = (c.byFeature[log.feature] ?? 0) + 1;
      if (log.createdAt > c.lastUsed) c.lastUsed = log.createdAt;
    }

    const byCreator = Object.entries(creatorMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.cost - a.cost);

    res.json({ success: true, data: { month, totals, byFeature, byCreator } });
  } catch (err) {
    next(err);
  }
});

export default router;
