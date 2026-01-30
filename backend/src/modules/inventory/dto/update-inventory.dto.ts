import { IsInt, IsOptional, Min, IsString } from 'class-validator';

export class UpdateInventoryDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  minStockLevel?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxStockLevel?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  reserved?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  lowStockThreshold?: number;
}
