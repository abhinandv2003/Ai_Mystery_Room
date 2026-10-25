# AI MYSTERY ROOM
## Single Source of Truth — Specification for Spec-Driven Development

**Document type:** Product Requirements + Software Architecture + Engineering Specification  
**Project:** AI Mystery Room  
**Stack:** MongoDB, Express.js, React, Node.js (MERN)  
**AI Provider:** Google Gemini API  
**Primary implementation agent:** OpenAI Codex  
**Document status:** Initial implementation baseline  
**Version:** 1.0.0

---

# 1. Purpose of This Document

This document is the authoritative specification for building AI Mystery Room.

All development decisions must follow this document unless an explicit, approved change is made to the specification.

Codex must use this document to:

- Understand the product and its intended behavior.
- Design the frontend, backend, database, and AI integration.
- Implement all features consistently.
- Define API contracts and data models.
- Build a responsive, accessible, modern user interface.
- Validate AI-generated mysteries and evidence.
- Implement security, error handling, and testing.
- Prevent scope creep and inconsistent implementation.
- Maintain the specification when requirements change.

## 1.1 Rules for Codex

1. Read this entire document before implementing the project.
2. Inspect the existing repository before creating or modifying files.
3. Preserve existing working code unless a change is necessary.
4. Treat this document as the product and architecture authority.
5. Do not silently introduce new frameworks, databases, providers, or major dependencies.
6. Do not implement placeholder buttons, fake API success responses, or nonfunctional features while claiming the product is complete.
7. If a requirement is ambiguous, choose the simplest implementation consistent with this specification and document the decision.
8. If a requirement conflicts with an existing architectural decision, identify the conflict before making a significant change.
9. Keep environment variables, secrets, AI prompts, and answer keys on the server.
10. Update the relevant documentation and tests whenever behavior changes.
11. All generated mysteries and evidence must be fictional and must belong to the same canonical mystery.
12. Never expose the culprit or hidden solution before the player submits a final answer or explicitly requests an allowed reveal.
13. Implement features in small, verifiable stages rather than generating the entire codebase in one uncontrolled pass.

---

# 2. Product Overview

## 2.1 Product concept

AI Mystery Room is an AI-powered interactive detective game.

A player provides a short story, scenario, or mystery premise. The application uses Google Gemini to generate a fictional investigation containing:

- A compelling crime or mysterious incident.
- A set of suspects, each with a believable motive and alibi.
- A hidden, predetermined culprit.
- A chronological timeline of events.
- Evidence items such as fictional WhatsApp messages, photographs, CCTV recordings, witness statements, and documents.
- Contradictions and misleading but fair clues.
- A final explanation showing how the evidence identifies the culprit.

The player explores the investigation, studies the evidence, develops a theory, and selects the person they believe committed the crime.

The system evaluates the submitted answer against the canonical solution and presents the verdict.

## 2.2 Product vision

Create an immersive digital detective experience where every investigation feels like solving a real mystery, without requiring the player to write code, understand AI, or navigate a complicated interface.

The experience should feel like a combination of:

- An interactive detective game.
- A digital investigation board.
- A fictional case-file management system.
- An AI-powered mystery generator.

## 2.3 Target audience

- Casual gamers who enjoy mysteries and detective stories.
- Fans of crime fiction, puzzles, and escape rooms.
- Students and friends looking for an interactive challenge.
- Players interested in AI-generated storytelling.

## 2.4 Core value proposition

**Every mystery is generated from the player's idea, and every piece of evidence contributes to a coherent investigation.**

## 2.5 Product boundaries

The initial release is a single-player web application.

The following are not part of the initial release:

- Multiplayer investigations.
- Live multiplayer collaboration.
- Real-world criminal investigation.
- Real WhatsApp account integration.
- Real CCTV camera integration.
- User-uploaded video processing.
- Public user-generated case marketplace.
- Subscription billing or payment integration.
- Native Android or iOS applications.
- User-created AI models.
- Social networking and public messaging.

These features may be considered later, but Codex must not implement them without an approved specification change.

---

# 3. Core Product Principles

## 3.1 Canonical truth

Every mystery must have exactly one canonical solution.

The culprit, timeline, motives, alibis, and evidence must be established before the player begins investigating.

Evidence must be generated from this canonical solution, not independently invented in a way that could contradict it.

## 3.2 Fair play

The player must have a reasonable opportunity to identify the culprit from the available evidence.

The solution must not depend on information that was never provided to the player.

## 3.3 Fictional evidence

All WhatsApp-style conversations, CCTV clips, photographs, documents, names, identities, and events are fictional game content.

The application must not imply that generated artifacts are authentic records from real people or organizations.

## 3.4 Server-side authority

The server owns the canonical answer and evaluates the player's submission.

The client must never decide whether an answer is correct based on a hidden answer embedded in frontend code.

## 3.5 Progressive disclosure

The interface should present information gradually:

1. Mystery premise.
2. Case briefing.
3. Suspect profiles.
4. Evidence.
5. Investigation tools.
6. Final accusation.
7. Verdict and explanation.

The culprit must remain concealed until the appropriate reveal state.

## 3.6 Reliability over generation speed

A coherent, playable mystery is more important than generating a large quantity of inconsistent evidence.

The application must validate generated content and handle incomplete AI responses gracefully.

---

# 4. User Stories

### US-01: Create a mystery

As a player, I want to describe a scenario so that the AI can create a unique investigation from my idea.

**Acceptance criteria:**
- The user can enter a story or scenario.
- The user can choose supported mystery settings and difficulty.
- Invalid input is rejected with a clear explanation.
- Submitting the form starts a visible generation process.
- The user cannot accidentally create multiple duplicate cases through repeated clicks.

### US-02: Explore the case

As a player, I want to read a briefing and explore suspects so that I understand the incident.

**Acceptance criteria:**
- The case page shows the title, premise, incident details, and objectives.
- Suspects have distinct identities, motives, alibis, and profile information.
- The solution is not exposed through public API responses or frontend data.

### US-03: Investigate evidence

As a player, I want to examine different forms of evidence so that I can identify contradictions and discover the truth.

**Acceptance criteria:**
- Evidence is organized by category.
- The player can open and inspect each evidence item.
- The interface distinguishes verified observations from character claims.
- Evidence items are consistent with the mystery timeline and canonical solution.

### US-04: Build a theory

As a player, I want to organize my findings so that I can reason about the case before accusing someone.

**Acceptance criteria:**
- The player can add evidence to a personal investigation board.
- The player can add notes.
- Notes and board selections are saved to the active case session.
- The board does not reveal the answer automatically.

### US-05: Accuse a suspect

As a player, I want to select the culprit and submit my accusation so that I can see whether my theory is correct.

