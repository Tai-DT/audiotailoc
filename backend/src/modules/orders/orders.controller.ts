import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @UseGuards(AdminOrKeyGuard)
  @Get()
  list(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('status') status?: string,
  ) {
    return this.orders.list({ page: Number(page), pageSize: Number(pageSize), status });
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orders.create(createOrderDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Get('stats')
  async getStats() {
    const totalOrders = await this.orders.list({ page: 1, pageSize: 1 });
    return {
      totalOrders: totalOrders.total || 0,
      pendingOrders: totalOrders.total || 0,
      completedOrders: 0,
    };
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

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orders.update(id, updateOrderDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.orders.delete(id);
  }

  @UseGuards(AdminOrKeyGuard)
  @Post(':id/invoice')
  sendInvoice(@Param('id') id: string) {
    return this.orders.sendInvoice(id);
  }
}
