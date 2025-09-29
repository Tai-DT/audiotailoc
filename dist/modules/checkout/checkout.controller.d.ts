import { CheckoutService } from './checkout.service';
declare class CheckoutDto {
    promotionCode?: string;
}
export declare class CheckoutController {
    private readonly checkout;
    constructor(checkout: CheckoutService);
    create(req: any, dto: CheckoutDto): Promise<{
        order: void;
    }>;
    getByOrderNo(req: any, orderNo: string): Promise<{
        order_items: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            productId: string;
            quantity: number;
            price: bigint;
            orderId: string;
            unitPrice: bigint;
        }[];
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            provider: string;
            amountCents: number;
            metadata: string;
            intentId: string;
            transactionId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNo: string;
        userId: string;
        subtotalCents: number;
        discountCents: number;
        shippingCents: number;
        totalCents: number;
        shippingAddress: string;
        shippingCoordinates: string;
        promotionCode: string;
    }>;
}
export {};
