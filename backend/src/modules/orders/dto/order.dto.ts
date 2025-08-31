import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsArray, IsEmail, IsPhoneNumber, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum ShippingMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  OVERNIGHT = 'OVERNIGHT',
  PICKUP = 'PICKUP',
}

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity to order',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Special notes for this item',
    example: 'Please check product condition carefully',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ShippingAddressDto {
  @ApiProperty({
    description: 'Recipient full name',
    example: 'Nguyen Van A',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84987654321',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Street address',
    example: '123 Nguyen Trai Street',
  })
  @IsString()
  street: string;

  @ApiPropertyOptional({
    description: 'Ward/Commune',
    example: 'Ward 1',
  })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({
    description: 'District',
    example: 'District 1',
  })
  @IsString()
  district: string;

  @ApiProperty({
    description: 'City/Province',
    example: 'Ho Chi Minh City',
  })
  @IsString()
  city: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '700000',
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Additional delivery instructions',
    example: 'Ring the bell twice, apartment 5A',
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Order items',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Shipping address',
    type: ShippingAddressDto,
  })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiPropertyOptional({
    description: 'Customer name (if different from shipping)',
    example: 'Nguyen Van A',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+84987654321',
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'nguyen.van.a@email.com',
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'Shipping method',
    enum: ShippingMethod,
    default: ShippingMethod.STANDARD,
    example: ShippingMethod.STANDARD,
  })
  @IsOptional()
  @IsEnum(ShippingMethod)
  shippingMethod?: ShippingMethod = ShippingMethod.STANDARD;

  @ApiPropertyOptional({
    description: 'Order notes',
    example: 'Please call before delivery',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Preferred delivery time',
    example: 'Morning (9AM - 12PM)',
  })
  @IsOptional()
  @IsString()
  preferredDeliveryTime?: string;

  @ApiPropertyOptional({
    description: 'Coupon code to apply',
    example: 'WELCOME10',
  })
  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Status update notes',
    example: 'Order confirmed and being prepared for shipment',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Tracking number (for shipped status)',
    example: 'VN123456789',
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Estimated delivery date',
    example: '2024-01-20T10:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  estimatedDeliveryDate?: string;
}

export class OrderSearchDto {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({
    description: 'Filter by order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Filter by payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Search by customer name or email',
    example: 'nguyen van a',
  })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiPropertyOptional({
    description: 'Search by order number',
    example: 'ORD-2024-001',
  })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiPropertyOptional({
    description: 'Filter by date range start',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by date range end',
    example: '2024-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Minimum order total',
    minimum: 0,
    example: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minTotal?: number;

  @ApiPropertyOptional({
    description: 'Maximum order total',
    minimum: 0,
    example: 5000000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxTotal?: number;

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt', 'updatedAt', 'total', 'orderNumber'],
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'total', 'orderNumber'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
    example: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}