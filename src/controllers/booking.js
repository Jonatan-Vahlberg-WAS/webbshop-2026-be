import { findEventById } from '../db/events.js';
import { addUserToEvent, findUserByEmail, createUser } from '../db/users.js';
import EventUser from '../models/connecting/EventUser.js';

class BookingController {
  bookingPost = [
    async (req, res) => {
      const { id } = req.params;
      const { persons } = req.body;

      try {
        if (!id) {
          return res.status(400).json({ error: 'Event ID is required' });
        }

        if (!persons || (Array.isArray(persons) && persons.length === 0)) {
          return res.status(400).json({ error: 'persons are required' });
        }

        const event = await findEventById(id);

        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }

        // Normalisera persons till array
        const personsArray = Array.isArray(persons) ? persons : [persons];

        // Validera alla personer innan något skrivs till DB
        for (const p of personsArray) {
          if (!p.firstname || !p.lastname || !p.email) {
            return res.status(400).json({
              error: 'Each person must have a firstname, lastname, and email',
            });
          }
        }

        // Kolla antal lediga platser innan vi skapar något
        const participantCount = await EventUser.countDocuments({
          eventId: event._id,
        });

        const seatsLeft = event.maxseats - participantCount;

        if (seatsLeft < personsArray.length) {
          return res.status(400).json({ error: 'Not enough seats available' });
        }

        // Nu är allt validerat → skapa användare och koppla
        for (const p of personsArray) {
          let user = await findUserByEmail(p.email);

          if (!user) {
            user = await createUser({
              firstname: p.firstname,
              lastname: p.lastname,
              email: p.email,
              password: 1234, // Dummy-lösenord, eftersom det inte används för inloggning
            });
          }

          const result = await addUserToEvent(user._id, event._id);
          if (result instanceof Error) {
            return res.status(400).json({ error: result.message });
          }
        }

        res.status(201).json({ message: 'Booking successful' });
      } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
      }
    },
  ];
}

export default new BookingController();
