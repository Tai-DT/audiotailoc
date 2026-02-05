-- Add missing profile/notification fields to users table.
-- These fields exist in prisma/schema.prisma but may be missing in some databases.

ALTER TABLE "users"
  ADD COLUMN "address" TEXT,
  ADD COLUMN "dateOfBirth" TIMESTAMP,
  ADD COLUMN "gender" TEXT,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "promoNotifications" BOOLEAN NOT NULL DEFAULT true;

