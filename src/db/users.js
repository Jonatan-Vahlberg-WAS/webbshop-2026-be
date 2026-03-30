import User from '../models/User.js';
import bcrypt from 'bcrypt';

export async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

export async function findUserByEmail(email) {
  return await User.findOne({ email });
}

export async function validatePassword(password, userPassword) {
  return await bcrypt.compare(password, userPassword);
}
