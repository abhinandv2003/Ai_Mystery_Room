import mongoose from 'mongoose';

const { Schema } = mongoose;

function isSafeAssetUrl(value) {
  if (!value) return true;
  if (value.startsWith('/assets/')) return !value.includes('..') && !value.includes('\\');
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

const statementSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true, maxlength: 4000 },
  timestamp: { type: Date },
  source: { type: String, maxlength: 300 },
}, { _id: false });

const relationshipSchema = new Schema({
  suspectId: { type: String, required: true },
  description: { type: String, required: true, maxlength: 1000 },
}, { _id: false });

const suspectSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, maxlength: 120 },
  role: { type: String, required: true, maxlength: 120 },
  age: { type: Number, min: 1, max: 120 },
  personality: { type: String, maxlength: 2000 },
  motive: { type: String, required: true, maxlength: 2000 },
  publicAlibi: { type: String, required: true, maxlength: 2000 },
  statements: { type: [statementSchema], default: [] },
  relationships: { type: [relationshipSchema], default: [] },
  profileAssetId: { type: String, maxlength: 200 },
}, { _id: false });

const evidenceSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true, maxlength: 180 },
  type: { type: String, required: true, maxlength: 80 },
  description: { type: String, required: true, maxlength: 2000 },
  discoveryContext: { type: String, maxlength: 2000 },
  timestamp: { type: Date },
  source: { type: String, maxlength: 300 },
  content: { type: Schema.Types.Mixed, required: true },
  asset: {
    kind: { type: String, enum: ['none', 'image', 'audio', 'video'], default: 'none' },
    url: { type: String, maxlength: 1000, validate: { validator: isSafeAssetUrl, message: 'Asset URL must be HTTPS or a local /assets path.' } },
    alt: { type: String, maxlength: 300 },
    placeholder: { type: Boolean, default: false },
  },
  relatedSuspectIds: { type: [String], default: [] },
  relatedEventIds: { type: [String], default: [] },
  credibility: { type: String, enum: ['verified', 'reported', 'uncertain'], default: 'uncertain' },
  metadata: { type: Map, of: String, default: undefined, select: false },
  // Deliberately no significance/isCulprit/solution labels in this public subdocument.
}, { _id: false });

const timelineEventSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  title: { type: String, required: true, maxlength: 180 },
  description: { type: String, required: true, maxlength: 2000 },
  sourceEvidenceIds: { type: [String], default: [] },
  certainty: { type: String, enum: ['verified', 'reported', 'uncertain'], default: 'uncertain' },
}, { _id: false });

const generationMetadataSchema = new Schema({
  model: { type: String, maxlength: 120 },
  promptVersion: { type: String, maxlength: 80 },
  generatedAt: { type: Date },
  failureCode: { type: String, maxlength: 80 },
  failureMessage: { type: String, maxlength: 500 },
}, { _id: false });

const canonicalSolutionSchema = new Schema({
  culpritId: { type: String, required: true },
  motive: { type: String, required: true, maxlength: 4000 },
  method: { type: String, required: true, maxlength: 4000 },
  opportunity: { type: String, required: true, maxlength: 4000 },
  incidentTimeline: { type: [Schema.Types.Mixed], default: [] },
  explanation: { type: String, required: true, maxlength: 12000 },
  decisiveEvidenceIds: { type: [String], default: [] },
  alternativeSuspectExplanations: { type: [Schema.Types.Mixed], default: [] },
  redHerringExplanations: { type: [Schema.Types.Mixed], default: [] },
}, { _id: false });

const mysterySchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'GuestSession', required: true, select: false },
  ownerExpiresAt: { type: Date, required: true, select: false },
  idempotencyKey: { type: String, maxlength: 128, select: false },
  title: { type: String, required: true, maxlength: 180 },
  scenario: { type: String, required: true, minlength: 30, maxlength: 2000, select: false },
  summary: { type: String, required: true, maxlength: 3000 },
  genre: { type: String, required: true, enum: ['detective', 'locked-room', 'missing-person', 'theft', 'suspicious-death', 'corporate'] },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  setting: { type: String, required: true, maxlength: 120 },
  incidentDate: { type: Date },
  incidentLocation: { type: String, required: true, maxlength: 300 },
  briefing: { type: String, required: true, maxlength: 6000 },
  investigationObjectives: { type: [String], default: [] },
  suspects: { type: [suspectSchema], default: [] },
  evidence: { type: [evidenceSchema], default: [] },
  timeline: { type: [timelineEventSchema], default: [] },
  generationStatus: { type: String, enum: ['queued', 'generating', 'ready', 'failed'], default: 'queued', index: true },
  generationMetadata: { type: generationMetadataSchema, select: false },
  canonicalSolution: { type: canonicalSolutionSchema, select: false },
  canonicalValidation: { type: Schema.Types.Mixed, select: false },
  internalGenerationData: { type: Schema.Types.Mixed, select: false },
}, { timestamps: true, versionKey: false });

mysterySchema.index({ ownerId: 1, createdAt: -1 });
mysterySchema.index({ generationStatus: 1, createdAt: 1 });
mysterySchema.index({ ownerExpiresAt: 1 }, { expireAfterSeconds: 0 });
mysterySchema.index({ ownerId: 1, idempotencyKey: 1 }, {
  unique: true,
  partialFilterExpression: { idempotencyKey: { $type: 'string' } },
});

mysterySchema.pre('validate', function validateMysteryIntegrity() {
  const uniqueIds = (entries) => new Set(entries.map(({ id }) => id)).size === entries.length;
  if (!uniqueIds(this.suspects)) this.invalidate('suspects', 'Suspect IDs must be unique.');
  if (!uniqueIds(this.evidence)) this.invalidate('evidence', 'Evidence IDs must be unique.');
  if (!uniqueIds(this.timeline)) this.invalidate('timeline', 'Timeline event IDs must be unique.');

  const suspectIds = new Set(this.suspects.map(({ id }) => id));
  const evidenceIds = new Set(this.evidence.map(({ id }) => id));
  const timelineIds = new Set(this.timeline.map(({ id }) => id));
  this.evidence.forEach((item, index) => item.relatedSuspectIds.forEach((id) => {
    if (!suspectIds.has(id)) this.invalidate(`evidence.${index}.relatedSuspectIds`, 'Evidence references an unknown suspect.');
  }));
  this.timeline.forEach((event, index) => event.sourceEvidenceIds.forEach((id) => {
    if (!evidenceIds.has(id)) this.invalidate(`timeline.${index}.sourceEvidenceIds`, 'Timeline event references unknown evidence.');
  }));
  this.suspects.forEach((suspect, index) => suspect.relationships.forEach((relationship) => {
    if (!suspectIds.has(relationship.suspectId)) this.invalidate(`suspects.${index}.relationships`, 'Suspect relationship references an unknown person.');
  }));
  if (this.generationStatus === 'ready') {
    if (!this.canonicalSolution) this.invalidate('canonicalSolution', 'A ready mystery requires a canonical solution.');
    else if (!suspectIds.has(this.canonicalSolution.culpritId)) this.invalidate('canonicalSolution.culpritId', 'The culprit must belong to this mystery.');
    this.canonicalSolution?.decisiveEvidenceIds.forEach((id) => {
      if (!evidenceIds.has(id)) this.invalidate('canonicalSolution.decisiveEvidenceIds', 'Canonical solution references unknown evidence.');
    });
    this.canonicalSolution?.incidentTimeline.forEach((event, index) => {
      if (event?.eventId && !timelineIds.has(event.eventId)) this.invalidate(`canonicalSolution.incidentTimeline.${index}`, 'Canonical timeline references an unknown event.');
    });
  }
});

export const Mystery = mongoose.model('Mystery', mysterySchema);
