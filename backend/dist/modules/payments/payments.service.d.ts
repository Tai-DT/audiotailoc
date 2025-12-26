import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PayOSService } from './payos.service';
export declare class PaymentsService {
    private readonly prisma;
    private readonly config;
    private readonly payos;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService, payos: PayOSService);
    createIntent(params: {
        orderId: string;
        provider: 'PAYOS' | 'COD';
        idempotencyKey?: string;
        returnUrl?: string;
    }): Promise<{
        intentId: string;
        redirectUrl: any;
        paymentMethod: string;
    } | {
        intentId: string;
        redirectUrl: any;
        paymentMethod?: undefined;
    }>;
    private buildRedirectUrl;
    private createMomoPayment;
    markPaid(provider: 'VNPAY' | 'MOMO' | 'PAYOS', txnRef: string, transactionId?: string, amountCents?: number): Promise<{
        ok: boolean;
    }>;
    createRefund(paymentId: string, amountCents?: number, reason?: string): Promise<{
        refundId: string;
        success: any;
    }>;
    private processVnpayRefund;
    private processMomoRefund;
    private processPayosRefund;
    handleWebhook(provider: 'VNPAY' | 'MOMO' | 'PAYOS', payload: any): Promise<{
        RspCode: string;
        Message: string;
    } | {
        resultCode: number;
        message: string;
    } | {
        error: number;
        message: string;
    }>;
    private handleVnpayWebhook;
    private handleMomoWebhook;
    private handlePayosWebhook;
    private markFailed;
}
