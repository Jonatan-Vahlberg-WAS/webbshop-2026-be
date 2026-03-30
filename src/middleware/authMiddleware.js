import jwtService from '../auth/jwt.js';

export function isAuth(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;

  try {
    if (!accessToken || !refreshToken)
      return res.status(401).json({ msg: 'User needs to login' });

    if (!jwtService.verifyAccess(accessToken)) {
      if (!jwtService.verifyRefresh(refreshToken)) {
        return res.status(401).json({ msg: 'User needs to login' });
      }
      jwtService.refreshAccessToken(refreshToken);
      next();
    }
    next();
  } catch (error) {
    next(error);
  }
}
