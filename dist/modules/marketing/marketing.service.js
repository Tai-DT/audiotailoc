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
var MarketingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let MarketingService = MarketingService_1 = class MarketingService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MarketingService_1.name);
    }
    async getCampaignss(status) {
        try {
            const where = status ? { status } : {};
            const campaignss = await this.prisma.campaigns.findMany({
                where,
                include: {
                    template: true,
                    campaign_recipients: true,
                    campaign_opens: true,
                    campaign_clicks: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            const transformed = campaignss.map((campaigns) => this.transformCampaigns(campaigns));
            const stats = this.buildCampaignsStats(transformed);
            return {
                campaignss: transformed,
                stats,
            };
        }
        catch (error) {
            this.logger.error('Failed to load campaignss', error);
            return {
                campaignss: [],
                stats: {
                    totalCampaignss: 0,
                    activeCampaignss: 0,
                    sentCampaignss: 0,
                    totalRecipients: 0,
                    averageOpenRate: 0,
                    averageClickRate: 0,
                    totalRevenue: 0,
                    conversionRate: 0,
                },
            };
        }
    }
    async getCampaigns(id) {
        const campaigns = await this.prisma.campaigns.findUnique({
            where: { id },
            include: {
                template: true,
                campaign_recipients: true,
                campaign_opens: true,
                campaign_clicks: true,
            },
        });
        if (!campaigns) {
            throw new common_1.NotFoundException('Campaigns not found');
        }
        const transformed = this.transformCampaigns(campaigns);
        const stats = this.buildCampaignsStats([transformed]);
        return {
            campaigns: transformed,
            stats,
        };
    }
    async createCampaigns(data) {
        if (data.templateId) {
            await this.ensureTemplateExists(data.templateId);
        }
        const campaigns = await this.prisma.campaigns.create({
            data: {
                name: data.name,
                description: data.description,
                type: data.type,
                targetAudience: data.targetAudience,
                discountPercent: data.discountPercent ?? null,
                discountAmount: data.discountAmount ?? null,
                subject: data.subject,
                content: data.content,
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
                templateId: data.templateId ?? null,
                createdBy: data.createdBy ?? 'system',
                status: data.scheduledAt ? client_1.CampaignStatus.SCHEDULED : client_1.CampaignStatus.DRAFT,
            },
            include: {
                template: true,
                campaign_recipients: true,
                campaign_opens: true,
                campaign_clicks: true,
            },
        });
        this.logger.log(`Campaigns created: ${campaigns.id}`);
        return this.transformCampaigns(campaigns);
    }
    async updateCampaigns(id, data) {
        if (data.templateId) {
            await this.ensureTemplateExists(data.templateId);
        }
        const updateData = {
            ...('name' in data ? { name: data.name } : {}),
            ...('description' in data ? { description: data.description } : {}),
            ...('type' in data ? { type: data.type } : {}),
            ...('targetAudience' in data ? { targetAudience: data.targetAudience } : {}),
            ...('discountPercent' in data ? { discountPercent: data.discountPercent } : {}),
            ...('discountAmount' in data ? { discountAmount: data.discountAmount } : {}),
            ...('subject' in data ? { subject: data.subject } : {}),
            ...('content' in data ? { content: data.content } : {}),
            ...('templateId' in data ? { templateId: data.templateId } : {}),
            ...('status' in data ? { status: data.status } : {}),
            ...('createdBy' in data ? { createdBy: data.createdBy } : {}),
        };
        if ('startDate' in data) {
            updateData.startDate = data.startDate ? new Date(data.startDate) : null;
        }
        if ('endDate' in data) {
            updateData.endDate = data.endDate ? new Date(data.endDate) : null;
        }
        if ('scheduledAt' in data) {
            updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
        }
        const campaigns = await this.prisma.campaigns.update({
            where: { id },
            data: updateData,
            include: {
                template: true,
                campaign_recipients: true,
                campaign_opens: true,
                campaign_clicks: true,
            },
        });
        this.logger.log(`Campaigns updated: ${id}`);
        return this.transformCampaigns(campaigns);
    }
    async deleteCampaigns(id) {
        await this.prisma.campaigns.delete({ where: { id } });
        this.logger.log(`Campaigns deleted: ${id}`);
        return { message: 'Campaigns deleted successfully' };
    }
    async duplicateCampaigns(id) {
        const original = await this.prisma.campaigns.findUnique({ where: { id } });
        if (!original) {
            throw new common_1.NotFoundException('Campaigns not found');
        }
        const duplicated = await this.prisma.campaigns.create({
            data: {
                name: `${original.name} (Copy)`
                    .trim()
                    .slice(0, 120),
                description: original.description,
                type: original.type,
                status: client_1.CampaignStatus.DRAFT,
                targetAudience: original.targetAudience,
                discountPercent: original.discountPercent,
                discountAmount: original.discountAmount,
                subject: original.subject,
                content: original.content,
                templateId: original.templateId,
                createdBy: original.createdBy ?? 'system',
            },
            include: {
                template: true,
                campaign_recipients: true,
                campaign_opens: true,
                campaign_clicks: true,
            },
        });
        this.logger.log(`Campaigns duplicated: ${duplicated.id} from ${id}`);
        return this.transformCampaigns(duplicated);
    }
    async scheduleCampaigns(id, scheduledAt) {
        const scheduledDate = new Date(scheduledAt);
        if (Number.isNaN(scheduledDate.getTime())) {
            throw new common_1.BadRequestException('Invalid scheduledAt value');
        }
        const campaigns = await this.prisma.campaigns.update({
            where: { id },
            data: {
                status: client_1.CampaignStatus.SCHEDULED,
                scheduledAt: scheduledDate,
            },
            include: {
                template: true,
                campaign_recipients: true,
                campaign_opens: true,
                campaign_clicks: true,
            },
        });
        this.logger.log(`Campaigns scheduled: ${id} at ${scheduledDate.toISOString()}`);
        return this.transformCampaigns(campaigns);
    }
    async sendCampaigns(id) {
        const campaigns = await this.prisma.campaigns.findUnique({
            where: { id },
            include: {
                template: true,
                campaign_recipients: true,
                campaign_opens: true,
                campaign_clicks: true,
            },
        });
        if (!campaigns) {
            throw new common_1.NotFoundException('Campaigns not found');
        }
        const recipients = await this.getTargetAudience(campaigns.targetAudience);
        if (!recipients.length) {
            this.logger.warn(`Campaigns ${id} has no recipients.`);
        }
        await this.prisma.campaign_recipients.createMany({
            data: recipients.map((recipient) => ({
                campaignId: campaigns.id,
                email: recipient.email,
                name: recipient.name ?? null,
            })),
            skipDuplicates: true,
        });
        switch (campaigns.type) {
            case client_1.CampaignType.EMAIL:
                await this.sendEmailCampaigns(campaigns, recipients);
                break;
            case client_1.CampaignType.SMS:
                await this.sendSMSCampaigns(campaigns, recipients);
                break;
            case client_1.CampaignType.PUSH:
                await this.sendPushCampaigns(campaigns, recipients);
                break;
            case client_1.CampaignType.SOCIAL:
                await this.sendSocialCampaigns(campaigns);
                break;
        }
        await this.prisma.campaigns.update({
            where: { id },
            data: {
                status: client_1.CampaignStatus.SENT,
                sentAt: new Date(),
                scheduledAt: null,
            },
        });
        if (campaigns.templateId) {
            await this.prisma.emailTemplate.update({
                where: { id: campaigns.templateId },
                data: {
                    usageCount: { increment: recipients.length || 1 },
                },
            });
        }
        this.logger.log(`Campaigns sent: ${id} to ${recipients.length} recipients`);
        return {
            message: 'Campaigns sent successfully',
            recipientCount: recipients.length,
        };
    }
    async getCampaignsStats(id) {
        const campaigns = await this.prisma.campaigns.findUnique({
            where: { id },
            include: {
                campaign_recipients: true,
                campaign_opens: true,
                campaign_clicks: true,
            },
        });
        if (!campaigns) {
            throw new common_1.NotFoundException('Campaigns not found');
        }
        const stats = {
            totalRecipients: campaigns.campaign_recipients.length,
            totalOpens: campaigns.campaign_opens.length,
            totalClicks: campaigns.campaign_clicks.length,
            openRate: campaigns.campaign_recipients.length > 0
                ? Number(((campaigns.campaign_opens.length / campaigns.campaign_recipients.length) * 100).toFixed(2))
                : 0,
            clickRate: campaigns.campaign_recipients.length > 0
                ? Number(((campaigns.campaign_clicks.length / campaigns.campaign_recipients.length) * 100).toFixed(2))
                : 0,
            conversionRate: 0,
        };
        return stats;
    }
    async getEmailTemplates() {
        const templates = await this.prisma.emailTemplate.findMany({
            orderBy: { updatedAt: 'desc' },
        });
        return {
            templates: templates.map((template) => this.transformTemplate(template)),
        };
    }
    async getEmailTemplate(id) {
        const template = await this.prisma.emailTemplate.findUnique({ where: { id } });
        if (!template) {
            throw new common_1.NotFoundException('Email template not found');
        }
        return this.transformTemplate(template);
    }
    async createEmailTemplate(data) {
        const template = await this.prisma.emailTemplate.create({
            data: {
                name: data.name,
                description: data.description,
                category: data.category,
                subject: data.subject,
                content: data.content,
                isActive: data.isActive ?? true,
            },
        });
        this.logger.log(`Email template created: ${template.id}`);
        return this.transformTemplate(template);
    }
    async updateEmailTemplate(id, data) {
        const template = await this.prisma.emailTemplate.update({
            where: { id },
            data,
        });
        this.logger.log(`Email template updated: ${id}`);
        return this.transformTemplate(template);
    }
    async deleteEmailTemplate(id) {
        await this.prisma.emailTemplate.delete({ where: { id } });
        this.logger.log(`Email template deleted: ${id}`);
        return { message: 'Email template deleted successfully' };
    }
    async getEmailStats(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [totalEmails, sentEmails, failedEmails] = await Promise.all([
            this.prisma.email_logs.count({ where }),
            this.prisma.email_logs.count({ where: { ...where, status: 'SENT' } }),
            this.prisma.email_logs.count({ where: { ...where, status: 'FAILED' } }),
        ]);
        return {
            totalEmails,
            sentEmails,
            failedEmails,
            successRate: totalEmails > 0 ? Number(((sentEmails / totalEmails) * 100).toFixed(2)) : 0,
        };
    }
    async sendEmail(data) {
        if (data.templateId) {
            const template = await this.prisma.emailTemplate.findUnique({ where: { id: data.templateId } });
            if (template) {
            }
        }
        this.logger.log(`Manual email send skipped for ${data.recipients.length} recipients (notification system disabled).`);
        return {
            total: data.recipients.length,
            sent: 0,
            failed: 0,
            results: data.recipients.map((email) => ({ email, status: 'skipped' })),
        };
    }
    async getAudienceSegments() {
        return [
            {
                id: 'new-customers',
                name: 'New Customers',
                description: 'Customers who registered in the last 30 days',
                count: await this.prisma.users.count({
                    where: {
                        role: 'USER',
                        createdAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                        },
                    },
                }),
            },
            {
                id: 'returning-customers',
                name: 'Returning Customers',
                description: 'Customers with more than 1 order',
                count: await this.prisma.users.count({
                    where: {
                        role: 'USER',
                        orders: {
                            some: {},
                        },
                    },
                }),
            },
            {
                id: 'high-value',
                name: 'High Value Customers',
                description: 'Customers who spent more than 5M VND',
                count: 0,
            },
            {
                id: 'inactive',
                name: 'Inactive Customers',
                description: 'Customers with no activity in 90 days',
                count: await this.prisma.users.count({
                    where: {
                        role: 'USER',
                        updatedAt: {
                            lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                        },
                    },
                }),
            },
        ];
    }
    async getAudienceSegment(id) {
        const segments = await this.getAudienceSegments();
        const segment = segments.find((s) => s.id === id);
        if (!segment) {
            throw new common_1.NotFoundException('Audience segment not found');
        }
        return segment;
    }
    async createAudienceSegment(data) {
        const segment = {
            id: `segment-${Date.now()}`,
            name: data.name,
            criteria: data.criteria,
            count: 0,
            createdAt: new Date(),
        };
        this.logger.log(`Audience segment created: ${segment.id}`);
        return segment;
    }
    async getROIAnalysis(_startDate, _endDate) {
        return {
            totalSpent: 5000000,
            totalRevenue: 25000000,
            roi: 400,
            campaignss: 12,
            averageROI: 350,
            topPerformingCampaigns: 'Summer Sale 2024',
            topPerformingChannel: 'Email Marketing',
        };
    }
    async getConversionFunnel(_startDate, _endDate) {
        return {
            visitors: 10000,
            leads: 1500,
            prospects: 750,
            customers: 300,
            conversionRates: {
                visitorToLead: 15,
                leadToProspect: 50,
                prospectToCustomer: 40,
                overall: 3,
            },
        };
    }
    transformCampaigns(campaigns) {
        const recipients = campaigns.campaign_recipients.length;
        const opens = campaigns.campaign_opens.length;
        const clicks = campaigns.campaign_clicks.length;
        return {
            id: campaigns.id,
            name: campaigns.name,
            description: campaigns.description,
            type: campaigns.type,
            status: campaigns.status,
            targetAudience: campaigns.targetAudience,
            discountPercent: campaigns.discountPercent,
            discountAmount: campaigns.discountAmount,
            subject: campaigns.subject,
            content: campaigns.content,
            startDate: campaigns.startDate ? campaigns.startDate.toISOString() : null,
            endDate: campaigns.endDate ? campaigns.endDate.toISOString() : null,
            scheduledAt: campaigns.scheduledAt ? campaigns.scheduledAt.toISOString() : null,
            sentAt: campaigns.sentAt ? campaigns.sentAt.toISOString() : null,
            createdAt: campaigns.createdAt.toISOString(),
            updatedAt: campaigns.updatedAt.toISOString(),
            createdBy: campaigns.createdBy,
            templateId: campaigns.templateId ?? null,
            template: campaigns.template
                ? {
                    id: campaigns.template.id,
                    name: campaigns.template.name,
                    description: campaigns.template.description,
                    subject: campaigns.template.subject,
                    content: campaigns.template.content,
                }
                : null,
            recipients,
            opens,
            clicks,
            conversions: 0,
            revenue: 0,
        };
    }
    buildCampaignsStats(campaignss) {
        const totalCampaignss = campaignss.length;
        const sentCampaignss = campaignss.filter((c) => c.status === client_1.CampaignStatus.SENT).length;
        const activeCampaignss = campaignss.filter((c) => c.status === client_1.CampaignStatus.SENT || c.status === client_1.CampaignStatus.SCHEDULED).length;
        const totalRecipients = campaignss.reduce((sum, c) => sum + (c.recipients || 0), 0);
        const totalRevenue = campaignss.reduce((sum, c) => sum + (c.revenue || 0), 0);
        const campaignssWithRecipients = campaignss.filter((c) => c.recipients > 0);
        const averageOpenRate = campaignssWithRecipients.length
            ? campaignssWithRecipients.reduce((sum, c) => sum + (c.opens / c.recipients) * 100, 0) /
                campaignssWithRecipients.length
            : 0;
        const averageClickRate = campaignssWithRecipients.length
            ? campaignssWithRecipients.reduce((sum, c) => sum + (c.clicks / c.recipients) * 100, 0) /
                campaignssWithRecipients.length
            : 0;
        return {
            totalCampaignss,
            activeCampaignss,
            sentCampaignss,
            totalRecipients,
            averageOpenRate: Number(averageOpenRate.toFixed(2)),
            averageClickRate: Number(averageClickRate.toFixed(2)),
            totalRevenue,
            conversionRate: 0,
        };
    }
    transformTemplate(template) {
        return {
            id: template.id,
            name: template.name,
            description: template.description ?? null,
            category: template.category ?? null,
            subject: template.subject,
            content: template.content,
            usageCount: template.usageCount ?? 0,
            isActive: template.isActive ?? true,
            createdAt: template.createdAt.toISOString(),
            updatedAt: template.updatedAt.toISOString(),
        };
    }
    async ensureTemplateExists(templateId) {
        const template = await this.prisma.emailTemplate.findUnique({ where: { id: templateId } });
        if (!template) {
            throw new common_1.NotFoundException('Email template not found');
        }
    }
    async getTargetAudience(targetAudience) {
        if (!targetAudience) {
            return this.prisma.users.findMany({
                where: { role: 'USER', email: { not: null } },
                select: { email: true, name: true },
            });
        }
        switch (targetAudience) {
            case 'new-customers':
                return this.prisma.users.findMany({
                    where: {
                        role: 'USER',
                        email: { not: null },
                        createdAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                        },
                    },
                    select: { email: true, name: true },
                });
            case 'returning-customers':
                return this.prisma.users.findMany({
                    where: {
                        role: 'USER',
                        email: { not: null },
                        orders: {
                            some: {},
                        },
                    },
                    select: { email: true, name: true },
                });
            default:
                return [];
        }
    }
    async sendEmailCampaigns(campaigns, _recipients) {
        this.logger.log(`Email campaigns ${campaigns.id} skipped (notification system disabled).`);
    }
    async sendSMSCampaigns(campaigns, recipients) {
        this.logger.log(`SMS campaigns ${campaigns.id} prepared for ${recipients.length} recipients.`);
    }
    async sendPushCampaigns(campaigns, recipients) {
        this.logger.log(`Push campaigns ${campaigns.id} prepared for ${recipients.length} recipients.`);
    }
    async sendSocialCampaigns(campaigns) {
        this.logger.log(`Social campaigns ${campaigns.id} posted.`);
    }
};
exports.MarketingService = MarketingService;
exports.MarketingService = MarketingService = MarketingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketingService);
//# sourceMappingURL=marketing.service.js.map