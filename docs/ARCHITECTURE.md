# Architecture

## Phase 1 baseline

The application is a JavaScript MERN project. The React/Vite client communicates with the Express API through REST JSON. The API validates configuration with Zod, applies Helmet, CORS, JSON size limits, request rate limiting, and Pino logging, and connects to MongoDB with Mongoose before listening.

```text
Browser (React + Vite)
    | REST JSON
Express API (Helmet, CORS, rate limit, Pino)
    | Mongoose
MongoDB
```

The foundation API includes `GET /api/v1/health`. It reports HTTP 503 when MongoDB is unavailable. The client has landing, intake, sample case, investigation, and verdict routes; case generation itself is not implemented.

The Phase 2 UI includes a fixed sample case under `client/src/mocks/`. Browser local storage holds only that sample's notes, selected evidence, and post-accusation verdict. A separate development-only endpoint (`POST /api/v1/demo/sample/accusations`) evaluates the sample accusation; its answer stays server-side. The endpoint is not mounted in production and is not part of the production case service.

## Phase 3 ownership and persistence

The server creates a cryptographically random guest token, sends it only in an HttpOnly SameSite=Lax cookie (Secure in production), and stores only its SHA-256 hash in `guestSessions`. Private requests resolve the cookie to a guest owner; case queries include that owner ID and return the same 404 for absent and foreign cases. Cookie-authenticated mutations require the configured Origin and `X-AMR-Request: 1`.

`Mystery` and `InvestigationSession` are Mongoose models with ownership references, timestamps, validation, indexes, and TTL expiry. A session expires after 24 hours without activity. Activity during the last 12 hours extends the cookie and owned data expiry by another 24 hours; TTL indexes remove expired session, case, and investigation data. One investigation session is unique per guest/case.

Canonical solution, validation, owner, scenario, and internal generation fields are excluded by default and omitted again by explicit public serializers. Phase 3 adds case list/status/read, suspect/evidence read, and investigation session APIs. Case creation remains deferred to Phase 4 so no case is marked queued without a generation worker. Production accusation/verdict services remain Phase 5.

The fixed sample and its development-only verdict endpoint remain isolated from production case services. Gemini credentials stay server-side.

## Configuration and startup

Server settings are parsed once at startup in `server/src/config/env.js`. `MONGODB_URI` is required. Optional feature secrets remain empty until their feature exists and are never used in browser code. The server connects to MongoDB before binding its port; a database connection failure exits startup with a structured log.
