import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";


// Token‑middleware (skyddar routes)
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin‑middleware (rollkontroll)
export const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden – admin only" });
  }

  next();
};

// Validation‑middleware för registrering
export const validateRegister = [
  body("name").notEmpty().trim().withMessage("Namn är obligatoriskt"),
  body("email").isEmail().normalizeEmail().withMessage("En giltig e-postadress är obligatorisk"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Lösenord måste vara minst 6 tecken"),
];

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
