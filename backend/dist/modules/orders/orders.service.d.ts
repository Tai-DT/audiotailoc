import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { TelegramService } from '../notifications/telegram.service';
import { CacheService } from '../caching/cache.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InventoryService } from '../inventory/inventory.service';
import { PromotionsService } from '../promotions/promotions.service';
export declare class OrdersService {
    private readonly prisma;
    private readonly mail;
    private readonly telegram;
    private readonly cache;
    private readonly promotionsService;
    private readonly inventoryService;
    private readonly logger;
    constructor(prisma: PrismaService, mail: MailService, telegram: TelegramService, cache: CacheService, promotionsService: PromotionsService, inventoryService: InventoryService);
    list(params: {
        page?: number;
        pageSize?: number;
        status?: string;
    }): Promise<{
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
        shippingName: string | null;
        shippingPhone: string | null;
        shippingCoordinates: string | null;
        shippingNotes: string | null;
        promotionCode: string | null;
        isDeleted: boolean;
        deletedAt: Date | null;
    }>;
    create(orderData: CreateOrderDto): Promise<any>;
    update(id: string, updateData: UpdateOrderDto): Promise<any>;
    sendInvoice(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
        id: string;
    }>;
    getUserOrders(userId: string, params: {
        page?: number;
        pageSize?: number;
        status?: string;
    }): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: any[];
    }>;
    getUserOrder(userId: string, orderId: string): Promise<any>;
    private transformOrderForResponse;
}
