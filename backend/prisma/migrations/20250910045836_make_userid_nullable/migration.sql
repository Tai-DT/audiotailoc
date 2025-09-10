/*
  Warnings:

  - You are about to drop the column `categoryId` on the `service_types` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `services` table. All the data in the column will be lost.
  - You are about to drop the `service_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "service_types" DROP CONSTRAINT "service_types_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_categoryId_fkey";

-- DropIndex
DROP INDEX "service_types_categoryId_idx";

-- DropIndex
DROP INDEX "services_categoryId_idx";

-- AlterTable
ALTER TABLE "service_types" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "category",
DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "service_categories";
