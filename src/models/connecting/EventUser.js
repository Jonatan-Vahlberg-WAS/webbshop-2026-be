import mongoose from "mongoose";

const eventUserSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


const EventUser = mongoose.model("EventUser", eventUserSchema);

export default EventUser;