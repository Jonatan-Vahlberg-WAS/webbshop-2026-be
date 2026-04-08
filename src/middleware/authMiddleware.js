import jwtService from '../auth/jwt.js';

export function isAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const refreshToken = req.headers['x-refresh-token'];

  try {
    // 1. Inget token alls → blockera
    if (!authHeader && !refreshToken) {
      return res.status(401).json({ msg: 'User needs to login' });
    }

    const accessToken = authHeader?.split(' ')[1];

    // 2. Verifiera access token
    const verifiedAccess = jwtService.verifyAccess(accessToken);
    let newAccessToken = null;

    // 3. Om access token är ogiltig → försök med refresh token
    if (!verifiedAccess) {
      const verifiedRefresh = jwtService.verifyRefresh(refreshToken);

      if (!verifiedRefresh) {
        return res.status(401).json({ msg: 'User needs to login' });
      }

      // 4. Skapa nytt access token
      newAccessToken = jwtService.refreshAccessToken(refreshToken);

      // 5. Skicka tillbaka nytt access token i header
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    }

    const activeToken = verifiedAccess || newAccessToken;

    // 6. Lägg userId på req
    req.user = { id: activeToken.userId };

    next();
  } catch (error) {
    next(error);
  }
}
