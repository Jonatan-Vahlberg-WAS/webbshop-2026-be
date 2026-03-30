import mongoose from 'mongoose';

const EventUserSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const EventUser = mongoose.model('EventUser', EventUserSchema);

export default EventUser;
