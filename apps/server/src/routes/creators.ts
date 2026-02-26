import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// ─── Query Params Schema ─────────────────────────────────

const creatorsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  category: z.string().optional(),
  sortBy: z.enum(['createdAt', 'followers', 'price']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── GET /api/creators ───────────────────────────────────

router.get(
  '/',
  validate(creatorsQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const {
        page,
        limit,
        search,
        gender,
        country,
        priceMin,
        priceMax,
        category,
        sortBy,
        sortOrder,
      } = req.query as unknown as z.infer<typeof creatorsQuerySchema>;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: Record<string, unknown> = {
        role: 'CREATOR',
        status: 'ACTIVE',
      };

      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (gender) {
        where.gender = gender;
      }

      if (country) {
        where.country = country;
      }

      if (category) {
        where.category = category;
      }

      // Price filtering via subscription tiers
      if (priceMin !== undefined || priceMax !== undefined) {
        where.subscriptionTiers = {
          some: {
            isActive: true,
            ...(priceMin !== undefined && { price: { gte: priceMin } }),
            ...(priceMax !== undefined && { price: { lte: priceMax } }),
          },
        };
      }

      // Build orderBy
      let orderBy: Record<string, unknown>;
      if (sortBy === 'followers') {
        orderBy = { followers: { _count: sortOrder } };
      } else {
        orderBy = { [sortBy]: sortOrder };
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Query
      const [creators, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            category: true,
            statusText: true,
            country: true,
            gender: true,
            isVerified: true,
            createdAt: true,
            _count: {
              select: { followers: true },
            },
            subscriptionTiers: {
              where: { isActive: true },
              orderBy: { price: 'asc' },
              take: 1,
              select: { price: true },
            },
            liveSessions: {
              where: { status: 'LIVE' },
              take: 1,
              select: { id: true },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      // Map to CreatorCard shape
      const items = creators.map((c) => ({
        id: c.id,
        username: c.username,
        displayName: c.displayName,
        avatar: c.avatar,
        category: c.category,
        statusText: c.statusText,
        country: c.country,
        gender: c.gender,
        isVerified: c.isVerified,
        isLive: c.liveSessions.length > 0,
        isNew: c.createdAt >= thirtyDaysAgo,
        price: c.subscriptionTiers[0]?.price ?? null,
        followersCount: c._count.followers,
      }));

      res.json({
        success: true,
        data: {
          items,
          total,
          page,
          limit,
          hasMore: skip + limit < total,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /api/creators/filters ───────────────────────────

router.get('/filters', async (_req, res, next) => {
  try {
    // Get distinct values from CREATOR users
    const creatorWhere = { role: 'CREATOR' as const, status: 'ACTIVE' as const };

    const [genderResults, countryResults, categoryResults, priceResult] =
      await Promise.all([
        prisma.user.findMany({
          where: { ...creatorWhere, gender: { not: null } },
          select: { gender: true },
          distinct: ['gender'],
          orderBy: { gender: 'asc' },
        }),
        prisma.user.findMany({
          where: { ...creatorWhere, country: { not: null } },
          select: { country: true },
          distinct: ['country'],
          orderBy: { country: 'asc' },
        }),
        prisma.user.findMany({
          where: { ...creatorWhere, category: { not: null } },
          select: { category: true },
          distinct: ['category'],
          orderBy: { category: 'asc' },
        }),
        prisma.subscriptionTier.aggregate({
          where: {
            isActive: true,
            creator: creatorWhere,
          },
          _min: { price: true },
          _max: { price: true },
        }),
      ]);

    res.json({
      success: true,
      data: {
        genders: genderResults.map((r) => r.gender).filter(Boolean),
        countries: countryResults.map((r) => r.country).filter(Boolean),
        categories: categoryResults.map((r) => r.category).filter(Boolean),
        priceRange: {
          min: priceResult._min.price ?? 0,
          max: priceResult._max.price ?? 100,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
