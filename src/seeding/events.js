import Event from '../models/Event.js';

const eventsData = [
  {
    title: 'Tech Summit 2026',
    description:
      'A gathering of tech leaders and developers to explore the future of technology.',
    date: new Date('2026-04-15'),
    maxseats: 300,
    location: 'Stockholm',
  },
  {
    title: 'Summer Music Festival',
    description:
      'Three days of live music across multiple stages in the heart of Gothenburg.',
    date: new Date('2026-06-20'),
    maxseats: 5000,
    location: 'Gothenburg',
  },
  {
    title: 'JavaScript Workshop',
    description:
      'Hands-on workshop covering modern JavaScript and Node.js best practices.',
    date: new Date('2026-05-08'),
    maxseats: 40,
    location: 'Online',
  },
  {
    title: 'Malmö Marathon',
    description: 'Annual city marathon open to runners of all levels.',
    date: new Date('2026-09-12'),
    maxseats: 2000,
    location: 'Malmö',
  },
  {
    title: 'Startup Networking Evening',
    description:
      'Meet founders, investors, and builders in the Swedish startup scene.',
    date: new Date('2026-04-28'),
    maxseats: 120,
    location: 'Stockholm',
  },
  {
    title: 'UX Design Conference',
    description:
      'Two-day conference on user experience, accessibility, and product design.',
    date: new Date('2026-10-03'),
    maxseats: 250,
    location: 'Gothenburg',
  },
  {
    title: 'Midsommar Celebration',
    description:
      'Traditional Swedish midsummer celebration with food, music, and dancing.',
    date: new Date('2026-06-19'),
    maxseats: 500,
    location: 'Uppsala',
  },
  {
    title: 'Cybersecurity Bootcamp',
    description:
      'Intensive two-day bootcamp covering ethical hacking and network security basics.',
    date: new Date('2026-11-14'),
    maxseats: 30,
    location: 'Online',
  },
  {
    title: 'Food & Wine Festival',
    description:
      'Explore cuisines from around the world paired with fine wines and local craft beers.',
    date: new Date('2026-08-22'),
    maxseats: 800,
    location: 'Malmö',
  },
  {
    title: 'AI & Machine Learning Seminar',
    description:
      'Industry experts share the latest developments in artificial intelligence.',
    date: new Date('2026-03-05'),
    maxseats: 200,
    location: 'Stockholm',
  },
];

export default async function seedingEvents() {
  await Event.deleteMany();
  const events = await Event.create(eventsData);
  console.log(`Seeded db with ${events.length} events`);
  return events;
}
