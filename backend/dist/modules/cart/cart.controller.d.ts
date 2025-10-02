import { CartService } from './cart.service';
declare class AddToCartDto {
    productId: string;
    quantity: number;
}
declare class UpdateCartItemDto {
    quantity: number;
}
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(cartId?: string, userId?: string): Promise<any>;
    addToCart(addToCartDto: AddToCartDto, cartId?: string, userId?: string): Promise<any>;
    createGuestCart(): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                priceCents: bigint;
                imageUrl: string;
                images: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: bigint;
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
    addToGuestCart(cartId: string, addToCartDto: AddToCartDto): Promise<any>;
    updateGuestCartItem(cartId: string, productId: string, updateCartItemDto: UpdateCartItemDto): Promise<any>;
    removeFromGuestCart(cartId: string, productId: string): Promise<any>;
    clearGuestCart(cartId: string): Promise<any>;
    convertGuestCartToUserCart(cartId: string, userId: string): Promise<any>;
    getUserCart(userId: string): Promise<any>;
    addToUserCart(userId: string, addToCartDto: AddToCartDto): Promise<any>;
    updateUserCartItem(userId: string, productId: string, updateCartItemDto: UpdateCartItemDto): Promise<any>;
    removeFromUserCart(userId: string, productId: string): Promise<any>;
    clearUserCart(userId: string): Promise<any>;
}
export {};
