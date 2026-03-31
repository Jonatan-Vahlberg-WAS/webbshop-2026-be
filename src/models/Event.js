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
    date: {
      type: Date,
      require: true,
      default: Date.now,
    },
    startTime: {
      type: String,
      require: true,
    },
    endTime: {
      type: String,
      require: true,
    },
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

  trainerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Event = mongoose.model('Event', EventSchema);

export default Event;
