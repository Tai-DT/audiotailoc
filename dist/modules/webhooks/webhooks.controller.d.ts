import { WebhooksService } from './webhooks.service';
declare class VNPAYWebhookDto {
    vnp_TxnRef: string;
    vnp_ResponseCode: string;
    vnp_Amount: string;
    vnp_TransactionNo: string;
    vnp_OrderInfo: string;
    vnp_PayDate: string;
    vnp_SecureHash: string;
}
declare class MOMOWebhookDto {
    orderId: string;
    resultCode: number;
    amount: string;
    transId: string;
    message: string;
    signature: string;
}
declare class PAYOSWebhookDto {
    orderCode: string;
    status: string;
    amount: string;
    transactionId: string;
    description: string;
    signature: string;
}
declare class OrderStatusWebhookDto {
    orderId: string;
    status: string;
    reason?: string;
}
declare class InventoryWebhookDto {
    productId: string;
    action: 'ADJUST' | 'SET';
    quantity: number;
    reason?: string;
}
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    handleVNPAYWebhook(data: VNPAYWebhookDto): Promise<import("./webhooks.service").WebhookResult>;
    handleMOMOWebhook(data: MOMOWebhookDto): Promise<import("./webhooks.service").WebhookResult>;
    handlePAYOSWebhook(data: PAYOSWebhookDto): Promise<import("./webhooks.service").WebhookResult>;
    handleOrderStatusWebhook(data: OrderStatusWebhookDto): Promise<import("./webhooks.service").WebhookResult>;
    handleInventoryWebhook(data: InventoryWebhookDto): Promise<import("./webhooks.service").WebhookResult>;
    handleZaloWebhook(_data: any, _signature?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
