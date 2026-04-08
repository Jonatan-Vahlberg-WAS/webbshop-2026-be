import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = Router();

// get my profile
router.get("/me", protect, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "Användare hittades inte" });
  }

  res.json({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});
});


// update my profile
router.put("/me", protect, async (req, res) => {
  const userId = req.userId;
  const { name, email } = req.body;

  // @läsa
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "Användare hittades inte" });
  }
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: "Email används redan" });
    }
  }
  user.name = name || user.name;
  user.email = email || user.email;
  await user.save();
  res.json({ name: user.name, email: user.email, role: user.role, message: "Användaruppgifter uppdaterades" });
});


  // DELETE my profile
  router.delete("/me", protect, async (req, res) => {
    const userId = req.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }
    res.json({ message: "Användare raderad" });
  });


export default router;
