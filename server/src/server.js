import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

let server;

async function start() {
  try {
    await connectDatabase();
    server = app.listen(env.PORT, () => logger.info({ port: env.PORT }, 'API server listening'));
  } catch (error) {
    logger.fatal({ err: error }, 'Server startup failed');
    process.exitCode = 1;
  }
}

async function shutdown(signal) {
  logger.info({ signal }, 'Shutting down');
  if (server) server.close();
  const mongoose = await import('mongoose');
  await mongoose.default.disconnect();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
