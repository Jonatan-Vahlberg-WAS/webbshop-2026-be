// src/routes/admin.js
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// GET all users
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET user by ID
router.get("/user/:id", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE user by ID
router.put("/user/:id", protect, adminOnly, async (req, res) => {
  const { name, email } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { name, email },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: "User not found" });

  res.json(updated);
});

// DELETE user by ID
router.delete("/user/:id", protect, adminOnly, async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
});

export default router;
