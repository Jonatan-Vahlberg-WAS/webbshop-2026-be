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
      ref: "Plants",
      required: false, //Change to true later
    },
    requesterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false, //Change to true later
    },
    ownerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false, //Change to true later
    },
    status: {
      type: String,
      required: true,
      enum: [
        STATUS_LEVEL.pending,
        STATUS_LEVEL.approved,
        STATUS_LEVEL.completed,
      ],
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
