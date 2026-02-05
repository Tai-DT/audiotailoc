import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

class CancelOrderDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^[0-9+\-\s()]+$/, { message: 'Invalid phone format' })
  phone?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

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
  @UseGuards(OptionalJwtGuard)
  // SECURITY: Allow public order creation for guest checkout
  // Note: This endpoint intentionally allows unauthenticated requests to support guest orders
  // The service will create a guest user if no userId is provided
  // Consider adding rate limiting or CAPTCHA for additional protection
  create(
    @Body()
    createOrderDto: CreateOrderDto,
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
    return this.orders.getStats();
  }

  @UseGuards(OptionalJwtGuard)
  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Body() dto: CancelOrderDto, @Req() req: any) {
    const userId = req.user?.sub || req.user?.id;
    const order = await this.orders.get(id);
    const normalizedRole = String(req.user?.role || '')
      .trim()
      .toUpperCase();
    const normalizedEmail = String(req.user?.email || '')
      .trim()
      .toLowerCase();
    const normalizedAdminEmail = String(process.env.ADMIN_EMAIL || '')
      .trim()
      .toLowerCase();
    const isAdmin =
      normalizedRole === 'ADMIN' ||
      (normalizedAdminEmail && normalizedEmail === normalizedAdminEmail);

    if (userId) {
      if (order.userId !== userId && !isAdmin) {
        throw new ForbiddenException('Bạn không có quyền hủy đơn hàng này');
      }
    } else {
      if (!dto.email && !dto.phone) {
        throw new ForbiddenException(
          'Vui lòng cung cấp email hoặc số điện thoại để xác thực hủy đơn hàng',
        );
      }

      const normalizeEmail = (value?: string) => (value ? value.toLowerCase().trim() : '');
      const normalizePhone = (value?: string) => (value || '').replace(/\D/g, '');

      const expectedEmails = new Set<string>();
      const expectedPhones = new Set<string>();

      [order.users?.email, order.customerEmail]
        .filter(Boolean)
        .forEach(email => expectedEmails.add(normalizeEmail(email)));
      [order.users?.phone, order.customerPhone].filter(Boolean).forEach(phone => {
        const normalized = normalizePhone(phone);
        if (normalized) expectedPhones.add(normalized);
      });

      const providedEmail = normalizeEmail(dto.email);
      const providedPhone = normalizePhone(dto.phone);

      const emailMatches = providedEmail && expectedEmails.has(providedEmail);
      const phoneMatches = providedPhone && expectedPhones.has(providedPhone);

      if (!emailMatches && !phoneMatches) {
        throw new ForbiddenException('Thông tin xác thực không khớp với đơn hàng');
      }
    }

    if (!['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)) {
      throw new BadRequestException('Chỉ có thể hủy đơn hàng trước khi giao hàng');
    }

    return this.orders.updateStatus(order.id, 'CANCELLED');
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  async get(@Param('id') id: string, @Req() req: any) {
    // Check if it's an admin request using headers (AdminOrKeyGuard logic)
    const adminKey = req.headers['x-admin-key'];
    const isAdminByKey = adminKey && adminKey === process.env.ADMIN_API_KEY;

    const order = await this.orders.get(id);

    // If authenticated user, check if they own the order
    if (req?.user) {
      const userId = req.user.sub || req.user.id;
      const normalizedRole = String(req.user?.role || '')
        .trim()
        .toUpperCase();
      const normalizedEmail = String(req.user?.email || '')
        .trim()
        .toLowerCase();
      const normalizedAdminEmail = String(process.env.ADMIN_EMAIL || '')
        .trim()
        .toLowerCase();
      const isAdminByRole =
        normalizedRole === 'ADMIN' ||
        (normalizedAdminEmail && normalizedEmail === normalizedAdminEmail);

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

  @Get(':id/downloads')
  @UseGuards(OptionalJwtGuard)
  async getDownloads(
    @Param('id') id: string,
    @Query('intentId') intentId: string | undefined,
    @Req() req: any,
  ) {
    const adminKey = req.headers['x-admin-key'];
    const isAdminByKey = adminKey && adminKey === process.env.ADMIN_API_KEY;

    if (req?.user) {
      const order = await this.orders.get(id);
      const userId = req.user.sub || req.user.id;
      const normalizedRole = String(req.user?.role || '')
        .trim()
        .toUpperCase();
      const normalizedEmail = String(req.user?.email || '')
        .trim()
        .toLowerCase();
      const normalizedAdminEmail = String(process.env.ADMIN_EMAIL || '')
        .trim()
        .toLowerCase();
      const isAdminByRole =
        normalizedRole === 'ADMIN' ||
        (normalizedAdminEmail && normalizedEmail === normalizedAdminEmail);

      if (isAdminByRole || isAdminByKey || order.userId === userId) {
        return this.orders.getDigitalDownloads(id);
      }

      throw new ForbiddenException('You do not have permission to view downloads for this order');
    }

    if (isAdminByKey) {
      return this.orders.getDigitalDownloads(id);
    }

    // Guest download access: require a paid intentId as a proof of purchase.
    if (intentId) {
      return this.orders.getDigitalDownloads(id, { intentId });
    }

    throw new ForbiddenException('Unauthorized access to order downloads');
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
    updateOrderDto: UpdateOrderDto,
  ) {
    return this.orders.update(id, updateOrderDto);
  }

  @UseGuards(AdminOrKeyGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.orders.delete(id);
  }
}
