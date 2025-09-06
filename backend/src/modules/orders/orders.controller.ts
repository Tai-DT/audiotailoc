import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @UseGuards(AdminOrKeyGuard)
  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('status') status?: string) {
    return this.orders.list({ page: Number(page), pageSize: Number(pageSize), status });
  }

  @Post()
  create(@Body() createOrderDto: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    notes?: string;
  }) {
    return this.orders.create(createOrderDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.orders.get(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id/status/:status')
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.orders.updateStatus(id, status);
  }
}

