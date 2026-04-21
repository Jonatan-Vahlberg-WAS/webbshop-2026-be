import { Router } from 'express';
import requiredRole from '../middleware/roleMiddleware.js';
import { isAuth } from '../middleware/authMiddleware.js';
import UserController from '../controllers/User.js';

const Userrouter = Router();

Userrouter.get(
  '/all',
  isAuth,
  requiredRole('admin'),
  UserController.getAllUserRolls
);

Userrouter.get(
  '/trainers',
  isAuth,
  requiredRole('admin'),
  UserController.getAllTrainers
);

export default Userrouter;
