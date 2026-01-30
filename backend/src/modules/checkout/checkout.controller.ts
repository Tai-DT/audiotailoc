import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtGuard } from '../auth/jwt.guard';
import { IsOptional, IsString } from 'class-validator';

class CheckoutDto {
  @IsOptional()
  @IsString()
  cartId?: string; // For guest checkout

  @IsOptional()
  @IsString()
  promotionCode?: string;

  @IsOptional()
  shippingAddress?: any;

  @IsOptional()
  shippingCoordinates?: any;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;
}

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Post('create-order')
  async create(@Request() req: any, @Body() dto: CheckoutDto) {
    const userId = req.user?.sub || null;
    const idempotencyKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];
    const order = await this.checkout.createOrder(userId, {
      cartId: dto.cartId,
      promotionCode: dto.promotionCode,
      shippingAddress: dto.shippingAddress,
      shippingCoordinates: dto.shippingCoordinates,
      customerEmail: dto.customerEmail,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      idempotencyKey,
    });
    return { order };
  }

  @UseGuards(JwtGuard)
  @Get('order-by-no/:orderNo')
  async getByOrderNo(@Request() req: any, @Param('orderNo') orderNo: string) {
    return this.checkout.getOrderForUserByNo(req.user?.sub, orderNo);
  }
}
