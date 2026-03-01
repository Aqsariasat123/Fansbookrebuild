import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { buildCrud } from './masters/crud-helper.js';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

const crud = buildCrud(prisma.announcement, {
  searchFields: ['title', 'content'],
  requiredFields: ['title', 'content'],
  orderBy: { createdAt: 'desc' },
  modelName: 'Announcement',
});

// Override create to inject createdBy from auth
router.get('/', crud.list);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.createdBy = req.user!.userId;
    if (req.body.isActive === undefined) req.body.isActive = true;
    return crud.create(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', crud.update);
router.delete('/:id', crud.remove);

export default router;
