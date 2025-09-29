-- DropForeignKey
ALTER TABLE "public"."service_bookings" DROP CONSTRAINT "service_bookings_userId_fkey";

-- AlterTable
ALTER TABLE "public"."cart_items" ALTER COLUMN "price" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "public"."order_items" ALTER COLUMN "price" SET DATA TYPE BIGINT,
ALTER COLUMN "unitPrice" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "public"."service_bookings" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."newsletter_subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_email_key" ON "public"."newsletter_subscriptions"("email");

-- AddForeignKey
ALTER TABLE "public"."service_bookings" ADD CONSTRAINT "service_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
