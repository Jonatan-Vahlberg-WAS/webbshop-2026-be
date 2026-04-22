import { body, validationResult } from "express-validator";

export const validatePlant = [
  body("plantName").notEmpty().withMessage("Plant name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("light").toInt().isIn([1, 2, 3]).withMessage("Invalid light requirement"),
  body("water").toInt().isIn([1, 2, 3]).withMessage("Invalid water requirement"),
  body("imageUrl").notEmpty().withMessage("Image is required"),
  body("coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must contain latitude and longitude"),
  body("meetingTime")
    .isISO8601()
    .toDate()
    .withMessage("Invalid meeting time"),
  body("available")
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage("Available must be true or false"),
];

export const validatePlantUpdate = [
  body("plantName")
    .optional()
    .notEmpty()
    .withMessage("Plant name is required"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description is required"),
  body("light")
    .optional()
    .toInt()
    .isIn([1, 2, 3])
    .withMessage("Invalid light requirement"),
  body("water")
    .optional()
    .toInt()
    .isIn([1, 2, 3])
    .withMessage("Invalid water requirement"),
  body("imageUrl")
    .optional()
    .notEmpty()
    .withMessage("Image is required"),
  body("coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must contain latitude and longitude"),
  body("meetingTime")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid meeting time"),
  body("available")
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage("Available must be true or false"),
];

export const validatePlantResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};