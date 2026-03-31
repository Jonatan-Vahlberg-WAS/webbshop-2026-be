import { Router } from 'express';
import EventController from '../controllers/Event.js';
import { isAdmin, isAuth } from '../middleware/authMiddleware.js';
import BookingController from '../controllers/booking.js';

const router = Router();

router.get('/', EventController.eventsGet);

router.post('/', isAuth, isAdmin, EventController.eventPost);

router.get('/archive', EventController.getArchivedEvents);

router.get('/:id', EventController.eventGet);

router.put('/:id', isAuth, isAdmin, EventController.editEventPut);

router.delete('/:id', isAuth, isAdmin, EventController.eventDelete);

router.post('/:id/bookings', BookingController.bookingPost);

router.get('/:id/bookings', isAuth, isAdmin, BookingController.bookingGet);

router.delete(
  '/:id/bookings',
  isAuth,
  isAdmin,
  BookingController.bookingDelete
);

export default router;
