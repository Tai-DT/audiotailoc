import { PrismaService } from '../../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    addToWishlist(userId: string, createWishlistDto: CreateWishlistDto): Promise<{
        products: {
            model: string | null;
            tags: string | null;
            description: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            isDeleted: boolean;
            slug: string;
            shortDescription: string | null;
            priceCents: bigint;
            originalPriceCents: bigint | null;
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
            minOrderQuantity: number;
            maxOrderQuantity: number | null;
            maxStock: number | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            canonicalUrl: string | null;
            featured: boolean;
            isActive: boolean;
            viewCount: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    getWishlist(userId: string): Promise<{
        items: {
            products: {
                stock: number;
                categories: {
                    id: string;
                    name: string;
                    slug: string;
                };
                inventory: {
                    stock: number;
                };
                id: string;
                name: string;
                slug: string;
                priceCents: bigint;
                originalPriceCents: bigint;
                imageUrl: string;
                images: string;
                isActive: boolean;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
        }[];
        total: number;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        message: string;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
    getWishlistCount(userId: string): Promise<number>;
    clearWishlist(userId: string): Promise<{
        message: string;
    }>;
}
