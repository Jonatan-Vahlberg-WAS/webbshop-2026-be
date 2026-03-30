import Event from '../models/Event.js';
import EventUser from '../models/connecting/EventUser.js';

async function getAllEvents() {
  try {
    const events = await Event.find(
      new Date() > new Date() ? { date: { $gte: new Date() } } : {}
    ).sort({ date: 1 }); // Sortera efter datum i stigande ordning

    // Lägg till antal deltagare för varje event + platser kvar
    const eventsWithParticipants = await Promise.all(
      events.map(async (event) => {
        const participantCount = await EventUser.countDocuments({
          eventId: event._id,
        });
        return {
          ...event.toObject(),
          participants: participantCount,
          seatsLeft: event.maxseats - participantCount,
        };
      })
    );

    return eventsWithParticipants;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export { getAllEvents };
