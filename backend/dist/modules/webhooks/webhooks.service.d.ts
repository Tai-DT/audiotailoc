import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { OrdersService } from '../orders/orders.service';
export interface WebhookData {
    [key: string]: any;
}
export interface WebhookResult {
    success: boolean;
    message: string;
    orderId?: string;
    paymentId?: string;
}
export declare class WebhooksService {
    private readonly config;
    private readonly prisma;
    private readonly paymentsService;
    private readonly ordersService;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService, paymentsService: PaymentsService, ordersService: OrdersService);
    handleVNPAYWebhook(data: WebhookData): Promise<WebhookResult>;
    handleMOMOWebhook(data: WebhookData): Promise<WebhookResult>;
    handlePAYOSWebhook(data: WebhookData): Promise<WebhookResult>;
    private validateVNPAYSignature;
    private validateMOMOSignature;
    private validatePAYOSSignature;
    handleOrderStatusWebhook(data: WebhookData): Promise<WebhookResult>;
    handleInventoryWebhook(data: WebhookData): Promise<WebhookResult>;
}
