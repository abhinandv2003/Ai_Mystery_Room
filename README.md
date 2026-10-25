# AI Mystery Room

AI Mystery Room is a single-player detective game where players investigate fictional, AI-generated cases. The product and architecture requirements are in [`spec.md`](./spec.md); [`docs/SPEC.md`](./docs/SPEC.md) is the project documentation copy.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- MongoDB available locally or through a connection string

## Setup

1. Copy `.env.example` to `.env` and adjust `MONGODB_URI` if needed.
2. Install each package set from the repository root:

   ```powershell
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

3. Start the API and Vite development server with `npm run dev`.

The frontend is served at <http://localhost:5173>; the API health endpoint is <http://localhost:5000/api/v1/health>.

The current implementation includes the Phase 1 foundation and a Phase 2 interface journey through a fixed sample case. Open `/` and select **Explore the sample case** to inspect it. The sample verdict uses a development-only API fixture; scenario generation, production case APIs, and persisted user investigations are not implemented yet. See [`docs/IMPLEMENTATION_STATUS.md`](./docs/IMPLEMENTATION_STATUS.md) and [`docs/IMPLEMENTATION_PLAN.md`](./docs/IMPLEMENTATION_PLAN.md) for details.
