import { findEventById } from '../db/events.js';
import { addUserToEvent, findUserByEmail, findUserById } from '../db/users.js';
import EventUser from '../models/connecting/EventUser.js';
import {
  bookingCancelationConfirmationMail,
  bookingConfirmationMail,
} from '../utils/emailFunctions.js';

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

        bookingConfirmationMail(event, user.email);

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
      const { email } = req.body;

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

        let user;
        if (email) {
          user = await findUserByEmail(email);
          if (!user) {
            return res
              .status(404)
              .json({ error: 'User not found with provided email' });
          }
        } else {
          user = await findUserById(userId);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
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

        bookingCancelationConfirmationMail(event, user.email);

        res.status(200).json({ message: 'Booking cancelled successfully' });
      } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
      }
    },
  ];

  myBookingsGet = [
    async (req, res) => {
      const { id: userId } = req.user;
      try {
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }
        const user = await findUserById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const bookings = await EventUser.find({ userId }).populate(
          'eventId',
          'title date time location'
        );
        const structuredBookings = { events: bookings.map((b) => b.eventId) };
        res.status(200).json(structuredBookings);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch user bookings' });
      }
    },
  ];
}

export default new BookingController();
