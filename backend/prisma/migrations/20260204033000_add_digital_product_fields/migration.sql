-- Add digital product fields for selling downloadable software via PayOS.
-- These fields are optional and safe for existing physical products.

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "isDigital" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "downloadUrl" TEXT;

CREATE INDEX IF NOT EXISTS "products_isDigital_idx" ON "products"("isDigital");

