import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import Trade, { STATUS_LEVEL } from "../models/trade.js";
import Plant from "../models/plant.js";

const router = Router();

// Skapa trade‑request
router.post("/", protect, async (req, res) => {
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

  res.status(201).json({ message: "Trade created", trade });
});

// Hämta mina trades (som ägare eller requester)
router.get("/me", protect, async (req, res) => {
  const trades = await Trade.find({
    $or: [{ ownerId: req.userId }, { requesterId: req.userId }],
  })
    .populate("plantId")
    .populate("ownerId", "name email")
    .populate("requesterId", "name email");

  res.json(trades);
});

// Ägare godkänner trade
router.patch("/:id/approve", protect, async (req, res) => {
  const trade = await Trade.findById(req.params.id);
  if (!trade) return res.status(404).json({ message: "Trade not found" });

  if (trade.ownerId.toString() !== req.userId) {
    return res.status(403).json({ message: "Only the owner can approve" });
  }

  trade.status = STATUS_LEVEL.approved;
  await trade.save();

  res.json({ message: "Trade approved", trade });
});

// Markera trade som completed
router.patch("/:id/complete", protect, async (req, res) => {
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
});

export default router;
