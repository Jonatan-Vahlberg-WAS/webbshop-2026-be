import { Router } from 'express';
import { getAllEvents } from '../db/events.js';

const router = Router();

router.get('/', async (req, res) => {
  const { kategori, search } = req.query;

  try {
    // Logga query-parametrar om de finns
    if (kategori || search) {
      console.log('Received query parameters:', req.query);
    }

    // Hämta events (du kan lägga in filtrering här senare)
    const events = await getAllEvents();

    if (events.length === 0) {
      console.log('No events found');
      return res.status(404).json({ message: 'No events found' });
    }

    res.status(200).json({ count: events.length, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export default router;
