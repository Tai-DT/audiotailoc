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
    send(to: string, subject: string, text: string, html?: string): Promise<any>;
    private generateOrderConfirmationTemplate;
    private generateOrderStatusTemplate;
    sendOrderConfirmation(to: string, orderData: OrderEmailData): Promise<any>;
    sendEmail(params: {
        to: string;
        subject: string;
        html: string;
        text?: string;
    }): Promise<any>;
    sendOrderStatusUpdate(to: string, orderData: OrderEmailData): Promise<any>;
    sendWelcomeEmail(to: string, customerName: string): Promise<any>;
}
export {};
