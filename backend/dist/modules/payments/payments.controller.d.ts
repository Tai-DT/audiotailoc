import { PaymentsService } from './payments.service';
import { PayOSService } from './payos.service';
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
    private readonly payos;
    constructor(payments: PaymentsService, prisma: PrismaService, payos: PayOSService);
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
    getMyPayments(req: any): Promise<{
        id: any;
        orderId: any;
        orderNo: any;
        description: string;
        amount: any;
        provider: any;
        status: any;
        transactionId: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
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
        redirectUrl: any;
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
        received: boolean;
    }>;
    vnpayWebhook(body: any): Promise<{
        error: number;
        message: string;
    } | {
        RspCode: string;
        Message: string;
    } | {
        resultCode: number;
        message: string;
    }>;
    momoWebhook(body: any): Promise<{
        error: number;
        message: string;
    } | {
        RspCode: string;
        Message: string;
    } | {
        resultCode: number;
        message: string;
    }>;
    payosWebhook(req: any, body: any, xsig?: string): Promise<{
        error: number;
        message: string;
    }>;
}
export {};
