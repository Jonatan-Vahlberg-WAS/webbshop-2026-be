import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: false,
  },

  date: {
    type: Date,
    required: true,
  },

  maxseats: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model('Event', EventSchema);

export default Event;
