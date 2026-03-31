import User from '../models/User.js';
import bcrypt from 'bcrypt';
import EventUser from '../models/connecting/EventUser.js';

export async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

export async function findUserByEmail(email) {
  return await User.findOne({ email }, '+password');
}

export async function findUserById(id) {
  return await User.findById(id);
}

export async function validatePassword(password, userPassword) {
  return await bcrypt.compare(password, userPassword);
}

export async function addUserToEvent(userId, eventId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user is already booked for the event
    const existingBooking = await EventUser.findOne({ userId, eventId });
    if (existingBooking) {
      return new Error(
        `${user.firstname} ${user.lastname} is already booked for this event`
      );
    }

    // Create a new booking
    const eventUser = new EventUser({ userId, eventId });
    await eventUser.save();
  } catch (error) {
    console.error('Error adding user to event:', error);
    throw error;
  }
}
