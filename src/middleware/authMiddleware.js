import jwtService from '../auth/jwt.js';
import { findUserById } from '../db/users.js';

export function isAuth(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;

  try {
    if (!accessToken && !refreshToken)
      return res.status(401).json({ msg: 'User needs to login' });

    if (!accessToken) {
      if (!jwtService.verifyRefresh(refreshToken)) {
        return res.status(401).json({ error: 'User needs to login' });
      }
      const newAccessToken = jwtService.refreshAccessToken(refreshToken);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: jwtService.getAccessTokenExpiry(), // millisekunder
      });
    }

    const verifyAccessToken = jwtService.verifyAccess(accessToken);

    req.user = { id: verifyAccessToken.userId };
    next();
  } catch (error) {
    next(error);
  }
}

export async function isAdmin(req, res, next) {
  const { id: userId } = req.user;

  const user = await findUserById(userId);

  if (!user?.admin) return res.status(403).json({ error: 'Access denied' });

  next();
}
