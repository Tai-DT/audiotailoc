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
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

interface AuthenticatedRequest {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // User-specific routes must be defined BEFORE routes with path parameters
  // to avoid route conflicts (e.g., /orders/me vs /orders/:id)
  
  @UseGuards(JwtGuard)
  @Get('me')
  async getMyOrders(
    @Request() req: AuthenticatedRequest,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('status') status?: string,
  ) {
    const userId = req.user.sub;
    return this.orders.getUserOrders(userId, {
      page: Number(page),
      pageSize: Number(pageSize),
      status,
    });
  }

  @UseGuards(JwtGuard)
  @Get('me/:id')
  async getMyOrder(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.orders.getUserOrder(userId, id);
  }

  @UseGuards(JwtGuard)
  @Patch('me/:id/cancel')
  async cancelMyOrder(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.sub;
    // Verify ownership first
    await this.orders.getUserOrder(userId, id);
    // Then cancel
    return this.orders.updateStatus(id, 'CANCELLED');
  }

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
