import { Router } from 'express';
import {
  validateRegister,
  validateAuthResult,
} from '../middleware/authValidation.js';
import { createUser, findUserByEmail, validatePassword } from '../db/users.js';
import jwtService from '../auth/jwt.js';

const router = Router();

router.post(
  '/register',
  validateRegister,
  validateAuthResult,
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
  }
);

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

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
});

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

router.get('/me', (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.json({ loggedIn: false });
  }

  try {
    const decoded = jwtService.verifyAccess(accessToken);

    if (!decoded) {
      return res.json({ loggedIn: false });
    }

    res.json({ loggedIn: true });
  } catch (error) {
    console.error('Error verifying access token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
