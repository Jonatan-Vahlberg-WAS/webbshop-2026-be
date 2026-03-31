import { Router } from 'express';
import EventController from '../controllers/Event.js';
import { isAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', EventController.eventsGet);

router.post('/', isAuth, EventController.eventPost);

router.get('/archive', EventController.getArchivedEvents);

router.get('/:id', EventController.eventGet);

router.put('/:id', isAuth, EventController.editEventPut);

router.delete('/:id', isAuth, EventController.eventDelete);

export default router;
