import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  viewCount: number;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // Knowledge Base Management
  async createArticle(data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    published?: boolean;
    slug?: string;
  }): Promise<KnowledgeBaseArticle> {
    const created = await this.prisma.knowledge_base_entries.create({
      data: {
        id: randomUUID(),
        title: data.title,
        content: data.content,
        kind: data.category,
        tags: data.tags?.join(',') || null,
        isActive: data.published ?? false,
        updatedAt: new Date(),
      },
    });

    return this.mapEntryToArticle(created);
  }

  async getArticles(params: {
    category?: string;
    published?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    items: KnowledgeBaseArticle[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (params.published !== undefined) {
      where.isActive = params.published;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { content: { contains: params.search, mode: 'insensitive' } },
        { tags: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.category) {
      where.kind = params.category;
    }

    const [entries, totalCount] = await Promise.all([
      this.prisma.knowledge_base_entries.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.knowledge_base_entries.count({ where }),
    ]);

    const items: KnowledgeBaseArticle[] = entries.map(e => this.mapEntryToArticle(e));

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  async getArticle(idOrSlug: string): Promise<KnowledgeBaseArticle> {
    const entry = await this.prisma.knowledge_base_entries.findUnique({ where: { id: idOrSlug } });
    if (!entry) throw new Error('Article not found');
    // increment view count
    await this.prisma.knowledge_base_entries.update({
      where: { id: entry.id },
      data: { viewCount: { increment: 1 } },
    });
    const refreshed = await this.prisma.knowledge_base_entries.findUnique({
      where: { id: entry.id },
    });
    return this.mapEntryToArticle(refreshed!);
  }

  async updateArticle(
    id: string,
    data: {
      title?: string;
      content?: string;
      category?: string;
      tags?: string[];
      published?: boolean;
      slug?: string;
    },
  ): Promise<KnowledgeBaseArticle> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.category !== undefined) updateData.kind = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags.join(',');
    if (data.published !== undefined) updateData.isActive = data.published;
    // slug not yet enforced in persistence step (pending migration / generation)
    const updated = await this.prisma.knowledge_base_entries.update({
      where: { id },
      data: updateData,
    });
    return this.mapEntryToArticle(updated);
  }

  async deleteArticle(id: string): Promise<{ success: boolean }> {
    await this.prisma.knowledge_base_entries.delete({ where: { id } });
    return { success: true };
  }

  async feedback(id: string, helpful: boolean): Promise<KnowledgeBaseArticle> {
    const updateField = helpful ? 'helpful' : 'notHelpful';
    const updated = await this.prisma.knowledge_base_entries.update({
      where: { id },
      data: { [updateField]: { increment: 1 } },
    });
    return this.mapEntryToArticle(updated);
  }

  private mapEntryToArticle(entry: any): KnowledgeBaseArticle {
    return {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      category: entry.kind,
      tags: entry.tags ? entry.tags.split(',').filter(Boolean) : [],
      published: entry.isActive,
      viewCount: entry.viewCount ?? 0,
      helpful: entry.helpful ?? 0,
      notHelpful: entry.notHelpful ?? 0,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }

  // FAQ Management
  async createFAQ(data: {
    question: string;
    answer: string;
    category: string;
    order?: number;
    published?: boolean;
  }): Promise<FAQ> {
    const faq = {
      id: `faq_${Date.now()}`,
      question: data.question,
      answer: data.answer,
      category: data.category,
      order: data.order || 0,
      published: data.published || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return faq;
  }

  async getFAQs(category?: string): Promise<FAQ[]> {
    // Mock data
    const mockFAQs: FAQ[] = [
      {
        id: 'faq_1',
        question: 'Làm thế nào để đặt hàng?',
        answer: 'Bạn có thể đặt hàng bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.',
        category: 'Đặt hàng',
        order: 1,
        published: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'faq_2',
        question: 'Thời gian giao hàng là bao lâu?',
        answer: 'Thời gian giao hàng thông thường là 2-3 ngày làm việc trong nội thành.',
        category: 'Giao hàng',
        order: 1,
        published: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    return category ? mockFAQs.filter(faq => faq.category === category) : mockFAQs;
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
    const ticket = {
      id: `ticket_${Date.now()}`,
      subject: data.subject,
      description: data.description,
      status: 'OPEN' as const,
      priority: data.priority || ('MEDIUM' as const),
      userId: data.userId,
      email: data.email,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In real implementation, save to database and send notifications
    return ticket;
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
    // Mock data
    const mockTickets: SupportTicket[] = [
      {
        id: 'ticket_1',
        subject: 'Sản phẩm bị lỗi',
        description: 'Tai nghe bị hỏng sau 1 tuần sử dụng',
        status: 'OPEN',
        priority: 'HIGH',
        email: 'customer@example.com',
        name: 'Nguyễn Văn A',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalCount = mockTickets.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items: mockTickets,
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
    // Mock implementation
    const ticket: SupportTicket = {
      id,
      subject: 'Sản phẩm bị lỗi',
      description: 'Tai nghe bị hỏng sau 1 tuần sử dụng',
      status,
      priority: 'HIGH',
      email: 'customer@example.com',
      name: 'Nguyễn Văn A',
      assignedTo,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    };

    return ticket;
  }

  // Search functionality
  async searchKnowledgeBase(query: string): Promise<KnowledgeBaseArticle[]> {
    const entries = await this.prisma.knowledge_base_entries.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit search results
    });

    return entries.map(entry => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      category: entry.kind,
      tags: entry.tags ? entry.tags.split(',').filter(Boolean) : [],
      published: entry.isActive,
      viewCount: 0,
      helpful: 0,
      notHelpful: 0,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.knowledge_base_entries.findMany({
      where: { isActive: true },
      select: { kind: true },
      distinct: ['kind'],
    });

    return categories.map(cat => cat.kind);
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
