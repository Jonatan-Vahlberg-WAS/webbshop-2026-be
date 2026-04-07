import mongoose from "mongoose";
const plantSchema = new mongoose.Schema(
  {
    plantName: {
      type: String,
      required: true,
    },
    light: {
      type: Number,
      required: true,
      enum: [1, 2, 3], // 1 = low light, 2 = medium light, 3 = high light
    },
    water: {
      type: Number,
      required: true,
      enum: [1, 2, 3], // 1 = low water, 2 = medium water, 3 = high water
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;