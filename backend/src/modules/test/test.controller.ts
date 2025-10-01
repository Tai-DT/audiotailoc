import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';
import { PrismaService } from '../../prisma/prisma.service';

class TestPaymentDto {
  amount?: number;
  description?: string;
  orderCode?: string;
}

@Controller('test')
export class TestController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly prisma: PrismaService
  ) {}

  @Post('payment')
  async createTestPayment(@Body() dto: TestPaymentDto) {
    try {
      // Create a test order first
      const timestamp = Date.now();
      const orderNo = `TEST${timestamp}`;
      
      const order = await this.prisma.order.create({
        data: {
          orderNo,
          userId: 'cmg7pqj7f000aimedkc9agi05', // Use existing user
          status: 'PENDING',
          subtotalCents: dto.amount || 100000,
          totalCents: dto.amount || 100000,
          shippingAddress: 'Test Address'
        }
      });

      // Create payment intent
      const intent = await this.payments.createIntent({
        orderId: order.id,
        provider: 'PAYOS',
        returnUrl: 'https://audiotailoc.com/payment/success'
      });

      return {
        success: true,
        order: {
          id: order.id,
          orderNo: order.orderNo,
          amount: order.totalCents
        },
        payment: intent
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}