import 'dotenv/config';
import express from 'express';
import { connectToDatabase } from './config/database.js';

import eventRouter from './routes/Event.js';
import authRouter from './routes/auth.js';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import cors from "cors";

const app = express();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Middleware
app.use(cors('*'));
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
//TODO: Add more routes as needed

export default app;
