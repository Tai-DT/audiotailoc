import { Controller, Post, Body, Headers, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

class VNPAYWebhookDto {
  vnp_TxnRef!: string;
  vnp_ResponseCode!: string;
  vnp_Amount!: string;
  vnp_TransactionNo!: string;
  vnp_OrderInfo!: string;
  vnp_PayDate!: string;
  vnp_SecureHash!: string;
}

class MOMOWebhookDto {
  orderId!: string;
  resultCode!: number;
  amount!: string;
  transId!: string;
  message!: string;
  signature!: string;
}

class PAYOSWebhookDto {
  orderCode!: string;
  status!: string;
  amount!: string;
  transactionId!: string;
  description!: string;
  signature!: string;
}

class OrderStatusWebhookDto {
  orderId!: string;
  status!: string;
  reason?: string;
}

class InventoryWebhookDto {
  productId!: string;
  action!: 'ADJUST' | 'SET';
  quantity!: number;
  reason?: string;
}

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('vnpay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle VNPAY payment webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  async handleVNPAYWebhook(@Body() data: VNPAYWebhookDto) {
    try {
      const result = await this.webhooksService.handleVNPAYWebhook(data);
      return result;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('momo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle MOMO payment webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  async handleMOMOWebhook(@Body() data: MOMOWebhookDto) {
    try {
      const result = await this.webhooksService.handleMOMOWebhook(data);
      return result;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('payos')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle PAYOS payment webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  async handlePAYOSWebhook(@Body() data: PAYOSWebhookDto) {
    try {
      const result = await this.webhooksService.handlePAYOSWebhook(data);
      return result;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('order-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle order status webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  async handleOrderStatusWebhook(@Body() data: OrderStatusWebhookDto) {
    try {
      const result = await this.webhooksService.handleOrderStatusWebhook(data);
      return result;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('inventory')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle inventory webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  async handleInventoryWebhook(@Body() data: InventoryWebhookDto) {
    try {
      const result = await this.webhooksService.handleInventoryWebhook(data);
      return result;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('zalo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Zalo webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleZaloWebhook(@Body() _data: any, @Headers('x-zalo-signature') _signature?: string) {
    // Zalo webhook handling is already implemented in zalo.services.ts
    return { success: true, message: 'Zalo webhook received' };
  }
}
