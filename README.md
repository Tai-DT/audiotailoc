Audio Tài Lộc — Dev Notes

Backend (NestJS + Prisma)
- Env: apps/backend/.env
  - Ensure DATABASE_URL points to a DB you can migrate.
  - Set ADMIN_EMAILS with comma-separated admin emails.
- Migrate + generate:
  - pnpm --filter @audiotailoc/backend prisma:migrate:dev --name add-user-role
  - pnpm --filter @audiotailoc/backend prisma:generate
- Seed:
  - pnpm --filter @audiotailoc/backend seed
  - Promotes emails in ADMIN_EMAILS to role=ADMIN and seeds sample products.

Admin Dashboard (Next.js app router)
- Env: apps/dashboard/.env.local
  - NEXT_PUBLIC_API_BASE_URL=http://localhost:3010 (or your backend URL)
- Auth:
  - Login via /login (proxied to backend /auth/login).
  - Cookies: accessToken (15m), refreshToken (7d).
- Admin-only features:
  - Create/edit/delete products, image upload, bulk delete.
  - UI gated; backend enforced by AdminGuard (role or ADMIN_EMAILS).

Storefront (Next.js app router)
- Env: apps/frontend/.env.local
  - NEXT_PUBLIC_API_BASE_URL=http://localhost:3010
- Uses product.imageUrl when present.

Dev scripts
- Start backend: pnpm --filter @audiotailoc/backend dev
- Start dashboard: pnpm --filter @audiotailoc/dashboard dev
- Start storefront: pnpm --filter @audiotailoc/frontend dev

