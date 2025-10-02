import { PrismaService } from '../../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    addToWishlist(userId: string, createWishlistDto: CreateWishlistDto): Promise<{
        product: {
            id: string;
            name: string;
            slug: string;
            priceCents: bigint;
            imageUrl: string;
            isActive: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    getWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    name: string;
                    slug: string;
                };
                id: string;
                name: string;
                slug: string;
                priceCents: bigint;
                originalPriceCents: bigint;
                imageUrl: string;
                images: string;
                stockQuantity: number;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
        })[];
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
