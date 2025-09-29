-- AlterTable
ALTER TABLE "public"."blog_articles" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "blog_articles_featured_idx" ON "public"."blog_articles"("featured");
