import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateReportDto } from './dto/report.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(AdminOrKeyGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  async getReports(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('type') type?: string,
  ) {
    return this.reportsService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      type,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  async getReport(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate a new report' })
  async generateReport(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.generate(createReportDto);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get reports by type' })
  async getReportsByType(
    @Param('type') type: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.reportsService.findByType(type, Number(page), Number(pageSize));
  }

  @Post(':id/export')
  @ApiOperation({ summary: 'Export report' })
  async exportReport(@Param('id') id: string) {
    return this.reportsService.export(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete report' })
  async deleteReport(@Param('id') id: string) {
    return this.reportsService.delete(id);
  }

  @Get('analytics/summary')
  @ApiOperation({ summary: 'Get analytics summary' })
  async getAnalyticsSummary() {
    return this.reportsService.getAnalyticsSummary();
  }

  @Post('generate/sales')
  @ApiOperation({ summary: 'Generate sales report' })
  async generateSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.generateSalesReport(startDate, endDate);
  }

  @Post('generate/inventory')
  @ApiOperation({ summary: 'Generate inventory report' })
  async generateInventoryReport() {
    return this.reportsService.generateInventoryReport();
  }

  @Post('generate/customers')
  @ApiOperation({ summary: 'Generate customers report' })
  async generateCustomersReport() {
    return this.reportsService.generateCustomersReport();
  }

  @Get('export/sales/:format')
  @ApiOperation({ summary: 'Export sales report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async exportSalesReport(
    @Param('format') format: 'pdf' | 'excel' | 'csv',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    const buffer = await this.reportsService.exportSalesReport(format, startDate, endDate);

    const filename = `bao-cao-doanh-so-${new Date().toISOString().split('T')[0]}`;
    const mimeTypes = {
      pdf: 'application/pdf',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
    };
    const extensions = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' };

    res.set({
      'Content-Type': mimeTypes[format],
      'Content-Disposition': `attachment; filename="${filename}.${extensions[format]}"`,
      'Content-Length': buffer.length,
    });

    return new StreamableFile(buffer);
  }

  @Get('export/inventory/:format')
  @ApiOperation({ summary: 'Export inventory report' })
  async exportInventoryReport(
    @Param('format') format: 'pdf' | 'excel' | 'csv',
    @Res() res?: Response,
  ) {
    const buffer = await this.reportsService.exportInventoryReport(format);

    const filename = `bao-cao-ton-kho-${new Date().toISOString().split('T')[0]}`;
    const mimeTypes = {
      pdf: 'application/pdf',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
    };
    const extensions = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' };

    res.set({
      'Content-Type': mimeTypes[format],
      'Content-Disposition': `attachment; filename="${filename}.${extensions[format]}"`,
      'Content-Length': buffer.length,
    });

    return new StreamableFile(buffer);
  }

  @Get('export/customers/:format')
  @ApiOperation({ summary: 'Export customers report' })
  async exportCustomersReport(
    @Param('format') format: 'pdf' | 'excel' | 'csv',
    @Res() res?: Response,
  ) {
    const buffer = await this.reportsService.exportCustomersReport(format);

    const filename = `bao-cao-khach-hang-${new Date().toISOString().split('T')[0]}`;
    const mimeTypes = {
      pdf: 'application/pdf',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
    };
    const extensions = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' };

    res.set({
      'Content-Type': mimeTypes[format],
      'Content-Disposition': `attachment; filename="${filename}.${extensions[format]}"`,
      'Content-Length': buffer.length,
    });

    return new StreamableFile(buffer);
  }

  @Get('export/comprehensive')
  @ApiOperation({ summary: 'Export comprehensive report (Excel with multiple sheets)' })
  async exportComprehensiveReport(@Res() res?: Response) {
    const buffer = await this.reportsService.exportComprehensiveReport('excel');

    const filename = `bao-cao-tong-hop-${new Date().toISOString().split('T')[0]}.xlsx`;

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });

    return new StreamableFile(buffer);
  }
}
