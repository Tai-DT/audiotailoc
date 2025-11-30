import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { MailService } from './mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { emailTemplates } from './templates/email.templates';
import { invoiceTemplates } from './templates/invoice.templates';

interface EmailTemplateData {
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  type: 'transactional' | 'promotional' | 'security';
  category: string;
}

interface SendEmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  template?: string;
}

@Controller('email')
@UseGuards(JwtGuard)
export class EmailController {
  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('templates')
  async getEmailTemplates(
    @Query() query: { type?: string; category?: string; page?: string; limit?: string },
  ) {
    try {
      // Real templates from our template files
      const templates = [
        {
          id: 'welcome',
          name: 'Email chào mừng',
          type: 'transactional',
          category: 'onboarding',
          subject: 'Chào mừng đến với Audio Tài Lộc',
          lastModified: new Date(),
          usage: 0,
          isActive: true,
        },
        {
          id: 'orderConfirmation',
          name: 'Xác nhận đơn hàng',
          type: 'transactional',
          category: 'orders',
          subject: 'Xác nhận đơn hàng - Audio Tài Lộc',
          lastModified: new Date(),
          usage: 0,
          isActive: true,
        },
        {
          id: 'invoice',
          name: 'Hóa đơn điện tử',
          type: 'transactional',
          category: 'invoices',
          subject: 'Hóa đơn mua hàng - Audio Tài Lộc',
          lastModified: new Date(),
          usage: 0,
          isActive: true,
        },
      ];

      return {
        success: true,
        data: templates,
        meta: {
          total: templates.length,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch email templates' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('templates/:id')
  async getEmailTemplate(@Param('id') id: string) {
    try {
      let htmlContent = '';
      let subject = '';
      let name = '';

      // Generate preview data based on template ID
      switch (id) {
        case 'welcome':
          name = 'Email chào mừng';
          subject = 'Chào mừng đến với Audio Tài Lộc';
          htmlContent = emailTemplates.welcome('Nguyễn Văn A');
          break;
        case 'orderConfirmation':
          name = 'Xác nhận đơn hàng';
          subject = 'Xác nhận đơn hàng #ORD-123456';
          htmlContent = emailTemplates.orderConfirmation({
            orderNo: 'ORD-123456',
            customerName: 'Nguyễn Văn A',
            totalAmount: '8.500.000 ₫',
            items: [
              { name: 'Loa Bluetooth Sony', quantity: 1, price: '2.500.000 ₫' },
              { name: 'Tai nghe Marshall', quantity: 2, price: '3.000.000 ₫' },
            ],
            status: 'PENDING',
            shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
            paymentMethod: 'Thanh toán khi nhận hàng (COD)',
            createdAt: new Date().toLocaleString('vi-VN'),
          });
          break;
        case 'invoice':
          name = 'Hóa đơn điện tử';
          subject = 'Hóa đơn #INV-2023-001';
          htmlContent = invoiceTemplates.standard({
            orderNo: 'ORD-2023-001',
            status: 'completed',
            invoiceNo: 'INV-2023-001',
            invoiceDate: new Date().toLocaleDateString('vi-VN'),
            customerName: 'Công ty TNHH ABC',
            companyAddress: '456 Đường XYZ, Quận 3, TP.HCM',
            taxCode: '0123456789',
            items: [
              {
                name: 'Loa Bluetooth Sony',
                quantity: 1,
                price: '2.500.000 ₫',
                
              },
              {
                name: 'Tai nghe Marshall',
                quantity: 2,
                price: '3.000.000 ₫',
                
              },
            ],
            subTotal: '8.500.000 ₫',
            taxAmount: '850.000 ₫',
            totalAmount: '9.350.000 ₫',
            paymentMethod: 'Chuyển khoản',
          });
          break;
        default:
          throw new HttpException(
            { success: false, message: 'Template not found' },
            HttpStatus.NOT_FOUND,
          );
      }

      return {
        success: true,
        data: {
          id,
          name,
          subject,
          htmlContent,
          type: 'transactional',
          category: 'system',
          lastModified: new Date(),
          isActive: true,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { success: false, message: 'Failed to fetch email template' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('templates')
  async createEmailTemplate(@Body() data: EmailTemplateData) {
    try {
      // Mock creation - in real app, save to database
      const newTemplate = {
        id: Date.now().toString(),
        ...data,
        lastModified: new Date(),
        usage: 0,
        isActive: true,
      };

      return {
        success: true,
        data: newTemplate,
        message: 'Email template created successfully',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to create email template' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('templates/:id')
  async updateEmailTemplate(@Param('id') id: string, @Body() data: Partial<EmailTemplateData>) {
    try {
      // Mock update - in real app, update in database
      return {
        success: true,
        data: {
          id,
          ...data,
          lastModified: new Date(),
        },
        message: 'Email template updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to update email template' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('templates/:id')
  async deleteEmailTemplate(@Param('id') _id: string) {
    try {
      // Mock deletion - in real app, delete from database
      return {
        success: true,
        message: 'Email template deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to delete email template' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('history')
  async getEmailHistory(
    @Query()
    query: {
      status?: string;
      type?: string;
      template?: string;
      startDate?: string;
      endDate?: string;
      page?: string;
      limit?: string;
    },
  ) {
    try {
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '50');
      const skip = (page - 1) * limit;

      // Mock email history - in real app, this would come from database
      const mockEmails = [
        {
          id: '1',
          subject: 'Đơn hàng của bạn đã được xác nhận',
          to: 'nguyenvana@example.com',
          from: 'orders@audiotailoc.com',
          status: 'sent',
          type: 'order_confirmation',
          priority: 'normal',
          sentAt: new Date('2024-01-15T14:30:00Z'),
          opened: true,
          clicked: false,
          template: 'order-confirmation',
        },
        {
          id: '2',
          subject: 'Khuyến mãi đặc biệt - Giảm giá 30%',
          to: 'tranthib@example.com',
          from: 'marketing@audiotailoc.com',
          status: 'delivered',
          type: 'promotional',
          priority: 'high',
          sentAt: new Date('2024-01-15T13:45:00Z'),
          opened: false,
          clicked: false,
          template: 'promotion-discount',
        },
        {
          id: '3',
          subject: 'Đơn hàng của bạn đang được giao',
          to: 'levanc@example.com',
          from: 'orders@audiotailoc.com',
          status: 'sent',
          type: 'shipping_notification',
          priority: 'normal',
          sentAt: new Date('2024-01-15T12:20:00Z'),
          opened: true,
          clicked: true,
          template: 'shipping-update',
        },
        {
          id: '4',
          subject: 'Cập nhật mật khẩu thành công',
          to: 'phamthid@example.com',
          from: 'security@audiotailoc.com',
          status: 'failed',
          type: 'security',
          priority: 'high',
          sentAt: new Date('2024-01-15T11:15:00Z'),
          opened: false,
          clicked: false,
          template: 'password-reset',
          error: 'Invalid email address',
        },
      ];

      // Filter emails
      let filteredEmails = mockEmails;
      if (query.status) {
        filteredEmails = filteredEmails.filter(e => e.status === query.status);
      }
      if (query.type) {
        filteredEmails = filteredEmails.filter(e => e.type === query.type);
      }
      if (query.template) {
        filteredEmails = filteredEmails.filter(e => e.template === query.template);
      }
      if (query.startDate) {
        const startDate = new Date(query.startDate);
        filteredEmails = filteredEmails.filter(e => new Date(e.sentAt) >= startDate);
      }
      if (query.endDate) {
        const endDate = new Date(query.endDate);
        filteredEmails = filteredEmails.filter(e => new Date(e.sentAt) <= endDate);
      }

      // Paginate
      const paginatedEmails = filteredEmails.slice(skip, skip + limit);

      return {
        success: true,
        data: paginatedEmails,
        meta: {
          total: filteredEmails.length,
          page,
          limit,
          totalPages: Math.ceil(filteredEmails.length / limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch email history' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('send')
  async sendEmail(@Body() data: SendEmailData) {
    try {
      await this.mailService.sendEmail({
        to: data.to,
        subject: data.subject,
        html: data.htmlContent,
        text: data.textContent,
      });

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to send email' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  async getEmailStats(@Query() _query: { startDate?: string; endDate?: string }) {
    try {
      // Mock email statistics
      const stats = {
        totalEmails: 15420,
        sentToday: 1247,
        delivered: 14250,
        failed: 170,
        openRate: 34.2,
        clickRate: 12.8,
        templates: 15,
        bounceRate: 1.1,
        complaintRate: 0.2,
        spamComplaints: 3,
        uniqueOpens: 5238,
        uniqueClicks: 1987,
        averageSendTime: 2.3, // seconds
        topPerformingTemplates: [
          { id: 'order-confirmation', name: 'Xác nhận đơn hàng', openRate: 45.2, clickRate: 18.7 },
          { id: 'welcome-email', name: 'Email chào mừng', openRate: 38.9, clickRate: 22.1 },
          {
            id: 'promotion-discount',
            name: 'Khuyến mãi giảm giá',
            openRate: 29.4,
            clickRate: 15.8,
          },
        ],
        emailTypeBreakdown: {
          transactional: 65,
          promotional: 25,
          security: 10,
        },
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch email statistics' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('settings')
  async getEmailSettings() {
    try {
      // Mock email settings - in real app, fetch from database
      const settings = {
        smtp: {
          host: process.env.SMTP_HOST || 'localhost',
          port: parseInt(process.env.SMTP_PORT || '1025'),
          secure: process.env.SMTP_SECURE === 'true',
          user: process.env.SMTP_USER || '',
          from: process.env.SMTP_FROM || 'no-reply@audiotailoc.local',
        },
        limits: {
          dailyLimit: 10000,
          hourlyLimit: 500,
          burstLimit: 100,
        },
        tracking: {
          enabled: true,
          trackOpens: true,
          trackClicks: true,
          trackUnsubscribes: true,
        },
        security: {
          dkim: {
            enabled: false,
            domain: '',
            selector: '',
          },
          spf: {
            enabled: true,
            record: 'v=spf1 include:_spf.audiotailoc.com ~all',
          },
        },
      };

      return {
        success: true,
        data: settings,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to fetch email settings' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('settings')
  async updateEmailSettings(@Body() settings: any) {
    try {
      // Mock update - in real app, save to database
      return {
        success: true,
        data: settings,
        message: 'Email settings updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to update email settings' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
