import { Router } from 'express';
import {
  getAllEvents,
  findEventsByType,
  searchInEvents,
} from '../db/events.js';

const router = Router();

router.get('/', async (req, res) => {
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
});

router.get('/:id', async (req, res) => {
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
});

export default router;
