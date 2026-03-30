import 'dotenv/config';
import { connectToDatabase } from '../config/database.js';
import seedingUsers from './users.js';
import seedingEvents from './events.js';
import seedingEventTypes from './event-types.js';

export default async function seeding() {
  await connectToDatabase();

  console.log('Seeding started');
  await seedingEvents();
  await seedingUsers();
  await seedingEventTypes();
  console.log('Seeding finished');
  process.exit();
}

seeding();
