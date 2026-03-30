import Event from '../models/Event.js';
import EventUser from '../models/connecting/EventUser.js';
import EventsEventtypes from '../models/connecting/eventsEventtypes.js';
import Eventtypes from '../models/Eventtypes.js';

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

async function findEventsByType(eventType, Events) {
  try {
    const eventTypeDoc = await Eventtypes.findOne({ slug: eventType });
    if (!eventTypeDoc) {
      return [];
    }

    const eventTypeId = eventTypeDoc._id;

    const eventIds = await EventsEventtypes.find({
      eventtypesId: eventTypeId,
    }).distinct('eventId');

    const filteredEvents = Events.filter((event) =>
      eventIds.some((id) => id.equals(event._id))
    );

    return filteredEvents;
  } catch (error) {
    console.error('Error fetching events by type:', error);
    throw error;
  }
}

async function searchInEvents(searchTerm, Events) {
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Filtrera events där title eller description innehåller sökordet (case-insensitive)
  const filteredEvents = Events.filter((event) => {
    const titleMatch = event.title.toLowerCase().includes(lowerSearchTerm);
    const descriptionMatch = event.description
      .toLowerCase()
      .includes(lowerSearchTerm);
    return titleMatch || descriptionMatch;
  });

  return filteredEvents;
}

export { getAllEvents, findEventsByType, searchInEvents };
