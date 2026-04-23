import { Router } from 'express';
import EventController from '../controllers/Event.js';
import { isAuth } from '../middleware/authMiddleware.js';
import BookingController from '../controllers/booking.js';
import capacityMiddleware from '../middleware/capacityMiddleware.js';
import requiredRole from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', EventController.eventsGet);

router.post('/', isAuth, requiredRole('admin'), EventController.eventPost);

router.get('/archive', EventController.getArchivedEvents);

router.get(
  '/my/bookings',
  isAuth,
  requiredRole('customer'),
  BookingController.myBookingsGet
);

router.get('/:id', EventController.eventGet);

router.put('/:id', isAuth, requiredRole('admin'), EventController.editEventPut);

router.delete(
  '/:id',
  isAuth,
  requiredRole('admin'),
  EventController.eventDelete
);

router.post(
  '/:id/bookings',
  isAuth,
  requiredRole('customer'),
  BookingController.bookingPost
);

router.get(
  '/:id/bookings',
  isAuth,
  requiredRole('admin'),
  BookingController.bookingGet
);

router.delete(
  '/:id/bookings',
  isAuth,
  requiredRole(['customer', 'admin']),
  BookingController.bookingDelete
);

export default router;
