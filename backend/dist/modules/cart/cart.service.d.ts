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
                priceCents: number;
                imageUrl: string;
                images: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        guestId: string | null;
        expiresAt: Date | null;
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
            userId: string | null;
            guestId: string | null;
            expiresAt: Date | null;
        };
        items: ({
            product: {
                model: string | null;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                tags: string | null;
                description: string | null;
                slug: string;
                shortDescription: string | null;
                priceCents: number;
                originalPriceCents: number | null;
                imageUrl: string | null;
                images: string | null;
                categoryId: string | null;
                brand: string | null;
                sku: string | null;
                specifications: string | null;
                features: string | null;
                warranty: string | null;
                weight: number | null;
                dimensions: string | null;
                stockQuantity: number;
                minOrderQuantity: number;
                maxOrderQuantity: number | null;
                maxStock: number | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                canonicalUrl: string | null;
                featured: boolean;
                isActive: boolean;
                isDeleted: boolean;
                viewCount: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
        subtotalCents: number;
    }>;
}
