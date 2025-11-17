import { Body, Controller, Get, Param, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtGuard } from '../auth/jwt.guard';
import { IsOptional, IsString, IsObject } from 'class-validator';

class ShippingAddressDto {
  @IsString() fullName!: string;
  @IsString() phone!: string;
  @IsString() email!: string;
  @IsString() address!: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsObject() coordinates?: { lat: number; lng: number };
  @IsOptional() @IsString() goongPlaceId?: string;
}

class CheckoutDto {
  @IsOptional() @IsString()
  promotionCode?: string;

  @IsObject()
  shippingAddress!: ShippingAddressDto;
}

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  // Endpoint cho guest users (không yêu cầu JWT)
  @Post()
  async create(@Request() req: any, @Body() dto: CheckoutDto) {
    const userId = req.user?.sub || req.users?.sub;

    if (!dto.shippingAddress) {
      throw new BadRequestException('Thông tin giao hàng là bắt buộc');
    }

    const order = await this.checkout.createOrder(userId, {
      promotionCode: dto.promotionCode,
      shippingAddress: dto.shippingAddress
    });

    return {
      id: order.id,
      orderNo: order.orderNo,
      totalCents: order.totalCents,
      status: order.status,
      shippingAddress: order.shippingAddress
    };
  }

  // Legacy endpoint
  @UseGuards(JwtGuard)
  @Post('create-order')
  async createLegacy(@Request() req: any, @Body() dto: CheckoutDto) {
    const order = await this.checkout.createOrder(req.users?.sub, {
      promotionCode: dto.promotionCode,
      shippingAddress: dto.shippingAddress
    });

    return { order };
  }

  @UseGuards(JwtGuard)
  @Get('order-by-no/:orderNo')
  async getByOrderNo(@Request() req: any, @Param('orderNo') orderNo: string) {
    return this.checkout.getOrderForUserByNo(req.users?.sub, orderNo);
  }
}
