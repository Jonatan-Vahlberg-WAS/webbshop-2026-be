import {
  getAllEvents,
  findEventsByType,
  searchInEvents,
  createEvent,
  findEventByName,
  findEventById,
} from '../db/events.js';
import { findEventtype, addEventtypeToEvent } from '../db/types.js';
import mongoose from 'mongoose';

class EventController {
  eventsGet = [
    async (req, res) => {
      const { kategori, search } = req.query;
      let events;

      try {
        // Logga query-parametrar om de finns
        if (kategori || search) {
          console.log('Received query parameters:', req.query);
        }

        // Hämta events
        events = await getAllEvents();

        if (events.length === 0) {
          console.log('No events found');
          return res.status(404).json({ message: 'No events found' });
        }

        if (kategori) {
          events = await findEventsByType(kategori, events);
        }

        if (search) {
          events = await searchInEvents(search, events);
        }

        res.status(200).json({ count: events.length, events });
      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
      }
    },
  ];

  eventGet = [
    async (req, res) => {
      const { id } = req.params;

      try {
        const events = await getAllEvents();
        const event = events.find((e) => e._id.toString() === id);

        if (!event) {
          console.log(`Event with ID ${id} not found`);
          return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
      } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
      }
    },
  ];

  eventPost = [
    async (req, res) => {
      const { title, description, date, type, maxseats, location } = req.body;

      if (!title || !description || !date || !type || !maxseats || !location) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (isNaN(maxseats) || maxseats <= 0 || !Number.isInteger(maxseats)) {
        return res.status(400).json({ error: 'Invalid maxseats value' });
      }

      if (typeof date !== 'string' || isNaN(Date.parse(date))) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const existingEvent = await findEventByName(title);
        if (existingEvent) {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ error: 'Event with this title already exists' });
        }

        const eventtype = await findEventtype(type);
        if (!eventtype) {
          await session.abortTransaction();
          return res.status(400).json({ error: 'Invalid event type' });
        }

        const newEvent = await createEvent(
          { title, description, date, maxseats, location },
          { session }
        );

        if (!newEvent) {
          await session.abortTransaction();
          return res.status(500).json({ error: 'Failed to create event' });
        }

        const updated = await addEventtypeToEvent(type, newEvent._id, {
          session,
        });
        if (!updated) {
          await session.abortTransaction();
          return res.status(500).json({ error: 'Failed to link event type' });
        }

        await session.commitTransaction();
        res.status(201).json(newEvent);
      } catch (error) {
        await session.abortTransaction();
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
      } finally {
        session.endSession();
      }
    },
  ];

  editEventPut = [
    async (req, res) => {
      const { id } = req.params;

      try {
        if (!id) {
          return res.status(400).json({ error: 'Event ID is required' });
        }

        const { title, description, date, type, maxseats, location } = req.body;

        if (
          !title &&
          !description &&
          !date &&
          !type &&
          !maxseats &&
          !location
        ) {
          return res
            .status(400)
            .json({ error: 'At least one field must be provided for update' });
        }

        const event = await findEventById(id);

        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }

        if (title) event.title = title;
        if (description) event.description = description;
        if (date) {
          if (isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Invalid date format' });
          }
          event.date = date;
        }
        if (maxseats) {
          if (isNaN(maxseats) || maxseats <= 0 || !Number.isInteger(maxseats)) {
            return res.status(400).json({ error: 'Invalid maxseats value' });
          }
          event.maxseats = maxseats;
        }
        if (location) event.location = location;

        if (type) {
          const eventtype = await findEventtype(type);
          if (!eventtype) {
            return res.status(400).json({ error: 'Invalid event type' });
          }
          await addEventtypeToEvent(type, event._id);
        }

        await event.save();
        res.status(200).json(event);
      } catch (error) {
        console.error('Error editing event:', error);
        res.status(500).json({ error: 'Failed to edit event' });
      }
    },
  ];
}

export default new EventController();
