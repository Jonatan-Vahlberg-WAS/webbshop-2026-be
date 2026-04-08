import jwt from 'jsonwebtoken';

const jwtService = {
  signAccess(payload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });
  },

  signRefresh(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d',
    });
  },

  verifyAccess(token) {
    return jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET,
      function (err, decoded) {
        if (err) {
          if (err?.message == 'jwt expired') return false;
        }
        return decoded;
      }
    );
  },

  verifyRefresh(token) {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
      function (err, decoded) {
        if (err) {
          if (err?.message == 'jwt expired') return false;
        }
        return decoded;
      }
    );
  },

  getRefreshTokenExpiry() {
    const expiresIn = process.env.JWT_REFRESH_EXPIRES || '30d';
    const now = Math.floor(Date.now() / 1000);

    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn);

    const seconds =
      unit === 'd'
        ? value * 86400
        : unit === 'h'
          ? value * 3600
          : unit === 'm'
            ? value * 60
            : value;

    return new Date((now + seconds) * 1000);
  },

  getAccessTokenExpiry() {
    const expiresIn = process.env.JWT_ACCESS_EXPIRES || '15m';
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn);

    const seconds =
      unit === 'd'
        ? value * 86400
        : unit === 'h'
          ? value * 3600
          : unit === 'm'
            ? value * 60
            : value;

    return seconds * 1000;
  },

  /**
   * Generate access + refresh tokens and set refresh token in headers
   * No database storage
   */
  generateTokensAndSetHeaders(res, userId) {
    const accessToken = this.signAccess({ userId });
    const refreshToken = this.signRefresh({ userId });

    // Sätt tokens i headers
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('X-Refresh-Token', refreshToken);

    // Returnera tokens i respons-body
    return {
      accessToken,
      refreshToken,
    };
  },

  /**
   * Refresh access token using refresh token from cookie
   */
  refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    const decoded = this.verifyRefresh(refreshToken);
    return this.signAccess({ userId: decoded.userId });
  },
};

export default jwtService;
