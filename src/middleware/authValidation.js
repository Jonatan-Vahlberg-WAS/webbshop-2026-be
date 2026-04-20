import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('firstname').notEmpty().trim().withMessage('Firstname is required'),
  body('lastname').notEmpty().trim().withMessage('Lastname is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const validateAuthResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
