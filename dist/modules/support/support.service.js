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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SupportService = class SupportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createArticle(data) {
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
        return article;
    }
    async getArticles(params) {
        const mockArticles = [
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
    async updateArticle(id, data) {
        const articlesResponse = await this.getArticles({});
        const article = articlesResponse.items.find(a => a.id === id);
        if (!article) {
            throw new Error(`Article with id ${id} not found`);
        }
        const updatedArticle = {
            ...article,
            ...data,
            updatedAt: new Date(),
        };
        return updatedArticle;
    }
    async deleteArticle(_id) {
        return;
    }
    async createFAQ(data) {
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
    async getFAQs(category) {
        const mockFAQs = [
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
    async createTicket(data) {
        const ticket = {
            id: `ticket_${Date.now()}`,
            subject: data.subject,
            description: data.description,
            status: 'OPEN',
            priority: data.priority || 'MEDIUM',
            userId: data.userId,
            email: data.email,
            name: data.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return ticket;
    }
    async getTickets(params) {
        const mockTickets = [
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
    async updateTicketStatus(id, status, assignedTo) {
        const ticket = {
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
    async searchKnowledgeBase(query) {
        const mockResults = [
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
        return mockResults.filter(article => article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()));
    }
    async getCategories() {
        return [
            'Hướng dẫn mua hàng',
            'Chính sách',
            'Kỹ thuật',
            'Thanh toán',
            'Giao hàng',
            'Bảo hành',
        ];
    }
    async sendTestEmail(email) {
        return {
            success: false,
            message: `Email notifications are disabled. No message was sent to ${email}.`
        };
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map