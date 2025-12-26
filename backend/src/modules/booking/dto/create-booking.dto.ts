import { IsString, IsOptional, IsArray, IsDateString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  serviceId!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? null : value))
  userId?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? null : value))
  technicianId?: string | null;

  @IsOptional()
  @IsString()
  status?: string;

  @IsDateString()
  scheduledAt!: string;

  @IsString()
  scheduledTime!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? null : value))
  notes?: string | null;

  @IsOptional()
  @IsNumber()
  estimatedCosts?: number;

  @IsOptional()
  @IsArray()
  items?: Array<{ itemId: string; quantity: number; price?: number }>;
}
