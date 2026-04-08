import { Router } from 'express';
import {
  validateRegister,
  validateAuthResult,
} from '../middleware/authValidation.js';
import AuthController from '../controllers/Auth.js';
import { isAuth } from '../middleware/authMiddleware.js';
import { requiredRole } from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/register',
  validateRegister,
  validateAuthResult,
  AuthController.registerPost
);

router.post('/login', AuthController.loginPost);

router.post('/logout', AuthController.logoutPost);

router.get('/me', isAuth, AuthController.meGet);

router.put(
  '/users/:id/role',
  isAuth,
  requiredRole('admin'),
  AuthController.updateUserRole
);

export default router;
