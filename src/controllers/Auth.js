import {
  createUser,
  findUserByEmail,
  findUserById,
  validatePassword,
} from '../db/users.js';
import jwtService from '../auth/jwt.js';
import AppError from '../utils/AppError.js';
import { getUserRoles } from '../db/roles.js';

class AuthController {
  registerPost = [
    async (req, res, next) => {
      try {
        const { firstname, lastname, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          return res.status(409).json({ error: 'Email already registered' });
        }

        const user = await createUser({ firstname, lastname, email, password });

        if (!user) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        jwtService.generateTokensAndSetHeaders(res, user._id);

        const roles = await getUserRoles(user._id);

        const isAdmin = roles.includes('admin');

        res.status(201).json({
          id: user._id,
          firstname,
          lastname,
          email,
          isAdmin,
          roles,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  loginPost = [
    async (req, res, next) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res
            .status(400)
            .json({ error: 'Email and password are required' });
        }

        const user = await findUserByEmail(email);
        if (!user) {
          return next(new AppError('Invalid email or password', 401));
        }

        const isMatch = await validatePassword(password, user.password);
        if (!isMatch) {
          return next(new AppError('Invalid email or password', 401));
        }

        // This sets the refreshToken cookie automatically
        jwtService.generateTokensAndSetHeaders(res, user._id);

        // Check if user is admin

        const isAdmin = await getUserRoles(user._id).then((roles) =>
          roles.includes('admin')
        );

        return res.status(200).json({ success: true, isAdmin });
      } catch (error) {
        next(error);
      }
    },
  ];

  meGet = [
    async (req, res, next) => {
      const { id: userId } = req.user;
      try {
        if (!userId) {
          return res.status(401).json({ loggedIn: false });
        }

        const user = await findUserById(userId);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const roles = await getUserRoles(userId);

        res.status(200).json({ ...user.toObject(), roles });
      } catch (error) {
        next(new AppError('Invalid token', 401));
      }
    },
  ];
}

export default new AuthController();
