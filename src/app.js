import 'dotenv/config';
import express from 'express';
import eventRouter from './routes/Event.js';
import authRouter from './routes/auth.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

// Middleware
app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
//TODO: Add more routes as needed

export default app;
