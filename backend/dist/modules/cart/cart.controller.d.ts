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
    getCart(cartId?: string, userId?: string): unknown;
    addToCart(addToCartDto: AddToCartDto, cartId?: string, userId?: string): unknown;
    createGuestCart(): unknown;
    getGuestCart(cartId: string): unknown;
    addToGuestCart(cartId: string, addToCartDto: AddToCartDto): unknown;
    updateGuestCartItem(cartId: string, productId: string, updateCartItemDto: UpdateCartItemDto): unknown;
    removeFromGuestCart(cartId: string, productId: string): unknown;
    clearGuestCart(cartId: string): unknown;
    convertGuestCartToUserCart(cartId: string, userId: string): unknown;
    getUserCart(userId: string): unknown;
    addToUserCart(userId: string, addToCartDto: AddToCartDto): unknown;
    updateUserCartItem(userId: string, productId: string, updateCartItemDto: UpdateCartItemDto): unknown;
    removeFromUserCart(userId: string, productId: string): unknown;
    clearUserCart(userId: string): unknown;
}
export {};
