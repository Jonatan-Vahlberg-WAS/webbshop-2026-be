import {
  createUser,
  findUserByEmail,
  findUserById,
  validatePassword,
} from '../db/users.js';
import jwtService from '../auth/jwt.js';
import AppError from '../utils/AppError.js';

class AuthController {
  registerPost = [
    async (req, res, next) => {
      try {
        const { name, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          return res.status(409).json({ error: 'Email already registered' });
        }

        const user = await createUser({ name, email, password });
        res.status(201).json({
          id: user._id,
          name: user.name,
          email: user.email,
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

        // if (!user.admin) {
        //   return res.status(403).json({ error: 'Access denied' });
        // }

        const isMatch = await validatePassword(password, user.password);
        if (!isMatch) {
          return next(new AppError('Invalid email or password', 401));
        }

        // This sets the refreshToken cookie automatically
        jwtService.generateTokensAndSetHeaders(res, user._id);

        return res.json({ success: true });
      } catch (error) {
        next(error);
      }
    },
  ];

  logoutPost = [
    (req, res) => {
      res.deleteHeader('Authorization');
      res.deleteHeader('X-Refresh-Token');
      res.json({ success: true });
    },
  ];

  meGet = [
    async (req, res) => {
      const { id: userId } = req.user;
      try {
        if (req.user?.userId) {
          return res.status(401).json({ loggedIn: false });
        }

        const user = await findUserById(userId);
        res.status(200).json(user);
      } catch (error) {
        next(new AppError('Invalid token', 401));
      }
    },
  ];
}

export default new AuthController();
