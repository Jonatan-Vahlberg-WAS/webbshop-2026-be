import 'dotenv/config';
import { connectToDatabase } from '../config/database.js';
import seedingUsers from './users.js';
import seedingEvents from './events.js';
import seedingRoles from './roles.js';
import seedingEventTypes from './event-types.js';
import EventsEventtypes from '../models/connecting/eventsEventtypes.js';
import EventUser from '../models/connecting/EventUser.js';
import RolesUsers from '../models/connecting/rolesUsers.js';

export default async function seeding() {
  await connectToDatabase();

  console.log('Seeding started');
  const users = await seedingUsers();
  const roles = await seedingRoles();

  await RolesUsers.deleteMany();
  const rolesUsers = await RolesUsers.create([
    { roleId: roles[2]._id, userId: users[0]._id }, // Admin
    { roleId: roles[0]._id, userId: users[1]._id }, // Anna - Customer
    { roleId: roles[1]._id, userId: users[2]._id }, // Erik - Trainer
    { roleId: roles[0]._id, userId: users[3]._id }, // Maria - Customer
    { roleId: roles[1]._id, userId: users[4]._id }, // Lars - Trainer
    { roleId: roles[0]._id, userId: users[5]._id }, // Sofia - Customer
    { roleId: roles[1]._id, userId: users[6]._id }, // Johan - Trainer
    { roleId: roles[0]._id, userId: users[7]._id }, // Emma - Customer
    { roleId: roles[0]._id, userId: users[8]._id }, // Patrik - Customer
    { roleId: roles[0]._id, userId: users[9]._id }, // Linda - Customer
  ]);
  console.log(`Seeded db with ${rolesUsers.length} user -> role`);

  const types = await seedingEventTypes();
  // Pass trainers: Erik = users[2], Lars = users[4], Johan = users[6]
  const events = await seedingEvents([users[2], users[4], users[6]]);

  await EventsEventtypes.deleteMany();
  const eventEventTypes = await EventsEventtypes.create([
    // Morning Yoga Flow → Yoga
    { eventId: events[0]._id, eventtypesId: types[0]._id },

    // HIIT Power Session → Fitness
    { eventId: events[1]._id, eventtypesId: types[1]._id },

    // Deep Relaxation Spa Day → Spa & Wellness
    { eventId: events[2]._id, eventtypesId: types[2]._id },

    // Outdoor Bootcamp → Bootcamp + Outdoor Training
    { eventId: events[3]._id, eventtypesId: types[4]._id },
    { eventId: events[3]._id, eventtypesId: types[8]._id },

    // Hot Yoga Detox → Yoga + Detox & Recovery
    { eventId: events[4]._id, eventtypesId: types[0]._id },
    { eventId: events[4]._id, eventtypesId: types[9]._id },

    // Pilates Core Strength → Pilates
    { eventId: events[5]._id, eventtypesId: types[5]._id },

    // Mindfulness & Meditation Workshop → Mindfulness + Meditation
    { eventId: events[6]._id, eventtypesId: types[6]._id },
    { eventId: events[6]._id, eventtypesId: types[3]._id },

    // Strength Training Fundamentals → Strength Training
    { eventId: events[7]._id, eventtypesId: types[7]._id },

    // Spa & Wellness Evening → Spa & Wellness
    { eventId: events[8]._id, eventtypesId: types[2]._id },

    // Sunrise Beach Yoga → Yoga + Outdoor Training
    { eventId: events[9]._id, eventtypesId: types[0]._id },
    { eventId: events[9]._id, eventtypesId: types[8]._id },
  ]);

  console.log(`Seeded db with ${eventEventTypes.length} event types -> event `);

  await EventUser.deleteMany();
  const eventUser = await EventUser.create([
    // Morning Yoga Flow
    { eventId: events[0]._id, userId: users[1]._id },
    { eventId: events[0]._id, userId: users[3]._id },
    { eventId: events[0]._id, userId: users[5]._id },
    { eventId: events[0]._id, userId: users[9]._id },
    // HIIT Power Session
    { eventId: events[1]._id, userId: users[8]._id },
    // Deep Relaxation Spa Day
    { eventId: events[2]._id, userId: users[1]._id },
    { eventId: events[2]._id, userId: users[3]._id },
    { eventId: events[2]._id, userId: users[7]._id },
    { eventId: events[2]._id, userId: users[9]._id },
    // Outdoor Bootcamp
    { eventId: events[3]._id, userId: users[8]._id },
    // Hot Yoga Detox
    { eventId: events[4]._id, userId: users[5]._id },
    { eventId: events[4]._id, userId: users[7]._id },
    { eventId: events[4]._id, userId: users[9]._id },
    // Pilates Core Strength
    { eventId: events[5]._id, userId: users[1]._id },
    { eventId: events[5]._id, userId: users[3]._id },
    { eventId: events[5]._id, userId: users[5]._id },
    // Mindfulness & Meditation Workshop
    { eventId: events[6]._id, userId: users[1]._id },
    { eventId: events[6]._id, userId: users[3]._id },
    { eventId: events[6]._id, userId: users[7]._id },
    { eventId: events[6]._id, userId: users[9]._id },
    // Strength Training Fundamentals
    { eventId: events[7]._id, userId: users[8]._id },
    // Spa & Wellness Evening
    { eventId: events[8]._id, userId: users[1]._id },
    { eventId: events[8]._id, userId: users[5]._id },
    { eventId: events[8]._id, userId: users[7]._id },
    { eventId: events[8]._id, userId: users[9]._id },
    // Sunrise Beach Yoga
    { eventId: events[9]._id, userId: users[1]._id },
    { eventId: events[9]._id, userId: users[3]._id },
    { eventId: events[9]._id, userId: users[5]._id },
    { eventId: events[9]._id, userId: users[7]._id },
    { eventId: events[9]._id, userId: users[9]._id },
  ]);
  console.log(`Seeded db with ${eventUser.length} user -> event`);

  console.log('Seeding finished');
  process.exit();
}

seeding();
