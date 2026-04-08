import jwtService from '../auth/jwt.js';
import RolesUser from '../models/connecting/rolesUsers.js';
import AppError from '../utils/AppError.js';

export function isAuth(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;

  try {
    if (!accessToken && !refreshToken)
      return res.status(401).json({ msg: 'User needs to login' });

    const verifyAccessToken = jwtService.verifyAccess(accessToken);
    let newAccessToken;

    if (!verifyAccessToken) {
      if (!jwtService.verifyRefresh(refreshToken)) {
        return res.status(401).json({ error: 'User needs to login' });
      }
      newAccessToken = jwtService.refreshAccessToken(refreshToken);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: jwtService.getAccessTokenExpiry(), // millisekunder
      });
    }

    const AccessToken = verifyAccessToken || newAccessToken;

    req.user = { id: AccessToken.userId };

    next();
  } catch (error) {
    next(error);
  }
}

export function requiredRole(role) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const userRole = await RolesUser.findOne({ userId }).populate('roleId');

      if (!userRole || userRole.roleId.slug !== role) {
        return next(new AppError('Access denied', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
