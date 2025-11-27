import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ExportPdfService } from './services/export-pdf.service';
import { ExportExcelService } from './services/export-excel.service';
import { ExportCsvService } from './services/export-csv.service';

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    PrismaService,
    ExportPdfService,
    ExportExcelService,
    ExportCsvService,
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
