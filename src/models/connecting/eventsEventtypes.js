import mongoose from 'mongoose';

const evnetsEventtypesSchema = new mongoose.Schema({
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

const EventsEventtypes = mongoose.model(
  'EventsEventtypes',
  evnetsEventtypesSchema
);

export default EventsEventtypes;
