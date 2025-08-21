import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    private readonly mailService: MailService
  ) {}

  // Knowledge Base Management
  async createArticle(data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    published?: boolean;
  }): Promise<KnowledgeBaseArticle> {
    // In a real implementation, this would use a proper KB table
    // For now, we'll simulate the structure
    const article = {
      id: `kb_${Date.now()}`,
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      published: data.published || false,
      viewCount: 0,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in a simple way for demo (in real app, use proper database table)
    return article;
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
    // Mock data for demonstration
    const mockArticles: KnowledgeBaseArticle[] = [
      {
        id: 'kb_1',
        title: 'Cách chọn tai nghe phù hợp',
        content: 'Hướng dẫn chi tiết về cách chọn tai nghe phù hợp với nhu cầu...',
        category: 'Hướng dẫn mua hàng',
        tags: ['tai nghe', 'hướng dẫn'],
        published: true,
        viewCount: 150,
        helpful: 12,
        notHelpful: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'kb_2',
        title: 'Chính sách bảo hành sản phẩm',
        content: 'Thông tin về chính sách bảo hành và hỗ trợ sau bán hàng...',
        category: 'Chính sách',
        tags: ['bảo hành', 'chính sách'],
        published: true,
        viewCount: 89,
        helpful: 8,
        notHelpful: 1,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalCount = mockArticles.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items: mockArticles,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  async getArticle(id: string): Promise<KnowledgeBaseArticle> {
    // Mock implementation
    const mockArticle: KnowledgeBaseArticle = {
      id,
      title: 'Cách chọn tai nghe phù hợp',
      content: 'Hướng dẫn chi tiết về cách chọn tai nghe phù hợp với nhu cầu...',
      category: 'Hướng dẫn mua hàng',
      tags: ['tai nghe', 'hướng dẫn'],
      published: true,
      viewCount: 150,
      helpful: 12,
      notHelpful: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    return mockArticle;
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

    return category 
      ? mockFAQs.filter(faq => faq.category === category)
      : mockFAQs;
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
      priority: data.priority || 'MEDIUM' as const,
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
    assignedTo?: string
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
    // Mock search results
    const mockResults: KnowledgeBaseArticle[] = [
      {
        id: 'kb_1',
        title: 'Cách chọn tai nghe phù hợp',
        content: 'Hướng dẫn chi tiết về cách chọn tai nghe phù hợp với nhu cầu...',
        category: 'Hướng dẫn mua hàng',
        tags: ['tai nghe', 'hướng dẫn'],
        published: true,
        viewCount: 150,
        helpful: 12,
        notHelpful: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    return mockResults.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getCategories(): Promise<string[]> {
    return [
      'Hướng dẫn mua hàng',
      'Chính sách',
      'Kỹ thuật',
      'Thanh toán',
      'Giao hàng',
      'Bảo hành',
    ];
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
            price: '1.000.000 VNĐ'
          }
        ],
        status: 'PENDING'
      };

      await this.mailService.sendOrderConfirmation(email, testOrderData);
      return { success: true, message: `Test email sent successfully to ${email}` };
    } catch (error) {
      return { success: false, message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }
}
