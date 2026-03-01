import { Router } from 'express';
import { prisma } from '../../../config/database.js';
import { buildCrud } from './crud-helper.js';

const router = Router();

const crud = buildCrud(prisma.emailTemplate, {
  searchFields: ['title', 'content'],
  requiredFields: ['title', 'content'],
  modelName: 'EmailTemplate',
});

router.get('/', crud.list);
router.post('/', crud.create);
router.put('/:id', crud.update);
router.delete('/:id', crud.remove);

export default router;
