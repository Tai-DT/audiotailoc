import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../../../common/enums';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

