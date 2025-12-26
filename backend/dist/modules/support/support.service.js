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
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../notifications/mail.service");
let SupportService = class SupportService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async createArticle(data) {
        const created = await this.prisma.knowledge_base_entries.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
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
    async getArticles(params) {
        const page = params.page || 1;
        const pageSize = params.pageSize || 10;
        const skip = (page - 1) * pageSize;
        const where = {};
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
        const items = entries.map(e => this.mapEntryToArticle(e));
        const totalPages = Math.ceil(totalCount / pageSize);
        return {
            items,
            totalCount,
            page,
            pageSize,
            totalPages,
        };
    }
    async getArticle(idOrSlug) {
        const entry = await this.prisma.knowledge_base_entries.findUnique({ where: { id: idOrSlug } });
        if (!entry)
            throw new Error('Article not found');
        await this.prisma.knowledge_base_entries.update({
            where: { id: entry.id },
            data: { viewCount: { increment: 1 } },
        });
        const refreshed = await this.prisma.knowledge_base_entries.findUnique({
            where: { id: entry.id },
        });
        return this.mapEntryToArticle(refreshed);
    }
    async updateArticle(id, data) {
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.content !== undefined)
            updateData.content = data.content;
        if (data.category !== undefined)
            updateData.kind = data.category;
        if (data.tags !== undefined)
            updateData.tags = data.tags.join(',');
        if (data.published !== undefined)
            updateData.isActive = data.published;
        const updated = await this.prisma.knowledge_base_entries.update({
            where: { id },
            data: updateData,
        });
        return this.mapEntryToArticle(updated);
    }
    async deleteArticle(id) {
        await this.prisma.knowledge_base_entries.delete({ where: { id } });
        return { success: true };
    }
    async feedback(id, helpful) {
        const updateField = helpful ? 'helpful' : 'notHelpful';
        const updated = await this.prisma.knowledge_base_entries.update({
            where: { id },
            data: { [updateField]: { increment: 1 } },
        });
        return this.mapEntryToArticle(updated);
    }
    mapEntryToArticle(entry) {
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
        return category ? mockFAQs.filter(faq => faq.category === category) : mockFAQs;
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
            take: 10,
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
    async getCategories() {
        const categories = await this.prisma.knowledge_base_entries.findMany({
            where: { isActive: true },
            select: { kind: true },
            distinct: ['kind'],
        });
        return categories.map(cat => cat.kind);
    }
    async sendTestEmail(email) {
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
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], SupportService);
//# sourceMappingURL=support.service.js.map