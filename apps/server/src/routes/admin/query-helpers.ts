import { Request } from 'express';
import { AppError } from '../../middleware/errorHandler.js';

export function getPagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildDateFilter(
  from: string | undefined,
  to: string | undefined,
  field = 'createdAt',
) {
  if (!from && !to) return {};
  const dateFilter: Record<string, Date> = {};
  if (from) {
    const d = new Date(from);
    if (isNaN(d.getTime())) throw new AppError(400, 'Invalid from date');
    dateFilter.gte = d;
  }
  if (to) {
    const d = new Date(to);
    if (isNaN(d.getTime())) throw new AppError(400, 'Invalid to date');
    d.setHours(23, 59, 59, 999);
    dateFilter.lte = d;
  }
  return { [field]: dateFilter };
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
