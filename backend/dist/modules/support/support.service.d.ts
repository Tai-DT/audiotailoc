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
export declare class SupportService {
    private readonly prisma;
    private readonly mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    createArticle(data: {
        title: string;
        content: string;
        category: string;
        tags?: string[];
        published?: boolean;
        slug?: string;
    }): Promise<KnowledgeBaseArticle>;
    getArticles(params: {
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
    }>;
    getArticle(idOrSlug: string): Promise<KnowledgeBaseArticle>;
    updateArticle(id: string, data: {
        title?: string;
        content?: string;
        category?: string;
        tags?: string[];
        published?: boolean;
        slug?: string;
    }): Promise<KnowledgeBaseArticle>;
    deleteArticle(id: string): Promise<{
        success: boolean;
    }>;
    feedback(id: string, helpful: boolean): Promise<KnowledgeBaseArticle>;
    private mapEntryToArticle;
    createFAQ(data: {
        question: string;
        answer: string;
        category: string;
        order?: number;
        published?: boolean;
    }): Promise<FAQ>;
    getFAQs(category?: string): Promise<FAQ[]>;
    createTicket(data: {
        subject: string;
        description: string;
        email: string;
        name: string;
        userId?: string;
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    }): Promise<SupportTicket>;
    getTickets(params: {
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
    }>;
    updateTicketStatus(id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED', assignedTo?: string): Promise<SupportTicket>;
    private mapPrismaTicketToInterface;
    searchKnowledgeBase(query: string): Promise<KnowledgeBaseArticle[]>;
    getCategories(): Promise<string[]>;
    sendTestEmail(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
