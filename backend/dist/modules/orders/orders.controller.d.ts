import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    list(page?: string, pageSize?: string, status?: string): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: {
            id: string;
            orderNumber: string;
            customerName: string;
            customerEmail: string;
            totalAmount: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            items: {
                id: string;
                productId: string;
                productSlug: any;
                productName: string;
                quantity: number;
                price: number;
                total: number;
            }[];
        }[];
    }>;
    create(createOrderDto: {
        items: Array<{
            productId: string;
            quantity: number;
        }>;
        shippingAddress: string;
        shippingCoordinates?: {
            lat: number;
            lng: number;
        };
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        notes?: string;
    }): Promise<any>;
    get(id: string): Promise<{
        items: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            imageUrl: string;
            price: number;
            orderId: string;
            unitPrice: number;
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
    updateStatus(id: string, status: string): Promise<{
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
    update(id: string, updateOrderDto: {
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        shippingAddress?: string;
        shippingCoordinates?: {
            lat: number;
            lng: number;
        };
        notes?: string;
        items?: Array<{
            productId: string;
            quantity: number;
            unitPrice?: number;
            name?: string;
        }>;
    }): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
