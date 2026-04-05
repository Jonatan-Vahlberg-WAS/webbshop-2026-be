import mongoose from "mongoose";
import Plant from "./Plant.js";
import User from "./User.js";

export const STATUS_LEVEL = {
  pending: "pending",
  approved: "approved",
  completed: "completed",
};

const tradeSchema = new mongoose.Schema(
  {
    plantId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Plant",
      required: true, // Change to true later
    },
    requesterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true, // Change to true later
    },
    ownerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true, // Change to true later
    },
    status: {
      type: String,
      required: true,
      enum: [
        STATUS_LEVEL.pending,
        STATUS_LEVEL.approved,
        STATUS_LEVEL.completed,
      ],
      default: STATUS_LEVEL.pending,
    },
  },
  {
    timestamps: true,
  },
);

tradeSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("plantId")) {
    const plant = await Plant.findById(this.plantId).select("ownerId");

    if (plant) {
      this.ownerId = plant.ownerId;
    }
  }

  next();
});

/* tradeSchema.post("save", async function (next) {
  if (this.isNew || this.isModified("status")) {
    const user = await User.findById(this.ownerId).select("_id")
    if (user) {
      this.ownerId = user._id
    }
  }
  next()
}) */

tradeSchema.post("save", async function () {
  if (this.status === STATUS_LEVEL.completed) {
    try {
      await User.findByIdAndUpdate(this.ownerId, {
        $addToSet: { history: this._id },
      });

      await User.findByIdAndUpdate(this.requesterId, {
        $addToSet: { history: this._id },
      });

      await Plant.findByIdAndUpdate(this.plantId, { available: false });
    } catch (err) {
      console.error("Error updating user history:", err);
    }
  }
});

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;
