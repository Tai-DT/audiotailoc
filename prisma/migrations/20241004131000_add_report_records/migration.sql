-- Create table to store generated report metadata
CREATE TABLE "report_records" (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "format" TEXT NOT NULL,
  "period" TEXT,
  "filters" JSONB,
  "filename" TEXT NOT NULL,
  "downloadUrl" TEXT NOT NULL,
  "generatedBy" TEXT,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "report_records_type_idx" ON "report_records"("type");
CREATE INDEX "report_records_generatedAt_idx" ON "report_records"("generatedAt" DESC);
