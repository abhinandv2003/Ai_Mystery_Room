import { createHash, randomBytes } from 'node:crypto';
import { GuestSession } from '../models/GuestSession.js';
import { Mystery } from '../models/Mystery.js';
import { InvestigationSession } from '../models/InvestigationSession.js';
import { env } from '../config/env.js';

export const GUEST_COOKIE_NAME = 'amr_guest';

function readCookie(req) {
  const header = req.headers.cookie ?? '';
  const entry = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${GUEST_COOKIE_NAME}=`));
  return entry ? entry.slice(GUEST_COOKIE_NAME.length + 1) : '';
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function setGuestCookie(res, value, maxAge) {
  const secure = env.NODE_ENV === 'production' ? '; Secure' : '';
  res.append('Set-Cookie', `${GUEST_COOKIE_NAME}=${value}; Path=${env.API_BASE_PATH}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`);
}

export async function findGuestSession(req) {
  const token = readCookie(req);
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
  return GuestSession.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
}

export async function createOrReuseGuestSession(req, res) {
  const existing = await findGuestSession(req);
  if (existing) {
    await refreshGuestSession(req, res, existing);
    return existing;
  }

  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000);
  const guestSession = await GuestSession.create({ tokenHash: hashToken(token), expiresAt });
  setGuestCookie(res, token, Math.floor(env.SESSION_TTL_HOURS * 60 * 60));
  return guestSession;
}

export async function refreshGuestSession(req, res, session) {
  const renewalThresholdMs = env.SESSION_TTL_HOURS * 60 * 60 * 1000 / 2;
  if (session.expiresAt.getTime() - Date.now() > renewalThresholdMs) return;

  const token = readCookie(req);
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000);
  await Promise.all([
    GuestSession.updateOne({ _id: session._id }, { $set: { expiresAt } }),
    Mystery.updateMany({ ownerId: session._id }, { $set: { ownerExpiresAt: expiresAt } }, { timestamps: false }),
    InvestigationSession.updateMany({ ownerId: session._id }, { $set: { ownerExpiresAt: expiresAt } }, { timestamps: false }),
  ]);
  session.expiresAt = expiresAt;
  setGuestCookie(res, token, Math.floor(env.SESSION_TTL_HOURS * 60 * 60));
}
