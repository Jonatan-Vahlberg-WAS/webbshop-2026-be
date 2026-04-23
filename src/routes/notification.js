import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import Notification from "../models/notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Get my notifications
router.get("/me", protect, asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.userId })
    .sort({ createdAt: -1 });

  res.json(notifications);
}));

// Mark as read
router.patch("/:id/read", protect, asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.json(notification);
}));

export default router;