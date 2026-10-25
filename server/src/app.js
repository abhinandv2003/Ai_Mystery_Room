import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import healthRoutes from './routes/health.routes.js';
import demoRoutes from './routes/demo.routes.js';
import guestSessionRoutes from './routes/guest-session.routes.js';
import mysteryRoutes from './routes/mystery.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(pinoHttp({ logger }));
app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX_REQUESTS, standardHeaders: 'draft-7', legacyHeaders: false }));

app.use(env.API_BASE_PATH, healthRoutes);
app.use(`${env.API_BASE_PATH}/guest-session`, guestSessionRoutes);
app.use(`${env.API_BASE_PATH}/mysteries`, mysteryRoutes);
// Deterministic Phase 2 UI fixture only; never expose it in production.
if (env.NODE_ENV !== 'production') app.use(`${env.API_BASE_PATH}/demo`, demoRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
