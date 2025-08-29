import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

interface ListQueryDto {
  page?: number;
  pageSize?: number;
  lowStockOnly?: string;
}

interface AdjustDto {
  stockDelta?: number;
  reservedDelta?: number;
  lowStockThreshold?: number;
}

@UseGuards(AdminOrKeyGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) { }

  @Get()
  list(@Query() q: ListQueryDto) {
    const page = q.page ? Number(q.page) : undefined;
    const pageSize = q.pageSize ? Number(q.pageSize) : undefined;
    const lowStockOnly = q.lowStockOnly === 'true';
    
    return this.inventory.list({ page, pageSize, lowStockOnly });
  }

  @Patch(':productId')
  adjust(@Param('productId') productId: string, @Body() dto: AdjustDto) {
    return this.inventory.adjust(productId, dto);
  }
}

