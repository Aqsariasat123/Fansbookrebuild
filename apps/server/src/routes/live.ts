import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// ─── Query Params Schema ─────────────────────────────────

const liveQuerySchema = z.object({
  category: z.string().optional(),
  gender: z.string().optional(),
  region: z.string().optional(),
  sortBy: z.enum(['viewers', 'newest']).default('viewers'),
});

// ─── GET /api/live — Currently live sessions ─────────────

router.get(
  '/',
  validate(liveQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const { category, gender, region, sortBy } =
        req.query as unknown as z.infer<typeof liveQuerySchema>;

      // Build creator where clause for filtering
      const creatorWhere: Record<string, unknown> = {
        role: 'CREATOR',
        status: 'ACTIVE',
      };

      if (gender) {
        creatorWhere.gender = gender;
      }

      if (region) {
        creatorWhere.country = region;
      }

      if (category) {
        creatorWhere.category = category;
      }

      const orderBy: Record<string, string> =
        sortBy === 'viewers'
          ? { viewerCount: 'desc' }
          : { startedAt: 'desc' };

      const sessions = await prisma.liveSession.findMany({
        where: {
          status: 'LIVE',
          creator: creatorWhere,
        },
        orderBy,
        select: {
          id: true,
          title: true,
          viewerCount: true,
          startedAt: true,
          creator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              category: true,
            },
          },
        },
      });

      const items = sessions.map((s) => ({
        id: s.id,
        creatorId: s.creator.id,
        username: s.creator.username,
        displayName: s.creator.displayName,
        avatar: s.creator.avatar,
        category: s.creator.category,
        viewerCount: s.viewerCount,
        title: s.title,
        startedAt: s.startedAt?.toISOString() ?? null,
      }));

      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /api/live/upcoming — Scheduled sessions ─────────

router.get('/upcoming', async (_req, res, next) => {
  try {
    const sessions = await prisma.liveSession.findMany({
      where: { status: 'SCHEDULED' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    const items = sessions.map((s) => ({
      id: s.id,
      creatorId: s.creator.id,
      username: s.creator.username,
      avatar: s.creator.avatar,
      title: s.title,
      scheduledAt: s.createdAt.toISOString(),
    }));

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

export default router;
