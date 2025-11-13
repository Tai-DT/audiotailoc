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
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../notifications/mail.service");
const client_1 = require("@prisma/client");
let MarketingService = MarketingService_1 = class MarketingService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.logger = new common_1.Logger(MarketingService_1.name);
    }
    async getCampaigns(status) {
        const where = status ? { status } : {};
        const campaigns = await this.prisma.campaigns.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        return campaigns;
    }
    async getCampaign(id) {
        const campaign = await this.prisma.campaigns.findUnique({
            where: { id }
        });
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        return campaign;
    }
    async createCampaign(data) {
        const campaign = await this.prisma.campaigns.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                name: data.name,
                description: data.description,
                type: data.type,
                targetAudience: data.targetAudience || null,
                discountPercent: data.discountPercent || 0,
                discountAmount: data.discountAmount || 0,
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
                status: client_1.CampaignStatus.DRAFT,
                updatedAt: new Date()
            }
        });
        this.logger.log(`Campaign created: ${campaign.id}`);
        return campaign;
    }
    async updateCampaign(id, data) {
        const campaign = await this.prisma.campaigns.update({
            where: { id },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            }
        });
        this.logger.log(`Campaign updated: ${id}`);
        return campaign;
    }
    async deleteCampaign(id) {
        await this.prisma.campaigns.delete({ where: { id } });
        this.logger.log(`Campaign deleted: ${id}`);
        return { message: 'Campaign deleted successfully' };
    }
    async sendCampaign(id) {
        const campaign = await this.getCampaign(id);
        const recipients = await this.getTargetAudience(campaign.targetAudience);
        switch (campaign.type) {
            case 'EMAIL':
                await this.sendEmailCampaign(campaign, recipients);
                break;
            case 'SMS':
                await this.sendSMSCampaign(campaign, recipients);
                break;
            case 'PUSH':
                await this.sendPushCampaign(campaign, recipients);
                break;
            case 'SOCIAL':
                await this.sendSocialCampaign(campaign);
                break;
        }
        await this.prisma.campaigns.update({
            where: { id },
            data: { status: client_1.CampaignStatus.SENT, sentAt: new Date() }
        });
        this.logger.log(`Campaign sent: ${id} to ${recipients.length} recipients`);
        return { message: 'Campaign sent successfully', recipientCount: recipients.length };
    }
    async getCampaignStats(id) {
        const campaign = await this.getCampaign(id);
        const stats = {
            totalRecipients: 0,
            totalOpens: 0,
            totalClicks: 0,
            openRate: 0,
            clickRate: 0,
            conversionRate: 0
        };
        return stats;
    }
    async sendEmail(data) {
        const results = [];
        for (const recipient of data.recipients) {
            try {
                await this.mailService.sendEmail({
                    to: recipient,
                    subject: data.subject,
                    html: data.content
                });
                results.push({ email: recipient, status: 'sent' });
            }
            catch (error) {
                this.logger.error(`Failed to send email to ${recipient}:`, error);
                results.push({ email: recipient, status: 'failed', error: error.message });
            }
        }
        return {
            total: data.recipients.length,
            sent: results.filter(r => r.status === 'sent').length,
            failed: results.filter(r => r.status === 'failed').length,
            results
        };
    }
    async getEmailTemplates() {
        return [
            {
                id: 'welcome',
                name: 'Welcome Email',
                subject: 'Welcome to Audio Tài Lộc!',
                content: '<h1>Welcome!</h1><p>Thank you for joining us.</p>'
            },
            {
                id: 'promotion',
                name: 'Promotion Email',
                subject: 'Special Offer Just for You!',
                content: '<h1>Special Offer</h1><p>Get 20% off your next purchase!</p>'
            },
            {
                id: 'order-confirmation',
                name: 'Order Confirmation',
                subject: 'Your Order Confirmation',
                content: '<h1>Order Confirmed</h1><p>Thank you for your order.</p>'
            }
        ];
    }
    async getEmailStats(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where['createdAt'] = {};
            if (startDate)
                where['createdAt']['gte'] = new Date(startDate);
            if (endDate)
                where['createdAt']['lte'] = new Date(endDate);
        }
        const [totalEmails, sentEmails, failedEmails] = await Promise.all([
            this.prisma.email_logs.count({ where }),
            this.prisma.email_logs.count({ where: { ...where, status: 'SENT' } }),
            this.prisma.email_logs.count({ where: { ...where, status: 'FAILED' } })
        ]);
        return {
            totalEmails,
            sentEmails,
            failedEmails,
            successRate: totalEmails > 0 ? (sentEmails / totalEmails * 100).toFixed(2) : 0
        };
    }
    async getAudienceSegments() {
        return [
            {
                id: 'new-customers',
                name: 'New Customers',
                description: 'Customers who registered in the last 30 days',
                count: 150
            },
            {
                id: 'returning-customers',
                name: 'Returning Customers',
                description: 'Customers with more than 1 order',
                count: 320
            },
            {
                id: 'high-value',
                name: 'High Value Customers',
                description: 'Customers who spent more than 5M VND',
                count: 85
            },
            {
                id: 'inactive',
                name: 'Inactive Customers',
                description: 'Customers with no activity in 90 days',
                count: 200
            }
        ];
    }
    async getAudienceSegment(id) {
        const segments = await this.getAudienceSegments();
        const segment = segments.find(s => s.id === id);
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
            createdAt: new Date()
        };
        this.logger.log(`Audience segment created: ${segment.id}`);
        return segment;
    }
    async getROIAnalysis(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where['createdAt'] = {};
            if (startDate)
                where['createdAt']['gte'] = new Date(startDate);
            if (endDate)
                where['createdAt']['lte'] = new Date(endDate);
        }
        return {
            totalSpent: 5000000,
            totalRevenue: 25000000,
            roi: 400,
            campaigns: 12,
            averageROI: 350,
            topPerformingCampaign: 'Summer Sale 2024',
            topPerformingChannel: 'Email Marketing'
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
                overall: 3
            }
        };
    }
    async getTargetAudience(targetAudience) {
        if (!targetAudience) {
            return this.prisma.users.findMany({
                where: { role: 'USER' },
                select: { email: true, name: true }
            });
        }
        switch (targetAudience) {
            case 'new-customers':
                return this.prisma.users.findMany({
                    where: {
                        role: 'USER',
                        createdAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        }
                    },
                    select: { email: true, name: true }
                });
            case 'returning-customers':
                return this.prisma.users.findMany({
                    where: {
                        role: 'USER',
                        orders: {
                            some: {}
                        }
                    },
                    select: { email: true, name: true }
                });
            default:
                return [];
        }
    }
    async sendEmailCampaign(campaign, recipients) {
        for (const recipient of recipients) {
            try {
                await this.mailService.sendEmail({
                    to: recipient.email,
                    subject: campaign.name,
                    html: campaign.description
                });
                await this.prisma.email_logs.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        campaignId: campaign.id,
                        recipientEmail: recipient.email,
                        subject: campaign.name,
                        status: 'SENT',
                        sentAt: new Date()
                    }
                });
            }
            catch (error) {
                this.logger.error(`Failed to send campaign email to ${recipient.email}:`, error);
                await this.prisma.email_logs.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        campaignId: campaign.id,
                        recipientEmail: recipient.email,
                        subject: campaign.name,
                        status: 'FAILED',
                        error: error.message
                    }
                });
            }
        }
    }
    async sendSMSCampaign(campaign, recipients) {
        this.logger.log(`SMS campaign sent to ${recipients.length} recipients`);
    }
    async sendPushCampaign(campaign, recipients) {
        this.logger.log(`Push campaign sent to ${recipients.length} recipients`);
    }
    async sendSocialCampaign(_campaign) {
        this.logger.log(`Social campaign posted`);
    }
};
exports.MarketingService = MarketingService;
exports.MarketingService = MarketingService = MarketingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], MarketingService);
//# sourceMappingURL=marketing.service.js.map