import Event from '../models/Event.js';

const eventsData = [
  {
    title: 'Morning Yoga Flow',
    description:
      'A calming morning yoga session focusing on breathwork, flexibility, and mindfulness.',
    time: {
      date: '2026-03-12',
      startTime: '07:30',
      endTime: '08:30',
    },
    maxseats: 25,
    location: 'Stockholm Yoga Studio',
    price: 149,
  },
  {
    title: 'HIIT Power Session',
    description:
      'High‑intensity interval training designed to boost endurance and burn calories fast.',
    time: {
      date: '2026-04-02',
      startTime: '18:00',
      endTime: '19:00',
    },
    maxseats: 30,
    location: 'Gothenburg Fitness Center',
    price: 199,
  },
  {
    title: 'Deep Relaxation Spa Day',
    description:
      'A full‑day spa experience including sauna, massage, aromatherapy, and guided relaxation.',
    time: {
      date: '2026-05-18',
      startTime: '10:00',
      endTime: '17:00',
    },
    maxseats: 40,
    location: 'Malmö Harmony Spa',
    price: 1299,
  },
  {
    title: 'Outdoor Bootcamp',
    description:
      'A fun and challenging outdoor bootcamp with strength circuits, cardio, and team exercises.',
    time: {
      date: '2026-06-05',
      startTime: '09:00',
      endTime: '10:30',
    },
    maxseats: 50,
    location: 'Uppsala City Park',
    price: 179,
  },
  {
    title: 'Hot Yoga Detox',
    description:
      'A heated yoga class designed to improve flexibility, detoxify the body, and increase focus.',
    time: {
      date: '2026-07-11',
      startTime: '17:00',
      endTime: '18:15',
    },
    maxseats: 20,
    location: 'Stockholm Heat Studio',
    price: 249,
  },
  {
    title: 'Pilates Core Strength',
    description:
      'A pilates session focused on core stability, posture, and controlled movement.',
    time: {
      date: '2026-08-03',
      startTime: '16:00',
      endTime: '17:00',
    },
    maxseats: 25,
    location: 'Gothenburg Wellness Center',
    price: 199,
  },
  {
    title: 'Mindfulness & Meditation Workshop',
    description:
      'A guided workshop teaching meditation techniques, stress reduction, and mental clarity.',
    time: {
      date: '2026-09-14',
      startTime: '14:00',
      endTime: '16:00',
    },
    maxseats: 40,
    location: 'Online',
    price: 299,
  },
  {
    title: 'Strength Training Fundamentals',
    description:
      'Learn proper lifting technique, form, and strength‑building fundamentals.',
    time: {
      date: '2026-10-09',
      startTime: '18:00',
      endTime: '19:30',
    },
    maxseats: 20,
    location: 'Malmö Strength Lab',
    price: 249,
  },
  {
    title: 'Spa & Wellness Evening',
    description:
      'An evening of relaxation with spa treatments, herbal teas, and guided breathing exercises.',
    time: {
      date: '2026-11-22',
      startTime: '17:00',
      endTime: '21:00',
    },
    maxseats: 35,
    location: 'Uppsala Serenity Spa',
    price: 899,
  },
  {
    title: 'Sunrise Beach Yoga',
    description:
      'A peaceful sunrise yoga session by the water, perfect for starting the day with clarity.',
    time: {
      date: '2026-07-20',
      startTime: '05:30',
      endTime: '06:30',
    },
    maxseats: 40,
    location: 'Varberg Beach',
    price: 159,
  },
];

// trainers: [erik, lars, johan]
export default async function seedingEvents(trainers = []) {
  const [erik, lars, johan] = trainers;

  const trainerAssignments = [
    lars, // Morning Yoga Flow
    erik, // HIIT Power Session
    johan, // Deep Relaxation Spa Day
    lars, // Outdoor Bootcamp
    johan, // Hot Yoga Detox
    johan, // Pilates Core Strength
    lars, // Mindfulness & Meditation Workshop
    erik, // Strength Training Fundamentals
    johan, // Spa & Wellness Evening
    lars, // Sunrise Beach Yoga
  ];

  const dataWithTrainers = eventsData.map((event, i) => ({
    ...event,
    trainerid: trainerAssignments[i]?._id,
  }));

  await Event.deleteMany();
  const events = await Event.create(dataWithTrainers);
  console.log(`Seeded db with ${events.length} events`);
  return events;
}
