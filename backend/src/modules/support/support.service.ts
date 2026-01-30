import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  userId?: string;
  email: string;
  name: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // FAQ Management
  async createFAQ(data: {
    question: string;
    answer: string;
    category: string;
    order?: number;
    published?: boolean;
  }): Promise<FAQ> {
    const faq = await this.prisma.faqs.create({
      data: {
        id: randomUUID(),
        question: data.question,
        answer: data.answer,
        category: data.category,
        displayOrder: data.order || 0,
        isActive: data.published ?? false,
        updatedAt: new Date(),
      },
    });

    return {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      order: faq.displayOrder,
      published: faq.isActive,
      createdAt: faq.createdAt,
      updatedAt: faq.updatedAt,
    };
  }

  async getFAQs(category?: string): Promise<FAQ[]> {
    // Query from database
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    const faqs = await this.prisma.faqs.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      order: faq.displayOrder,
      published: faq.isActive,
      createdAt: faq.createdAt,
      updatedAt: faq.updatedAt,
    }));
  }

  // Support Ticket Management
  async createTicket(data: {
    subject: string;
    description: string;
    email: string;
    name: string;
    userId?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }): Promise<SupportTicket> {
    const ticket = await this.prisma.support_tickets.create({
      data: {
        id: randomUUID(),
        subject: data.subject,
        description: data.description,
        status: 'OPEN',
        priority: data.priority || 'MEDIUM',
        userId: data.userId || null,
        email: data.email,
        name: data.name,
        updatedAt: new Date(),
      },
    });

    // Send confirmation email
    try {
      await this.mailService.sendEmail({
        to: data.email,
        subject: `[Support Ticket #${ticket.id.substring(0, 8)}] ${data.subject}`,
        text: `Xin chào ${data.name},\n\nChúng tôi đã nhận được yêu cầu hỗ trợ của bạn với tiêu đề: "${data.subject}". Đội ngũ hỗ trợ của Audio Tài Lộc sẽ phản hồi bạn trong thời gian sớm nhất.\n\nTrân trọng,\nAudio Tài Lộc Support Team.`,
        html: `<h3>Xin chào ${data.name},</h3><p>Chúng tôi đã nhận được yêu cầu hỗ trợ của bạn với tiêu đề: <b>"${data.subject}"</b>.</p><p>Đội ngũ hỗ trợ của Audio Tài Lộc sẽ phản hồi bạn trong thời gian sớm nhất.</p><br/><p>Trân trọng,<br/>Audio Tài Lộc Support Team.</p>`,
      });
      this.logger.log(`Ticket confirmation email sent to ${data.email}`);
    } catch (error) {
      this.logger.error(`Failed to send ticket confirmation email to ${data.email}`, error);
    }

    return {
      id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
      priority: ticket.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      userId: ticket.userId || undefined,
      email: ticket.email,
      name: ticket.name,
      assignedTo: ticket.assignedTo || undefined,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  async getTickets(params: {
    userId?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    items: SupportTicket[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const skip = (page - 1) * pageSize;

    // Build where clause from database
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    if (params.assignedTo) where.assignedTo = params.assignedTo;

    const [tickets, totalCount] = await Promise.all([
      this.prisma.support_tickets.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.support_tickets.count({ where }),
    ]);

    const items: SupportTicket[] = tickets.map(t => ({
      id: t.id,
      subject: t.subject,
      description: t.description,
      status: t.status as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
      priority: t.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      userId: t.userId || undefined,
      email: t.email,
      name: t.name,
      assignedTo: t.assignedTo || undefined,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  async updateTicketStatus(
    id: string,
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
    assignedTo?: string,
  ): Promise<SupportTicket> {
    // Update in database
    const updateData: any = { status, updatedAt: new Date() };
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
    }

    const updated = await this.prisma.support_tickets.update({
      where: { id },
      data: updateData,
    });

    return {
      id: updated.id,
      subject: updated.subject,
      description: updated.description,
      status: updated.status as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
      priority: updated.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      userId: updated.userId || undefined,
      email: updated.email,
      name: updated.name,
      assignedTo: updated.assignedTo || undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async sendTestEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const testOrderData = {
        orderNo: `TEST-${Date.now()}`,
        customerName: 'Test Customer',
        totalAmount: '1.000.000 VNĐ',
        items: [
          {
            name: 'Test Audio Equipment',
            quantity: 1,
            price: '1.000.000 VNĐ',
          },
        ],
        status: 'PENDING',
      };

      await this.mailService.sendOrderConfirmation(email, testOrderData);
      return { success: true, message: `Test email sent successfully to ${email}` };
    } catch (error) {
      return {
        success: false,
        message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
