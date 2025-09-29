import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentsService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    createIntent(params: {
        orderId: string;
        provider: 'PAYOS' | 'COD';
        returnUrl?: string;
    }): unknown;
    private buildRedirectUrl;
    private createMomoPayment;
    markPaid(provider: 'VNPAY' | 'MOMO' | 'PAYOS', txnRef: string, transactionId?: string): unknown;
    createRefund(paymentId: string, amountCents?: number, reason?: string): unknown;
    private processVnpayRefund;
    private processMomoRefund;
    private processPayosRefund;
    handleWebhook(provider: 'VNPAY' | 'MOMO' | 'PAYOS', payload: any): unknown;
    private handleVnpayWebhook;
    private handleMomoWebhook;
    private handlePayosWebhook;
    private markFailed;
}
