import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PayOSService } from './payos.service';
import { TelegramService } from '../notifications/telegram.service';
export declare class PaymentsService {
    private readonly prisma;
    private readonly config;
    private readonly payosService;
    private readonly telegram;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService, payosService: PayOSService, telegram: TelegramService);
    createIntent(params: {
        orderId: string;
        provider: 'PAYOS' | 'COD';
        returnUrl?: string;
    }): Promise<{
        intentId: string;
        redirectUrl: any;
        paymentMethod: string;
    } | {
        intentId: string;
        redirectUrl: string;
        paymentMethod: "PAYOS";
    }>;
    private buildRedirectUrl;
    private createMomoPayment;
    markPaid(provider: 'VNPAY' | 'MOMO' | 'PAYOS', txnRef: string, transactionId?: string): Promise<{
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
