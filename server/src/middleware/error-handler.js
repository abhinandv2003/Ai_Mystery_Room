import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/api-error.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'The requested resource was not found.', details: [] },
  });
}

export function errorHandler(error, req, res, _next) {
  logger.error({ err: error, method: req.method, path: req.path }, 'Request failed');
  if (res.headersSent) return;
  const status = error instanceof ApiError ? error.status : (Number.isInteger(error.status) ? error.status : 500);
  res.status(status).json({
    success: false,
    error: {
      code: status >= 500 ? 'INTERNAL_SERVER_ERROR' : (error instanceof ApiError ? error.code : 'REQUEST_ERROR'),
      message: status >= 500 ? 'An unexpected server error occurred.' : (error instanceof ApiError ? error.message : 'The request could not be processed.'),
      details: error instanceof ApiError ? error.details : [],
    },
  });
}
