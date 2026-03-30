import mongoose from "mongoose";

const eventUserSchema = new mongoose.Schema({
  eventId: {
    type: UUID,
    required: true,
  },
  userId: {
    type: UUID,
    required: true,
  },
});

const EventUser = mongoose.model("EventUser", eventUserSchema);

export default EventUser;