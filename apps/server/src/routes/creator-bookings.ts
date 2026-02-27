import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// All routes require auth + CREATOR role
router.use(authenticate, requireRole('CREATOR'));

const FAN_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatar: true,
};

const VALID_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'NO_SHOW'];
const UPDATABLE_STATUSES = ['ACCEPTED', 'REJECTED', 'COMPLETED', 'NO_SHOW'];

// ─── GET /api/creator/bookings ── paginated bookings ────────
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;

    const where: Record<string, unknown> = { creatorId: userId };

    if (status && status !== 'All') {
      if (!VALID_STATUSES.includes(status)) {
        throw new AppError(400, 'Invalid status filter');
      }
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          fan: { select: FAN_SELECT },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const data = items.map((b) => ({
      id: b.id,
      fan: b.fan,
      date: b.date,
      timeSlot: b.timeSlot,
      status: b.status,
      notes: b.notes,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    res.json({
      success: true,
      data: {
        items: data,
        total,
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/creator/bookings/:id/status ── update booking status
router.put('/:id/status', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const bookingId = req.params.id as string;
    const { status } = req.body;

    if (!status || !UPDATABLE_STATUSES.includes(status)) {
      throw new AppError(400, `Status must be one of: ${UPDATABLE_STATUSES.join(', ')}`);
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new AppError(404, 'Booking not found');
    if (booking.creatorId !== userId)
      throw new AppError(403, 'Not authorized to update this booking');

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        fan: { select: FAN_SELECT },
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        fan: updated.fan,
        date: updated.date,
        timeSlot: updated.timeSlot,
        status: updated.status,
        notes: updated.notes,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
