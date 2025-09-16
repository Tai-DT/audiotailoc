import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtGuard } from '../auth/jwt.guard';
import { IsOptional, IsString } from 'class-validator';

class CheckoutDto {
  @IsOptional() @IsString()
  promotionCode?: string;

  // shippingAddress will be any JSON from frontend
}

@UseGuards(JwtGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Post('create-order')
  async create(@Request() req: any, @Body() dto: CheckoutDto) {
    const order = await this.checkout.createOrder(req.user?.sub, { promotionCode: dto.promotionCode });
    return { order };
  }

  @Get('order-by-no/:orderNo')
  async getByOrderNo(@Request() req: any, @Param('orderNo') orderNo: string) {
    return this.checkout.getOrderForUserByNo(req.user?.sub, orderNo);
  }
}
