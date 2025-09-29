import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionDto } from './create-promotion.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageCount?: number;
}
