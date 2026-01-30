import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogService } from '../logging/activity-log.service';
import { emailTemplates, OrderEmailData } from './templates/email.templates';
import { invoiceTemplates, InvoiceData } from './templates/invoice.templates';
import * as nodemailer from 'nodemailer';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: any;
  private from: string;
  private lastSentMap = new Map<string, number>();

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly activityLog: ActivityLogService,
  ) {
    this.from = this.config.get('SMTP_FROM') || 'no-reply@audiotailoc.local';
  }

  async onModuleInit() {
    try {
      const smtpConfig: any = {
        host: this.config.get('SMTP_HOST') || 'localhost',
        port: Number(this.config.get('SMTP_PORT') || '1025'),
      };

      const user = this.config.get('SMTP_USER');
      const pass = this.config.get('SMTP_PASS');
      if (user && pass) {
        smtpConfig.auth = { user, pass };
      }

      const secure = this.config.get('SMTP_SECURE') === 'true';
      if (secure) {
        smtpConfig.secure = true;
      } else {
        smtpConfig.tls = { rejectUnauthorized: false };
      }

      this.transporter = nodemailer.createTransport(smtpConfig);
    } catch (error) {
      this.logger.error('Failed to create email transporter:', error);
      this.transporter = {
        sendMail: async () => undefined,
      };
    }
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async send(to: string, subject: string, text: string, html?: string) {
    if (!this.transporter?.sendMail) {
      this.logger.warn('Email transporter not available');
      return;
    }

    // ANTI-SPAM: Rate Limiting
    const now = Date.now();
    const lastSent = this.lastSentMap.get(to) || 0;
    if (now - lastSent < 2000) return;
    this.lastSentMap.set(to, now);

    try {
      const footer = `<hr/><p style="color:#666;font-size:12px">Audio Tài Lộc - Thiết bị âm thanh cao cấp.</p>`;
      const mailOptions = {
        from: this.from,
        to,
        subject,
        text: text + '\n\nAudio Tài Lộc Support',
        html: html ? html + footer : text + footer,
      };

      const result = await this.transporter.sendMail(mailOptions);

      await this.activityLog.logActivity({
        action: 'SEND_EMAIL',
        resource: 'mail',
        resourceId: to,
        details: { subject },
        category: 'notifications',
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  private generateOrderConfirmationTemplate(data: OrderEmailData): EmailTemplate {
    const html = emailTemplates.orderConfirmation(data);
    const text = `Xác nhận đơn hàng #${data.orderNo}\nXin chào ${data.customerName}...`;
    return { subject: `Xác nhận đơn hàng #${data.orderNo} - Audio Tài Lộc`, html, text };
  }

  private generateOrderStatusTemplate(data: OrderEmailData): EmailTemplate {
    const statusMessages = {
      PAID: 'Đã thanh toán',
      SHIPPED: 'Đang giao hàng',
      DELIVERED: 'Đã giao hàng',
      CANCELLED: 'Đã hủy',
    };
    const statusMessage = (statusMessages as any)[data.status] || data.status;
    const html = `<h2>Cập nhật đơn hàng #${data.orderNo}: ${statusMessage}</h2>`;
    return { subject: `Cập nhật đơn hàng #${data.orderNo}`, html, text: statusMessage };
  }

  async sendOrderConfirmation(to: string, orderData: OrderEmailData) {
    const template = this.generateOrderConfirmationTemplate(orderData);
    return this.send(to, template.subject, template.text, template.html);
  }

  async sendEmail(params: { to: string; subject: string; html: string; text?: string }) {
    return this.send(params.to, params.subject, params.text || '', params.html);
  }

  async sendOrderStatusUpdate(to: string, orderData: OrderEmailData) {
    const template = this.generateOrderStatusTemplate(orderData);
    return this.send(to, template.subject, template.text, template.html);
  }

  async sendWelcomeEmail(to: string, customerName: string) {
    const html = emailTemplates.welcome(customerName);
    return this.send(to, 'Chào mừng đến với Audio Tài Lộc!', customerName, html);
  }

  async sendInvoice(to: string, invoiceData: InvoiceData) {
    const html = invoiceTemplates.standard(invoiceData);
    return this.send(to, `Hóa đơn #${invoiceData.invoiceNo}`, 'Invoice attached', html);
  }
}
