import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards, Delete, Req, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService, private readonly config: ConfigService) {}

  @UseGuards(AdminOrKeyGuard)
  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20', @Query('status') status?: string) {
    return this.orders.list({ page: Number(page), pageSize: Number(pageSize), status });
  }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60 } })
  create(@Req() req: any) {
    console.log('=== CONTROLLER CREATE DEBUG ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const expectedKey = this.config.get<string>('PUBLIC_ORDER_API_KEY');
    if (expectedKey) {
      const headerValue = req.headers?.['x-order-key'];
      if (headerValue !== expectedKey) {
        throw new ForbiddenException('Invalid order token');
      }
    }
    return this.orders.create(req.body);
  }

  @Post('create')
  createLegacy(@Req() req: any) {
    const expectedKey = this.config.get<string>('PUBLIC_ORDER_API_KEY');
    if (expectedKey) {
      const headerValue = req.headers?.['x-order-key'];
      if (headerValue !== expectedKey) {
        throw new ForbiddenException('Invalid order token');
      }
    }
    return this.orders.create(req.body);
  }

  @UseGuards(AdminOrKeyGuard)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.orders.get(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id/status/:status')
  updateStatusLegacy(@Param('id') id: string, @Param('status') status: string) {
    return this.orders.updateStatus(id, status);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() payload: { status: string }
  ) {
    return this.orders.updateStatus(id, payload?.status);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    shippingAddress?: string;
    shippingCoordinates?: { lat: number; lng: number };
    notes?: string;
    items?: Array<{ productId: string; quantity: number; unitPrice?: number; name?: string }>;
  }) {
    return this.orders.update(id, updateOrderDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.orders.delete(id);
  }
}
