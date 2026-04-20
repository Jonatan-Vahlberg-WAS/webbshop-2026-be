import { Router } from 'express';
import { getAllUsers } from '../db/users.js';
import { GetRolesByUser } from '../db/roles.js';
import requiredRole from '../middleware/roleMiddleware.js';
import { isAuth } from '../middleware/authMiddleware.js';

const Userrouter = Router();

Userrouter.get('/', isAuth, requiredRole('admin'), async (req, res) => {
  try {
    const users = await getAllUsers();
    const usersWithRoles = await GetRolesByUser(users);
    res.json(usersWithRoles);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default Userrouter;
