import { Router } from 'express';
import TypesController from '../controllers/Types.js';
import { isAuth } from '../middleware/authMiddleware.js';
import requiredRole from '../middleware/roleMiddleware.js';

const router = Router();
const typesController = new TypesController();

router.get('/', typesController.typesGet);
router.post('/', isAuth, requiredRole('admin'), typesController.typesPost);
router.put('/:id', isAuth, requiredRole('admin'), typesController.editTypePut);
router.delete(
  '/:id',
  isAuth,
  requiredRole('admin'),
  typesController.typesDelete
);

export default router;
