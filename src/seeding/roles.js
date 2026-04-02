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
];

export default async function seedRoles() {
  await Roles.deleteMany({});
  const roles = await Roles.create(rolesData);
  console.log('Roles seeded successfully');
  return roles;
}
