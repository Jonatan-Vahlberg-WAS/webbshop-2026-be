// src/routes/auth.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateRegister, validateResult } from "../middleware/authMiddleware.js";

const router = Router();

// REGISTER
router.post("/register", validateRegister, validateResult, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email redan existerar" });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Registrering lyckades",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Registreringsfel:", err);
    res.status(500).json({ error: "Registrering misslyckades" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Ogiltig email eller lösenord" });
    }

    const isMatch = await user.isSamePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Ogiltig email eller lösenord" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Inloggning lyckades",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login fel:", err);
    res.status(500).json({ error: "Inloggning misslyckades" });
  }
});

export default router;
