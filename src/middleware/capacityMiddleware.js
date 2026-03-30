//validera att booking inte inner håller fel datum

import Event from '../models/Event.js';

export default async function capacityMiddleWare(req, res, next) {
  const { seats, bookingId } = req.body; //seats är hur många sätten kunden bokar typ lite osäker på hur bookningen kommer se ut

  const event = Event.findById(bookingId);

  if (seats < event.maxseats) return;
}
