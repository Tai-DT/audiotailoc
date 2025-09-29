import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { PromotionService } from '../promotions/promotion.service';
import { MailService } from '../notifications/mail.service';
export declare class CheckoutService {
    private readonly prisma;
    private readonly cart;
    private readonly promos;
    private readonly mail;
    constructor(prisma: PrismaService, cart: CartService, promos: PromotionService, mail: MailService);
    createOrder(userId: string, params: {
        promotionCode?: string;
        shippingAddress?: any;
    }): unknown;
    getOrderForUserByNo(userId: string, orderNo: string): unknown;
}
