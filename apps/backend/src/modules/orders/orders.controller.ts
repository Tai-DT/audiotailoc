import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@UseGuards(JwtGuard, AdminGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('status') status?: string) {
    return this.orders.list({ page: Number(page), pageSize: Number(pageSize), status });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.orders.get(id);
  }

  @Patch(':id/status/:status')
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.orders.updateStatus(id, status);
  }
}

