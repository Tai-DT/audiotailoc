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
            id: string;
            name: string;
            slug: string;
            imageUrl: string;
            isActive: boolean;
            priceCents: bigint;
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
                imageUrl: string;
                images: string;
                isActive: boolean;
                priceCents: bigint;
                originalPriceCents: bigint;
                stockQuantity: number;
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
