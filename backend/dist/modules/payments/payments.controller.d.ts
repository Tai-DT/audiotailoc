import { PaymentsService } from './payments.service';
import { PayOSService } from './payos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PayOSCreatePaymentDto, PayOSRefundDto } from './dto/payos-webhook.dto';
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
    private readonly payosService;
    private readonly prisma;
    private readonly logger;
    constructor(payments: PaymentsService, payosService: PayOSService, prisma: PrismaService);
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
        redirectUrl: string;
        paymentMethod: "PAYOS";
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
    createPayOSPayment(createPaymentDto: PayOSCreatePaymentDto, req: any): Promise<{
        success: boolean;
        checkoutUrl: any;
        paymentRequestId: any;
        orderCode: any;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        orderCode: number;
        checkoutUrl?: undefined;
        paymentRequestId?: undefined;
    }>;
    getPayOSPaymentStatus(orderCode: string): Promise<{
        success: boolean;
        data: any;
    }>;
    createPayOSRefund(refundDto: PayOSRefundDto): Promise<{
        success: boolean;
        refundId: any;
        message: string;
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
    payosWebhook(req: any, body: any): Promise<{
        error: number;
        message: string;
    }>;
}
export {};
