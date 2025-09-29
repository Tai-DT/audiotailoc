import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';
declare class CreateIntentDto {
    orderId: string;
    provider: 'PAYOS' | 'COD';
    idempotencyKey: string;
    returnUrl?: string;
}
declare class CreateRefundDto {
    paymentId: string;
    amountCents?: number;
    reason?: string;
}
export declare class PaymentsController {
    private readonly payments;
    private readonly prisma;
    constructor(payments: PaymentsService, prisma: PrismaService);
    getPaymentMethods(): {
        methods: {
            id: string;
            name: string;
            description: string;
            logo: string;
            enabled: boolean;
        }[];
    };
    getPaymentStatus(): {
        status: string;
        message: string;
        timestamp: any;
        supportedProviders: string[];
    };
    getPayments(query: any): unknown;
    getPaymentStats(): unknown;
    createIntent(dto: CreateIntentDto): unknown;
    createRefund(dto: CreateRefundDto): unknown;
    vnpayCallback(ref: string): unknown;
    momoCallback(ref: string): unknown;
    payosCallback(orderCode?: string, ref?: string): unknown;
    vnpayWebhook(body: any): unknown;
    momoWebhook(body: any): unknown;
    payosWebhook(req: any, body: any, xsig?: string): unknown;
}
export {};
