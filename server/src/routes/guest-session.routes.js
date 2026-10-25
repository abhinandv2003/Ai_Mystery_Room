import { Router } from 'express';
import { createOrReuseGuestSession } from '../services/guest-session.service.js';
import { requireTrustedMutation } from '../middleware/require-trusted-mutation.js';
import { asyncHandler } from '../utils/async-handler.js';
import { z } from 'zod';

const router = Router();

router.post('/', requireTrustedMutation, asyncHandler(async (req, res) => {
  const parsed = z.object({}).strict().safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Guest session creation does not accept owner IDs or client tokens.', details: [] } });
  const session = await createOrReuseGuestSession(req, res);
  res.status(201).json({
    success: true,
    data: { expiresAt: session.expiresAt.toISOString() },
  });
}));

export default router;
