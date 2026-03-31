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

  time: {
    type: Object,
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

  price: {
    type: Number,
    required: true,
  },
});

const Event = mongoose.model('Event', EventSchema);

export default Event;
