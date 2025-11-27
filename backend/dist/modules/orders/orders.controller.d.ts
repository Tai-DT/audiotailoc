import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
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
    create(createOrderDto: CreateOrderDto): Promise<any>;
    getStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
    }>;
    get(id: string): Promise<any>;
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
        isDeleted: boolean;
        deletedAt: Date | null;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<any>;
    delete(id: string): Promise<{
        message: string;
        id: string;
    }>;
    sendInvoice(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
