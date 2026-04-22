import jwtService from './jwt.js';

describe('jwtService', () => {
  test('signAccess should create a token', () => {
    // Mocka environment variablerna
    process.env.JWT_ACCESS_SECRET = 'test-secret';
    process.env.JWT_ACCESS_EXPIRES = '15m';

    const token = jwtService.signAccess({ userId: 123 });

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
});
