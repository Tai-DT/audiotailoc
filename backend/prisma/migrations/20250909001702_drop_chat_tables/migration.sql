/*
  Warnings:

  - You are about to drop the `chat_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat_sessions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `system_configs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "chat_sessions" DROP CONSTRAINT "chat_sessions_userId_fkey";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "budget" TEXT,
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "challenges" TEXT,
ADD COLUMN     "client" TEXT,
ADD COLUMN     "clientLogo" TEXT,
ADD COLUMN     "clientLogoUrl" TEXT,
ADD COLUMN     "completionDate" TIMESTAMP(3),
ADD COLUMN     "content" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "demoUrl" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "features" TEXT,
ADD COLUMN     "galleryImages" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "images" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "liveUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "projectDate" TIMESTAMP(3),
ADD COLUMN     "results" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "solutions" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "structuredData" TEXT,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "teamSize" INTEGER,
ADD COLUMN     "technologies" TEXT,
ADD COLUMN     "testimonial" TEXT,
ADD COLUMN     "thumbnailImage" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "youtubeVideoId" TEXT,
ADD COLUMN     "youtubeVideoUrl" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "maxPrice" INTEGER,
ADD COLUMN     "minPrice" INTEGER,
ADD COLUMN     "priceType" TEXT NOT NULL DEFAULT 'FIXED',
ALTER COLUMN "basePriceCents" SET DEFAULT 0,
ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "system_configs" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "chat_messages";

-- DropTable
DROP TABLE "chat_sessions";

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "mobileImageUrl" TEXT,
    "linkUrl" TEXT,
    "buttonLabel" TEXT,
    "page" TEXT NOT NULL DEFAULT 'home',
    "locale" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banners_page_idx" ON "banners"("page");

-- CreateIndex
CREATE INDEX "banners_isActive_idx" ON "banners"("isActive");

-- CreateIndex
CREATE INDEX "banners_isDeleted_idx" ON "banners"("isDeleted");

-- CreateIndex
CREATE INDEX "banners_position_idx" ON "banners"("position");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_isActive_idx" ON "projects"("isActive");

-- CreateIndex
CREATE INDEX "projects_isFeatured_idx" ON "projects"("isFeatured");
