import { Router } from 'express';
import { prisma } from '../../../config/database.js';
import { buildCrud } from './crud-helper.js';

const router = Router();

const crud = buildCrud(prisma.translation, {
  searchFields: ['textKey', 'textValue'],
  requiredFields: ['textKey', 'textValue'],
  modelName: 'Translation',
});

router.get('/', crud.list);
router.post('/', crud.create);
router.put('/:id', crud.update);
router.delete('/:id', crud.remove);

export default router;
