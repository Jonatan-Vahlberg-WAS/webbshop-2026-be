import { body, validationResult } from "express-validator";

export const validatePlant = [
  body("plantName").notEmpty().withMessage("Växtnamn skall vara ifyllt"),
  body("description").notEmpty().withMessage("Beskrivning skall vara ifyllt"),
  body("light").isIn([1, 2, 3]).withMessage("Ogiltigt ljusbehov"),
  body("water").isIn([1, 2, 3]).withMessage("Ogiltigt vattenbehov"),
  body("imageUrl").notEmpty().withMessage("Bild är obligatorisk"),
  body("coordinates").isArray({ min: 2, max: 2 }).withMessage("Koordinater måste vara ifyllda"),
  body("meetingTime").isISO8601().toDate().withMessage("Ogiltig mötestid"),
  body("available").optional().isBoolean().withMessage("Växten måste vara tillgänglig eller inte"),
];


export const validatePlantResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};