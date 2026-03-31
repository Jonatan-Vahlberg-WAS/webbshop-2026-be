import EventsEventtypes from '../models/connecting/eventsEventtypes.js';
import Eventtypes from '../models/Eventtypes.js';

async function findEventtype(slug) {
  try {
    const eventtype = await Eventtypes.findOne({ slug: slug });
    return eventtype;
  } catch (error) {
    console.error('Error fetching event type:', error);
    throw error;
  }
}

async function addEventtypeToEvent(eventtypeSlug, eventId, options = {}) {
  const { session } = options;

  try {
    const eventtype = await findEventtype(eventtypeSlug);
    if (!eventtype) {
      throw new Error('Event type not found');
    }

    const newConnection = new EventsEventtypes({
      eventtypesId: eventtype._id,
      eventId: eventId,
    });

    const savedConnection = await newConnection.save({ session });
    return savedConnection;
  } catch (error) {
    console.error('Error adding event type to event:', error);
    throw error;
  }
}

export { findEventtype, addEventtypeToEvent };
