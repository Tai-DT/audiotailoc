import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class CartService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    createGuestCart(): unknown;
    getGuestCart(cartId: string): unknown;
    addToGuestCart(cartId: string, productId: string, quantity?: number): unknown;
    updateGuestCartItem(cartId: string, productId: string, quantity: number): unknown;
    removeFromGuestCart(cartId: string, productId: string): unknown;
    clearGuestCart(cartId: string): unknown;
    convertGuestCartToUserCart(cartId: string, userId: string): unknown;
    getUserCart(userId: string): unknown;
    createUserCart(userId: string): unknown;
    addToUserCart(userId: string, productId: string, quantity?: number): unknown;
    updateUserCartItem(userId: string, productId: string, quantity: number): unknown;
    removeFromUserCart(userId: string, productId: string): unknown;
    clearUserCart(userId: string): unknown;
    private calculateCartTotals;
    cleanupExpiredGuestCarts(): any;
    getCartWithTotals(userId: string): unknown;
}
