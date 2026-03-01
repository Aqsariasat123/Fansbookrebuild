import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { getPagination, paginatedResponse } from './query-helpers.js';

const router = Router();

const REPORTER_SELECT = { id: true, username: true, displayName: true, avatar: true };

function buildReportWhere(query: Record<string, unknown>) {
  const where: Record<string, unknown> = {};
  const status = query.status as string | undefined;
  if (status && status !== 'All') where.status = status;
  const type = query.type as string | undefined;
  if (type && type !== 'All') where.reason = type;
  const search = (query.search as string)?.trim();
  if (search) {
    where.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { reporter: { username: { contains: search, mode: 'insensitive' } } },
    ];
  }
  return where;
}

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const where = buildReportWhere(req.query as Record<string, unknown>);
    const [items, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          reporter: { select: REPORTER_SELECT },
          reportedUser: { select: REPORTER_SELECT },
        },
      }),
      prisma.report.count({ where }),
    ]);
    res.json(paginatedResponse(items, total, page, limit));
  } catch (err) {
    next(err);
  }
});

router.put('/:id/resolve', async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const valid = ['RESOLVED', 'DISMISSED', 'INVESTIGATING'];
    if (!status || !valid.includes(status)) {
      throw new AppError(400, `Status must be one of: ${valid.join(', ')}`);
    }
    const report = await prisma.report.findUnique({ where: { id: req.params.id } });
    if (!report) throw new AppError(404, 'Report not found');
    const resolvedAt = status === 'RESOLVED' || status === 'DISMISSED' ? new Date() : null;
    const description = note
      ? `${report.description || ''}\n\n[Admin Note]: ${note}`
      : report.description;
    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: { status, resolvedBy: req.user!.userId, resolvedAt, description },
      include: { reporter: { select: REPORTER_SELECT }, reportedUser: { select: REPORTER_SELECT } },
    });
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'REPORT_RESOLVE',
        targetType: 'Report',
        targetId: req.params.id,
        details: { status, note },
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
