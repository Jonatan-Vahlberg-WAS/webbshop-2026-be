import { body, validationResult } from "express-validator";
import { LIGHT_LEVELS } from "../models/Plant.js";

//Rules that shows error message when data is not valid
export const validatePlant = [
  body("name").notEmpty().withMessage("Name is required"),
  body("image").notEmpty().withMessage("Image is required"),
  //TODO: Add more validation rules as needed
  body("species").notEmpty().withMessage("Species is required"),
  body("lightLevels").notEmpty().isIn([LIGHT_LEVELS.low, LIGHT_LEVELS.partial, LIGHT_LEVELS.bright, LIGHT_LEVELS.directSun]).withMessage("Light Levels must be one of: low, partial, bright, direct Sun"),
  body("ownerId").notEmpty().withMessage("OwnerId is required"),
  body("coordinates").isArray({min: 2, max: 2}).withMessage("Array has to contain two elements"),
  body("meetingTime").notEmpty().withMessage("Meeting time is required"),
];

export function validatePlantResult(req, res, next){
    const errors = validationResult(req)
    if(errors.isEmpty()) {
        return next();
    }
    
    const formattedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg
    }))

    return res.status(400).json({
        errors: formattedErrors
    })
}