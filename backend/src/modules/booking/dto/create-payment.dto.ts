import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaymentProvider } from '../../../common/enums';

export class CreatePaymentDto {
  @IsString()
  bookingId!: string;

  @IsInt()
  @IsPositive()
  amountCents!: number;

  @IsEnum(PaymentProvider)
  paymentMethod!: PaymentProvider;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
