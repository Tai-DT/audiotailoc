import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InventoryReportService } from '../services/inventory-report.service';
import { AdminOrKeyGuard } from '../../auth/admin-or-key.guard';

@Controller('inventory/reports')
@UseGuards(AdminOrKeyGuard)
export class InventoryReportController {
  constructor(private readonly reportService: InventoryReportService) {}

  @Get('stock')
  async getStockReport(
    @Query('categoryId') categoryId?: string,
    @Query('lowStockOnly') lowStockOnly?: string,
    @Query('outOfStockOnly') outOfStockOnly?: string,
  ) {
    const filters = {
      categoryId,
      lowStockOnly: lowStockOnly === 'true',
      outOfStockOnly: outOfStockOnly === 'true',
    };

    return this.reportService.generateStockReport(filters);
  }

  @Get('movements')
  async getMovementReport(
    @Query('productId') productId?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
  ) {
    const filters = {
      productId,
      type,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      userId,
    };

    return this.reportService.generateMovementReport(filters);
  }

  @Get('alerts')
  async getAlertReport(
    @Query('type') type?: string,
    @Query('isResolved') isResolved?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      type,
      isResolved: isResolved ? isResolved === 'true' : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.reportService.generateAlertReport(filters);
  }
}
