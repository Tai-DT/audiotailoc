Prisma Schema Notes

This backend uses a simplified schema optimized for unit tests and a minimal feature set:

- Product: `slug` (unique), `priceCents` (Int), `featured` (Boolean)
- Promotion: uses `startDate`, `endDate`, `isActive` for validity

Legacy/demo scripts that targeted older schemas have been archived in `../legacy/` and are excluded from TypeScript compilation via `tsconfig.json`.

Active seed script: `../src/seed.ts`

