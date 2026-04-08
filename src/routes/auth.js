import { Router } from "express";
import {
  validateRegister,
  validateAuthResult,
} from "../middleware/authValidation.js";
import { createUser, findUserByEmail } from "../db/users.js";

const authRouter = Router();

// POST /auth/register
authRouter.post(
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

      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ error: "Registration failed" });
    }
  },
);

// TODO POST /auth/login

// TODO GET /auth/me
// TODO Validation for User

// TODO PATCH /auth/me
// TODO Validation for User

// TODO PUT /auth/me
// TODO Validation for User

// TODO isSamePassword - comparison
// TODO areset password

export default authRouter;
