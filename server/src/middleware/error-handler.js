import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `No route matches ${req.method} ${req.path}.` },
  });
}

export function errorHandler(error, req, res, _next) {
  logger.error({ err: error, method: req.method, path: req.path }, 'Request failed');
  if (res.headersSent) return;
  const status = Number.isInteger(error.status) ? error.status : 500;
  res.status(status).json({
    success: false,
    error: {
      code: status >= 500 ? 'INTERNAL_SERVER_ERROR' : (error.code ?? 'REQUEST_ERROR'),
      message: status >= 500 ? 'An unexpected server error occurred.' : error.message,
    },
  });
}
