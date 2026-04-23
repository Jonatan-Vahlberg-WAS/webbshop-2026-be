// src/models/plant.js
import mongoose from "mongoose";
import slugify from "slugify";

const plantSchema = new mongoose.Schema(
  {
    plantName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    light: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    water: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
    },
    meetingTime: {
      type: Date,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: { type: String },
  },
  { timestamps: true },
);

plantSchema.pre("validate", function (next) {
  if (this.isModified("plantName")) {
    this.slug = slugify(this.plantName, { lower: true });
  }
  next();
});

const Plant = mongoose.model("Plant", plantSchema);
export default Plant;
