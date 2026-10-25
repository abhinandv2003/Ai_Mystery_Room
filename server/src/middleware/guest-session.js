import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { findGuestSession, refreshGuestSession } from '../services/guest-session.service.js';

export const requireGuestSession = asyncHandler(async (req, res, next) => {
  const guestSession = await findGuestSession(req);
  if (!guestSession) throw new ApiError(401, 'UNAUTHORIZED', 'Start or restore a guest session to access this case.');
  await refreshGuestSession(req, res, guestSession);
  req.guestSession = guestSession;
  next();
});
