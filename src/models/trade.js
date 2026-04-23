import mongoose from "mongoose"
import Plant from "./plant.js"
import User from "./User.js"

export const STATUS_LEVEL = {
  pending: "pending",
  approved: "approved",
  completed: "completed",
  declined: "declined"
}

const tradeSchema = new mongoose.Schema(
  {
    plantId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Plant",
      required: true
    },
    requesterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true
    },
    ownerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: [
        STATUS_LEVEL.pending,
        STATUS_LEVEL.approved,
        STATUS_LEVEL.completed,
        STATUS_LEVEL.declined,
      ],
      default: STATUS_LEVEL.pending,
    },
  },
  {
    timestamps: true,
  },
)

tradeSchema.pre("validate", async function (next) {
  try {
    if (this.isNew || this.isModified("plantId")) {
      const plant = await Plant.findById(this.plantId).select("ownerId");

      if (plant) {
        this.ownerId = plant.ownerId;
      }
    }

    if (this.requesterId?.equals(this.ownerId)) {
      const error = new Error("You cannot trade your own plant");
      return next(error);
    }

    next();
  } catch (err) {
    next(err);
  }
});

tradeSchema.post("save", async function () {
  if (this.status === STATUS_LEVEL.completed) {
    try {
      await User.findByIdAndUpdate(this.ownerId, {
        $addToSet: { history: this._id  },
      })

      await User.findByIdAndUpdate(this.requesterId, {
        $addToSet: { history: this._id  },
      })

      
    } catch (error) {
      console.error("Error updating user history:", error)
    }
  }
})

const Trade = mongoose.model("Trade", tradeSchema)

export default Trade