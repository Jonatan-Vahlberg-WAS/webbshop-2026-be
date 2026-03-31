import { findEventById } from '../db/events.js';

export default async function capacityMiddleware(req, res, next) {
  const { id: eventId } = req.params;
  const { persons } = req.body;

  try {
    const event = await findEventById(eventId);

    if (event.seatsLeft - persons.length < 0)
      return next(new Error('Event full', 409));

    next();
  } catch (error) {
    next(error);
  }
}
