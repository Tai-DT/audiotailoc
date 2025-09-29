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
    addToWishlist(req: AuthenticatedRequest, createWishlistDto: CreateWishlistDto): unknown;
    getWishlist(req: AuthenticatedRequest): unknown;
    getWishlistCount(req: AuthenticatedRequest): unknown;
    isInWishlist(req: AuthenticatedRequest, productId: string): unknown;
    removeFromWishlist(req: AuthenticatedRequest, productId: string): unknown;
    clearWishlist(req: AuthenticatedRequest): unknown;
}
export {};
