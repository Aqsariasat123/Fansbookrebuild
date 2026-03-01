import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../middleware/errorHandler.js';

/**
 * Shared pagination + search parsing for master CRUD routes.
 */
export function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const search = (req.query.search as string)?.trim() || '';
  return { page, limit, skip, search };
}

export function paginatedResponse(items: unknown[], total: number, page: number, limit: number) {
  return {
    success: true,
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Generic CRUD factory for simple master models.
 * Returns { list, create, update, remove } handlers.
 */
export function buildCrud(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  opts: {
    searchFields?: string[];
    requiredFields?: string[];
    orderBy?: Record<string, string>;
  } = {},
) {
  const {
    searchFields = ['name'],
    requiredFields = ['name'],
    orderBy = { createdAt: 'desc' },
  } = opts;

  const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, skip, search } = parsePagination(req);
      const where: Record<string, unknown> = {};

      if (search && searchFields.length > 0) {
        where.OR = searchFields.map((f) => ({
          [f]: { contains: search, mode: 'insensitive' },
        }));
      }

      const [items, total] = await Promise.all([
        model.findMany({ where, orderBy, skip, take: limit }),
        model.count({ where }),
      ]);

      res.json(paginatedResponse(items, total, page, limit));
    } catch (err) {
      next(err);
    }
  };

  const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const field of requiredFields) {
        if (!req.body[field] && req.body[field] !== 0) {
          throw new AppError(400, `${field} is required`);
        }
      }
      const item = await model.create({ data: req.body });
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = await model.findUnique({ where: { id: req.params.id } });
      if (!existing) throw new AppError(404, 'Record not found');

      const item = await model.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = await model.findUnique({ where: { id: req.params.id } });
      if (!existing) throw new AppError(404, 'Record not found');

      await model.delete({ where: { id: req.params.id } });
      res.json({ success: true, data: { id: req.params.id } });
    } catch (err) {
      next(err);
    }
  };

  return { list, create, update, remove };
}