**Acceptance criteria:**
- The player must select a suspect.
- The player must explicitly confirm the accusation.
- The server evaluates the answer.
- The verdict includes a clear explanation after submission.
- Repeated submissions do not create duplicate completed sessions.

### US-06: Review the solution

As a player, I want to understand how the mystery was solved so that I can learn from the evidence.

**Acceptance criteria:**
- The verdict identifies the correct culprit.
- The explanation connects important evidence to the conclusion.
- Red herrings are explained where applicable.
- The timeline explains how the incident occurred.
- The player can review the evidence after completion.

### US-07: Recover an investigation

As a player, I want to return to a case I started so that I can continue investigating.

**Acceptance criteria:**
- The player can return to an active case.
- Investigation notes and selected evidence are retained.
- Completed cases display the final result.
- Case access is restricted to the authorized owner or active session.

---

# 5. Scope and Feature Priorities

## P0 — Required for MVP

1. Responsive landing page.
2. Mystery creation form.
3. Gemini-powered mystery generation.
4. Canonical mystery and evidence validation.
5. Case briefing page.
6. Suspect profiles.
7. Evidence archive.
8. Fictional chat transcript viewer.
9. Image evidence viewer with generated or fallback artwork.
10. CCTV-style incident report and timeline viewer.
11. Investigation notes.
12. Evidence board.
13. Suspect accusation and verdict.
14. Solution explanation.
15. Persistent case sessions.
16. Backend authentication or secure guest-session access.
17. Loading, empty, and error states.
18. Input validation and security protections.
19. Responsive desktop, tablet, and mobile layouts.
20. Automated tests for critical functionality.

## P1 — Important improvements

- AI-generated visual evidence using an optional image generation provider.
- Additional mystery templates.
- More difficulty settings.
- Evidence filtering and search.
- A case history dashboard.
- Player performance statistics.
- Limited hint system.
- Case sharing through secure, read-only links.

## P2 — Future possibilities

- Multiplayer investigations.
- Competitive scoring and leaderboards.
- Daily mystery challenges.
- Community-created mysteries.
- Custom sound effects and advanced animations.
- Mobile application.
- Additional AI providers.

**Implementation rule:** Complete and verify P0 before beginning P1 or P2.

---

# 6. Technology Stack

## 6.1 Frontend

| Technology | Responsibility |
|---|---|
| React | Component-based user interface |
| Vite | Development server and production build |
| JavaScript with JSX | Frontend application logic |
| Tailwind CSS | Responsive styling and design system |
| React Router | Client-side routing |
| Lucide React | Interface icons |
| Framer Motion | Optional interface animations |
| Fetch API | HTTP communication with backend |

Do not introduce TypeScript, Redux, Next.js, or another frontend framework without an approved architecture change.

React Context and local component state are sufficient for the initial application unless testing demonstrates a need for something more complex.

## 6.2 Backend

| Technology | Responsibility |
|---|---|
| Node.js | Server runtime |
| Express.js | REST API and middleware |
| MongoDB | Persistent data storage |
| Mongoose | Schema definition and database operations |
| Google Gemini API | Mystery generation and structured AI output |
| Zod | Runtime validation of API and AI-generated objects |
| Helmet | HTTP security headers |
| express-rate-limit | Request throttling |
| Pino or equivalent | Structured server logging |

Use a currently supported, compatible version of each dependency. Pin versions in the package manifest and lockfile.

## 6.3 AI

Primary provider: Google Gemini.

The Gemini integration must be implemented behind a backend service abstraction so that prompts, output validation, retries, and model configuration are centralized.

The exact Gemini model identifier must be configurable through environment variables and verified against the current provider documentation before implementation.

Do not hardcode an unverified model name throughout the codebase.

## 6.4 Database

MongoDB stores:

- User accounts or guest-session ownership records.
- Mystery cases.
- Suspects.
- Evidence metadata.
- Canonical solutions.
- Investigation sessions.
- Player notes.
- Selected evidence.
- Accusation results.

## 6.5 Architecture overview

```text
React + Vite Frontend
        |
        | HTTPS / REST JSON
        v
Node.js + Express API
        |
        +---- Authentication / Session Access
        |
        +---- Mystery Generation Service
        |          |
        |          v
        |       Gemini API
        |
        +---- Mystery Validation Service
        |
        +---- Investigation Service
        |
        +---- Verdict Service
        |
        v
MongoDB + Mongoose
```

The browser must never communicate directly with Gemini using a privileged API key.

The frontend receives only the information required for the current game state.

---

# 7. Repository Structure

Codex should create the following structure unless the repository already contains an equivalent, functioning organization.

```text
ai-mystery-room/
├── client/
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── mystery/
│   │   │   ├── evidence/
│   │   │   └── investigation/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CreateMysteryPage.jsx
│   │   │   ├── CasePage.jsx
│   │   │   ├── InvestigationPage.jsx
│   │   │   ├── VerdictPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── gemini.service.js
│   │   │   ├── mystery.service.js
│   │   │   ├── validation.service.js
│   │   │   ├── evidence.service.js
│   │   │   └── verdict.service.js
│   │   ├── prompts/
│   │   │   └── mystery-generation.prompt.js
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── SPEC.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATA_MODEL.md
│   ├── AI_PROMPTS.md
│   └── IMPLEMENTATION_STATUS.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

The root `package.json` may provide scripts for running the frontend and backend together during development.

Do not duplicate configuration files unnecessarily or place secrets inside the client directory.

---

# 8. Application Routes

The initial application must implement the following routes.

| Route | Purpose | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/create` | Create a new mystery | Guest or authenticated user |
| `/cases/:caseId` | Case briefing and overview | Authorized owner |
| `/cases/:caseId/investigate` | Investigation workspace | Authorized owner |
| `/cases/:caseId/verdict` | Final result and explanation | Completed case owner |
| `*` | Not-found page | Public |

The case ID must be an opaque identifier such as a MongoDB ObjectId or UUID.

An identifier alone must not grant access to a private case.

If authentication is not implemented in the initial iteration, use a secure server-managed guest session with an unpredictable token. Do not treat an arbitrary client-supplied user ID as proof of ownership.

---

# 9. UI/UX Design Specification

## 9.1 Visual direction

The website should feel like a premium digital detective workspace.

The visual identity should combine a modern SaaS interface with the atmosphere of a crime investigation room.

Avoid generic AI landing-page aesthetics, excessive gradients, unnecessary glassmorphism, and cluttered dashboards.

## 9.2 Color palette

