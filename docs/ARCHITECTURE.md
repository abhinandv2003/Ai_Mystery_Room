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

## Planned services

Later phases add case/session ownership, mystery generation and validation, evidence, and deterministic verdict services. Gemini credentials and canonical solutions remain server-side. The server must serialize only public case data before a verdict is allowed.

## Configuration and startup

Server settings are parsed once at startup in `server/src/config/env.js`. `MONGODB_URI` is required. Optional feature secrets remain empty until their feature exists and are never used in browser code. The server connects to MongoDB before binding its port; a database connection failure exits startup with a structured log.
