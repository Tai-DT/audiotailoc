Legacy seeds and demo scripts

These scripts were written for older iterations of the data model and are archived here to avoid compile and schema-mismatch issues.

Archived files:
- add-karaoke-products.ts
- seed-karaoke.ts
- seed-services.ts
- prisma-seed.ts (moved from prisma/seed.ts)

Notes:
- Current schema uses Product fields: slug, priceCents, featured.
- The active seed is at `src/seed.ts` and matches the simplified schema.
- `tsconfig.json` excludes these legacy files from the TypeScript build.

