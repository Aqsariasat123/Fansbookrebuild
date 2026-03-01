import { prisma } from '../config/database.js';
import type { Request } from 'express';

/**
 * Log any system activity to the audit log.
 * Works for admin, creator, and fan actions.
 */
export async function logActivity(
  userId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: unknown,
  req?: Request,
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: userId,
        action,
        targetType,
        targetId,
        details: details ? JSON.parse(JSON.stringify(details)) : undefined,
        ipAddress: req
          ? (typeof req.ip === 'string' ? req.ip : req.socket.remoteAddress) || null
          : null,
      },
    });
  } catch {
    // Non-critical — don't block the operation
  }
}
