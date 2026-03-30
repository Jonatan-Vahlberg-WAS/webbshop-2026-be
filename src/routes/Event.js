import { Router } from 'express';
import EventController from '../controllers/Event.js';

const router = Router();

router.get('/', EventController.eventsGet);

router.get('/:id', EventController.eventGet);

export default router;
