import { IsString, IsNumber, IsOptional, Min, Max, IsArray } from 'class-validator';

export class CreateServiceReviewDto {
  // userId is set by the controller from JWT, not from request body
  userId?: string;

  @IsString()
  serviceId: string;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}

export class UpdateServiceReviewDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  response?: string;
}

export class ServiceReviewQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
