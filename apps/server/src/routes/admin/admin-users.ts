import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { getPagination, buildDateFilter, paginatedResponse } from './query-helpers.js';

const router = Router();

const USER_SELECT = {
  id: true,
  email: true,
  username: true,
  displayName: true,
  firstName: true,
  lastName: true,
  avatar: true,
  role: true,
  status: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
};

function buildUserWhere(query: Record<string, unknown>) {
  const where: Record<string, unknown> = {};
  const search = (query.search as string)?.trim();
  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  const role = query.role as string | undefined;
  if (role && role !== 'All') where.role = role;
  const status = query.status as string | undefined;
  if (status && status !== 'All') where.status = status;
  Object.assign(where, buildDateFilter(query.from as string, query.to as string));
  return where;
}

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const where = buildUserWhere(req.query as Record<string, unknown>);
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: USER_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);
    res.json(paginatedResponse(items, total, page, limit));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        ...USER_SELECT,
        bio: true,
        location: true,
        website: true,
        mobileNumber: true,
        country: true,
        category: true,
        dateOfBirth: true,
        aboutMe: true,
        socialLinks: true,
        emailVerified: true,
        twoFactorEnabled: true,
        _count: { select: { posts: true, followers: true, following: true } },
      },
    });
    if (!user) throw new AppError(404, 'User not found');
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['ACTIVE', 'SUSPENDED', 'BANNED', 'DEACTIVATED'];
    if (!status || !valid.includes(status)) {
      throw new AppError(400, `Status must be one of: ${valid.join(', ')}`);
    }
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw new AppError(404, 'User not found');
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
      select: USER_SELECT,
    });
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'USER_STATUS_CHANGE',
        targetType: 'User',
        targetId: req.params.id,
        details: { oldStatus: user.status, newStatus: status },
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

router.put('/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    const valid = ['FAN', 'CREATOR', 'ADMIN'];
    if (!role || !valid.includes(role)) {
      throw new AppError(400, `Role must be one of: ${valid.join(', ')}`);
    }
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw new AppError(404, 'User not found');
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: USER_SELECT,
    });
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'USER_ROLE_CHANGE',
        targetType: 'User',
        targetId: req.params.id,
        details: { oldRole: user.role, newRole: role },
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
