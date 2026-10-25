# API Contract

All routes use JSON under `API_BASE_PATH` (default `/api/v1`). Success responses use `{ "success": true, "data": ... }`; failures use `{ "success": false, "error": { "code": "...", "message": "...", "details": [] } }`. Private mystery routes require the guest cookie and enforce owner matching. A missing or non-owned case returns the same `404 NOT_FOUND` response.

Cookie-authenticated mutations require `X-AMR-Request: 1` and, when an `Origin` header is present, it must match `CLIENT_URL`. Browser requests must include credentials. The guest token is an HttpOnly, SameSite=Lax cookie, Secure in production; it is never returned in JSON.

## Implemented

### `GET /health`

Returns `200` when the API and MongoDB connection are healthy, otherwise `503`. Response includes non-sensitive dependency status only.

### `POST /guest-session`

Creates or reuses a guest owner and sets the `amr_guest` cookie. Returns the expiry timestamp, never the token. Requires `X-AMR-Request: 1`. Session expiry is 24 hours after last activity; activity during the final 12 hours renews the cookie and owned data TTL.

### `GET /mysteries`

Returns a paginated list of the current guest's case summaries only. Supports `status`, `page` (default 1), and `limit` (default 20, maximum 50). This supports returning to the guest's own active cases; it never accepts an owner ID from the request.

### `GET /mysteries/:caseId/status`

Returns case ID, generation status, a safe progress stage, and a generic failure message if generation failed. Requires an unexpired owner cookie.

### `GET /mysteries/:caseId`

Returns the public case briefing, public suspects, evidence index, and timeline. Returns `409 CASE_NOT_READY` until generation status is `ready`. Canonical solution, raw scenario, owner ID, and internal generation fields are omitted.

### `GET /mysteries/:caseId/suspects`

Returns public suspect profiles for a ready, owned mystery.

### `GET /mysteries/:caseId/evidence`

Returns public evidence index items. Optional filters: `type`, `suspectId`, and `search`. Evidence content is retrieved separately.

### `GET /mysteries/:caseId/evidence/:evidenceId`

Returns one complete public evidence artifact after verifying case ownership and evidence membership.

### `GET /mysteries/:caseId/session`

Returns or starts the single active investigation session for the owner and case. Includes session status, selected evidence IDs, notes, and timestamps. It does not include accusation or result fields.

### `PATCH /mysteries/:caseId/session`

Accepts either or both `notes` (maximum 4,000 characters) and `selectedEvidenceIds`. Rejects unknown fields, duplicate or foreign evidence IDs, and changes to completed/abandoned sessions. Requires `X-AMR-Request: 1`.

### `POST /demo/sample/accusations` (development only)

Deterministic Phase 2 fixture endpoint. Mounted only when `NODE_ENV` is not `production`; not part of production case services.

## Deferred to later phases

- `POST /mysteries`: scenario intake and generation job creation are Phase 4. Phase 3 does not create permanent queued cases without a worker.
- Production accusation submission and `GET /mysteries/:caseId/verdict`: Phase 5.
- Generation itself is Phase 4. No ready mystery can be created through the public API in Phase 3; later generation services will persist validated cases.

## Error codes

Implemented APIs use `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CASE_NOT_READY`, `SESSION_COMPLETED`, and `INTERNAL_SERVER_ERROR` with HTTP 400, 401, 403, 404, 409, or 500 as appropriate. Error bodies never include stack traces, database internals, secrets, or canonical solutions.
