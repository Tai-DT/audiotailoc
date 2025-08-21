/*
  Warnings:

  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaKeywordsEn" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have proper updatedAt values
UPDATE "Category" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaKeywordsEn" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogDescriptionEn" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "ogTitleEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaKeywordsEn" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogDescriptionEn" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "ogTitleEn" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaDescriptionEn" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaKeywordsEn" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "metaTitleEn" TEXT,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogDescriptionEn" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "ogTitleEn" TEXT;
