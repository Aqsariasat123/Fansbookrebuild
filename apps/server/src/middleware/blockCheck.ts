import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from './errorHandler.js';

export async function checkBlockStatus(req: Request, _res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const targetId = (req.params.id || req.params.username) as string | undefined;
    if (!userId || !targetId) return next();

    // Resolve username to userId if needed
    let targetUserId = targetId;
    if (targetId.length < 20) {
      // Likely a username, not a cuid
      const user = await prisma.user.findUnique({
        where: { username: targetId },
        select: { id: true },
      });
      if (user) targetUserId = user.id;
    }

    if (userId === targetUserId) return next();

    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: userId },
        ],
      },
    });

    if (block) throw new AppError(403, 'This content is not available');

    next();
  } catch (err) {
    next(err);
  }
}
