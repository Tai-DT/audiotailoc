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
        userId?: string;
    }, req?: any): Promise<any>;
    getStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
    }>;
    get(id: string, req: any): Promise<{
        totalCents: number;
        subtotalCents: number;
        order_items: {
            price: number;
            unitPrice: number;
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string | null;
            orderId: string;
            productId: string;
            quantity: number;
        }[];
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            metadata: string | null;
            orderId: string;
            transactionId: string | null;
            provider: string;
            amountCents: number;
            intentId: string | null;
        }[];
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderNo: string;
        userId: string | null;
        discountCents: number;
        shippingCents: number;
        shippingAddress: string | null;
        shippingCoordinates: string | null;
        promotionCode: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
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
