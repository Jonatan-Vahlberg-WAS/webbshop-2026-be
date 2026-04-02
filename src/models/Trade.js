import mongoose from "mongoose"
import Plant from "./Plant.js"
export const STATUS_LEVEL = {
  pending: "pending",
  approved: "approved",
  completed: "completed",
}

const tradeSchema = new mongoose.Schema(
  {
    plantId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Plant",
      required: true, //Change to true later
    },
    requesterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true, //Change to true later
    },
    ownerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true, //Change to true later
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
)

tradeSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("plantId")) {
    const plant = await Plant.findById(this.plantId).select("ownerId")
    if (plant) {
      this.ownerId = plant.ownerId
    }
  }
  next()
})

const Trade = mongoose.model("Trade", tradeSchema)

export default Trade
