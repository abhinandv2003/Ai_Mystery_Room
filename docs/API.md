# API Contract

All endpoints are rooted at `API_BASE_PATH` (default `/api/v1`) and return JSON. Standard success shape: `{ "success": true, "data": ... }`. Standard error shape: `{ "success": false, "error": { "code": "...", "message": "..." } }`.

## Implemented

### `GET /health`

Returns `200` when the API and MongoDB connection are healthy, otherwise `503`.

Healthy response data includes `status`, `service`, `timestamp`, and `dependencies.database`. This endpoint contains no secrets.

### `POST /demo/sample/accusations` (development only)

Accepts `{ "suspectId": "mara|elias|nia|owen", "reasoning": "..." }` and returns a deterministic verdict for the fixed Phase 2 sample. The route is registered only when `NODE_ENV` is not `production`. It does not read or write MongoDB and is not an API for generated or user-owned cases. Its canonical answer and evaluator live in `server/src/mocks/sampleVerdict.js`.

## Planned

Case creation, generation status, case/suspect/evidence retrieval, investigation session updates, production accusation submission, and verdict retrieval are specified in `SPEC.md` and will be implemented in later phases. They are not currently available.
