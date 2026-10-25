import mongoose from 'mongoose';

const guestSessionSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true, select: false },
  expiresAt: { type: Date, required: true },
}, { timestamps: true, versionKey: false });

guestSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const GuestSession = mongoose.model('GuestSession', guestSessionSchema);
