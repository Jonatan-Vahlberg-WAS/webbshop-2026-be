import { findEventById } from '../db/events.js';
import { addUserToEvent, findUserByEmail, findUserById } from '../db/users.js';
import EventUser from '../models/connecting/EventUser.js';

class BookingController {
  bookingPost = [
    async (req, res) => {
      const { id: eventId } = req.params;

      const { id: userId } = req.user;

      try {
        if (!eventId) {
          return res.status(400).json({ error: 'Event ID is required' });
        }

        const user = await findUserById(userId);

        if (!user) {
          return res.status(400).json({ error: 'user not found' });
        }

        const event = await findEventById(eventId);

        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }

        if (event.seatsLeft < 1) {
          return res.status(400).json({ error: 'Not enough seats available' });
        }

        const result = await addUserToEvent(user._id, event._id);

        if (result instanceof Error) {
          return res.status(400).json({ error: result.message });
        }

        res.status(201).json({ message: 'Booking successful' });
      } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
      }
    },
  ];

  bookingGet = [
    async (req, res) => {
      const { id } = req.params;

      try {
        if (!id) {
          return res.status(400).json({ error: 'Event ID is required' });
        }

        const event = await findEventById(id);
        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }

        const bookings = await EventUser.find({ eventId: id }).populate(
          'userId',
          'firstname lastname email'
        );

        const structuredBookings = { users: bookings.map((b) => b.userId) };
        res.status(200).json(structuredBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
      }
    },
  ];

  bookingDelete = [
    async (req, res) => {
      const { id } = req.params;
      const { id: userId } = req.user;

      try {
        if (!id) {
          return res.status(400).json({ error: 'Event ID is required' });
        }

        if (!userId) {
          return res.status(400).json({ error: 'user is required' });
        }

        const event = await findEventById(id);
        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }

        const user = await findUserById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const existingBooking = await EventUser.findOne({
          userId: user._id,
          eventId: id,
        });

        if (!existingBooking) {
          return res
            .status(400)
            .json({ error: 'User is not booked for this event' });
        }

        await EventUser.deleteOne({ eventId: id, userId: user._id });

        res.status(200).json({ message: 'Booking cancelled successfully' });
      } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
      }
    },
  ];
}

export default new BookingController();
