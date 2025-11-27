-- AlterTable: Add missing fields and fix naming inconsistencies in promotions table
ALTER TABLE "promotions"
ADD COLUMN IF NOT EXISTS "startsAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "maxDiscount" INTEGER,
ADD COLUMN IF NOT EXISTS "minOrderAmount" INTEGER,
ADD COLUMN IF NOT EXISTS "usageCount" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "usageLimit" INTEGER,
ADD COLUMN IF NOT EXISTS "tierBased" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "isFirstPurchaseOnly" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "customerSegment" TEXT,
ADD COLUMN IF NOT EXISTS "conditions" JSONB,
ADD COLUMN IF NOT EXISTS "versionNumber" INTEGER DEFAULT 1;

-- Update existing data: migrate starts_at to startsAt if empty
UPDATE "promotions" SET "startsAt" = "starts_at" WHERE "startsAt" IS NULL AND "starts_at" IS NOT NULL;

-- Create promotions_products junction table
CREATE TABLE IF NOT EXISTS "promotions_products" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "promotionId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "promotions_products_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "promotions_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE("promotionId", "productId")
);

-- Create promotions_categories junction table
CREATE TABLE IF NOT EXISTS "promotions_categories" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "promotionId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "promotions_categories_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "promotions_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE("promotionId", "categoryId")
);

-- Create customer_promotions table for tracking promotion usage per customer
CREATE TABLE IF NOT EXISTS "customer_promotions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "promotionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "orderId" TEXT,
  "discountApplied" INTEGER,
  "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT DEFAULT 'APPLIED',
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "customer_promotions_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "customer_promotions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "customer_promotions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create promotion_audit_logs table for tracking all changes
CREATE TABLE IF NOT EXISTS "promotion_audit_logs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "promotionId" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "oldValues" JSONB,
  "newValues" JSONB,
  "reason" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "promotion_audit_logs_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "promotion_audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create promotion_analytics table for detailed metrics
CREATE TABLE IF NOT EXISTS "promotion_analytics" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "promotionId" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "impressions" INTEGER DEFAULT 0,
  "clicks" INTEGER DEFAULT 0,
  "conversions" INTEGER DEFAULT 0,
  "revenueImpact" DECIMAL(10, 2) DEFAULT 0,
  "discountGiven" DECIMAL(10, 2) DEFAULT 0,
  "usageCount" INTEGER DEFAULT 0,
  "avgOrderValue" DECIMAL(10, 2),
  "conversionRate" DECIMAL(5, 2),
  "roi" DECIMAL(5, 2),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "promotion_analytics_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE("promotionId", "date")
);

-- Create promotion_versions table for version history
CREATE TABLE IF NOT EXISTS "promotion_versions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "promotionId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "data" JSONB NOT NULL,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "promotion_versions_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "promotion_versions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE("promotionId", "versionNumber")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_promotions_code" ON "promotions"("code");
CREATE INDEX IF NOT EXISTS "idx_promotions_isActive" ON "promotions"("isActive");
CREATE INDEX IF NOT EXISTS "idx_promotions_type" ON "promotions"("type");
CREATE INDEX IF NOT EXISTS "idx_promotions_startsAt" ON "promotions"("startsAt");
CREATE INDEX IF NOT EXISTS "idx_promotions_expiresAt" ON "promotions"("expiresAt");
CREATE INDEX IF NOT EXISTS "idx_promotions_customerSegment" ON "promotions"("customerSegment");

CREATE INDEX IF NOT EXISTS "idx_customer_promotions_userId" ON "customer_promotions"("userId");
CREATE INDEX IF NOT EXISTS "idx_customer_promotions_promotionId" ON "customer_promotions"("promotionId");
CREATE INDEX IF NOT EXISTS "idx_customer_promotions_usedAt" ON "customer_promotions"("usedAt");
CREATE INDEX IF NOT EXISTS "idx_customer_promotions_orderId" ON "customer_promotions"("orderId");

CREATE INDEX IF NOT EXISTS "idx_promotion_audit_logs_promotionId" ON "promotion_audit_logs"("promotionId");
CREATE INDEX IF NOT EXISTS "idx_promotion_audit_logs_userId" ON "promotion_audit_logs"("userId");
CREATE INDEX IF NOT EXISTS "idx_promotion_audit_logs_action" ON "promotion_audit_logs"("action");
CREATE INDEX IF NOT EXISTS "idx_promotion_audit_logs_createdAt" ON "promotion_audit_logs"("createdAt");

CREATE INDEX IF NOT EXISTS "idx_promotion_analytics_promotionId" ON "promotion_analytics"("promotionId");
CREATE INDEX IF NOT EXISTS "idx_promotion_analytics_date" ON "promotion_analytics"("date");

CREATE INDEX IF NOT EXISTS "idx_promotions_products_promotionId" ON "promotions_products"("promotionId");
CREATE INDEX IF NOT EXISTS "idx_promotions_products_productId" ON "promotions_products"("productId");

CREATE INDEX IF NOT EXISTS "idx_promotions_categories_promotionId" ON "promotions_categories"("promotionId");
CREATE INDEX IF NOT EXISTS "idx_promotions_categories_categoryId" ON "promotions_categories"("categoryId");

-- Add constraint to ensure created_by references users table if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'promotions_created_by_fkey'
  ) THEN
    ALTER TABLE "promotions" ADD CONSTRAINT "promotions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
