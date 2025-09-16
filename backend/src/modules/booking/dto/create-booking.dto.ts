import { IsString, IsOptional, IsArray, IsDateString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  serviceId!: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsString()
  customerName!: string;

  @IsString()
  customerPhone!: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsString()
  customerAddress!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsString()
  scheduledTime!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  items?: Array<{ itemId: string; quantity: number }>;
}