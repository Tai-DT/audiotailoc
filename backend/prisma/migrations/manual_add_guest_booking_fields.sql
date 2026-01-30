-- Add customer info fields for guest booking to service_bookings table
-- Run this migration manually if Prisma db push fails due to connection issues

ALTER TABLE "public"."service_bookings" 
ADD COLUMN IF NOT EXISTS "customerName" TEXT,
ADD COLUMN IF NOT EXISTS "customerPhone" TEXT,
ADD COLUMN IF NOT EXISTS "customerEmail" TEXT;

-- Add comment for documentation
COMMENT ON COLUMN "service_bookings"."customerName" IS 'Customer name for guest bookings (no authentication required)';
COMMENT ON COLUMN "service_bookings"."customerPhone" IS 'Customer phone for guest bookings';
COMMENT ON COLUMN "service_bookings"."customerEmail" IS 'Customer email for guest bookings (optional)';
