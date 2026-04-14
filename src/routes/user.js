import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// GET my profile
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }),
);

// UPDATE my profile
router.put(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { name, email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let normalizedEmail = user.email;

    if (email) {
      normalizedEmail = email.toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    if (name) user.name = name;
    if (email) user.email = normalizedEmail;

    await user.save();

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Profile updated",
    });
  }),
);

// DELETE my profile
router.delete(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  }),
);

export default router;
