import User from '../models/User.js';

const usersData = [
  {
    firstname: 'Admin',
    lastname: 'User',
    email: 'admin@example.com',
    password: 'Admin123!',
    admin: true,
    phone: '+46700000001',
  },
  {
    firstname: 'Anna',
    lastname: 'Lindqvist',
    email: 'anna.lindqvist@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000002',
  },
  {
    firstname: 'Erik',
    lastname: 'Johansson',
    email: 'erik.johansson@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000003',
  },
  {
    firstname: 'Maria',
    lastname: 'Svensson',
    email: 'maria.svensson@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000004',
  },
  {
    firstname: 'Lars',
    lastname: 'Petersson',
    email: 'lars.petersson@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000005',
  },
  {
    firstname: 'Sofia',
    lastname: 'Nilsson',
    email: 'sofia.nilsson@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000006',
  },
  {
    firstname: 'Johan',
    lastname: 'Bergström',
    email: 'johan.bergstrom@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000007',
  },
  {
    firstname: 'Emma',
    lastname: 'Karlsson',
    email: 'emma.karlsson@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000008',
  },
  {
    firstname: 'Patrik',
    lastname: 'Holm',
    email: 'patrik.holm@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000009',
  },
  {
    firstname: 'Linda',
    lastname: 'Ekström',
    email: 'linda.ekstrom@example.com',
    password: 'Password123!',
    admin: false,
    phone: '+46700000010',
  },
];

export default async function seedingUsers() {
  await User.deleteMany();
  const users = await User.create(usersData);
  console.log(`Seeded db with ${users.length} users`);
  return users;
}
