# Implementation Status

## Repository baseline

The repository already contained a partial Phase 1 MERN foundation when implementation began. It included root, client, and server package manifests; an Express health endpoint; environment validation; MongoDB connection setup; React/Vite routing; Tailwind styling; shared UI primitives; and initial landing and creation screens. The specification copy at `docs/SPEC.md` matches the root `spec.md`.

The Phase 1–2 baseline was committed and pushed to `origin/main` as `b895e03`. Phase 3 work is in the working tree and has not yet been committed.

## Phase 0 — Repository inspection and planning

- Inspected the repository structure, dependencies, existing source, and supporting documentation.
- Confirmed Node.js v22.12.0 and npm 11.7.0 are available.
- Recorded the phase plan and baseline in `docs/IMPLEMENTATION_PLAN.md`.
- No product or architecture conflict was found.

## Phase 1 — Project foundation

### Already present at inspection

- React, Vite, React Router, Tailwind, reusable UI primitives, and landing/create/not-found routes.
- Express API with validated environment configuration, health endpoint, MongoDB connection, Pino logging, Helmet, CORS, rate limiting, and error handling.
- Root development scripts and example environment configuration.

### Completed in this pass

- Aligned Tailwind's sans, mono, and serif font families with the fonts loaded by the global stylesheet.
- Fixed server environment loading so API startup reliably reads the repository-root `.env`, regardless of npm's server-package working directory.
- Clarified the root README installation steps and linked the implementation plan and status.
- Corrected this document to reflect the actual repository baseline.

### Verification

- Installed root, server, and client dependencies; npm generated package lockfiles for all three manifests.
- `npm run build` passed. Vite 6.0.7 transformed 1,585 modules and produced the production client bundle.
- Started the API using the configured root `.env`; MongoDB connected and `GET /api/v1/health` returned HTTP 200 with the database marked `connected`.
- Confirmed Gemini key and model settings are present without printing their values. Gemini is not integrated yet because mystery generation is a later phase.
- npm reported 6 vulnerabilities in the server dependency tree (1 moderate, 5 high) and 9 in the client dependency tree (4 moderate, 5 high). They have not been auto-fixed because forced dependency changes may alter the pinned stack; review and remediation should be tracked before production.
- No automated test suite exists; tests are planned for Phase 7.

## Phase 2 — UI shell

### Completed

- Built the landing and scenario-intake pages with a fictional demo-mode notice, 30–2,000 character validation, genre/difficulty/setting/suspect controls, and a visible preview progress state.
- Added a fixed case briefing, suspect profiles, searchable/category-filtered evidence archive and evidence viewer, verified-vs-claimed timeline, evidence board, saved notes, accusation confirmation, and verdict/solution view.
- Connected the player journey through `/`, `/create`, `/cases/sample`, `/cases/sample/investigate`, and `/cases/sample/verdict`.
- Isolated public sample facts in `client/src/mocks/sampleCase.js`; browser-only notes and board selections use `client/src/services/demoCaseService.js`.
- Kept the demo answer and deterministic evaluation in `server/src/mocks/sampleVerdict.js`. Its `/api/v1/demo/*` route is mounted only outside production and is not used by production cases.
- Added responsive layouts, keyboard-visible focus styles, accessible dialog naming/focus handling, and reduced-motion treatment for loading UI.

### Verification

- `npm run build` passed after the Phase 2 changes.
- Started the API against MongoDB and manually called the demo accusation endpoint; it returned a verdict for an incorrect accusation.
- Started both services together with `npm run dev`; the client route fallback returned HTTP 200 and the health endpoint reported MongoDB connected.
- Visual browser checks at mobile/tablet/desktop sizes were not run in this environment. No automated tests were added or run.
- `npm run dev` previously reported port 5173 already in use when another Vite process was active. Close a duplicate frontend process before starting the combined script.

## Remaining phases

- Phase 4: Add Gemini generation, structured output and canonical/evidence validation, retries, and generation status.
- Phase 5: Connect investigation tools and implement deterministic verdicts.
- Phase 6: Complete supported visual evidence viewers and fallback assets.
- Phase 7: Add unit, integration, end-to-end, and security tests; address critical defects.
- Phase 8: Prepare production build, deployment configuration, health monitoring, and operations documentation.

The sample-case journey is a UI fixture, not a generated or persisted user case. The creation form validates input and opens the sample; it does not send the scenario to Gemini. The demo verdict endpoint is development-only. Production case generation and production verdict evaluation remain unimplemented.

## Phase 3 — Data models and APIs

### Completed

- Added GuestSession, Mystery, and InvestigationSession Mongoose models with private-field selection, validation, timestamps, ownership/uniqueness indexes, and TTL expiry.
- Added HttpOnly, SameSite=Lax guest cookies using cryptographically random tokens; only token hashes are stored. Guest ownership is resolved from the cookie, never from request JSON.
- Added trusted-origin and custom-header checks for cookie-authenticated mutations.
- Added owner-scoped case list, generation-status, case briefing, suspect, evidence index/detail, and investigation-session read/update APIs.
- Added strict request validation, safe serializers, 404 concealment for non-owned cases, consistent API errors, and protection against editing completed sessions.
- Added 24-hour idle expiry with renewal during the final 12 hours; TTL indexes remove expired guest records and their owned case/session records.
- Updated API, architecture, and data-model documentation. Case creation remains Phase 4 so this phase cannot create a permanently queued case without a generation worker.

### Verification

- `node --check` passed for all 20 server source files.
- Imported the Express app successfully, loading all route modules and Mongoose schemas.
- Automated tests and database-backed endpoint checks were not run. Phase 3 case APIs require a ready Mystery record, which will be created by Phase 4 generation; no user database fixtures were inserted during this phase.
