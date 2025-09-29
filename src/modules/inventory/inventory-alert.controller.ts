import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryAlertsService } from './inventory-alert.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@ApiTags('Inventory Alerts')
@Controller('inventory/alerts')
@UseGuards(AdminOrKeyGuard)
@ApiBearerAuth()
export class InventoryAlertController {
  constructor(private readonly inventoryAlertsService: InventoryAlertsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create inventory alert' })
  @ApiResponse({
    status: 201,
    description: 'Alert created successfully',
  })
  async create(@Body() data: {
    productId: string;
    type: string;
    message: string;
    threshold?: number;
    currentStock?: number;
  }) {
    return this.inventoryAlertsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory alerts' })
  @ApiResponse({
    status: 200,
    description: 'Alerts retrieved successfully',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('productId') productId?: string,
    @Query('type') type?: string,
    @Query('isResolved') isResolved?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const params = {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
      productId,
      type,
      isResolved: isResolved ? isResolved === 'true' : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.inventoryAlertsService.findAll(params);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get alerts for specific product' })
  @ApiResponse({
    status: 200,
    description: 'Product alerts retrieved successfully',
  })
  async findByProduct(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const params = {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    };

    return this.inventoryAlertsService.findByProduct(productId, params);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active alerts' })
  @ApiResponse({
    status: 200,
    description: 'Active alerts retrieved successfully',
  })
  async getActiveAlerts() {
    return this.inventoryAlertsService.getActiveAlerts();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get alert summary' })
  @ApiResponse({
    status: 200,
    description: 'Alert summary retrieved successfully',
  })
  async getAlertSummary() {
    return this.inventoryAlertsService.getAlertSummary();
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve alert' })
  @ApiResponse({
    status: 200,
    description: 'Alert resolved successfully',
  })
  async resolve(@Param('id') id: string) {
    return this.inventoryAlertsService.resolve(id);
  }

  @Post('bulk-resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk resolve alerts' })
  @ApiResponse({
    status: 200,
    description: 'Alerts resolved successfully',
  })
  async bulkResolve(@Body() data: { ids: string[] }) {
    return this.inventoryAlertsService.bulkResolve(data.ids);
  }

  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check and create alerts based on current stock' })
  @ApiResponse({
    status: 200,
    description: 'Alerts checked and created successfully',
  })
  async checkAndCreateAlerts(@Body() data: { productId?: string } = {}) {
    return this.inventoryAlertsService.checkAndCreateAlerts(data.productId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete alert' })
  @ApiResponse({
    status: 200,
    description: 'Alert deleted successfully',
  })
  async delete(@Param('id') id: string) {
    return this.inventoryAlertsService.delete(id);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk delete alerts' })
  @ApiResponse({
    status: 200,
    description: 'Alerts deleted successfully',
  })
  async bulkDelete(@Body() data: { ids: string[] }) {
    return this.inventoryAlertsService.bulkDelete(data.ids);
  }
}
