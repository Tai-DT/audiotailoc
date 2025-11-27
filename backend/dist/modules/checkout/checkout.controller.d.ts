import { CheckoutService } from './checkout.service';
declare class ShippingAddressDto {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    notes?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    goongPlaceId?: string;
}
declare class CheckoutDto {
    promotionCode?: string;
    shippingAddress: ShippingAddressDto;
    items?: Array<{
        productId: string;
        quantity: number;
    }>;
}
export declare class CheckoutController {
    private readonly checkout;
    constructor(checkout: CheckoutService);
    create(req: any, dto: CheckoutDto): Promise<{
        id: string;
        orderNo: string;
        totalCents: number;
        status: string;
        shippingAddress: string;
    }>;
    createLegacy(req: any, dto: CheckoutDto): Promise<{
        order: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderNo: string;
            userId: string | null;
            subtotalCents: number;
            discountCents: number;
            shippingCents: number;
            totalCents: number;
            shippingAddress: string | null;
            shippingCoordinates: string | null;
            promotionCode: string | null;
            isDeleted: boolean;
            deletedAt: Date | null;
        };
    }>;
    getByOrderNo(req: any, orderNo: string): Promise<{
        order_items: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            orderId: string;
            productId: string;
            quantity: number;
            price: bigint;
            unitPrice: bigint | null;
        }[];
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: string | null;
            orderId: string;
            transactionId: string | null;
            intentId: string | null;
            provider: string;
            amountCents: number;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNo: string;
        userId: string | null;
        subtotalCents: number;
        discountCents: number;
        shippingCents: number;
        totalCents: number;
        shippingAddress: string | null;
        shippingCoordinates: string | null;
        promotionCode: string | null;
        isDeleted: boolean;
        deletedAt: Date | null;
    }>;
}
export {};
