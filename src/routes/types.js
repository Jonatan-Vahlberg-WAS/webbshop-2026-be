import { Router } from 'express';
import TypesController from '../controllers/Types.js';
import { isAuth } from '../middleware/authMiddleware.js';

const router = Router();
const typesController = new TypesController();

router.get('/', typesController.typesGet);
router.post('/', isAuth, typesController.typesPost);
router.put('/:id', isAuth, typesController.editTypePut);
router.delete('/:id', isAuth, typesController.typesDelete);

export default router;
