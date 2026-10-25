import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

const allowedOrigin = new URL(env.CLIENT_URL).origin;

export function requireTrustedMutation(req, _res, next) {
  const origin = req.get('Origin');
  if ((origin && origin !== allowedOrigin) || req.get('X-AMR-Request') !== '1') {
    return next(new ApiError(403, 'FORBIDDEN', 'This request could not be verified. Refresh the application and try again.'));
  }
  return next();
}
