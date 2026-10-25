import mongoose from 'mongoose';
import { Mystery } from '../models/Mystery.js';
import { ApiError } from '../utils/api-error.js';

export async function findOwnedMystery(caseId, ownerId) {
  if (!mongoose.isObjectIdOrHexString(caseId)) throw new ApiError(404, 'NOT_FOUND', 'The requested case was not found.');
  const mystery = await Mystery.findOne({ _id: caseId, ownerId });
  if (!mystery) throw new ApiError(404, 'NOT_FOUND', 'The requested case was not found.');
  return mystery;
}

export async function findReadyMystery(caseId, ownerId) {
  const mystery = await findOwnedMystery(caseId, ownerId);
  if (mystery.generationStatus !== 'ready') {
    throw new ApiError(409, 'CASE_NOT_READY', 'This case is not ready to investigate yet.');
  }
  return mystery;
}

function serializeSuspect(suspect) {
  return {
    id: suspect.id,
    name: suspect.name,
    role: suspect.role,
    ...(suspect.age == null ? {} : { age: suspect.age }),
    personality: suspect.personality ?? '',
    motive: suspect.motive,
    publicAlibi: suspect.publicAlibi,
    statements: (suspect.statements ?? []).map((statement) => ({
      id: statement.id,
      text: statement.text,
      ...(statement.timestamp ? { timestamp: statement.timestamp.toISOString() } : {}),
      source: statement.source ?? '',
    })),
    relationships: (suspect.relationships ?? []).map((relationship) => ({ suspectId: relationship.suspectId, description: relationship.description })),
    profileAssetId: suspect.profileAssetId ?? null,
  };
}

function serializeEvidence(evidence, { includeContent = false } = {}) {
  return {
    id: evidence.id,
    title: evidence.title,
    type: evidence.type,
    description: evidence.description,
    discoveryContext: evidence.discoveryContext ?? '',
    ...(evidence.timestamp ? { timestamp: evidence.timestamp.toISOString() } : {}),
    source: evidence.source ?? '',
    ...(includeContent ? { content: evidence.content } : {}),
    asset: evidence.asset?.toObject ? evidence.asset.toObject({ depopulate: true }) : (evidence.asset ?? { kind: 'none', url: null, alt: '', placeholder: false }),
    relatedSuspectIds: evidence.relatedSuspectIds ?? [],
    relatedEventIds: evidence.relatedEventIds ?? [],
    credibility: evidence.credibility,
  };
}

function serializeTimelineEvent(event) {
  return {
    id: event.id,
    timestamp: event.timestamp.toISOString(),
    title: event.title,
    description: event.description,
    sourceEvidenceIds: event.sourceEvidenceIds ?? [],
    certainty: event.certainty,
  };
}

export function serializeMystery(mystery) {
  return {
    id: mystery._id.toString(),
    title: mystery.title,
    summary: mystery.summary,
    genre: mystery.genre,
    difficulty: mystery.difficulty,
    setting: mystery.setting,
    ...(mystery.incidentDate ? { incidentDate: mystery.incidentDate.toISOString() } : {}),
    incidentLocation: mystery.incidentLocation,
    briefing: mystery.briefing,
    investigationObjectives: mystery.investigationObjectives ?? [],
    generationStatus: mystery.generationStatus,
    suspects: mystery.suspects.map(serializeSuspect),
    evidence: mystery.evidence.map((evidence) => serializeEvidence(evidence)),
    timeline: mystery.timeline.map(serializeTimelineEvent),
    createdAt: mystery.createdAt.toISOString(),
    updatedAt: mystery.updatedAt.toISOString(),
  };
}

export function serializeMysterySummary(mystery) {
  return {
    id: mystery._id.toString(),
    title: mystery.title,
    summary: mystery.summary,
    difficulty: mystery.difficulty,
    generationStatus: mystery.generationStatus,
    createdAt: mystery.createdAt.toISOString(),
    updatedAt: mystery.updatedAt.toISOString(),
  };
}

export function serializeEvidenceIndex(evidence) {
  return serializeEvidence(evidence);
}

export function serializeEvidenceItem(evidence) {
  return serializeEvidence(evidence, { includeContent: true });
}

export function serializeInvestigationSession(session) {
  return {
    id: session._id.toString(),
    mysteryId: session.mysteryId.toString(),
    status: session.status,
    selectedEvidenceIds: session.selectedEvidenceIds,
    notes: session.notes,
    startedAt: session.startedAt.toISOString(),
    ...(session.completedAt ? { completedAt: session.completedAt.toISOString() } : {}),
    updatedAt: session.updatedAt.toISOString(),
  };
}
