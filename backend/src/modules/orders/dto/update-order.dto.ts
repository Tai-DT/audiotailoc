import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ShippingCoordinatesDto } from './create-order.dto';

export class UpdateOrderItemDto {
  @ApiPropertyOptional({ description: 'ID của sản phẩm' })
  @IsString()
  productId: string;

  @ApiPropertyOptional({ description: 'Số lượng sản phẩm', minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Đơn giá (tùy chọn)' })
  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @ApiPropertyOptional({ description: 'Tên sản phẩm (tùy chọn)' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'Tên khách hàng' })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại khách hàng' })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiPropertyOptional({ description: 'Email khách hàng' })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ giao hàng' })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiPropertyOptional({ description: 'Tọa độ giao hàng' })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingCoordinatesDto)
  shippingCoordinates?: ShippingCoordinatesDto;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: [UpdateOrderItemDto], description: 'Danh sách sản phẩm cập nhật' })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];
}
