// src/routes/admin.js
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Plant from "../models/plant.js";
import Trade from "../models/trade.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// GET all users
router.get("/users", protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));

// GET user by ID
router.get("/user/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}));

// UPDATE user by ID
router.put("/user/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (email) {
    const normalized = email.toLowerCase();
    const existing = await User.findOne({ email: normalized });

    if (existing && existing._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Email is already in use" });
    }
  }

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { name, email: email?.toLowerCase() },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: "User not found" });

  res.json(updated);
}));

// DELETE user by ID
router.delete("/user/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
}));

// Get all plants (for admin overview)
router.get("/plants", protect, adminOnly, asyncHandler(async (req, res) => {
  const plants = await Plant.find().populate("ownerId", "name email");
  res.json(plants);
}));


// Ta bort en planta (för admin)
router.delete("/plant/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) return res.status(404).json({ message: "Plant not found" });

  res.json({ message: "Plant deleted by admin" });
}));

// Get all trades (for admin)
router.get("/trades", protect, adminOnly, asyncHandler(async (req, res) => {
  const trades = await Trade.find()
    .populate("plantId")
    .populate("ownerId", "name email")
    .populate("requesterId", "name email");

  res.json(trades);
}));

export default router;
