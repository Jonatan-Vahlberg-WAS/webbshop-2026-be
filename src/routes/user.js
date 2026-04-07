import { Router } from "express";
import { protectReq } from "../middleware/authToken.js";
const router = Router();
import User from "../models/User.js";

// get my profile
router.get("/me", protectReq, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});


// update my profile
router.put("/me", protectReq, async (req, res) => {
  const userId = req.userId;
  const { name, email } = req.body;

  // @läsa
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }
  user.name = name || user.name;
  user.email = email || user.email;
  await user.save();
  res.json(user);
  
  });


  // DELETE my profile
  router.delete("/me", protectReq, async (req, res) => {
    const userId = req.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  });


export default router;
