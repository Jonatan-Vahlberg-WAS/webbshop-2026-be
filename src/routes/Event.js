import { Router } from 'express';
import EventController from '../controllers/Event.js';
import { isAdmin, isAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', EventController.eventsGet);

router.post('/', isAuth, isAdmin, EventController.eventPost);

router.get('/archive', EventController.getArchivedEvents);

router.get('/:id', EventController.eventGet);

router.put('/:id', isAuth, isAdmin, EventController.editEventPut);

router.delete('/:id', isAuth, isAdmin, EventController.eventDelete);

export default router;
