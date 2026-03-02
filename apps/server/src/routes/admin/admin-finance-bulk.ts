import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = Router();

// ─── POST /api/admin/finance/withdrawals/bulk-approve ────
router.post('/bulk-approve', async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(400, 'ids array is required');
    }
    await prisma.$transaction(async (tx) => {
      await tx.withdrawal.updateMany({
        where: { id: { in: ids }, status: 'PENDING' },
        data: { status: 'COMPLETED', processedAt: new Date() },
      });
      for (const id of ids) {
        await tx.auditLog.create({
          data: {
            adminId: req.user!.userId,
            action: 'WITHDRAWAL_BULK_APPROVE',
            targetType: 'Withdrawal',
            targetId: id,
            details: { bulkCount: ids.length },
          },
        });
      }
    });
    res.json({ success: true, message: `${ids.length} withdrawals approved` });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/admin/finance/withdrawals/bulk-reject ─────
router.post('/bulk-reject', async (req, res, next) => {
  try {
    const { ids, reason } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(400, 'ids array is required');
    }
    await prisma.$transaction(async (tx) => {
      await tx.withdrawal.updateMany({
        where: { id: { in: ids }, status: 'PENDING' },
        data: { status: 'REJECTED', rejectionReason: reason || null, processedAt: new Date() },
      });
      for (const id of ids) {
        await tx.auditLog.create({
          data: {
            adminId: req.user!.userId,
            action: 'WITHDRAWAL_BULK_REJECT',
            targetType: 'Withdrawal',
            targetId: id,
            details: { reason: reason || null, bulkCount: ids.length },
          },
        });
      }
    });
    res.json({ success: true, message: `${ids.length} withdrawals rejected` });
  } catch (err) {
    next(err);
  }
});

export default router;
