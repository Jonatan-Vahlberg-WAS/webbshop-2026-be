import 'dotenv/config';
import express from 'express';
import { connectToDatabase } from './config/database.js';
import eventRouter from './routes/Event.js';
import authRouter from './routes/auth.js';
import typesRouter from './routes/types.js';
import cors from 'cors';
import mongoose from 'mongoose';
import errorHandler from './middleware/errorHandler.js';
import Userrouter from './routes/user.js';

const app = express();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Change to frontend URL when ready
const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
];

// Middleware
app.use(
  cors({
    exposedHeaders: ['Authorization', 'X-Refresh-Token'],
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectToDatabase();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Webbshop API',
    stack: 'MEN (MongoDB, Express, Node.js)',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/types', typesRouter);
app.use('/api/users', Userrouter);
app.use(errorHandler);

export default app;
