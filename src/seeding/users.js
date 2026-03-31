import User from '../models/User.js';

const usersData = [
  {
    firstname: 'Admin',
    lastname: 'User',
    email: 'admin@example.com',
    password: 'Admin123!',
    admin: true,
  },
  {
    firstname: 'Anna',
    lastname: 'Lindqvist',
    email: 'anna.lindqvist@example.com',
    password: 'Password123!',
    admin: false,
  },
  {
    firstname: 'Erik',
    lastname: 'Johansson',
    email: 'erik.johansson@example.com',
    password: 'Password123!',
    admin: false,
  },
  {
    firstname: 'Maria',
    lastname: 'Svensson',
    email: 'maria.svensson@example.com',
    password: 'Password123!',
    admin: false,
  },
  {
    firstname: 'Lars',
    lastname: 'Petersson',
    email: 'lars.petersson@example.com',
    password: 'Password123!',
    admin: false,
  },
  {
    firstname: 'Sofia',
    lastname: 'Nilsson',
    email: 'sofia.nilsson@example.com',
    password: 'Password123!',
    admin: false,
  },
  {
    firstname: 'Johan',
    lastname: 'Bergström',
    email: 'johan.bergstrom@example.com',
    password: 'Password123!',
    admin: false,
  },
  {
    firstname: 'Emma',
    lastname: 'Karlsson',
    email: 'emma.karlsson@example.com',
    password: 'Password123!',
    admin: false,
  },
];

export default async function seedingUsers() {
  await User.deleteMany();
  const users = await User.create(usersData);
  console.log(`Seeded db with ${users.length} users`);
  return users;
}
