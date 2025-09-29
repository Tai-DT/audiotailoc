import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class CartService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    createGuestCart(): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                images: string;
                priceCents: number;
                imageUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
            price: number;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        guestId: string;
        expiresAt: Date;
    }>;
    getGuestCart(cartId: string): Promise<any>;
    addToGuestCart(cartId: string, productId: string, quantity?: number): Promise<any>;
    updateGuestCartItem(cartId: string, productId: string, quantity: number): Promise<any>;
    removeFromGuestCart(cartId: string, productId: string): Promise<any>;
    clearGuestCart(cartId: string): Promise<any>;
    convertGuestCartToUserCart(cartId: string, userId: string): Promise<any>;
    getUserCart(userId: string): Promise<any>;
    createUserCart(userId: string): Promise<any>;
    addToUserCart(userId: string, productId: string, quantity?: number): Promise<any>;
    updateUserCartItem(userId: string, productId: string, quantity: number): Promise<any>;
    removeFromUserCart(userId: string, productId: string): Promise<any>;
    clearUserCart(userId: string): Promise<any>;
    private calculateCartTotals;
    cleanupExpiredGuestCarts(): Promise<void>;
    getCartWithTotals(userId: string): Promise<{
        cart: any;
        items: any[];
        subtotalCents: number;
    } | {
        cart: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            guestId: string;
            expiresAt: Date;
        };
        items: ({
            product: {
                model: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string;
                description: string;
                slug: string;
                shortDescription: string;
                features: string;
                images: string;
                isActive: boolean;
                viewCount: number;
                metaTitle: string;
                metaDescription: string;
                metaKeywords: string;
                canonicalUrl: string;
                featured: boolean;
                isDeleted: boolean;
                priceCents: number;
                originalPriceCents: number;
                imageUrl: string;
                categoryId: string;
                brand: string;
                sku: string;
                specifications: string;
                warranty: string;
                weight: number;
                dimensions: string;
                stockQuantity: number;
                minOrderQuantity: number;
                maxOrderQuantity: number;
                maxStock: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
            price: number;
        })[];
        subtotalCents: number;
    }>;
}
