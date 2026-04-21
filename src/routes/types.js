import { Router } from 'express';
import TypesController from '../controllers/Types.js';
import { isAuth } from '../middleware/authMiddleware.js';
import requiredRole from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', TypesController.typesGet);
router.post('/', isAuth, requiredRole('admin'), TypesController.typesPost);
router.put('/:id', isAuth, requiredRole('admin'), TypesController.editTypePut);
router.delete(
  '/:id',
  isAuth,
  requiredRole('admin'),
  TypesController.typesDelete
);

export default router;
