Migration: add idempotencyKey to orders

SQL example (Postgres):

ALTER TABLE "orders" ADD COLUMN "idempotencyKey" TEXT;
CREATE INDEX idx_orders_idempotency ON "orders"("idempotencyKey");

Notes:
- This is a safe, nullable column with an index to speed up idempotency lookups.
- Apply on staging first and ensure no locks during peak hours.