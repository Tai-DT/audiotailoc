import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus, ShippingMethod } from './order.dto';

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Order item ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: '456e7890-e89b-12d3-a456-426614174001',
  })
  productId: string;

  @ApiProperty({
    description: 'Product details',
    type: 'object',
    example: {
      id: '456e7890-e89b-12d3-a456-426614174001',
      name: 'Premium Audio Cable - 3 Meter',
      sku: 'AUD-CABLE-3M-001',
      image: '/images/products/audio-cable-3m.jpg',
    },
  })
  product: {
    id: string;
    name: string;
    sku: string;
    image?: string;
  };

  @ApiProperty({
    description: 'Ordered quantity',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit price at time of order (in VND)',
    example: 150000,
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Total price for this item (in VND)',
    example: 300000,
  })
  totalPrice: number;

  @ApiPropertyOptional({
    description: 'Special notes for this item',
    example: 'Please check product condition carefully',
  })
  notes?: string;
}

export class ShippingAddressResponseDto {
  @ApiProperty({
    description: 'Recipient full name',
    example: 'Nguyen Van A',
  })
  fullName: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84987654321',
  })
  phone: string;

  @ApiProperty({
    description: 'Complete formatted address',
    example: '123 Nguyen Trai Street, Ward 1, District 1, Ho Chi Minh City',
  })
  formattedAddress: string;

  @ApiProperty({
    description: 'Street address',
    example: '123 Nguyen Trai Street',
  })
  street: string;

  @ApiPropertyOptional({
    description: 'Ward/Commune',
    example: 'Ward 1',
  })
  ward?: string;

  @ApiProperty({
    description: 'District',
    example: 'District 1',
  })
  district: string;

  @ApiProperty({
    description: 'City/Province',
    example: 'Ho Chi Minh City',
  })
  city: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '700000',
  })
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Additional delivery instructions',
    example: 'Ring the bell twice, apartment 5A',
  })
  instructions?: string;
}

export class OrderStatusHistoryDto {
  @ApiProperty({
    description: 'Status value',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Status change timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Status change notes',
    example: 'Order confirmed and being prepared for shipment',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'User who changed the status',
    example: 'admin@audiotailoc.com',
  })
  changedBy?: string;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Order number (human-readable)',
    example: 'ORD-2024-001',
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Current order status',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Order items',
    type: [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Shipping address',
    type: ShippingAddressResponseDto,
  })
  shippingAddress: ShippingAddressResponseDto;

  @ApiPropertyOptional({
    description: 'Customer name',
    example: 'Nguyen Van A',
  })
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+84987654321',
  })
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'nguyen.van.a@email.com',
  })
  customerEmail?: string;

  @ApiProperty({
    description: 'Shipping method',
    enum: ShippingMethod,
    example: ShippingMethod.STANDARD,
  })
  shippingMethod: ShippingMethod;

  @ApiProperty({
    description: 'Subtotal amount (before shipping and tax)',
    example: 300000,
  })
  subtotal: number;

  @ApiProperty({
    description: 'Shipping cost',
    example: 25000,
  })
  shippingCost: number;

  @ApiPropertyOptional({
    description: 'Tax amount',
    example: 32500,
  })
  tax?: number;

  @ApiPropertyOptional({
    description: 'Discount amount',
    example: 30000,
  })
  discount?: number;

  @ApiProperty({
    description: 'Total order amount',
    example: 327500,
  })
  total: number;

  @ApiPropertyOptional({
    description: 'Applied coupon code',
    example: 'WELCOME10',
  })
  couponCode?: string;

  @ApiPropertyOptional({
    description: 'Order notes',
    example: 'Please call before delivery',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Preferred delivery time',
    example: 'Morning (9AM - 12PM)',
  })
  preferredDeliveryTime?: string;

  @ApiPropertyOptional({
    description: 'Tracking number',
    example: 'VN123456789',
  })
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Estimated delivery date',
    example: '2024-01-20T10:00:00.000Z',
  })
  estimatedDeliveryDate?: string;

  @ApiPropertyOptional({
    description: 'Actual delivery date',
    example: '2024-01-19T14:30:00.000Z',
  })
  deliveredAt?: string;

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-15T10:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Order last update date',
    example: '2024-01-15T11:00:00.000Z',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Order status history',
    type: [OrderStatusHistoryDto],
  })
  statusHistory?: OrderStatusHistoryDto[];

  @ApiPropertyOptional({
    description: 'Payment information',
    type: 'object',
    example: {
      paymentId: 'pay_123456789',
      provider: 'VNPAY',
      paidAt: '2024-01-15T10:15:00.000Z',
    },
  })
  payment?: {
    paymentId: string;
    provider: string;
    paidAt: string;
  };
}

export class OrderSummaryDto {
  @ApiProperty({
    description: 'Order ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Order number',
    example: 'ORD-2024-001',
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Customer name',
    example: 'Nguyen Van A',
  })
  customerName: string;

  @ApiProperty({
    description: 'Total amount',
    example: 327500,
  })
  total: number;

  @ApiProperty({
    description: 'Number of items',
    example: 3,
  })
  itemCount: number;

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-15T10:00:00.000Z',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: 'Expected delivery date',
    example: '2024-01-20T10:00:00.000Z',
  })
  expectedDelivery?: string;
}

export class OrderAnalyticsDto {
  @ApiProperty({
    description: 'Total orders count',
    example: 1250,
  })
  totalOrders: number;

  @ApiProperty({
    description: 'Total revenue amount',
    example: 125000000,
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Average order value',
    example: 100000,
  })
  averageOrderValue: number;

  @ApiProperty({
    description: 'Orders by status',
    type: 'object',
    example: {
      PENDING: 45,
      CONFIRMED: 120,
      PROCESSING: 80,
      SHIPPED: 150,
      DELIVERED: 800,
      CANCELLED: 35,
      REFUNDED: 20,
    },
  })
  ordersByStatus: Record<OrderStatus, number>;

  @ApiProperty({
    description: 'Revenue trend data',
    type: 'array',
    example: [
      { date: '2024-01-01', orders: 45, revenue: 4500000 },
      { date: '2024-01-02', orders: 52, revenue: 5200000 },
    ],
  })
  revenueTrend: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;

  @ApiPropertyOptional({
    description: 'Top selling products',
    type: 'array',
    example: [
      {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        productName: 'Premium Audio Cable',
        quantity: 150,
        revenue: 22500000,
      },
    ],
  })
  topProducts?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}