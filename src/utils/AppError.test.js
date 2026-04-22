import AppError from './AppError.js';

describe('AppError', () => {
  test('should create an error with message and statusCode', () => {
    const error = new AppError('Test error', 400);

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
  });

  test('should set status to "fail" for 4xx errors', () => {
    const error = new AppError('Bad request', 400);
    expect(error.status).toBe('fail');
  });

  test('should set status to "error" for 5xx errors', () => {
    const error = new AppError('Server error', 500);
    expect(error.status).toBe('error');
  });
});
