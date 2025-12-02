import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
interface AuthenticatedRequest {
    user: {
        sub: string;
        email: string;
        role: string;
    };
}
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    addToWishlist(req: AuthenticatedRequest, createWishlistDto: CreateWishlistDto): Promise<{
        products: {
            model: string | null;
            tags: string | null;
            description: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
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
        userId: string;
        productId: string;
    }>;
    getWishlist(req: AuthenticatedRequest): Promise<{
        items: ({
            products: {
                categories: {
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
    getWishlistCount(req: AuthenticatedRequest): Promise<{
        count: number;
    }>;
    isInWishlist(req: AuthenticatedRequest, productId: string): Promise<{
        isInWishlist: boolean;
    }>;
    removeFromWishlist(req: AuthenticatedRequest, productId: string): Promise<{
        message: string;
    }>;
    clearWishlist(req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
export {};
