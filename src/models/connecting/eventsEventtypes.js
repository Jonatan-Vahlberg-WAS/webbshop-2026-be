import mongoose from 'mongoose';

const EventsEventTypesSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  eventtypesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eventtypes',
    required: true,
  },
});

const EventsEventTypes = mongoose.model(
  'EventsEventTypes',
  EventsEventTypesSchema
);

export default EventsEventTypes;
