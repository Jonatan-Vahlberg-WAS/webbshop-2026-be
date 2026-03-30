import {
  createUser,
  findUserByEmail,
  findUserById,
  validatePassword,
} from '../db/users.js';
import jwtService from '../auth/jwt.js';

class AuthController {
  registerPost = [
    async (req, res) => {
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
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
      }
    },
  ];

  loginPost = [
    async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res
            .status(400)
            .json({ error: 'Email and password are required' });
        }

        const user = await findUserByEmail(email);
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // if (!user.admin) {
        //   return res.status(403).json({ error: 'Access denied' });
        // }

        const isMatch = await validatePassword(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // This sets the refreshToken cookie automatically
        jwtService.generateTokensAndSetCookie(res, user._id);

        return res.json({ success: true });
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed' });
      }
    },
  ];

  logoutPost = [
    (req, res) => {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
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
        res.json(user);
      } catch (error) {
        console.error('Error verifying access token:', error);
        res.status(401).json({ error: 'Invalid token' });
      }
    },
  ];
}

export default new AuthController();
