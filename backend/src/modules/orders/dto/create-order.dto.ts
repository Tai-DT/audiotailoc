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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID của sản phẩm' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Số lượng sản phẩm', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ShippingCoordinatesDto {
  @ApiProperty({ description: 'Vĩ độ' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Kinh độ' })
  @IsNumber()
  lng: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto], description: 'Danh sách sản phẩm' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

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

  @ApiPropertyOptional({ description: 'Ghi chú đơn hàng' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Mã khuyến mãi' })
  @IsString()
  @IsOptional()
  promotionCode?: string;

  @ApiPropertyOptional({ description: 'User ID (nếu đã đăng nhập)' })
  @IsString()
  @IsOptional()
  userId?: string;
}
