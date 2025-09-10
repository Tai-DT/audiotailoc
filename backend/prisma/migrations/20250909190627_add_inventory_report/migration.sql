-- CreateTable
CREATE TABLE "inventory_reports" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "parameters" TEXT,
    "data" TEXT,
    "generatedBy" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_reports_type_idx" ON "inventory_reports"("type");

-- CreateIndex
CREATE INDEX "inventory_reports_generatedAt_idx" ON "inventory_reports"("generatedAt");
