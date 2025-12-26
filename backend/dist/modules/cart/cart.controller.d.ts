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
    getCart(cartId?: string, userId?: string, req?: any): Promise<any>;
    addToCart(addToCartDto: AddToCartDto, cartId?: string, userId?: string, req?: any): Promise<any>;
    createGuestCart(): Promise<{
        cart_items: ({
            products: {
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
            productId: string;
            quantity: number;
            price: bigint;
            cartId: string;
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
    convertGuestCartToUserCart(cartId: string, req: any): Promise<any>;
    getUserCart(req: any): Promise<any>;
    addToUserCart(addToCartDto: AddToCartDto, req: any): Promise<any>;
    updateUserCartItem(productId: string, updateCartItemDto: UpdateCartItemDto, req: any): Promise<any>;
    removeFromUserCart(productId: string, req: any): Promise<any>;
    clearUserCart(req: any): Promise<any>;
}
export {};
