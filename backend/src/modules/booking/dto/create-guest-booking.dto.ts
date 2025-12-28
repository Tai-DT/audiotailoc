import { IsString, IsOptional, IsEmail, Matches, IsDateString } from 'class-validator';

export class CreateGuestBookingDto {
  @IsString()
  serviceId!: string;

  @IsString()
  customerName!: string;

  @IsString()
  @Matches(/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  customerPhone!: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerAddress?: string;

  @IsDateString()
  scheduledDate!: string;

  @IsString()
  scheduledTime!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
