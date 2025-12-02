import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryMovementService } from './inventory-movement.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@ApiTags('Inventory Movements')
@Controller('inventory/movements')
@UseGuards(AdminOrKeyGuard)
@ApiBearerAuth()
export class InventoryMovementController {
  constructor(private readonly inventoryMovementService: InventoryMovementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create inventory movement' })
  @ApiResponse({
    status: 201,
    description: 'Movement created successfully',
  })
  async create(@Body() data: {
    productId: string;
    type: string;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason?: string;
    referenceId?: string;
    referenceType?: string;
    userId?: string;
    notes?: string;
  }) {
    return this.inventoryMovementService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory movements' })
  @ApiResponse({
    status: 200,
    description: 'Movements retrieved successfully',
  })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('productId') productId?: string,
    @Query('type') type?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const params = {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
      productId,
      type,
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.inventoryMovementService.findAll(params);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get movements for specific product' })
  @ApiResponse({
    status: 200,
    description: 'Product movements retrieved successfully',
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

    return this.inventoryMovementService.findByProduct(productId, params);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get movement summary' })
  @ApiResponse({
    status: 200,
    description: 'Movement summary retrieved successfully',
  })
  async getSummary(
    @Query('productId') productId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const params = {
      productId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.inventoryMovementService.getSummary(
      params.productId,
      params.startDate,
      params.endDate,
    );
  }
}