import mongoose from 'mongoose';

const { Schema } = mongoose;

const accusationSchema = new Schema({
  selectedSuspectId: { type: String, required: true },
  reasoning: { type: String, maxlength: 2000, default: '' },
  submittedAt: { type: Date, required: true },
}, { _id: false });

const accusationResultSchema = new Schema({
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String, required: true, maxlength: 12000 },
  decisiveEvidenceIds: { type: [String], default: [] },
  timelineReconstruction: { type: [Schema.Types.Mixed], default: [] },
  redHerringExplanations: { type: [Schema.Types.Mixed], default: [] },
  score: { type: Number, min: 0 },
}, { _id: false });

const investigationSessionSchema = new Schema({
  mysteryId: { type: Schema.Types.ObjectId, ref: 'Mystery', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'GuestSession', required: true, select: false },
  ownerExpiresAt: { type: Date, required: true, select: false },
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active', index: true },
  selectedEvidenceIds: { type: [String], default: [] },
  notes: { type: String, maxlength: 4000, default: '' },
  accusation: { type: accusationSchema, select: false },
  result: { type: accusationResultSchema, select: false },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
}, { timestamps: true, versionKey: false });

investigationSessionSchema.index({ ownerId: 1, mysteryId: 1 }, { unique: true });
investigationSessionSchema.index({ ownerId: 1, status: 1 });
investigationSessionSchema.index({ ownerExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const InvestigationSession = mongoose.model('InvestigationSession', investigationSessionSchema);
