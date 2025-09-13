
# Guidance for AI coding agents working on Audio Tài Lộc

This repository is a full-stack Next.js + NestJS TypeScript monorepo. Keep suggestions small, well-scoped, and testable. When in doubt prefer non-destructive changes and add tests or a smoke-check where practical.

Key facts (quick):
- Backend: `backend/` (NestJS, Prisma, Postgres). Main server port: 3010 (see `env-template.txt` and `backend/src/main.ts`). APIs are prefixed with `/api/v1` and docs at `/docs`.
- Frontend: `frontend/` (Next.js 15, App Router). Dev port: 3000. API base: `http://localhost:3010/api/v1`.
- Dashboard: `dashboard/` (Next.js). Dev port: 3001.

What changes are acceptable without human review:
- Small, single-file bug fixes (up to ~30 lines) with unit tests added or updated in the relevant package (`backend/` or `frontend/`).
- Fixing type errors, lint rule violations, or adding missing imports.
- Improving error messages, logging, or adding small validation checks.

When to ask for clarification:
- Any change that touches authentication, secrets, payment integrations (PayOS/MOMO/VNPAY), or database migrations.
- Schema changes in `prisma/schema.prisma` or anything that requires `prisma migrate`.

Developer workflows and commands (explicit):
- Start backend in dev: `cd backend && npm run start:dev` (watch, port 3010).
- Run backend tests: `cd backend && npm run test` (use `test:unit` or `test:integration` as needed).
- Run frontend dev: `cd frontend && npm run dev` (port 3000).
- Run dashboard dev: `cd dashboard && npm run dev` (port 3001).
- Common monorepo dev shortcut: `npm run dev` from repo root (project README documents commands).

Project-specific patterns and conventions to follow:
- API versioning: routes are under `api/v1`. Keep single-version docs in sync (Swagger is configured in `backend/src/main.ts`).
- Validation: backend uses Nest `ValidationPipe` with transform enabled; DTOs often rely on implicit conversion. Prefer adjusting DTOs over turning off validation.
- Global interceptors/filters: changes to response shape should consider `ResponseTransformInterceptor` and `HttpExceptionFilter` in `backend/src/common`.
- Large request bodies are limited (2MB) and compression/helmet are enabled — avoid suggesting very large uploads without adding chunking or streaming.
- Environment variables: see `env-template.txt`. Never hardcode production credentials or secrets; use placeholders.

Integration points to watch:
- Prisma + Postgres (`prisma/` and `backend/package.json` scripts). Running or changing migrations requires human review.
- Redis (caching) and Upstash usage — caches may affect tests; prefer clearing or mocking in unit tests.
- Cloudinary (uploads) and payment providers — treat as external and mock in tests.

Files and locations worth checking when editing:
- `backend/src/main.ts` — server boot, middleware, docs.
- `env-template.txt` — canonical env defaults and ports.
- `prisma/schema.prisma` and `backend/prisma/` — DB schema & migrations.
- `frontend/lib/api.ts` or `frontend/app/providers` — API client setup.
- `dashboard/` and `frontend/app/admin` — admin UI code and routes.

Testing and quality gates:
- Run unit tests after backend changes: `cd backend && npm run test:unit`.
- Run lint/typecheck when touching shared types: `cd backend && npm run typecheck` and `cd frontend && npm run lint`.
- For any change that modifies the public API surface, update Swagger docs or add/adjust integration tests under `backend/__tests__`.

Examples (be explicit):
- Fixing a 400-validation bug in a DTO: update DTO class, add/adjust a unit test in `backend/test/unit`, run `npm run test:unit`.
- Adding a small frontend API helper: add to `frontend/lib/api.ts`, update usages in `frontend/app/*`, run `npm run dev` and a smoke check.

If you change multiple files or run migrations, include a short checklist in the PR body with commands to reproduce locally.

If anything in this file is unclear or you need more repository-specific policies (e.g., admin credential handling, CI-only steps), ask the human maintainer before proceeding.
