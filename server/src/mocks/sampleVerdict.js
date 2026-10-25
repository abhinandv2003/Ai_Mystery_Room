import { z } from 'zod';

// Phase 2 UI-only fixture. Canonical demo answer stays on the server.
export const sampleAccusationSchema = z.object({
  suspectId: z.enum(['mara', 'elias', 'nia', 'owen']),
  reasoning: z.string().max(2000).optional().default(''),
});

export function evaluateSampleAccusation({ suspectId, reasoning }) {
  const correctSuspectId = 'elias';
  return {
    suspectId,
    correctSuspectId,
    isCorrect: suspectId === correctSuspectId,
    reasoning,
    explanation: 'The curator used his access token to schedule the projection loop, entered the gallery during the blackout, and contradicted the radio relay record. Brass dust on his folio links him to the loosened service panel. The other clues explain why the other suspects looked plausible, but none connects them to the timed outage and the hidden access route.',
    keyEvidenceIds: ['projection-log', 'radio-transcript', 'case-inspection'],
    submittedAt: new Date().toISOString(),
  };
}
