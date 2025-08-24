/*
  Warnings:

  - You are about to drop the column `viewCount` on the `ProductView` table. All the data in the column will be lost.
  - You are about to drop the column `viewedAt` on the `ProductView` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionSource" AS ENUM ('chat', 'contact', 'faq', 'support');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('answered', 'pending', 'escalated');

-- CreateEnum
CREATE TYPE "ViewSource" AS ENUM ('search', 'category', 'recommendation', 'direct');

-- DropForeignKey
ALTER TABLE "ProductView" DROP CONSTRAINT "ProductView_userId_fkey";

-- DropIndex
DROP INDEX "ProductView_userId_productId_key";

-- AlterTable
ALTER TABLE "ProductView" DROP COLUMN "viewCount",
DROP COLUMN "viewedAt",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "source" "ViewSource" NOT NULL DEFAULT 'direct',
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SearchQuery" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultCount" INTEGER,
    "clickedResults" TEXT[],
    "searchDuration" INTEGER,

    CONSTRAINT "SearchQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "category" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "QuestionSource" NOT NULL DEFAULT 'chat',
    "status" "QuestionStatus" NOT NULL DEFAULT 'pending',
    "satisfaction" INTEGER,

    CONSTRAINT "CustomerQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceView" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "source" "ViewSource" NOT NULL DEFAULT 'direct',
    "referrer" TEXT,

    CONSTRAINT "ServiceView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductView" ADD CONSTRAINT "ProductView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchQuery" ADD CONSTRAINT "SearchQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerQuestion" ADD CONSTRAINT "CustomerQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceView" ADD CONSTRAINT "ServiceView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
