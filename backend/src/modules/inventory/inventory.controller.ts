import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Delete,
  Post,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { IsBooleanString, IsInt, IsOptional } from 'class-validator';

class ListQueryDto {
  @IsOptional()
  @IsInt()
  page?: number;
  @IsOptional()
  @IsInt()
  pageSize?: number;
  @IsOptional()
  @IsBooleanString()
  lowStockOnly?: string;
}

class AdjustDto {
  @IsOptional()
  @IsInt()
  stockDelta?: number;
  @IsOptional()
  @IsInt()
  reservedDelta?: number;
  @IsOptional()
  @IsInt()
  lowStockThreshold?: number;

  // Absolute values (alternative to deltas)
  @IsOptional()
  @IsInt()
  stock?: number;
  @IsOptional()
  @IsInt()
  reserved?: number;
}

@UseGuards(AdminOrKeyGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get()
  list(@Query() q: ListQueryDto) {
    return this.inventory.list({
      page: q.page,
      pageSize: q.pageSize,
      lowStockOnly: q.lowStockOnly === 'true',
    });
  }

  @Patch(':productId')
  adjust(@Param('productId') productId: string, @Body() dto: AdjustDto) {
    return this.inventory.adjust(productId, dto);
  }

  @Delete(':productId')
  delete(@Param('productId') productId: string) {
    return this.inventory.delete(productId);
  }
}