| Token | Suggested value | Usage |
|---|---|---|
| Background | `#0B0D10` | Main application background |
| Surface | `#141820` | Cards and panels |
| Elevated surface | `#1C222C` | Modals and active panels |
| Primary text | `#F4F5F7` | Headings and important text |
| Secondary text | `#A4ACB9` | Supporting text |
| Accent | `#C84B45` | Accusations and important actions |
| Evidence accent | `#D4A95F` | Evidence highlights |
| Success | `#4EAA78` | Correct verdicts |
| Border | `#2B323D` | Dividers and panel borders |

Use semantic color tokens rather than scattering raw color values throughout components.

Ensure text and controls meet appropriate contrast requirements.

## 9.3 Typography

Use a clean sans-serif font for interface text and an optional serif or display font for case titles.

Suggested typography:

- Headings: Manrope or equivalent.
- Body: Inter or equivalent.
- Case reference numbers: Monospaced font.

Typography must remain readable on small screens.

## 9.4 Common interface components

Create reusable components for:

- `AppShell`
- `Navbar`
- `Button`
- `TextInput`
- `Textarea`
- `Select`
- `Badge`
- `Card`
- `Modal`
- `Toast`
- `LoadingIndicator`
- `Skeleton`
- `EmptyState`
- `ErrorState`
- `EvidenceCard`
- `SuspectCard`
- `EvidenceViewer`
- `CaseHeader`
- `Timeline`
- `ConfirmDialog`

All reusable components must support appropriate loading, disabled, and error states where relevant.

## 9.5 Landing page

The landing page should include:

1. A navigation bar with the logo and primary action.
2. A prominent headline introducing the detective experience.
3. A short explanation of how AI-generated mysteries work.
4. A primary CTA: **Create Your Mystery**.
5. A secondary CTA: **Explore a Sample Case**, if a real sample case is available.
6. A visual preview of an investigation board.
7. A short feature section explaining suspects, evidence, and deduction.
8. A footer containing product information and a fictional-content disclaimer.

Suggested headline:

**Every clue tells a story. Only one tells the truth.**

Suggested supporting text:

Turn any scenario into a fictional detective investigation filled with suspects, hidden motives, digital evidence, and a mystery waiting to be solved.

The sample-case CTA must open a functioning sample case, not a nonfunctional placeholder.

## 9.6 Mystery creation page

The page must contain:

- Scenario textarea.
- Genre selector.
- Difficulty selector.
- Optional setting selector.
- Optional number-of-suspects selector.
- Generate Mystery button.
- Input validation messages.
- Generation progress state.
- Error recovery and retry action.

Recommended defaults:

| Field | Default |
|---|---|
| Genre | Detective mystery |
| Difficulty | Medium |
| Setting | Modern-day setting |
| Number of suspects | 4 |

Supported genres initially:

- Detective mystery.
- Locked-room mystery.
- Missing-person mystery.
- Theft or heist.
- Suspicious death.
- Corporate mystery.

All generated stories must remain fictional and non-graphic by default.

### Input limits

- Scenario minimum: 30 characters.
- Scenario maximum: 2,000 characters.
- Number of suspects: 3–6.
- Difficulty: Easy, Medium, or Hard.

The backend must enforce these constraints independently of the frontend.

The frontend must show a character counter and prevent accidental double submission.

## 9.7 Case overview page

Display:

- Case title.
- Case ID or reference number.
- Incident category.
- Difficulty.
- Incident date within the fictional story.
- Location.
- Case summary.
- Investigation objectives.
- Number of suspects.
- Number of evidence items.
- Start Investigation button.

Do not display the canonical culprit or hidden solution in the overview response.

## 9.8 Investigation workspace

The investigation workspace is the primary game interface.

Desktop layout:

- Left panel: case navigation and suspect list.
- Main panel: selected evidence and evidence viewer.
- Right panel: investigation notes, selected evidence, and theory board.

On mobile, panels should become accessible tabs, drawers, or stacked layouts.

The player must be able to switch between:

- Overview.
- Suspects.
- Evidence.
- Timeline.
- Investigation board.
- Accusation.

The interface must not require horizontal scrolling on common mobile viewport sizes.

## 9.9 Evidence viewer

Each evidence item must open in a dedicated viewer or modal.

The viewer must display:

- Evidence title.
- Evidence type.
- Collection or discovery context.
- Fictional timestamp.
- Relevant participants or source.
- Artifact contents.
- Evidence credibility classification, when appropriate.
- Related suspects.
- Add to investigation board action.

The viewer must distinguish between a character's claim and an objectively established fact.

## 9.10 Accusation interface

The accusation interface must:

1. Show the available suspects.
2. Allow one suspect to be selected.
3. Optionally collect the player's explanation.
4. Display a confirmation dialog.
5. Submit the accusation to the backend.
6. Show a processing state.
7. Display the final verdict after the server confirms completion.

A player must not be able to access the canonical solution by inspecting client-side state before the accusation.

## 9.11 Verdict page

The verdict page should include:

- Correct or incorrect result.
- Selected suspect.
- Correct culprit.
- Final case explanation.
- Key evidence supporting the answer.
- Contradictions that eliminated other suspects.
- Timeline reconstruction.
- Red-herring explanation.
- Optional score and performance summary.
- Return to case button.

The complete solution may be shown after the first final accusation in the MVP. This behavior must be consistent throughout the application.

## 9.12 Accessibility and responsive behavior

- Use semantic HTML.
- Support keyboard navigation.
- Provide visible focus states.
- Use accessible labels for form controls.
- Do not rely on color alone to communicate correctness.
- Respect reduced-motion preferences.
- Provide meaningful alternative text for images.
- Ensure dialogs have accessible names and appropriate focus behavior.
- Test at mobile widths, tablet widths, and desktop widths.

---

# 10. Mystery Generation Engine

This is the most important backend subsystem.

## 10.1 Generation workflow

The system must follow this sequence:

1. Validate the incoming scenario and configuration.
2. Create a mystery-generation job or pending case.
3. Generate a structured mystery blueprint using Gemini.
4. Validate the returned structure against a strict schema.
5. Check canonical consistency and evidence relationships.
6. Repair or regenerate invalid content within a bounded retry limit.
7. Persist the validated mystery.
8. Persist the canonical solution separately from public case data.
9. Generate or assign visual evidence assets.
10. Mark the case ready only when all required MVP content is available.
11. Return a sanitized public case response.
12. Let the frontend navigate to the completed case.

Do not mark a mystery as ready before all required data has passed validation.

## 10.2 Generation state machine

Supported case-generation states:

- `queued`
- `generating`
- `validating`
- `ready`
- `failed`

Allowed transitions:

```text
queued -> generating
generating -> validating
validating -> ready
validating -> generating  (bounded repair attempt)
generating -> failed
validating -> failed
```

A case in `failed` state must not be playable.

