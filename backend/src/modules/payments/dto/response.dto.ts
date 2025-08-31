import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentProvider, PaymentStatus, Currency } from './payment.dto';

export class PaymentIntentResponseDto {
  @ApiProperty({
    description: 'Payment intent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Associated order ID',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  orderId: string;

  @ApiProperty({
    description: 'Payment amount in cents',
    example: 150000,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    enum: Currency,
    example: Currency.VND,
  })
  currency: Currency;

  @ApiProperty({
    description: 'Payment provider',
    enum: PaymentProvider,
    example: PaymentProvider.VNPAY,
  })
  provider: PaymentProvider;

  @ApiProperty({
    description: 'Current payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Payment description',
    example: 'Payment for order #12345',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Payment URL for redirection',
    example: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=...',
  })
  paymentUrl?: string;

  @ApiPropertyOptional({
    description: 'QR code for payment (base64 or URL)',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  qrCode?: string;

  @ApiPropertyOptional({
    description: 'Transaction ID from payment provider',
    example: 'vnp_123456789',
  })
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Customer information',
    type: 'object',
    example: {
      name: 'Nguyen Van A',
      email: 'nguyen.van.a@email.com',
      phone: '0987654321',
    },
  })
  customer?: {
    name: string;
    email: string;
    phone: string;
  };

  @ApiPropertyOptional({
    description: 'Payment expiry date',
    example: '2024-01-15T11:30:00.000Z',
  })
  expiresAt?: string;

  @ApiProperty({
    description: 'Payment creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Payment last update date',
    example: '2024-01-15T10:35:00.000Z',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    type: 'object',
  })
  metadata?: Record<string, any>;
}

export class PaymentMethodResponseDto {
  @ApiProperty({
    description: 'Payment method ID',
    example: 'VNPAY',
  })
  id: string;

  @ApiProperty({
    description: 'Payment method name',
    example: 'VNPAY',
  })
  name: string;

  @ApiProperty({
    description: 'Payment method description',
    example: 'Thanh toán qua VNPAY - Hỗ trợ ATM, Visa, MasterCard',
  })
  description: string;

  @ApiPropertyOptional({
    description: 'Payment method logo URL',
    example: 'https://audiotailoc.com/images/payment/vnpay.png',
  })
  logo?: string;

  @ApiProperty({
    description: 'Is payment method currently enabled',
    example: true,
  })
  enabled: boolean;

  @ApiPropertyOptional({
    description: 'Minimum transaction amount in VND',
    example: 10000,
  })
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Maximum transaction amount in VND',
    example: 50000000,
  })
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Processing fee percentage',
    example: 2.5,
  })
  feePercentage?: number;

  @ApiPropertyOptional({
    description: 'Fixed processing fee in VND',
    example: 2000,
  })
  fixedFee?: number;

  @ApiPropertyOptional({
    description: 'Supported currencies',
    type: [String],
    example: ['VND'],
  })
  supportedCurrencies?: string[];

  @ApiPropertyOptional({
    description: 'Estimated processing time',
    example: 'Instant',
  })
  processingTime?: string;

  @ApiPropertyOptional({
    description: 'Payment method features',
    type: [String],
    example: ['QR_CODE', 'INSTALLMENT', 'REFUND'],
  })
  features?: string[];
}

export class RefundResponseDto {
  @ApiProperty({
    description: 'Refund ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Original payment ID',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  paymentId: string;

  @ApiProperty({
    description: 'Refund amount in cents',
    example: 75000,
  })
  amount: number;

  @ApiProperty({
    description: 'Refund status',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    example: 'PROCESSING',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Reason for refund',
    example: 'Customer requested refund',
  })
  reason?: string;

  @ApiPropertyOptional({
    description: 'Refund transaction ID from provider',
    example: 'rf_123456789',
  })
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Expected completion date',
    example: '2024-01-20T10:30:00.000Z',
  })
  expectedCompletionAt?: string;

  @ApiProperty({
    description: 'Refund creation date',
    example: '2024-01-15T14:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Refund last update date',
    example: '2024-01-15T14:35:00.000Z',
  })
  updatedAt: string;
}

export class PaymentStatusResponseDto {
  @ApiProperty({
    description: 'Payment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Current payment status',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Transaction ID from payment provider',
    example: 'vnp_123456789',
  })
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Payment completion date',
    example: '2024-01-15T11:15:00.000Z',
  })
  completedAt?: string;

  @ApiPropertyOptional({
    description: 'Failure reason if payment failed',
    example: 'Insufficient funds',
  })
  failureReason?: string;

  @ApiPropertyOptional({
    description: 'Last status update timestamp',
    example: '2024-01-15T11:15:30.000Z',
  })
  lastUpdated?: string;
}

export class WebhookResponseDto {
  @ApiProperty({
    description: 'Webhook processing status',
    example: 'SUCCESS',
  })
  status: string;

  @ApiProperty({
    description: 'Webhook processing message',
    example: 'Payment status updated successfully',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Updated payment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  paymentId?: string;

  @ApiPropertyOptional({
    description: 'Timestamp of webhook processing',
    example: '2024-01-15T11:20:00.000Z',
  })
  processedAt?: string;
}