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
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  },

  verifyRefresh(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
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
   * Generate access + refresh tokens and set refresh token as cookie
   * No database storage
   */
  generateTokensAndSetCookie(res, userId) {
    const accessToken = this.signAccess({ userId });
    const refreshToken = this.signRefresh({ userId });

    const isProd = process.env.NODE_ENV === 'production';

    // Access token cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: this.getAccessTokenExpiry(), // millisekunder
    });

    // Refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      expires: this.getRefreshTokenExpiry(), // datum
    });

    return accessToken; // om du vill returnera den också
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
