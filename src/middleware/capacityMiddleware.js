import { findEventById } from '../db/events.js';

export default async function capacityMiddleware(req, res, next) {
  const { id: eventId } = req.params;
  const { id: userId } = req.user;

  try {
    const event = await findEventById(eventId);

    if (event.seatsLeft - userId.length < 0)
      return next(new Error('Event full', 409));

    next();
  } catch (error) {
    next(error);
  }
}