The user must receive a useful error and an opportunity to retry generation.

## 10.3 Canonical mystery blueprint

Gemini must generate one structured object representing the complete mystery.

The object must include:

### A. Case metadata

- Title.
- Short description.
- Detailed briefing.
- Incident type.
- Fictional setting.
- Fictional incident date and time.
- Difficulty.
- Investigation objectives.

### B. Canonical solution

- Culprit ID.
- Motive.
- Method.
- Opportunity.
- Complete incident timeline.
- Explanation of the crime or incident.
- Key evidence proving the conclusion.
- Explanation of misleading clues.
- Explanation of why each alternative suspect is not the culprit.

### C. Suspects

Each suspect must contain:

- Stable ID.
- Name.
- Age, if appropriate.
- Role or relationship to the incident.
- Personality summary.
- Motive.
- Public alibi.
- Actual whereabouts at relevant times.
- Relevant secrets.
- Statements.
- Relationship to other suspects.
- Whether the suspect is the culprit.

The culprit flag must be stored only in private canonical data.

### D. Evidence

Each evidence item must contain:

- Stable ID.
- Title.
- Type.
- Description.
- Discovery context.
- Fictional timestamp.
- Source.
- Content or asset reference.
- Related suspect IDs.
- Related timeline event IDs.
- Evidentiary significance.
- Whether it supports, contradicts, or is neutral to a particular claim.
- Whether it is a red herring.
- Required asset generation status, if applicable.

### E. Timeline

Each event must contain:

- Stable ID.
- Timestamp.
- Event description.
- Participants.
- Related evidence IDs.
- Confidence or certainty classification.
- Whether it is a confirmed fact or an unverified claim.

## 10.4 Consistency rules

The validation engine must enforce:

1. Exactly one culprit exists.
2. The culprit ID references an existing suspect.
3. All suspect IDs are unique within the case.
4. All evidence IDs are unique within the case.
5. All referenced suspects, events, and evidence items exist.
6. Timestamps are valid and consistent with the fictional incident.
7. Evidence does not establish mutually incompatible facts without explaining the discrepancy.
8. The culprit's motive, opportunity, and actions are consistent with the timeline.
9. The correct culprit can be inferred using evidence available to the player.
10. At least two independent pieces of evidence support the correct conclusion.
11. Each non-culprit suspect has a believable reason for appearing suspicious.
12. Red herrings are explainable and do not invalidate the canonical solution.
13. The final explanation cites existing evidence IDs.
14. No required public evidence is missing.
15. The story is self-contained and does not depend on outside factual research.

These are application validation rules, not instructions that should be left entirely to the AI.

## 10.5 Difficulty levels

### Easy

- 3 suspects by default.
- Clear evidence relationships.
- Limited red herrings.
- Direct contradictions.
- Relatively short timeline.

### Medium

- 4 suspects by default.
- Multiple motives.
- Several interconnected evidence items.
- At least one plausible red herring.
- Some indirect deductions.

### Hard

- 5–6 suspects.
- More complex timelines.
- Multiple misleading but explainable clues.
- Several deductions required to identify the culprit.
- Stronger emphasis on cross-referencing evidence.

Difficulty must affect the reasoning complexity, not introduce contradictions or arbitrary answers.

## 10.6 AI retry policy

Use a bounded retry strategy:

- First attempt: generate the mystery.
- Second attempt: repair validation failures using specific error messages.
- Third attempt: regenerate or repair the failed components.

After the configured retry limit, mark the generation job as failed.

The retry count must be configurable.

Do not retry indefinitely or repeatedly incur Gemini API costs for an impossible or invalid request.

## 10.7 Structured output

Use Gemini's supported structured-output capabilities where available.

Parse the response into a JSON object and validate it using the application's schema.

Do not depend on extracting JSON from arbitrary prose using fragile string splitting.

If the provider returns malformed or incomplete content, handle it as a generation failure and apply the bounded retry policy.

---

# 11. AI Prompt Specification

The prompt must establish a clear separation between the story's truth and the artifacts that reveal it.

## 11.1 System prompt

The backend must maintain a versioned system prompt with the following intent:

> You are the mystery architect for AI Mystery Room, a fictional detective game.
>
> Create a coherent, fair, self-contained investigation from the player's scenario.
>
> First establish the complete canonical truth: the incident, culprit, motive, method, opportunity, timeline, and actions of every suspect.
>
> Then generate suspects, statements, timelines, and evidence from that canonical truth.
>
> Every clue must agree with the established events unless the clue intentionally represents a lie, mistaken recollection, incomplete information, or another explicitly explained source of uncertainty.
>
> There must be exactly one culprit. The correct culprit must be identifiable through the evidence available to the player.
>
> Do not change the canonical solution to accommodate arbitrary evidence generated later.
>
> Do not create impossible timelines, missing suspects, nonexistent evidence references, or unsupported conclusions.
>
> Include plausible but fair red herrings. Explain why each misleading clue is misleading.
>
> Return only the requested structured object using the specified schema. Do not include markdown fences or commentary outside the object.
>
> All characters, conversations, events, and artifacts are fictional. Do not claim that generated records are authentic records from real services.
>
> Follow the supplied content limits and difficulty settings.

## 11.2 User prompt template

The backend constructs a prompt containing:

- Player's scenario.
- Selected genre.
- Selected difficulty.
- Setting.
- Suspect count.
- Evidence requirements.
- Required JSON schema.
- Content restrictions.
- Consistency requirements.

The user's story is untrusted input. It must never be allowed to override the system prompt, expose secrets, change application policy, or request arbitrary tool execution.

## 11.3 Evidence generation

Evidence should be generated from the canonical blueprint.

The preferred approach is to generate the canonical blueprint and its logically connected evidence in one structured generation stage, then validate and persist the result.

If evidence requires a separate AI call, pass the relevant canonical facts and instruct the model to create only the requested artifact without changing established events.

Any artifact that fails validation must be repaired or regenerated before the case becomes playable.

## 11.4 AI versioning

Store the following metadata with each case:

- Provider.
- Model identifier.
- Prompt version.
- Schema version.
- Generation timestamp.
- Number of attempts.
- Validation outcome.

This allows future prompt improvements without silently changing existing cases.

## 11.5 AI cost and latency

- Use token limits appropriate to the expected structured output.
- Avoid generating the same case repeatedly.
- Do not call Gemini every time a player opens evidence.
- Persist validated results.
- Reuse evidence and asset references.
- Configure request timeouts.
- Handle provider rate limits.
- Limit concurrent generation jobs.
- Record generation duration and token usage where available.

---

# 12. Evidence System

## 12.1 Supported evidence types

The initial application must support the following evidence types:

