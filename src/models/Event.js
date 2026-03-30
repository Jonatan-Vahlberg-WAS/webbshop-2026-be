import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    id: {
        type: UUID,
        required: true,
        unique: true,
        default: () => uuidv4(),
    },

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

const Event = mongoose.model("Event", eventSchema);

export default Event;