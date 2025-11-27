import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSchema {
  @ApiProperty({
    description: 'Product unique identifier',
    example: 'prod_123',
  })
  id!: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Premium Bluetooth Headphones',
  })
  name!: string;

  @ApiProperty({
    description: 'Product URL-friendly slug',
    example: 'premium-bluetooth-headphones',
  })
  slug!: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-quality wireless headphones with active noise cancellation',
  })
  description?: string;

  @ApiProperty({
    description: 'Product price in cents (VND)',
    example: 2500000,
    minimum: 0,
  })
  priceCents!: number;

  @ApiPropertyOptional({
    description: 'Main product image URL',
    example: 'https://example.com/images/product.jpg',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Product category ID',
    example: 'cat_headphones',
  })
  categoryId?: string;

  @ApiProperty({
    description: 'Whether product is featured',
    example: true,
    default: false,
  })
  featured!: boolean;

  @ApiProperty({
    description: 'Whether product is in stock',
    example: true,
    default: true,
  })
  inStock!: boolean;

  @ApiPropertyOptional({
    description: 'Product specifications',
    example: {
      brand: 'Sony',
      model: 'WH-1000XM5',
      weight: '250g',
      batteryLife: '30 hours',
    },
  })
  specifications?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Product image gallery',
    type: [String],
    example: ['https://example.com/images/product1.jpg', 'https://example.com/images/product2.jpg'],
  })
  images?: string[];

  @ApiProperty({
    description: 'Product creation date',
    example: '2025-08-31T22:57:59.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Product last update date',
    example: '2025-08-31T22:57:59.000Z',
  })
  updatedAt!: string;
}

export class CategorySchema {
  @ApiProperty({
    description: 'Category unique identifier',
    example: 'cat_headphones',
  })
  id!: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Headphones',
  })
  name!: string;

  @ApiProperty({
    description: 'Category URL-friendly slug',
    example: 'headphones',
  })
  slug!: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Premium audio headphones and earphones',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/images/category.jpg',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Number of products in this category',
    example: 25,
    minimum: 0,
  })
  productCount!: number;

  @ApiProperty({
    description: 'Category creation date',
    example: '2025-08-31T22:57:59.000Z',
  })
  createdAt!: string;
}

export class UserSchema {
  @ApiProperty({
    description: 'User unique identifier',
    example: 'user_123',
  })
  id!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email!: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'Nguyễn Văn A',
  })
  name?: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin', 'moderator'],
  })
  role!: string;

  @ApiProperty({
    description: 'Account verification status',
    example: true,
  })
  isVerified!: boolean;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+84901234567',
  })
  phone?: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2025-08-31T22:57:59.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last login date',
    example: '2025-08-31T22:57:59.000Z',
  })
  lastLoginAt!: string;
}

export class OrderSchema {
  @ApiProperty({
    description: 'Order unique identifier',
    example: 'order_123',
  })
  id!: string;

  @ApiProperty({
    description: 'Order number (human-readable)',
    example: 'ORD-2025-001234',
  })
  orderNumber!: string;

  @ApiProperty({
    description: 'Customer user ID',
    example: 'user_123',
  })
  userId!: string;

  @ApiProperty({
    description: 'Order status',
    example: 'pending',
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  status!: string;

  @ApiProperty({
    description: 'Order total amount in cents (VND)',
    example: 5000000,
    minimum: 0,
  })
  totalCents!: number;

  @ApiProperty({
    description: 'Shipping address',
    example: {
      name: 'Nguyễn Văn A',
      phone: '+84901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP.HCM',
      postalCode: '70000',
    },
  })
  shippingAddress!: Record<string, any>;

  @ApiProperty({
    description: 'Order items',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'prod_123' },
        name: { type: 'string', example: 'Premium Bluetooth Headphones' },
        quantity: { type: 'number', example: 2 },
        priceCents: { type: 'number', example: 2500000 },
        totalCents: { type: 'number', example: 5000000 },
      },
    },
  })
  items!: any[];

  @ApiProperty({
    description: 'Order creation date',
    example: '2025-08-31T22:57:59.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Order last update date',
    example: '2025-08-31T22:57:59.000Z',
  })
  updatedAt!: string;
}

export class CartSchema {
  @ApiProperty({
    description: 'Cart unique identifier',
    example: 'cart_123',
  })
  id!: string;

  @ApiPropertyOptional({
    description: 'Cart owner user ID (null for guest carts)',
    example: 'user_123',
  })
  userId?: string;

  @ApiProperty({
    description: 'Cart items',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'prod_123' },
        name: { type: 'string', example: 'Premium Bluetooth Headphones' },
        quantity: { type: 'number', example: 2 },
        priceCents: { type: 'number', example: 2500000 },
        totalCents: { type: 'number', example: 5000000 },
        imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
      },
    },
  })
  items!: any[];

  @ApiProperty({
    description: 'Cart total amount in cents (VND)',
    example: 5000000,
    minimum: 0,
  })
  totalCents!: number;

  @ApiProperty({
    description: 'Number of items in cart',
    example: 3,
    minimum: 0,
  })
  itemCount!: number;

  @ApiProperty({
    description: 'Cart creation date',
    example: '2025-08-31T22:57:59.000Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Cart last update date',
    example: '2025-08-31T22:57:59.000Z',
  })
  updatedAt!: string;
}