| Type | Presentation |
|---|---|
| `chat` | Fictional messaging conversation |
| `image` | Fictional photograph or image artifact |
| `cctv` | CCTV-style recording or incident report |
| `document` | Notes, reports, receipts, letters |
| `statement` | Witness or suspect statement |
| `timeline` | Sequence of relevant events |

## 12.2 Fictional chat evidence

A chat evidence item must contain:

- Conversation participants.
- Message timestamps.
- Message text.
- Sender identifiers.
- Optional attachment references.
- Relevant context.
- Related suspects.
- Evidence significance.

Messages must be displayed in a recognizable chat interface, but the interface must identify the content as fictional game evidence.

Do not connect to actual WhatsApp accounts or scrape real messages.

Do not represent generated conversations as verified exports from real devices.

## 12.3 Image evidence

Image evidence may include:

- A fictional location photograph.
- An object found at the scene.
- A visual detail relevant to an alibi.
- A fictional document photograph.
- A visual clue requiring comparison.

Image generation is a separate capability from Gemini text generation. The project must not assume that a text-generation API automatically produces image files.

For the MVP:

1. Use generated image assets when a compatible image-generation provider is configured.
2. If no image-generation provider is configured, use locally stored fictional assets or an evidence illustration generated by the frontend.
3. Never label a placeholder illustration as an actual CCTV recording or genuine photographic evidence.
4. Keep the asset-generation interface replaceable so that a provider can be added later.

Store asset references and metadata in MongoDB, not large base64 image blobs.

## 12.4 CCTV evidence

The MVP should support a CCTV evidence viewer with:

- Camera identifier.
- Fictional location.
- Recorded time range.
- Incident summary.
- Timestamped observations.
- Related suspects.
- A video-like interface when a real compatible video asset exists.

When no video-generation provider is available, present the content as a **CCTV incident log** or **frame-by-frame reconstruction**, not as an actual generated recording.

The frontend may show fictional still frames and timestamp overlays. Do not pretend a static image is a playable video.

## 12.5 Evidence relationships

Each evidence item must reference the entities it affects.

For example:

- Chat message → suspect and timeline event.
- CCTV observation → suspect, location, and time.
- Photograph → object or location and relevant timeline event.
- Witness statement → speaker and claim.
- Document → author, date, and associated event.

The evidence board uses these relationships to help the player organize findings.

---

# 13. Database Design

Use Mongoose models with schema validation, timestamps, appropriate indexes, and explicit field selection.

## 13.1 User model

Collection: `users`

Fields:

- `_id`
- `displayName`
- `email`, if account authentication is implemented
- `passwordHash`, if password authentication is implemented
- `authProvider`, if applicable
- `createdAt`
- `updatedAt`

Security rules:

- Never store plaintext passwords.
- Never return password hashes in API responses.
- Do not require user accounts if secure guest access is chosen for the MVP.
- Never treat a user ID supplied by the browser as authorization.

## 13.2 Mystery model

Collection: `mysteries`

Public fields:

- `_id`
- `ownerId` or equivalent guest-session ownership reference
- `title`
- `scenario`
- `summary`
- `genre`
- `difficulty`
- `setting`
- `incidentDate`
- `incidentLocation`
- `briefing`
- `investigationObjectives`
- `suspects`
- `evidence`
- `timeline`
- `generationStatus`
- `generationMetadata`
- `createdAt`
- `updatedAt`

Private fields:

- `canonicalSolution`
- `canonicalValidation`
- `internalGenerationData`

The private fields must be excluded from public serialization by default.

For a production implementation, consider separating the canonical solution into its own collection with restricted service-level access.

## 13.3 Suspect subdocument

Fields:

- `id`
- `name`
- `role`
- `age`, if applicable
- `personality`
- `motive`
- `publicAlibi`
- `statements`
- `relationships`
- `profileAssetId`, if available

Do not include a publicly accessible `isCulprit` field.

## 13.4 Evidence subdocument

Fields:

- `id`
- `title`
- `type`
- `description`
- `discoveryContext`
- `timestamp`
- `source`
- `content`
- `asset`
- `relatedSuspectIds`
- `relatedEventIds`
- `significance`
- `credibility`
- `metadata`

The public evidence schema must not contain hidden answer labels or solution-only reasoning.

## 13.5 Canonical solution

Fields:

- `culpritId`
- `motive`
- `method`
- `opportunity`
- `incidentTimeline`
- `explanation`
- `decisiveEvidenceIds`
- `alternativeSuspectExplanations`
- `redHerringExplanations`

This data must only be retrieved by authorized backend services.

## 13.6 Investigation session

Collection: `investigationSessions`

Fields:

- `_id`
- `mysteryId`
- `ownerId` or secure guest-session ownership reference
- `status`
- `selectedEvidenceIds`
- `notes`
- `accusation`
- `result`
- `startedAt`
- `completedAt`
- `createdAt`
- `updatedAt`

Supported session states:

- `active`
- `completed`
- `abandoned`

The application should normally create one investigation session per player per case. If multiple sessions are supported later, the uniqueness rule must be explicitly revised.

## 13.7 Accusation result

Fields:

- `selectedSuspectId`
- `isCorrect`
- `submittedAt`
- `explanation`
- `score`, if scoring is implemented

The backend must compute `isCorrect` by comparing the submitted suspect ID against the private canonical solution.

Do not accept a client-provided correctness flag.

## 13.8 Indexes

Create indexes where appropriate for:

- Mystery owner and creation date.
- Mystery generation status.
- Session owner and mystery ID.
- Session status.
- Guest-session ownership token hash.
- Idempotency keys for generation and accusation requests, where needed.

Avoid unnecessary indexes on large embedded arrays unless query patterns justify them.

---

# 14. REST API Specification

Base path: `/api/v1`

All API requests and responses must use JSON unless a specific asset-serving route is introduced.

