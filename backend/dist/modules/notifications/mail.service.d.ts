/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
interface OrderEmailData {
    orderNo: string;
    customerName: string;
    totalAmount: string;
    items: Array<{
        name: string;
        quantity: number;
        price: string;
    }>;
    status: string;
    trackingUrl?: string;
}
export declare class MailService {
    private readonly config;
    private readonly prisma;
    private readonly logger;
    private transporter;
    private from;
    constructor(config: ConfigService, prisma: PrismaService);
    send(to: string, subject: string, text: string, html?: string): unknown;
    private generateOrderConfirmationTemplate;
    private generateOrderStatusTemplate;
    sendOrderConfirmation(to: string, orderData: OrderEmailData): unknown;
    sendEmail(params: {
        to: string;
        subject: string;
        html: string;
        text?: string;
    }): unknown;
    sendOrderStatusUpdate(to: string, orderData: OrderEmailData): unknown;
    sendWelcomeEmail(to: string, customerName: string): unknown;
}
export {};
