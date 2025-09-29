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
    getCart(req: any, cartId?: string, userId?: string): Promise<any>;
    addToCart(req: any, addToCartDto: AddToCartDto, cartId?: string, userId?: string): Promise<any>;
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
