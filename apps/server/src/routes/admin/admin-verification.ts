import { Router } from 'express';
import { prisma } from '../../config/database.js';

const router = Router();

// GET /api/admin/verification — list pending creator verifications
router.get('/', async (req, res, next) => {
  try {
    const { status = 'PENDING', page = '1', limit = '20', q } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {
      role: 'CREATOR',
      verificationStatus: status as string,
    };
    if (q) {
      where.OR = [
        { username: { contains: q as string, mode: 'insensitive' } },
        { displayName: { contains: q as string, mode: 'insensitive' } },
        { email: { contains: q as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          avatar: true,
          idDocumentUrl: true,
          selfieUrl: true,
          verificationStatus: true,
          createdAt: true,
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/verification/:userId/approve
router.put('/:userId/approve', async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { verificationStatus: 'VERIFIED', isVerified: true },
      select: { id: true, username: true, verificationStatus: true },
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'VERIFY_CREATOR',
        targetType: 'User',
        targetId: user.id,
        details: { status: 'VERIFIED' },
      },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/verification/:userId/reject
router.put('/:userId/reject', async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { verificationStatus: 'REJECTED' },
      select: { id: true, username: true, verificationStatus: true },
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'REJECT_CREATOR',
        targetType: 'User',
        targetId: user.id,
        details: { status: 'REJECTED', reason: reason || null },
      },
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
