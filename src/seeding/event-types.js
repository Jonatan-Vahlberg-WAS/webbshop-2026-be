import Eventtypes from '../models/Eventtypes.js';

const eventTypesData = [
  { name: 'Yoga', slug: 'yoga' },
  { name: 'Fitness', slug: 'fitness' },
  { name: 'Spa & Wellness', slug: 'spa-wellness' },
  { name: 'Meditation', slug: 'meditation' },
  { name: 'Bootcamp', slug: 'bootcamp' },
  { name: 'Pilates', slug: 'pilates' },
  { name: 'Mindfulness', slug: 'mindfulness' },
  { name: 'Strength Training', slug: 'strength-training' },
  { name: 'Outdoor Training', slug: 'outdoor-training' },
  { name: 'Detox & Recovery', slug: 'detox-recovery' },
];

export default async function seedingEventTypes() {
  await Eventtypes.deleteMany();
  const types = await Eventtypes.create(eventTypesData);
  console.log(`Seeded db with ${types.length} event types`);
  return types;
}