## 14.1 Standard response conventions

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid scenario.",
    "details": []
  }
}
```

Do not expose stack traces, secrets, database internals, private prompts, or canonical solutions in error responses.

## 14.2 Health check

`GET /api/v1/health`

Purpose:

- Check server availability.
- Optionally report non-sensitive dependency status.

The public health endpoint must not disclose environment variables, database credentials, or provider secrets.

## 14.3 Create mystery

`POST /api/v1/mysteries`

Request:

```json
{
  "scenario": "A rare manuscript disappears from a locked library.",
  "genre": "detective",
  "difficulty": "medium",
  "setting": "modern",
  "suspectCount": 4
}
```

Expected behavior:

- Validate the request.
- Verify rate limits and authorization.
- Create a generation job or generate synchronously, depending on the implementation.
- Return the created case or a generation-job reference.

Recommended asynchronous response:

HTTP `202 Accepted`

```json
{
  "success": true,
  "data": {
    "caseId": "CASE_ID",
    "status": "queued"
  }
}
```

## 14.4 Check generation status

`GET /api/v1/mysteries/:caseId/status`

Returns:

- Case ID.
- Generation status.
- Progress stage.
- Safe error information if failed.

Do not expose private generation prompts or solution data.

## 14.5 Get case

`GET /api/v1/mysteries/:caseId`

Returns:

- Public case metadata.
- Briefing.
- Public suspect profiles.
- Evidence index.
- Timeline information suitable for the current game stage.
- Generation status.

It must not return the canonical culprit or hidden solution.

## 14.6 Get suspects

`GET /api/v1/mysteries/:caseId/suspects`

Returns public suspect profiles only.

The server must omit private canonical fields.

## 14.7 Get evidence

`GET /api/v1/mysteries/:caseId/evidence`

Optional query parameters:

- `type`
- `suspectId`
- `search`

Returns the public evidence index and the requested filtered results.

The player must not receive solution-only significance labels.

## 14.8 Get evidence item

`GET /api/v1/mysteries/:caseId/evidence/:evidenceId`

Returns the complete public artifact for that evidence item.

Verify both case ownership and evidence membership before returning the item.

## 14.9 Get investigation session

`GET /api/v1/mysteries/:caseId/session`

Returns the authorized player's session state, notes, selected evidence IDs, and completion status.

## 14.10 Update investigation session

`PATCH /api/v1/mysteries/:caseId/session`

Request:

```json
{
  "notes": "The witness's timeline conflicts with the camera log.",
  "selectedEvidenceIds": [
    "evidence_01",
    "evidence_04"
  ]
}
```

Expected behavior:

- Validate all evidence IDs.
- Limit note length.
- Enforce ownership.
- Save the updated session.
- Reject modifications after completion when those modifications would change the verdict or score.

## 14.11 Submit accusation

`POST /api/v1/mysteries/:caseId/accusations`

Request:

```json
{
  "suspectId": "suspect_03",
  "reasoning": "The camera log contradicts the suspect's alibi."
}
```

Expected behavior:

1. Verify case and session ownership.
2. Verify the case is ready.
3. Verify the session is active.
4. Verify the suspect belongs to the case.
5. Enforce the MVP's one-final-accusation rule.
6. Compare the suspect ID with the canonical culprit ID.
7. Generate or retrieve the explanation from the canonical solution.
8. Persist the completed session and verdict.
9. Return the verdict response.

The evaluation must be deterministic. The AI must not independently decide whether the selected culprit is correct.

## 14.12 Get verdict

`GET /api/v1/mysteries/:caseId/verdict`

Only available to the authorized player after the case is completed.

Returns:

- Submitted accusation.
- Correctness.
- Culprit identity.
- Solution explanation.
- Decisive evidence.
- Timeline reconstruction.
- Red-herring explanations.

## 14.13 API error codes

Implement consistent error codes, including:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CASE_NOT_READY`
- `GENERATION_FAILED`
- `GENERATION_IN_PROGRESS`
- `RATE_LIMITED`
- `INVALID_SUSPECT`
- `SESSION_COMPLETED`
- `ACCUSATION_ALREADY_SUBMITTED`
- `AI_PROVIDER_ERROR`
- `INTERNAL_SERVER_ERROR`

Use appropriate HTTP status codes such as 400, 401, 403, 404, 409, 422, 429, and 500.

---

# 15. Verdict and Scoring Logic

## 15.1 MVP verdict

The MVP uses one final accusation per investigation session.

The verdict is determined by:

```text
if selectedSuspectId === canonicalSolution.culpritId:
    result = correct
else:
    result = incorrect
```

This comparison happens on the backend.

## 15.2 Explanation generation

The solution explanation should be generated from the canonical solution and validated evidence.

It must:

- Identify the decisive evidence.
- Explain the culprit's motive.
- Explain the opportunity and method.
- Reconstruct the important timeline.
- Explain contradictions in the alibis.
- Explain misleading clues.
- Explain why the other suspects were eliminated.

The application must not rely on a new unconstrained AI call to determine the truth.

If the explanation needs to be generated dynamically, the model must receive the established solution and evidence as fixed facts. Cache the validated result.

## 15.3 Optional score

If a score is implemented, use a transparent rule.

Suggested initial scoring:

- Correct culprit: 100 points.
- Each correctly identified decisive clue: up to 20 bonus points.
- Optional hint used: deduct a small configured amount.
- Incorrect accusation: zero base points.

Do not implement scoring in a way that changes the verdict.

If evidence tagging and scoring are not ready, omit the scoring UI entirely.

---

# 16. Authentication and Session Security

The MVP may use secure guest sessions to reduce onboarding friction.

If authentication is implemented, support a documented authentication strategy rather than inventing a custom insecure one.

## 16.1 Guest-session requirements

- Generate a cryptographically secure, unpredictable session token.
- Store only a hash of the token server-side where applicable.
- Use an appropriate secure cookie strategy.
- Set `HttpOnly`, `Secure` in production, and an appropriate `SameSite` policy.
- Validate ownership on every private case and session endpoint.
- Do not use a MongoDB ObjectId as a secret.
- Do not trust `ownerId` supplied in request bodies.
- Provide a clear session-expiry and recovery policy.

## 16.2 General security requirements

- Validate all input on the server.
- Sanitize user-controlled strings where necessary.
- Restrict request body sizes.
- Rate-limit expensive AI generation routes.
- Use CORS with explicit allowed origins.
- Apply Helmet security headers.
- Protect cookie-authenticated mutation endpoints against CSRF as appropriate.
- Avoid leaking sensitive information through logs.
- Never store Gemini API keys in frontend code.
- Never expose canonical solutions through public API responses.
- Avoid rendering untrusted AI content as raw HTML.
- Validate URLs before using them as asset references.
- Restrict image and document uploads if upload functionality is added later.

---

# 17. Configuration and Environment Variables

Create `.env.example` with documented placeholders.

