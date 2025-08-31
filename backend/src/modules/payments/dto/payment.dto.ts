import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsArray, IsObject, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentProvider {
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  PAYOS = 'PAYOS',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum Currency {
  VND = 'VND',
  USD = 'USD',
}

export class CreateIntentDto {
  @ApiProperty({
    description: 'Order ID or unique identifier for the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'Payment amount in cents (VND)',
    example: 150000,
    minimum: 1000,
  })
  @IsNumber()
  @Min(1000) // Minimum 10 VND
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    enum: Currency,
    default: Currency.VND,
    example: Currency.VND,
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    description: 'Payment provider',
    enum: PaymentProvider,
    example: PaymentProvider.VNPAY,
  })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiPropertyOptional({
    description: 'Payment description',
    example: 'Payment for order #12345',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Customer information',
    type: 'object',
    example: {
      name: 'Nguyen Van A',
      email: 'nguyen.van.a@email.com',
      phone: '0987654321',
    },
  })
  @IsOptional()
  @IsObject()
  customer?: {
    name: string;
    email: string;
    phone: string;
  };

  @ApiPropertyOptional({
    description: 'Return URL after payment completion',
    example: 'https://audiotailoc.com/payment/success',
  })
  @IsOptional()
  @IsString()
  returnUrl?: string;

  @ApiPropertyOptional({
    description: 'Cancel URL if payment is cancelled',
    example: 'https://audiotailoc.com/payment/cancel',
  })
  @IsOptional()
  @IsString()
  cancelUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the payment',
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CreateRefundDto {
  @ApiProperty({
    description: 'Payment ID to refund',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  paymentId: string;

  @ApiProperty({
    description: 'Refund amount in cents (VND)',
    example: 75000,
    minimum: 1000,
  })
  @IsNumber()
  @Min(1000)
  amount: number;

  @ApiPropertyOptional({
    description: 'Reason for refund',
    example: 'Customer requested refund',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Additional notes for the refund',
    example: 'Processed due to defective product',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ProcessWebhookDto {
  @ApiProperty({
    description: 'Transaction ID from payment provider',
    example: 'vnp_123456789',
  })
  @IsString()
  transactionId: string;

  @ApiProperty({
    description: 'Payment status from provider',
    example: 'SUCCESS',
  })
  @IsString()
  status: string;

  @ApiPropertyOptional({
    description: 'Provider-specific data',
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  providerData?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Webhook signature for verification',
    example: 'sha256=abcdef123456...',
  })
  @IsOptional()
  @IsString()
  signature?: string;
}

export class PaymentMethodDto {
  @ApiProperty({
    description: 'Payment method ID',
    example: 'VNPAY',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Payment method name',
    example: 'VNPAY',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Payment method description',
    example: 'Thanh toán qua VNPAY',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Payment method logo URL',
    example: '/images/payment/vnpay.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Is payment method enabled',
    example: true,
  })
  enabled: boolean;

  @ApiPropertyOptional({
    description: 'Minimum amount for this payment method',
    example: 10000,
  })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Maximum amount for this payment method',
    example: 50000000,
  })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Processing fee percentage',
    example: 2.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  feePercentage?: number;

  @ApiPropertyOptional({
    description: 'Fixed processing fee in VND',
    example: 2000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedFee?: number;
}