import mongoose from "mongoose"

export const STATUS_LEVEL = {
  pending: "pending",
  approved: "approved",
  completed: "completed",
}

const tradeSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Plants",
    required: false, //Change to true later
  },
  requesterId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: false, //Change to true later
  },
  status: {
    type: String,
    required: true,
    enum: [STATUS_LEVEL.pending, STATUS_LEVEL.approved, STATUS_LEVEL.completed],
  },
})

const Trade = mongoose.model("Trade", tradeSchema)

export default Trade
