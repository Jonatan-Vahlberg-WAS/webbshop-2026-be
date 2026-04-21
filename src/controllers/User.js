import { getAllUsers } from '../db/users.js';
import { GetRolesByUser, getTrainers } from '../db/roles.js';

class UserController {
  getAllUserRolls = [
    async (req, res, next) => {
      try {
        const users = await getAllUsers();
        const usersWithRoles = await GetRolesByUser(users);
        res.json(usersWithRoles);
      } catch (error) {
        console.error('Error fetching users:', error);
        next(error);
      }
    },
  ];

  getAllTrainers = [
    async (req, res, next) => {
      try {
        const trainers = await getTrainers();
        res.status(200).json(trainers);
      } catch (error) {
        console.error(error);
        next(error);
      }
    },
  ];
}

export default new UserController();
