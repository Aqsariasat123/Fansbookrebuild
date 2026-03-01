import { Router } from 'express';
import { prisma } from '../../../config/database.js';
import { buildCrud } from './crud-helper.js';

const router = Router();

const crud = buildCrud(prisma.profileStat, {
  searchFields: ['name'],
  requiredFields: ['name', 'profileStatTypeId'],
  modelName: 'ProfileStat',
});

router.get('/', crud.list);
router.post('/', crud.create);
router.put('/:id', crud.update);
router.delete('/:id', crud.remove);

export default router;
