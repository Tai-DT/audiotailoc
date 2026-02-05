-- Align database schema with prisma/schema.prisma (additive-safe).
-- Focus: add missing columns/tables that currently break Prisma queries.

-- =====================
-- Banners
-- =====================
ALTER TABLE "banners"
  ADD COLUMN IF NOT EXISTS "darkImageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "darkMobileImageUrl" TEXT;

-- =====================
-- Projects
-- =====================
ALTER TABLE "projects"
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- =====================
-- Service bookings extra guest fields
-- =====================
ALTER TABLE "service_bookings"
  ADD COLUMN IF NOT EXISTS "address" TEXT,
  ADD COLUMN IF NOT EXISTS "coordinates" TEXT,
  ADD COLUMN IF NOT EXISTS "goongPlaceId" TEXT,
  ADD COLUMN IF NOT EXISTS "customerName" TEXT,
  ADD COLUMN IF NOT EXISTS "customerPhone" TEXT,
  ADD COLUMN IF NOT EXISTS "customerEmail" TEXT;

-- =====================
-- Promotions: add createdBy + enforce non-null defaults for required fields
-- =====================
ALTER TABLE "promotions"
  ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

DO $$
BEGIN
  -- Best-effort data migration from legacy snake_case column.
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'promotions'
      AND column_name = 'created_by'
  ) THEN
    EXECUTE 'UPDATE "promotions" SET "createdBy" = "created_by" WHERE "createdBy" IS NULL AND "created_by" IS NOT NULL';
  END IF;
END $$;

ALTER TABLE "promotions" ALTER COLUMN "usageCount" SET DEFAULT 0;
UPDATE "promotions" SET "usageCount" = 0 WHERE "usageCount" IS NULL;
ALTER TABLE "promotions" ALTER COLUMN "usageCount" SET NOT NULL;

ALTER TABLE "promotions" ALTER COLUMN "tierBased" SET DEFAULT false;
UPDATE "promotions" SET "tierBased" = false WHERE "tierBased" IS NULL;
ALTER TABLE "promotions" ALTER COLUMN "tierBased" SET NOT NULL;

ALTER TABLE "promotions" ALTER COLUMN "isFirstPurchaseOnly" SET DEFAULT false;
UPDATE "promotions" SET "isFirstPurchaseOnly" = false WHERE "isFirstPurchaseOnly" IS NULL;
ALTER TABLE "promotions" ALTER COLUMN "isFirstPurchaseOnly" SET NOT NULL;

ALTER TABLE "promotions" ALTER COLUMN "versionNumber" SET DEFAULT 1;
UPDATE "promotions" SET "versionNumber" = 1 WHERE "versionNumber" IS NULL;
ALTER TABLE "promotions" ALTER COLUMN "versionNumber" SET NOT NULL;

-- =====================
-- Customer promotions: bigint + status non-null
-- =====================
ALTER TABLE "customer_promotions"
  ALTER COLUMN "discountApplied" TYPE BIGINT USING "discountApplied"::bigint;

ALTER TABLE "customer_promotions" ALTER COLUMN "status" SET DEFAULT 'APPLIED';
UPDATE "customer_promotions" SET "status" = 'APPLIED' WHERE "status" IS NULL;
ALTER TABLE "customer_promotions" ALTER COLUMN "status" SET NOT NULL;

-- =====================
-- Monetary columns: widen to BIGINT (safe int4 -> int8)
-- =====================
ALTER TABLE "orders"
  ALTER COLUMN "subtotalCents" TYPE BIGINT USING "subtotalCents"::bigint,
  ALTER COLUMN "discountCents" TYPE BIGINT USING "discountCents"::bigint,
  ALTER COLUMN "shippingCents" TYPE BIGINT USING "shippingCents"::bigint,
  ALTER COLUMN "totalCents" TYPE BIGINT USING "totalCents"::bigint;

ALTER TABLE "payment_intents"
  ALTER COLUMN "amountCents" TYPE BIGINT USING "amountCents"::bigint;

ALTER TABLE "payments"
  ALTER COLUMN "amountCents" TYPE BIGINT USING "amountCents"::bigint;

ALTER TABLE "refunds"
  ALTER COLUMN "amountCents" TYPE BIGINT USING "amountCents"::bigint;

ALTER TABLE "service_booking_items"
  ALTER COLUMN "price" TYPE BIGINT USING "price"::bigint;

ALTER TABLE "service_bookings"
  ALTER COLUMN "estimatedCosts" TYPE BIGINT USING "estimatedCosts"::bigint,
  ALTER COLUMN "actualCosts" TYPE BIGINT USING "actualCosts"::bigint;

ALTER TABLE "service_items"
  ALTER COLUMN "price" TYPE BIGINT USING "price"::bigint;

ALTER TABLE "service_payments"
  ALTER COLUMN "amountCents" TYPE BIGINT USING "amountCents"::bigint;

ALTER TABLE "services"
  ALTER COLUMN "basePriceCents" TYPE BIGINT USING "basePriceCents"::bigint,
  ALTER COLUMN "price" TYPE BIGINT USING "price"::bigint,
  ALTER COLUMN "minPrice" TYPE BIGINT USING "minPrice"::bigint,
  ALTER COLUMN "maxPrice" TYPE BIGINT USING "maxPrice"::bigint;

-- =====================
-- New tables required by code/schema
-- =====================
CREATE TABLE IF NOT EXISTS "service_reviews" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "bookingId" TEXT,
  "rating" INTEGER NOT NULL,
  "title" TEXT,
  "comment" TEXT,
  "images" TEXT,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "status" "ReviewStatus" NOT NULL DEFAULT 'APPROVED',
  "upvotes" INTEGER NOT NULL DEFAULT 0,
  "downvotes" INTEGER NOT NULL DEFAULT 0,
  "response" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "service_reviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "support_tickets" (
  "id" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
  "userId" TEXT,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "assignedTo" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "faqs" (
  "id" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "category" TEXT,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "service_reviews_serviceId_idx" ON "service_reviews" ("serviceId");
CREATE INDEX IF NOT EXISTS "service_reviews_userId_idx" ON "service_reviews" ("userId");
CREATE INDEX IF NOT EXISTS "service_reviews_status_idx" ON "service_reviews" ("status");
CREATE INDEX IF NOT EXISTS "service_reviews_createdAt_idx" ON "service_reviews" ("createdAt");

CREATE INDEX IF NOT EXISTS "support_tickets_priority_idx" ON "support_tickets" ("priority");
CREATE INDEX IF NOT EXISTS "support_tickets_status_idx" ON "support_tickets" ("status");
CREATE INDEX IF NOT EXISTS "support_tickets_userId_idx" ON "support_tickets" ("userId");

CREATE INDEX IF NOT EXISTS "faqs_displayOrder_idx" ON "faqs" ("displayOrder");
CREATE INDEX IF NOT EXISTS "faqs_isActive_idx" ON "faqs" ("isActive");

-- Foreign keys (best-effort; only create if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'service_reviews_serviceId_fkey'
  ) THEN
    ALTER TABLE "service_reviews"
      ADD CONSTRAINT "service_reviews_serviceId_fkey"
      FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'service_reviews_userId_fkey'
  ) THEN
    ALTER TABLE "service_reviews"
      ADD CONSTRAINT "service_reviews_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'support_tickets_userId_fkey'
  ) THEN
    ALTER TABLE "support_tickets"
      ADD CONSTRAINT "support_tickets_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'promotions_createdBy_fkey'
  ) THEN
    ALTER TABLE "promotions"
      ADD CONSTRAINT "promotions_createdBy_fkey"
      FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
