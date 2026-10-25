import { Router } from 'express';
import { z } from 'zod';
import { InvestigationSession } from '../models/InvestigationSession.js';
import { Mystery } from '../models/Mystery.js';
import { findOwnedMystery, findReadyMystery, serializeEvidenceIndex, serializeEvidenceItem, serializeInvestigationSession, serializeMystery, serializeMysterySummary } from '../services/mystery-access.service.js';
import { requireGuestSession } from '../middleware/guest-session.js';
import { requireTrustedMutation } from '../middleware/require-trusted-mutation.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
const evidenceFilterSchema = z.object({
  type: z.string().trim().min(1).max(80).optional(),
  suspectId: z.string().trim().min(1).max(80).optional(),
  search: z.string().trim().max(100).optional(),
}).strict();
const caseListQuerySchema = z.object({
  status: z.enum(['queued', 'generating', 'ready', 'failed']).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
}).strict();
const sessionPatchSchema = z.object({
  notes: z.string().max(4000).optional(),
  selectedEvidenceIds: z.array(z.string().trim().min(1).max(80)).max(100).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'Provide notes or selectedEvidenceIds.').superRefine((value, context) => {
  if (value.selectedEvidenceIds && new Set(value.selectedEvidenceIds).size !== value.selectedEvidenceIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['selectedEvidenceIds'], message: 'Evidence IDs must be unique.' });
  }
});

function validationError(error, message) {
  return new ApiError(400, 'VALIDATION_ERROR', message, error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })));
}

function sessionResponse(session, res, status = 200) {
  return res.status(status).json({ success: true, data: serializeInvestigationSession(session) });
}

router.get('/', requireGuestSession, asyncHandler(async (req, res) => {
  const parsed = caseListQuerySchema.safeParse(req.query);
  if (!parsed.success) throw validationError(parsed.error, 'Case list filters are invalid.');
  const { status, page, limit } = parsed.data;
  const filter = { ownerId: req.guestSession._id, ...(status ? { generationStatus: status } : {}) };
  const [items, total] = await Promise.all([
    Mystery.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
    Mystery.countDocuments(filter),
  ]);
  res.json({ success: true, data: { items: items.map(serializeMysterySummary), page, limit, total } });
}));

async function getOrStartSession(mysteryId, ownerId, ownerExpiresAt) {
  try {
    return await InvestigationSession.findOneAndUpdate(
      { mysteryId, ownerId },
      { $setOnInsert: { mysteryId, ownerId, ownerExpiresAt, status: 'active', startedAt: new Date() } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    return InvestigationSession.findOne({ mysteryId, ownerId });
  }
}

router.get('/:caseId/status', requireGuestSession, asyncHandler(async (req, res) => {
  const mystery = await findOwnedMystery(req.params.caseId, req.guestSession._id);
  const progressStage = ({ queued: 'queued', generating: 'assembling_case', ready: 'ready', failed: 'failed' })[mystery.generationStatus] ?? 'unknown';
  const safeError = mystery.generationStatus === 'failed' ? { code: 'GENERATION_FAILED', message: 'This case could not be prepared. Please try again.' } : null;
  res.json({ success: true, data: { caseId: mystery._id.toString(), status: mystery.generationStatus, progressStage, error: safeError } });
}));

router.get('/:caseId/suspects', requireGuestSession, asyncHandler(async (req, res) => {
  const mystery = await findReadyMystery(req.params.caseId, req.guestSession._id);
  const data = serializeMystery(mystery).suspects;
  res.json({ success: true, data });
}));

router.get('/:caseId/evidence/:evidenceId', requireGuestSession, asyncHandler(async (req, res) => {
  const mystery = await findReadyMystery(req.params.caseId, req.guestSession._id);
  const evidence = mystery.evidence.find(({ id }) => id === req.params.evidenceId);
  if (!evidence) throw new ApiError(404, 'NOT_FOUND', 'The requested evidence was not found.');
  res.json({ success: true, data: serializeEvidenceItem(evidence) });
}));

router.get('/:caseId/evidence', requireGuestSession, asyncHandler(async (req, res) => {
  const parsed = evidenceFilterSchema.safeParse(req.query);
  if (!parsed.success) throw validationError(parsed.error, 'Evidence filters are invalid.');
  const mystery = await findReadyMystery(req.params.caseId, req.guestSession._id);
  const { type, suspectId, search } = parsed.data;
  const query = search?.toLocaleLowerCase();
  const evidence = mystery.evidence.filter((item) => {
    if (type && item.type !== type) return false;
    if (suspectId && !item.relatedSuspectIds.includes(suspectId)) return false;
    if (query && !`${item.title} ${item.type} ${item.description} ${item.source ?? ''}`.toLocaleLowerCase().includes(query)) return false;
    return true;
  }).map(serializeEvidenceIndex);
  res.json({ success: true, data: evidence });
}));

router.get('/:caseId/session', requireGuestSession, asyncHandler(async (req, res) => {
  const mystery = await findReadyMystery(req.params.caseId, req.guestSession._id);
  const session = await getOrStartSession(mystery._id, req.guestSession._id, req.guestSession.expiresAt);
  return sessionResponse(session, res);
}));

router.patch('/:caseId/session', requireTrustedMutation, requireGuestSession, asyncHandler(async (req, res) => {
  const parsed = sessionPatchSchema.safeParse(req.body);
  if (!parsed.success) throw validationError(parsed.error, 'The investigation update is invalid.');
  const mystery = await findReadyMystery(req.params.caseId, req.guestSession._id);
  const validEvidenceIds = new Set(mystery.evidence.map(({ id }) => id));
  if (parsed.data.selectedEvidenceIds?.some((id) => !validEvidenceIds.has(id))) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'One or more selected evidence IDs do not belong to this case.');
  }

  const session = await getOrStartSession(mystery._id, req.guestSession._id, req.guestSession.expiresAt);
  if (session.status !== 'active') throw new ApiError(409, 'SESSION_COMPLETED', 'This investigation can no longer be changed.');
  const updated = await InvestigationSession.findOneAndUpdate(
    { _id: session._id, ownerId: req.guestSession._id, status: 'active' },
    { $set: parsed.data },
    { new: true, runValidators: true },
  );
  if (!updated) throw new ApiError(409, 'SESSION_COMPLETED', 'This investigation can no longer be changed.');
  return sessionResponse(updated, res);
}));

router.get('/:caseId', requireGuestSession, asyncHandler(async (req, res) => {
  const mystery = await findReadyMystery(req.params.caseId, req.guestSession._id);
  res.json({ success: true, data: serializeMystery(mystery) });
}));

export default router;
