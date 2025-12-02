"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
let MailService = MailService_1 = class MailService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.logger = new common_1.Logger(MailService_1.name);
        try {
            const nodemailer = require('nodemailer');
            const smtpConfig = {
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
            }
            else {
                smtpConfig.tls = { rejectUnauthorized: false };
            }
            this.transporter = nodemailer.createTransport(smtpConfig);
        }
        catch (error) {
            this.logger.error('Failed to create email transporter:', error);
            this.transporter = {
                sendMail: async () => undefined,
            };
        }
        this.from = this.config.get('SMTP_FROM') || 'no-reply@audiotailoc.local';
    }
    async send(to, subject, text, html) {
        if (!this.transporter?.sendMail) {
            this.logger.warn('Email transporter not available');
            return;
        }
        try {
            const mailOptions = {
                from: this.from,
                to,
                subject,
                text,
                html: html || text
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to ${to}: ${subject}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}:`, error);
            throw error;
        }
    }
    generateOrderConfirmationTemplate(data) {
        const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
      </tr>
    `).join('');
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Xác nhận đơn hàng</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">🎵 Audio Tài Lộc</h1>
          </div>

          <h2 style="color: #1f2937;">Xác nhận đơn hàng #${data.orderNo}</h2>

          <p>Xin chào ${data.customerName},</p>
          <p>Cảm ơn bạn đã đặt hàng tại Audio Tài Lộc. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Chi tiết đơn hàng:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #e5e7eb;">
                  <th style="padding: 12px; text-align: left;">Sản phẩm</th>
                  <th style="padding: 12px; text-align: center;">Số lượng</th>
                  <th style="padding: 12px; text-align: right;">Giá</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="text-align: right; margin-top: 15px; font-size: 18px; font-weight: bold;">
              Tổng cộng: ${data.totalAmount}
            </div>
          </div>

          <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao cho đơn vị vận chuyển.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
            <p>Cảm ơn bạn đã tin tưởng Audio Tài Lộc!</p>
            <p>Hotline: 1900-xxxx | Email: support@audiotailoc.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
        const text = `
Xác nhận đơn hàng #${data.orderNo}

Xin chào ${data.customerName},

Cảm ơn bạn đã đặt hàng tại Audio Tài Lộc. Đơn hàng của bạn đã được xác nhận và đang được xử lý.

Chi tiết đơn hàng:
${data.items.map(item => `- ${item.name} x${item.quantity}: ${item.price}`).join('\n')}

Tổng cộng: ${data.totalAmount}

Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao cho đơn vị vận chuyển.

Cảm ơn bạn đã tin tưởng Audio Tài Lộc!
Hotline: 1900-xxxx | Email: support@audiotailoc.com
    `;
        return {
            subject: `Xác nhận đơn hàng #${data.orderNo} - Audio Tài Lộc`,
            html,
            text
        };
    }
    generateOrderStatusTemplate(data) {
        const statusMessages = {
            PAID: 'Đơn hàng đã được thanh toán thành công',
            SHIPPED: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
            DELIVERED: 'Đơn hàng đã được giao thành công',
            CANCELLED: 'Đơn hàng đã bị hủy',
            REFUNDED: 'Đơn hàng đã được hoàn tiền'
        };
        const statusMessage = statusMessages[data.status] || `Trạng thái đơn hàng: ${data.status}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cập nhật đơn hàng</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">🎵 Audio Tài Lộc</h1>
          </div>

          <h2 style="color: #1f2937;">Cập nhật đơn hàng #${data.orderNo}</h2>

          <p>Xin chào ${data.customerName},</p>

          <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">${statusMessage}</h3>
            ${data.trackingUrl ? `<p><a href="${data.trackingUrl}" style="color: #2563eb;">Theo dõi đơn hàng</a></p>` : ''}
          </div>

          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
            <p>Cảm ơn bạn đã tin tưởng Audio Tài Lộc!</p>
            <p>Hotline: 1900-xxxx | Email: support@audiotailoc.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
        const text = `
Cập nhật đơn hàng #${data.orderNo}

Xin chào ${data.customerName},

${statusMessage}

${data.trackingUrl ? `Theo dõi đơn hàng: ${data.trackingUrl}` : ''}

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.

Cảm ơn bạn đã tin tưởng Audio Tài Lộc!
Hotline: 1900-xxxx | Email: support@audiotailoc.com
    `;
        return {
            subject: `Cập nhật đơn hàng #${data.orderNo} - ${statusMessage}`,
            html,
            text
        };
    }
    async sendOrderConfirmation(to, orderData) {
        const template = this.generateOrderConfirmationTemplate(orderData);
        return this.send(to, template.subject, template.text, template.html);
    }
    async sendEmail(params) {
        return this.send(params.to, params.subject, params.text || '', params.html);
    }
    async sendOrderStatusUpdate(to, orderData) {
        const template = this.generateOrderStatusTemplate(orderData);
        return this.send(to, template.subject, template.text, template.html);
    }
    async sendWelcomeEmail(to, customerName) {
        const subject = 'Chào mừng đến với Audio Tài Lộc!';
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Chào mừng</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">🎵 Audio Tài Lộc</h1>
          </div>

          <h2>Chào mừng ${customerName}!</h2>

          <p>Cảm ơn bạn đã đăng ký tài khoản tại Audio Tài Lộc. Chúng tôi rất vui được phục vụ bạn!</p>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Khám phá ngay:</h3>
            <ul>
              <li>Tai nghe cao cấp từ các thương hiệu nổi tiếng</li>
              <li>Loa bluetooth chất lượng cao</li>
              <li>Ampli và thiết bị âm thanh chuyên nghiệp</li>
              <li>Phụ kiện âm thanh đa dạng</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}"
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Khám phá sản phẩm
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
            <p>Hotline: 1900-xxxx | Email: support@audiotailoc.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
        const text = `
Chào mừng ${customerName}!

Cảm ơn bạn đã đăng ký tài khoản tại Audio Tài Lộc. Chúng tôi rất vui được phục vụ bạn!

Khám phá ngay:
- Tai nghe cao cấp từ các thương hiệu nổi tiếng
- Loa bluetooth chất lượng cao
- Ampli và thiết bị âm thanh chuyên nghiệp
- Phụ kiện âm thanh đa dạng

Truy cập: ${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}

Hotline: 1900-xxxx | Email: support@audiotailoc.com
    `;
        return this.send(to, subject, text, html);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], MailService);
//# sourceMappingURL=mail.service.js.map