"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartSchema = exports.OrderSchema = exports.UserSchema = exports.CategorySchema = exports.ProductSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProductSchema {
}
exports.ProductSchema = ProductSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product unique identifier',
        example: 'prod_123',
    }),
    __metadata("design:type", String)
], ProductSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Premium Bluetooth Headphones',
    }),
    __metadata("design:type", String)
], ProductSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product URL-friendly slug',
        example: 'premium-bluetooth-headphones',
    }),
    __metadata("design:type", String)
], ProductSchema.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product description',
        example: 'High-quality wireless headphones with active noise cancellation',
    }),
    __metadata("design:type", String)
], ProductSchema.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product price in cents (VND)',
        example: 2500000,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], ProductSchema.prototype, "priceCents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Main product image URL',
        example: 'https://example.com/images/product.jpg',
    }),
    __metadata("design:type", String)
], ProductSchema.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product category ID',
        example: 'cat_headphones',
    }),
    __metadata("design:type", String)
], ProductSchema.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether product is featured',
        example: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], ProductSchema.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether product is in stock',
        example: true,
        default: true,
    }),
    __metadata("design:type", Boolean)
], ProductSchema.prototype, "inStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product specifications',
        example: {
            brand: 'Sony',
            model: 'WH-1000XM5',
            weight: '250g',
            batteryLife: '30 hours',
        },
    }),
    __metadata("design:type", Object)
], ProductSchema.prototype, "specifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product image gallery',
        type: [String],
        example: ['https://example.com/images/product1.jpg', 'https://example.com/images/product2.jpg'],
    }),
    __metadata("design:type", Array)
], ProductSchema.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product creation date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], ProductSchema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product last update date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], ProductSchema.prototype, "updatedAt", void 0);
class CategorySchema {
}
exports.CategorySchema = CategorySchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category unique identifier',
        example: 'cat_headphones',
    }),
    __metadata("design:type", String)
], CategorySchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category name',
        example: 'Headphones',
    }),
    __metadata("design:type", String)
], CategorySchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category URL-friendly slug',
        example: 'headphones',
    }),
    __metadata("design:type", String)
], CategorySchema.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category description',
        example: 'Premium audio headphones and earphones',
    }),
    __metadata("design:type", String)
], CategorySchema.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category image URL',
        example: 'https://example.com/images/category.jpg',
    }),
    __metadata("design:type", String)
], CategorySchema.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of products in this category',
        example: 25,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], CategorySchema.prototype, "productCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category creation date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], CategorySchema.prototype, "createdAt", void 0);
class UserSchema {
}
exports.UserSchema = UserSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User unique identifier',
        example: 'user_123',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
        format: 'email',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User full name',
        example: 'Nguyễn Văn A',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User role',
        example: 'user',
        enum: ['user', 'admin', 'moderator'],
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account verification status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserSchema.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User phone number',
        example: '+84901234567',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account creation date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last login date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], UserSchema.prototype, "lastLoginAt", void 0);
class OrderSchema {
}
exports.OrderSchema = OrderSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order unique identifier',
        example: 'order_123',
    }),
    __metadata("design:type", String)
], OrderSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order number (human-readable)',
        example: 'ORD-2025-001234',
    }),
    __metadata("design:type", String)
], OrderSchema.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer user ID',
        example: 'user_123',
    }),
    __metadata("design:type", String)
], OrderSchema.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order status',
        example: 'pending',
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    }),
    __metadata("design:type", String)
], OrderSchema.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order total amount in cents (VND)',
        example: 5000000,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], OrderSchema.prototype, "totalCents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    __metadata("design:type", Object)
], OrderSchema.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    __metadata("design:type", Array)
], OrderSchema.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order creation date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], OrderSchema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order last update date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], OrderSchema.prototype, "updatedAt", void 0);
class CartSchema {
}
exports.CartSchema = CartSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart unique identifier',
        example: 'cart_123',
    }),
    __metadata("design:type", String)
], CartSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cart owner user ID (null for guest carts)',
        example: 'user_123',
    }),
    __metadata("design:type", String)
], CartSchema.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    __metadata("design:type", Array)
], CartSchema.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart total amount in cents (VND)',
        example: 5000000,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], CartSchema.prototype, "totalCents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items in cart',
        example: 3,
        minimum: 0,
    }),
    __metadata("design:type", Number)
], CartSchema.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart creation date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], CartSchema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cart last update date',
        example: '2025-08-31T22:57:59.000Z',
    }),
    __metadata("design:type", String)
], CartSchema.prototype, "updatedAt", void 0);
//# sourceMappingURL=api.schemas.js.map