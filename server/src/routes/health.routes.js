import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  const healthy = databaseConnected;
  res.status(healthy ? 200 : 503).json({
    success: healthy,
    data: {
      status: healthy ? 'ok' : 'degraded',
      service: 'ai-mystery-room-api',
      timestamp: new Date().toISOString(),
      dependencies: { database: databaseConnected ? 'connected' : 'disconnected' },
    },
  });
});

export default router;
