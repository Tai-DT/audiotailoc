---
name: Maintain Backend
description: Instructions and logic for maintaining, fixing, and verifying the NestJS backend.
---

# Maintain Backend Skill

This skill provides the logic and proccedures for maintaining the `@audiotailoc/backend` service.

## 1. Diagnostics & Health Checks

To verify the health of the backend logic, use the following commands from the `backend` directory:

```bash
# Run linting with auto-fix (Recommended first step)
npm run lint:fix

# Run type checking
npm run typecheck

# Run tests
npm run test
```

## 2. Common Fixes

### Formatting & Linting
If you encounter `prettier/prettier` errors or unused variable warnings:
- Run `npm run lint:fix`
- Remove unused variables checking the logic first.

### Database Schema
If there are errors related to Prisma or database schema:
- Ensure the database is running.
- Run `npm run prisma:generate` to update the client.
- Run `npm run prisma:migrate:dev` if schema changes are needed.

## 3. Deployment Preparation
Before deployment or merging:
1. Ensure `npm run build` passes without error.
2. Verify environment variables match the schema (see `.env.example`).
