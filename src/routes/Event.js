import { Router } from 'express';
import EventController from '../controllers/Event.js';
import { isAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', EventController.eventsGet);

router.post('/', isAuth, EventController.eventPost);

router.get('/:id', EventController.eventGet);

export default router;
