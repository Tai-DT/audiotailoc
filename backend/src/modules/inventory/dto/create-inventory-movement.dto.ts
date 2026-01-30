import { IsString, IsInt, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateInventoryMovementDto {
  @IsString()
  inventoryId: string;

  @IsString()
  @IsEnum(['IN', 'OUT', 'ADJUSTMENT', 'RESERVE', 'RELEASE', 'SOLD', 'RETURNED'])
  type: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  performedBy?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
