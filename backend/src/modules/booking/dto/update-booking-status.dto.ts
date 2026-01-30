import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceBookingStatus } from '../../../common/enums';

export class UpdateBookingStatusDto {
  @IsEnum(ServiceBookingStatus)
  status!: ServiceBookingStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  changedBy?: string;
}
