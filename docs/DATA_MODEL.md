# Data Model

Phase 3 adds Mongoose models with timestamps, validation, and indexes. Account sign-in is out of scope; private data is owned by a server-managed guest session.

## GuestSession (`guestSessions`)

- `tokenHash`: unique SHA-256 hash of a cryptographically random cookie token. Never selected or returned.
- `expiresAt`: required session expiry with a MongoDB TTL index.
- Timestamps.

The browser receives only the random token in an HttpOnly cookie. It is not an account ID and is never accepted in a JSON body. The default 24-hour session expiry is rolling: activity during the final 12 hours renews it for another 24 hours. Expired guest sessions and their owned mysteries/investigation sessions are removed through TTL indexes.

## Mystery (`mysteries`)

`ownerId` references a GuestSession and is excluded from selection. `ownerExpiresAt` is a private TTL timestamp synchronized with the owner session. Public case fields include title, summary, genre, difficulty, setting, incident date/location, briefing, objectives, suspects, public evidence metadata, timeline, generation status, and timestamps.

The original `scenario`, idempotency key, generation metadata, canonical solution, canonical validation, and internal generation data are private or omitted from public serializers. These fields also use Mongoose `select: false`. Public serializers explicitly select fields; they never serialize a whole Mystery document.

Suspects contain public motive/alibi/statements/relationships. Evidence contains public artifact content and credibility, but no `isCulprit` or solution-significance fields. Asset URLs are limited to HTTPS or local `/assets/` paths. Model validation checks unique IDs and suspect/evidence references; a mystery cannot be marked ready without a canonical culprit belonging to that case.

## InvestigationSession (`investigationSessions`)

One session per `(ownerId, mysteryId)`, enforced by a unique compound index. Fields include status (`active`, `completed`, `abandoned`), selected evidence IDs, notes (maximum 4,000 characters), optional private accusation/result subdocuments, start/completion timestamps, owner expiry, and timestamps. Owner, accusation, and result are excluded from default selection. Session APIs return only status, saved evidence, notes, and dates.

## Indexes

- Guest token hash: unique.
- Guest expiry: TTL.
- Mystery: owner/creation date, generation status/creation date, owner/idempotency key, owner expiry TTL.
- Investigation session: unique owner/mystery, owner/status, owner expiry TTL.

No `User` model is required for the guest-only MVP. Verdict computation and public reveal endpoints are scheduled for Phase 5.
