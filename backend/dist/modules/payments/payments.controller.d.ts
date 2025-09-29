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
        timestamp: string;
        supportedProviders: string[];
    };
    getPayments(query: any): Promise<{
        payments: {
            id: any;
            orderId: any;
            orderNo: any;
            amountCents: any;
            provider: any;
            status: any;
            createdAt: any;
            updatedAt: any;
            paidAt: any;
            user: any;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPaymentStats(): Promise<{
        totalPayments: number;
        totalRevenue: number;
        pendingPayments: number;
        failedPayments: number;
        refundedPayments: number;
        refundedAmount: number;
    }>;
    createIntent(dto: CreateIntentDto): Promise<{
        intentId: string;
        redirectUrl: any;
        paymentMethod: string;
    } | {
        intentId: string;
        redirectUrl: string;
        paymentMethod?: undefined;
    }>;
    createRefund(dto: CreateRefundDto): Promise<{
        refundId: string;
        success: any;
    }>;
    vnpayCallback(ref: string): Promise<{
        ok: boolean;
    }>;
    momoCallback(ref: string): Promise<{
        ok: boolean;
    }>;
    payosCallback(orderCode?: string, ref?: string): Promise<{
        ok: boolean;
    }>;
    vnpayWebhook(body: any): Promise<{
        RspCode: string;
        Message: string;
    } | {
        resultCode: number;
        message: string;
    } | {
        error: number;
        message: string;
    }>;
    momoWebhook(body: any): Promise<{
        RspCode: string;
        Message: string;
    } | {
        resultCode: number;
        message: string;
    } | {
        error: number;
        message: string;
    }>;
    payosWebhook(req: any, body: any, xsig?: string): Promise<{
        RspCode: string;
        Message: string;
    } | {
        resultCode: number;
        message: string;
    } | {
        error: number;
        message: string;
    } | {
        ok: boolean;
    }>;
}
export {};
