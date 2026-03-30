import { Router } from 'express';
import {
  validateRegister,
  validateAuthResult,
} from '../middleware/authValidation.js';
import AuthController from '../controllers/Auth.js';

const router = Router();

router.post(
  '/register',
  validateRegister,
  validateAuthResult,
  AuthController.registerPost
);

router.post('/login', AuthController.loginPost);

router.post('/logout', AuthController.logoutPost);

router.get('/me', AuthController.meGet);

export default router;
