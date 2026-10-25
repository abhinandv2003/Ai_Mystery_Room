# Implementation Plan

This plan follows the phase order and exit criteria in `SPEC.md`. Each phase is a reviewable increment; later product features depend on the foundation and contracts from earlier phases.

## Repository baseline

The repository already had most Phase 1 pieces: a React/Vite client, an Express/Mongoose server, validated configuration, database connection, a database-aware health route, logging/security middleware, starter routes and UI primitives, and supporting architecture/API/data/AI docs. The source specification and `docs/SPEC.md` are identical. This work aligned Tailwind font families with the global stylesheet and fixed the server to load the root `.env` even when launched from the server package directory. Phase 2 now provides a complete demo journey using isolated deterministic fixtures.

## Phases and acceptance criteria

| Phase | Work | Dependencies | Acceptance criteria |
|---|---|---|---|
| 0. Inspection and planning | Inventory code/dependencies, compare against the spec, update architecture/API/data/AI/status docs, record decisions and risks. | None | Baseline and phased plan are documented; unresolved product conflicts are surfaced. |
| 1. Project foundation | React/Vite, Express, Tailwind, environment validation, MongoDB connection, health endpoint, routing, shared UI, logging, error handling, dev scripts. | Phase 0 | Client and API start locally; configured MongoDB connects; health endpoint reports dependency state; no secrets are committed. |
| 2. UI shell | Complete page layouts and primary interactions with isolated deterministic fixtures. | Phase 1 | Main player journey is navigable with a fixture on desktop and mobile. |
| 3. Data models and APIs | Add models, ownership/session access, case and evidence endpoints, persistence, validation, and response conventions. | Phase 1; UI contracts from Phase 2 as needed | Documented endpoints work; ownership is enforced; public responses omit canonical solution data. |
| 4. Gemini generation | Add versioned server prompts, structured parsing, canonical/evidence validation, retry/failure behavior, metadata, and status polling. | Phase 3 | Valid scenarios become playable cases; invalid output cannot become ready; failures are visible; solution remains private. |
| 5. Investigation and verdict | Persist notes/selections, implement accusation, server-side deterministic evaluation, explanation, and completed-session rules. | Phases 3–4 | A case can be completed; correct and incorrect accusations produce expected verdicts; refresh preserves state. |
| 6. Visual evidence | Implement fictional chat, image fallback, CCTV-style logs/reconstructions, and optional image provider integration. | Phases 2–5 | Evidence viewers render supported types; missing assets do not block play; placeholders are identified. |
| 7. Testing and security | Add unit/API/E2E/security coverage, responsive checks, duplicate/failure checks, and fix critical defects. | Phases 1–6 | Critical player flow and security tests pass; no known critical security defect remains. |
| 8. Deployment preparation | Production scripts/configuration, database access controls, health/monitoring, backup/recovery and cost/rate-limit guidance. | Phases 1–7 | Production build and deployment setup are reproducible and keep secrets private. |

## Decisions and risks

- No product or architecture conflict was identified during inspection.
- Guest access is the onboarding path. Private case APIs now use a server-managed cookie session and owner-scoped MongoDB queries.
- MongoDB availability is required for a healthy API; local build checks can be run independently of MongoDB.
- Gemini model names and any optional image provider must be verified/configured when those phases are implemented. No provider secret belongs in client code.
- The current create page is an intentionally non-submitting UI shell. It must not be presented as working generation until Phase 4 is complete.
- The Phase 2 sample verdict endpoint is mounted only outside production. It exists only to exercise the UI while real case and accusation APIs are built in later phases.
- Guest ownership uses an opaque HttpOnly cookie token; only its SHA-256 hash is stored. Session expiry and owned-case cleanup use TTL indexes.
- Phase 3 intentionally does not create mystery records until Phase 4 can queue and complete generation, avoiding permanent pending cases.
- User-owned case APIs cannot return a ready case until Phase 4 writes a validated Mystery; API behavior for malformed/foreign IDs is implemented but database-backed ownership checks were not exercised in this pass.

## Current execution boundary

Phases 1–3 are implemented. The next increment is Phase 4: build the Gemini generation job and validation pipeline, then persist only validated ready cases. The scenario intake must remain clearly labeled as a preview until that generation flow is complete.
