import Roles from '../models/Roles.js';

const rolesData = [
  {
    name: 'Customer',
    slug: 'customer',
  },
  {
    name: 'Trainer',
    slug: 'trainer',
  },
  {
    name: 'Admin',
    slug: 'admin',
  },
  {
    name: 'Super Admin',
    slug: 'super-admin',
  },
  {
    name: 'Event Manager',
    slug: 'event-manager',
  },
  {
    name: 'Support',
    slug: 'support',
  },
  {
    name: 'Moderator',
    slug: 'moderator',
  },
  {
    name: 'Content Creator',
    slug: 'content-creator',
  },
  {
    name: 'Finance',
    slug: 'finance',
  },
  {
    name: 'Guest',
    slug: 'guest',
  },
];

export default async function seedRoles() {
  await Roles.deleteMany({});
  const roles = await Roles.create(rolesData);
  console.log('Roles seeded successfully');
  return roles;
}
