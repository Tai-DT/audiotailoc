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
  Req,
  ForbiddenException,
} from '@nestjs/common';
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
  list(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('status') status?: string,
  ) {
    return this.orders.list({ page: Number(page), pageSize: Number(pageSize), status });
  }

  @Post()
  // SECURITY: Allow public order creation for guest checkout
  // Note: This endpoint intentionally allows unauthenticated requests to support guest orders
  // The service will create a guest user if no userId is provided
  // Consider adding rate limiting or CAPTCHA for additional protection
  create(
    @Body()
    createOrderDto: {
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress: string;
      shippingCoordinates?: { lat: number; lng: number };
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      notes?: string;
      userId?: string; // Optional: authenticated users can provide their userId
    },
    @Req() req?: any,
  ) {
    // SECURITY: If user is authenticated, force using their own userId
    // This prevents logged-in users from creating orders for other users via body manipulation
    if (req?.user) {
      createOrderDto.userId = req.user.sub || req.user.id;
    } else {
      // If NOT authenticated, ignore any userId provided in the body for guest checkouts
      // This prevents guest users from associating orders with existing user accounts
      delete createOrderDto.userId;
    }

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

  @Get(':id')
  async get(@Param('id') id: string, @Req() req: any) {
    // Check if it's an admin request using headers (AdminOrKeyGuard logic)
    const adminKey = req.headers['x-admin-key'];
    const isAdminByKey = adminKey && adminKey === process.env.ADMIN_API_KEY;

    const order = await this.orders.get(id);

    // If authenticated user, check if they own the order
    if (req?.user) {
      const userId = req.user.sub || req.user.id;
      const isAdminByRole = req.user.role === 'ADMIN' || req.user.email === process.env.ADMIN_EMAIL;

      if (isAdminByRole || isAdminByKey || order.userId === userId) {
        return order;
      }

      throw new ForbiddenException('You do not have permission to view this order');
    }

    // If guest or no user info, only allow if admin key is present
    if (isAdminByKey) {
      return order;
    }

    // Default: throw unauthorized if no identification
    throw new ForbiddenException('Unauthorized access to order details');
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id/status/:status')
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.orders.updateStatus(id, status);
  }

  @UseGuards(AdminOrKeyGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateOrderDto: {
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      shippingAddress?: string;
      shippingCoordinates?: { lat: number; lng: number };
      notes?: string;
      items?: Array<{ productId: string; quantity: number; unitPrice?: number; name?: string }>;
    },
  ) {
    return this.orders.update(id, updateOrderDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.orders.delete(id);
  }
}
