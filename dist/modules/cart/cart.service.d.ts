import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { InventoryService } from '../inventory/inventory.service';
export declare class CartService {
    private readonly prisma;
    private readonly config;
    private readonly inventoryService;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService, inventoryService: InventoryService);
    createGuestCart(): Promise<{
        cart_items: ({
            products: {
                id: string;
                name: string;
                imageUrl: string;
                images: string;
                priceCents: bigint;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
            price: bigint;
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
            products: {
                model: string;
                tags: string;
                description: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                imageUrl: string;
                categoryId: string;
                viewCount: number;
                featured: boolean;
                images: string;
                shortDescription: string;
                features: string;
                isActive: boolean;
                metaTitle: string;
                metaDescription: string;
                metaKeywords: string;
                canonicalUrl: string;
                isDeleted: boolean;
                priceCents: bigint;
                originalPriceCents: bigint;
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
            price: bigint;
        })[];
        subtotalCents: number;
    }>;
    private checkAndReserveStock;
    private releaseStock;
    private updateReservedStock;
}
