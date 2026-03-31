import mongoose from "mongoose";

export const LIGHT_LEVELS = {
  outdoor: "outdoor",
  indoor: "indoor",
  heatlamp: "heatlamp"
}

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  //TODO: Add more fields as needed
  species: {
    type: String,
    required: true,
  },
  lighting: {
    type: String,
    required: true,
    enum: [LIGHT_LEVELS.outdoor, LIGHT_LEVELS.indoor, LIGHT_LEVELS.heatlamp]
  },
  ownerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true 
  },
  coordinates: {
    type: [Number],
    default: [0, 0],
    required: true
  },
  meetingTime: {
    type: Date,
    required: true
  },
  available: {
    type: Boolean,
    default: true,
    required: true
  }
}, 
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;