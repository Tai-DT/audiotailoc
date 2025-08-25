# Repository Guidelines

## Project Structure & Module Organization
- Monorepo with workspaces: `backend/` (NestJS + Prisma) and `frontend/` (Next.js).
- Backend: source in `backend/src`, tests in `backend/test` and `src/**/*.spec.ts`, Prisma schema in `backend/prisma/`, assets in `backend/uploads/`.
- Frontend: app routes in `frontend/app`, shared UI in `frontend/components`, utilities in `frontend/lib`, config in `frontend/next.config.js`.
- Supporting scripts live at repo root (e.g., `integration-master-plan.js`, `test-frontend-integration.js`).

## Build, Test, and Development Commands
- Root dev (both apps): `npm run dev` → runs backend and frontend together.
- Backend dev: `npm run dev:backend` (Nest watch mode). Prod build: `npm run build:backend`, start: `npm run start:backend`.
- Frontend dev: `npm run dev:frontend`. Build: `npm run build:frontend`, start: `npm run start:frontend`.
- Backend tests: `cd backend && npm run test` (Jest). Coverage: `npm run test:cov`. Lint: `npm run lint`.
- Database: `cd backend && npm run prisma:migrate:dev` then `npm run seed`.

## Coding Style & Naming Conventions
- TypeScript-first. Indentation 2 spaces; single quotes; trailing commas where sensible.
- Filenames: kebab-case for files (`booking-service.ts`); PascalCase for classes; camelCase for variables/functions.
- Nest modules: `*.module.ts`, controllers `*.controller.ts`, services `*.service.ts`.
- Linting: ESLint configured in root and packages; Prettier used in frontend. Run `npm run lint` per package.

## Testing Guidelines
- Backend: Jest for unit/integration. Name tests `*.spec.ts`; e2e as `*.e2e-spec.ts`. Run `npm run test`, or focus with `npm run test:unit`/`test:e2e`.
- Frontend: Playwright config present; use `cd frontend && npx playwright test` for E2E if enabled. Keep tests near features or under `__tests__/`.
- Aim for meaningful coverage on services and controllers; use `test:cov` to verify.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`). Scope examples: `backend`, `frontend`, `auth`, `booking`.
- PRs: clear title/description, linked issues, steps to test, screenshots for UI, and notes on migrations/ENV changes.

## Security & Configuration Tips
- Secrets: never commit `.env`. Use `backend/.env.example` and `frontend/.env.local.example`.
- Backend ENV: `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, `MINIO_*`/`CLOUDINARY_*`, SMTP.
- Frontend ENV: `NEXT_PUBLIC_API_URL` pointing to backend base URL.
