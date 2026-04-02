import { Router } from 'express';
import TypesController from '../controllers/Types.js';
import { isAuth, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();
const typesController = new TypesController();

router.get('/', typesController.typesGet);
router.post('/', isAuth, isAdmin, typesController.typesPost);
router.put('/:id', isAuth, isAdmin, typesController.editTypePut);
router.delete('/:id', isAuth, isAdmin, typesController.typesDelete);

export default router;
