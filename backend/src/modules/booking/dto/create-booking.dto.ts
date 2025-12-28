import { IsString, IsOptional, IsArray, IsDateString, IsNumber, IsEmail } from 'class-validator';
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

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  // Alias for scheduledAt - frontend uses this name
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

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

  // Customer information fields (for storing with authenticated bookings too)
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
