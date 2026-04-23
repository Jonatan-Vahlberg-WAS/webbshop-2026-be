import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import Trade, { STATUS_LEVEL } from "../models/trade.js";
import Plant from "../models/plant.js";
import Notification from "../models/notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Create trade request
router.post("/", protect, asyncHandler(async (req, res) => {
  const { plantId } = req.body;

  const plant = await Plant.findById(plantId);
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }
  if (plant.ownerId.toString() === req.userId) {
    return res.status(400).json({ message: "You cannot trade your own plant" });
  }

  const trade = await Trade.create({
    plantId,
    requesterId: req.userId,
    ownerId: plant.ownerId,
  });

  // Notification to plant owner
  await Notification.create({
    userId: plant.ownerId,
    message: `You have a new trade request for your plant "${plant.plantName}".`,
  });

  res.status(201).json({ message: "Trade created", trade });
}));

// Get my trades (as owner or requester)
router.get("/me", protect, asyncHandler(async (req, res) => {
  const trades = await Trade.find({
    $or: [{ ownerId: req.userId }, { requesterId: req.userId }],
  })
    .populate("plantId", "plantName imageUrl coordinates")
    .populate("ownerId", "name email")
    .populate("requesterId", "name email");

  res.json(trades);
}));

// Owner approves trade
router.patch("/:id/approve", protect, asyncHandler(async (req, res) => {
  const trade = await Trade.findById(req.params.id);
  if (!trade) return res.status(404).json({ message: "Trade not found" });

  if (trade.ownerId.toString() !== req.userId) {
    return res.status(403).json({ message: "Only the owner can approve" });
  }

  trade.status = STATUS_LEVEL.approved;
  await trade.save();

  //Notification to requester
  await Notification.create({
    userId: trade.requesterId,
    message: "Your trade request has been approved!",
  });

  res.json({ message: "Trade approved", trade });
}));

// Mark trade as completed
router.patch("/:id/complete", protect, asyncHandler(async (req, res) => {
  const trade = await Trade.findById(req.params.id);
  if (!trade) return res.status(404).json({ message: "Trade not found" });

  if (
    trade.ownerId.toString() !== req.userId &&
    trade.requesterId.toString() !== req.userId
  ) {
    return res.status(403).json({ message: "Only participants can complete the trade" });
  }

  trade.status = STATUS_LEVEL.completed;
  await trade.save();

  res.json({ message: "Trade completed", trade });
}));

// Owner declines trade
router.patch("/:id/decline", protect, asyncHandler(async (req, res) => {
  const trade = await Trade.findById(req.params.id);
  if (!trade) return res.status(404).json({ message: "Trade not found" });

  if (trade.ownerId.toString() !== req.userId) {
    return res.status(403).json({ message: "Only the owner can cancel the trade" });
  }

  trade.status = STATUS_LEVEL.declined;
  await trade.save();

  // Notification to requester
  await Notification.create({
    userId: trade.requesterId,
    message: "Your trade request has been declined.",
  });

  res.json({ message: "Trade declined", trade });
}));

export default router;