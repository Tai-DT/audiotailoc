/*
  Warnings:

  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report_records` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- AlterTable
ALTER TABLE "public"."product_reviews" ADD COLUMN     "images" TEXT,
ADD COLUMN     "response" TEXT;

-- DropTable
DROP TABLE "public"."notifications";

-- DropTable
DROP TABLE "public"."report_records";
