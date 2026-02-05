-- Add missing optional order fields used by the API.
-- Some databases may have been created from older migrations and miss these columns.

ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;

ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "notes" TEXT;

CREATE INDEX IF NOT EXISTS "idx_orders_idempotency" ON "orders"("idempotencyKey");

