import { IsString, IsOptional, IsNumber } from 'class-validator';

export class PayOSWebhookDto {
  @IsString()
  orderCode!: string;

  @IsString()
  status!: string;

  @IsString()
  @IsOptional()
  amount?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  cancelReason?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  @IsOptional()
  paidAt?: number;

  @IsString()
  @IsOptional()
  paymentRequestId?: string;
}

export class PayOSCreatePaymentDto {
  @IsString()
  orderCode!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  buyerName?: string;

  @IsString()
  @IsOptional()
  buyerEmail?: string;

  @IsString()
  @IsOptional()
  buyerPhone?: string;

  @IsString()
  returnUrl!: string;

  @IsString()
  cancelUrl!: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class PayOSRefundDto {
  @IsString()
  transactionId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cancelReason?: string;
}
