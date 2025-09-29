import { SupportService } from './support.service';
declare class CreateArticleDto {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    published?: boolean;
}
declare class CreateFAQDto {
    question: string;
    answer: string;
    category: string;
    order?: number;
    published?: boolean;
}
declare class CreateTicketDto {
    subject: string;
    description: string;
    email: string;
    name: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
declare class UpdateTicketStatusDto {
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    assignedTo?: string;
}
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createArticle(dto: CreateArticleDto): Promise<import("./support.service").KnowledgeBaseArticle>;
    getArticles(category?: string, published?: string, search?: string, page?: string, pageSize?: string): Promise<{
        items: import("./support.service").KnowledgeBaseArticle[];
        totalCount: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    getArticle(id: string): Promise<import("./support.service").KnowledgeBaseArticle>;
    searchKnowledgeBase(query: string): Promise<import("./support.service").KnowledgeBaseArticle[]>;
    getKBCategories(): Promise<string[]>;
    createFAQ(dto: CreateFAQDto): Promise<import("./support.service").FAQ>;
    getFAQs(category?: string): Promise<import("./support.service").FAQ[]>;
    createTicket(dto: CreateTicketDto): Promise<import("./support.service").SupportTicket>;
    getTickets(userId?: string, status?: string, priority?: string, assignedTo?: string, page?: string, pageSize?: string): Promise<{
        items: import("./support.service").SupportTicket[];
        totalCount: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    updateTicketStatus(id: string, dto: UpdateTicketStatusDto): Promise<import("./support.service").SupportTicket>;
    testEmail(body: {
        email: string;
    }): unknown;
}
export {};
