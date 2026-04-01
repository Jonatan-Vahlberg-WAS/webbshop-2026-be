import { Router } from "express";
import {
  validateRegister,
  validateAuthResult,
} from "../middleware/authValidation.js";
import { createUser, findUserByEmail } from "../db/users.js";
// import jsontoken from "jsonwebtoken";
import jwt from "jsonwebtoken";

const router = Router();

// Skapa konto
router.post(
  "/register",
  validateRegister,
  validateAuthResult,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const user = await createUser({ name, email, password });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({
        message: "User registered successfully",
        user: { name: user.name, email: user.email },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  },
);

// login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    console.log(user)
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      message: "Login successful",
      user: { name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
