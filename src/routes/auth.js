import { Router } from 'express';
import {
  validateRegister,
  validateAuthResult,
} from '../middleware/authValidation.js';
import AuthController from '../controllers/Auth.js';
import { isAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/register',
  validateRegister,
  validateAuthResult,
  AuthController.registerPost
);

router.post('/login', AuthController.loginPost);

router.get('/me', isAuth, AuthController.meGet);

export default router;
