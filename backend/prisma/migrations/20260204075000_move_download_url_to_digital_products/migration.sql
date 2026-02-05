-- Move digital downloadUrl out of products into a dedicated table.
-- This keeps physical product data clean while allowing software-specific fields to evolve.

CREATE TABLE IF NOT EXISTS "digital_products" (
  "productId" TEXT NOT NULL,
  "downloadUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  CONSTRAINT "digital_products_pkey" PRIMARY KEY ("productId"),
  CONSTRAINT "digital_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Best-effort backfill from existing column (if present).
INSERT INTO "digital_products" ("productId", "downloadUrl", "createdAt", "updatedAt")
SELECT p."id", p."downloadUrl", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "products" p
WHERE p."isDigital" = true AND p."downloadUrl" IS NOT NULL AND TRIM(p."downloadUrl") <> ''
ON CONFLICT ("productId") DO UPDATE
SET "downloadUrl" = EXCLUDED."downloadUrl",
    "updatedAt" = EXCLUDED."updatedAt";

-- Drop old column (downloadUrl should now live in digital_products).
ALTER TABLE "products" DROP COLUMN IF EXISTS "downloadUrl";

