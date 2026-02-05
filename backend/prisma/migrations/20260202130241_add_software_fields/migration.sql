-- AlterTable
ALTER TABLE "public"."software"
ADD COLUMN     "priceCents" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "isPaidRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "downloadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productId" TEXT;

-- CreateIndex
CREATE INDEX "software_productId_idx" ON "public"."software"("productId");
CREATE INDEX "software_isActive_idx" ON "public"."software"("isActive");
CREATE INDEX "software_isDeleted_idx" ON "public"."software"("isDeleted");

-- AddForeignKey
ALTER TABLE "public"."software" ADD CONSTRAINT "software_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