```dotenv
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
API_BASE_PATH=/api/v1

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room

# AI
GEMINI_API_KEY=
GEMINI_MODEL=

# Generation
MYSTERY_GENERATION_TIMEOUT_MS=90000
MYSTERY_GENERATION_MAX_RETRIES=2
MYSTERY_GENERATION_MAX_CONCURRENCY=2

# Security
SESSION_SECRET=
SESSION_TTL_HOURS=24
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# Optional image generation
IMAGE_GENERATION_PROVIDER=local
IMAGE_GENERATION_API_KEY=

# Frontend
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

These values are examples of configuration names and development defaults, not production security recommendations.

Codex must:

- Validate required environment variables at startup.
- Fail fast with a clear configuration error when mandatory values are missing.
- Never commit `.env` files.
- Never prefix secrets with `VITE_`.
- Never expose secrets in client bundles.
- Document production settings separately.
- Ensure the server-side Gemini key is available only to backend code.

---

# 18. Error Handling and Resilience

## 18.1 Frontend states

Every major asynchronous feature must have:

- Idle state.
- Loading state.
- Success state.
- Empty state, where applicable.
- Recoverable error state.
- Disabled state where actions are unavailable.

## 18.2 Gemini failures

Handle:

- Invalid API credentials.
- Quota exhaustion.
- Rate limiting.
- Request timeouts.
- Provider outages.
- Malformed structured output.
- Content policy refusals.
- Inconsistent evidence.
- Excessive generation duration.

The application must show a useful user-facing message without revealing sensitive provider details.

## 18.3 Database failures

- Handle connection errors.
- Avoid reporting success before persistence succeeds.
- Prevent duplicate generation jobs where idempotency is required.
- Use appropriate atomic updates for session completion.
- Do not mark an accusation as submitted until the canonical result has been successfully persisted.

## 18.4 Idempotency

Mystery creation and accusation endpoints must be protected against duplicate submissions.

Use an idempotency key or equivalent request-deduplication strategy where appropriate.

A repeated accusation request must not create multiple completed sessions or inconsistent results.

## 18.5 Timeouts and cancellation

- Configure request timeouts.
- Do not hold an HTTP request open indefinitely while waiting for AI generation.
- Prefer a job/status workflow for generation.
- Ensure a failed browser connection does not automatically create a duplicate job.
- If cancellation is implemented, define how cancelled generation jobs are handled and whether they incur provider costs.

---

# 19. Testing Strategy

Testing is required, not optional.

## 19.1 Unit tests

Test:

- Scenario validation.
- Configuration validation.
- Mystery schema validation.
- Exactly-one-culprit validation.
- Evidence-reference integrity.
- Timeline consistency rules.
- Public/private data serialization.
- Verdict comparison.
- Session-state transitions.
- Request validation.

## 19.2 Integration tests

Test:

- MongoDB model persistence.
- Mystery creation.
- Generation job status.
- Public case retrieval.
- Suspect retrieval.
- Evidence retrieval.
- Investigation session creation and updates.
- Correct accusation.
- Incorrect accusation.
- Repeated accusation.
- Unauthorized case access.
- AI provider failures.
- Retry behavior.

Use a mocked Gemini service in ordinary automated tests. Tests must not incur real API costs by default.

Maintain a small number of optional integration tests that can run against the actual provider when explicitly configured.

## 19.3 End-to-end tests

Using an appropriate browser automation tool such as Playwright, test the complete player journey:

1. Open the home page.
2. Navigate to mystery creation.
3. Enter a valid scenario.
4. Generate or load a deterministic test mystery.
5. Open the case briefing.
6. View suspects.
7. Open a chat evidence item.
8. Open an image evidence item.
9. Review the timeline.
10. Add evidence to the investigation board.
11. Save a note.
12. Select a suspect.
13. Submit the accusation.
14. Verify the verdict.
15. Refresh the page and verify persistence.

## 19.4 Security tests

Verify that:

- The culprit is not present in public case responses.
- The Gemini key is not present in frontend assets.
- One user cannot read another user's case.
- Invalid suspect IDs are rejected.
- Invalid evidence IDs are rejected.
- Request-size limits are enforced.
- Rate limits are applied.
- Completed sessions cannot be manipulated to change a verdict.

## 19.5 Quality gate

A feature is complete only when:

- The implementation works.
- Its critical tests pass.
- Errors are handled.
- The interface is responsive.
- API contracts are documented.
- Security requirements are satisfied.
- No placeholder behavior is presented as a finished feature.

---

# 20. Implementation Plan for Codex

Codex must implement the project in the following phases.

## Phase 0 — Repository inspection and planning

Tasks:

- Inspect repository files and current dependencies.
- Identify existing functionality.
- Create or update `docs/SPEC.md`.
- Create `docs/ARCHITECTURE.md`.
- Create `docs/API.md`.
- Create `docs/DATA_MODEL.md`.
- Create `docs/AI_PROMPTS.md`.
- Create `docs/IMPLEMENTATION_STATUS.md`.
- Record any existing implementation that differs from this specification.

Deliverable: an agreed implementation plan and repository baseline.

Do not rewrite the entire application during this phase.

## Phase 1 — Project foundation

Tasks:

- Configure React and Vite.
- Configure Express.
- Configure Tailwind CSS.
- Connect MongoDB.
- Configure environment validation.
- Set up routing.
- Create shared UI components.
- Add health endpoint.
- Add logging and error middleware.
- Add development scripts.

Exit criteria:

- Frontend runs locally.
- Backend runs locally.
- MongoDB connects.
- Health endpoint responds.
- No secrets are committed.

## Phase 2 — UI shell

Tasks:

- Build landing page.
- Build mystery creation page.
- Build case overview.
- Build investigation workspace.
- Build suspect cards.
- Build evidence viewer.
- Build timeline.
- Build investigation board.
- Build accusation flow.
- Build verdict page.
- Implement responsive layouts.

Use deterministic mock fixtures during UI development. Clearly isolate the fixtures from production services.

Exit criteria:

- The complete interface can be navigated using a test mystery.
- All primary interactions function.
- Mobile and desktop layouts are usable.

## Phase 3 — Data models and APIs

Tasks:

- Implement database models.
- Implement ownership and session access.
- Implement case endpoints.
- Implement suspect and evidence endpoints.
- Implement session persistence.
- Implement request validation.
- Implement API error conventions.

Exit criteria:

- All documented endpoints behave according to their contracts.
- Ownership restrictions are tested.
- Public responses omit canonical solution fields.

## Phase 4 — Gemini generation

Tasks:

- Implement the Gemini service.
- Add versioned generation prompts.
- Implement structured output validation.
- Implement canonical solution validation.
- Implement evidence relationship validation.
- Implement retry and failure policies.
- Persist generation metadata.
- Add generation status polling.

Exit criteria:

- A valid scenario generates a playable mystery.
- Invalid output cannot become a ready case.
- Failed generation is reported correctly.
- The answer remains private before accusation.

## Phase 5 — Investigation and verdict

Tasks:

- Connect all evidence viewers to persisted data.
- Implement notes and evidence selection.
- Implement accusation submission.
- Implement deterministic server-side verdict evaluation.
- Implement the solution explanation.
- Implement completed-session restrictions.

Exit criteria:

- A complete investigation can be finished.
- Correct and incorrect accusations produce the expected verdict.
- Refreshing the browser preserves case and session state.

## Phase 6 — Visual evidence

Tasks:

- Implement fictional chat artifacts.
- Implement image evidence and asset fallback.
- Implement CCTV incident logs or frame-based reconstructions.
- Add optional provider integration for generated images.
- Validate asset references and loading states.

Exit criteria:

- All supported evidence types render correctly.
- No unavailable asset blocks the investigation.
- Placeholder assets are clearly identified.

## Phase 7 — Testing and security

Tasks:

- Add unit tests.
- Add API integration tests.
- Add end-to-end tests.
- Test private solution protection.
- Test cross-user access restrictions.
- Test duplicate requests and failures.
- Test responsive layouts.
- Fix all critical defects.

Exit criteria:

- All required tests pass.
- No known critical security defect remains.
- The complete player journey works end to end.

## Phase 8 — Deployment preparation

Tasks:

- Add production build scripts.
- Configure production environment variables.
- Configure MongoDB access controls.
- Document deployment.
- Add health checks.
- Add error monitoring guidance.
- Add backup and recovery guidance.
- Document API rate limits and generation costs.

Exit criteria:

- The application can be built for production.
- The deployment configuration does not expose secrets.
- Setup instructions are reproducible.

---

# 21. Definition of Done

The MVP is considered complete only when all of the following are true.

### Product

- [ ] A player can create a mystery from a scenario.
- [ ] The application generates suspects and evidence.
- [ ] The case contains one canonical culprit.
- [ ] Evidence is coherent with the timeline and canonical solution.
- [ ] The player can explore all required evidence types.
- [ ] The player can organize evidence and write notes.
- [ ] The player can submit a final accusation.
- [ ] The application displays a correct or incorrect verdict.
- [ ] The final explanation is grounded in the case evidence.

### Engineering

- [ ] The frontend and backend follow the specified architecture.
- [ ] MongoDB persistence works.
- [ ] API contracts are implemented.
- [ ] AI output is schema-validated.
- [ ] Retry and failure policies work.
- [ ] Session state persists.
- [ ] Duplicate requests are handled safely.
- [ ] Public endpoints do not expose the canonical answer.

### Security

- [ ] Gemini credentials remain server-side.
- [ ] Private case access is enforced.
- [ ] Inputs are validated on the server.
- [ ] Rate limits protect expensive endpoints.
- [ ] Secrets are excluded from version control.
- [ ] Completed verdicts cannot be altered through ordinary client requests.

### UX and quality

- [ ] The application is responsive.
- [ ] Loading and error states are implemented.
- [ ] No core button is a placeholder.
- [ ] Accessibility fundamentals are implemented.
- [ ] Automated tests cover critical paths.
- [ ] README and implementation documentation are current.

---

# 22. Out of Scope and Non-Negotiable Constraints

Codex must not:

- Expose the culprit in frontend constants, hidden HTML, or public API payloads.
- Let Gemini decide the verdict independently of the canonical solution.
- Generate each evidence item without reference to established case facts.
- Store API keys in source code.
- Replace MongoDB with another database.
- Replace the MERN stack with another framework.
- Introduce an image or video generation provider as a mandatory dependency without approval.
- Claim to generate authentic WhatsApp records, real surveillance footage, or genuine crime-scene photographs.
- Add payment systems, subscriptions, or multiplayer features to the MVP.
- Mark incomplete AI output as a playable case.
- Leave nonfunctional controls in the completed UI.
- Silently modify the API contract or database schema without updating the documentation and tests.

---

# 23. Specification Change Management

This specification is authoritative, but it may evolve through deliberate changes.

When a requirement changes:

1. Identify the affected requirement.
2. Describe the reason for the change.
3. Update `docs/SPEC.md`.
4. Update affected architecture, API, and data-model documents.
5. Update implementation tasks.
6. Update or add tests.
7. Implement the change.
8. Record the change in a specification changelog.

Codex must not silently make a substantial product decision and treat it as approved.

For minor implementation details that do not change product behavior or public contracts, Codex may use reasonable engineering judgment.

---

# 24. Initial Assumptions

The following assumptions establish a practical MVP baseline:

1. The application is single-player.
2. Guest access is preferred for reducing initial onboarding friction, provided ownership can be enforced securely.
3. Each case has one canonical culprit.
4. Each player gets one final accusation per session.
5. The verdict is deterministic.
6. Gemini is the primary text-generation provider.
7. Image generation is optional.
8. Video generation is optional and is not required for the MVP.
9. Evidence is fictional and clearly presented as game content.
10. MongoDB stores structured mystery and session data.
11. The first release prioritizes correctness and coherence over maximum evidence volume.
12. The initial release is a responsive web application.

If an assumption proves unsuitable, update the specification before implementing a materially different approach.

---

# 25. First Instruction to Codex

Use the following prompt to begin the implementation workflow.

**Codex execution prompt:**

You are the lead software engineer responsible for implementing AI Mystery Room according to this specification.

Treat `docs/SPEC.md` as the Single Source of Truth.

Before writing application code:

1. Inspect the existing repository.
2. Identify existing files, dependencies, and implemented features.
3. Compare the repository against this specification.
4. Create or update the supporting architecture, API, data-model, AI-prompt, and implementation-status documents.
5. Produce a concise implementation plan with dependencies, risks, and phase-specific acceptance criteria.
6. Identify any conflicts that require a product decision before implementation.

Then implement Phase 1 only.

For Phase 1, establish the MERN project foundation, environment validation, MongoDB connection, API health check, frontend routing, Tailwind styling, reusable UI primitives, and development scripts.

Do not implement later phases prematurely.

After Phase 1:

- Run the relevant tests and build checks.
- Fix all errors introduced by your changes.
- Document commands required to run the project.
- Update `docs/IMPLEMENTATION_STATUS.md`.
- Report the files created or changed, commands executed, test results, unresolved issues, and the next phase.

Continue through the remaining phases incrementally, respecting the dependency order and acceptance criteria defined in this specification.

Never claim that a feature or test is complete unless you have actually implemented or executed it. Preserve the existing codebase where practical, keep changes focused, and maintain consistency between the implementation, tests, and specification.

---

# 26. Final Product Definition

AI Mystery Room is a MERN-based interactive detective game in which Gemini creates fictional mysteries from user-provided scenarios. A validated canonical solution governs the suspects, timeline, and evidence. Players explore the investigation, examine fictional digital artifacts, organize their findings, and submit a final accusation. The server evaluates the accusation against the hidden solution and presents an evidence-based explanation.

**The defining quality of the product is not simply AI-generated storytelling. It is the ability to generate a coherent, fair, and solvable investigation that the player can genuinely investigate.**
