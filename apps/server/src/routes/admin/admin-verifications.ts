import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database.js';
import {
  adminApprove,
  adminReject,
  adminRequestResubmit,
} from '../../services/verificationService.js';

const router = Router();

// GET /api/admin/verifications
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = '1', limit = '20', q } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (q) {
      where.user = {
        OR: [
          { username: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      prisma.identityVerification.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { submittedAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              email: true,
              createdAt: true,
            },
          },
          reviewedBy: { select: { username: true } },
        },
      }),
      prisma.identityVerification.count({ where }),
    ]);

    res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/verifications/stats
router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, pending, manualReview, approved, rejected, today] = await Promise.all([
      prisma.identityVerification.count(),
      prisma.identityVerification.count({ where: { status: 'PENDING' } }),
      prisma.identityVerification.count({ where: { status: 'MANUAL_REVIEW' } }),
      prisma.identityVerification.count({ where: { status: 'APPROVED' } }),
      prisma.identityVerification.count({ where: { status: 'REJECTED' } }),
      prisma.identityVerification.count({ where: { submittedAt: { gte: todayStart } } }),
    ]);

    const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;
    res.json({
      success: true,
      data: { total, pending, manualReview, approved, rejected, today, rejectionRate },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/verifications/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const item = await prisma.identityVerification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            email: true,
          },
        },
        reviewedBy: { select: { username: true } },
      },
    });
    if (!item) {
      res.status(404).json({ success: false, message: 'Not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/verifications/:id/approve
router.patch('/:id/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as Request & { user: { userId: string } }).user.userId;
    await adminApprove(String(req.params.id), adminId);
    res.json({ success: true, message: 'Verification approved' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/verifications/:id/reject
router.patch('/:id/reject', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body as { reason?: string };
    if (!reason) {
      res.status(400).json({ success: false, message: 'Rejection reason required' });
      return;
    }
    const adminId = (req as Request & { user: { userId: string } }).user.userId;
    await adminReject(String(req.params.id), adminId, reason);
    res.json({ success: true, message: 'Verification rejected' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/verifications/:id/request-resubmit
router.patch('/:id/request-resubmit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as Request & { user: { userId: string } }).user.userId;
    await adminRequestResubmit(String(req.params.id), adminId);
    res.json({ success: true, message: 'Resubmission requested' });
  } catch (err) {
    next(err);
  }
});

export default router;
