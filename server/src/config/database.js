import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase() {
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  logger.info({ database: mongoose.connection.name }, 'MongoDB connected');
}
