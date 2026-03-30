import Eventtypes from '../models/Eventtypes.js';

const eventTypesData = [
  { name: 'Concert', slug: 'concert' },
  { name: 'Conference', slug: 'conference' },
  { name: 'Workshop', slug: 'workshop' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Festival', slug: 'festival' },
  { name: 'Networking', slug: 'networking' },
];

export default async function seedingEventTypes() {
  await Eventtypes.deleteMany();
  const types = await Eventtypes.create(eventTypesData);
  console.log(`Seeded db with ${types.length} event types`);
  return types;
}
