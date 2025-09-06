-- Add isDeleted column to products if missing (PostgreSQL)
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "products_isDeleted_idx" ON "products" ("isDeleted");
