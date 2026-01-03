import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';
import { CampaignStatus, CampaignType } from '@prisma/client';
export declare class MarketingService {
    private readonly prisma;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService);
    getCampaigns(status?: CampaignStatus): Promise<{
        status: import(".prisma/client").$Enums.CampaignStatus;
        description: string;
        content: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        type: import(".prisma/client").$Enums.CampaignType;
        scheduledAt: Date | null;
        createdBy: string | null;
        targetAudience: string | null;
        discountPercent: number | null;
        discountAmount: number | null;
        sentAt: Date | null;
        subject: string | null;
        templateId: string | null;
    }[]>;
    getCampaign(id: string): Promise<{
        status: import(".prisma/client").$Enums.CampaignStatus;
        description: string;
        content: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        type: import(".prisma/client").$Enums.CampaignType;
        scheduledAt: Date | null;
        createdBy: string | null;
        targetAudience: string | null;
        discountPercent: number | null;
        discountAmount: number | null;
        sentAt: Date | null;
        subject: string | null;
        templateId: string | null;
    }>;
    createCampaign(data: {
        name: string;
        description: string;
        type: CampaignType;
        targetAudience?: string;
        discountPercent?: number;
        discountAmount?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.CampaignStatus;
        description: string;
        content: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        type: import(".prisma/client").$Enums.CampaignType;
        scheduledAt: Date | null;
        createdBy: string | null;
        targetAudience: string | null;
        discountPercent: number | null;
        discountAmount: number | null;
        sentAt: Date | null;
        subject: string | null;
        templateId: string | null;
    }>;
    updateCampaign(id: string, data: Partial<{
        name: string;
        description: string;
        type: CampaignType;
        targetAudience: string;
        discountPercent: number;
        discountAmount: number;
        startDate: string;
        endDate: string;
        status: CampaignStatus;
    }>): Promise<{
        status: import(".prisma/client").$Enums.CampaignStatus;
        description: string;
        content: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        type: import(".prisma/client").$Enums.CampaignType;
        scheduledAt: Date | null;
        createdBy: string | null;
        targetAudience: string | null;
        discountPercent: number | null;
        discountAmount: number | null;
        sentAt: Date | null;
        subject: string | null;
        templateId: string | null;
    }>;
    deleteCampaign(id: string): Promise<{
        message: string;
    }>;
    sendCampaign(id: string): Promise<{
        message: string;
        recipientCount: number;
    }>;
    getCampaignStats(id: string): Promise<{
        totalRecipients: number;
        totalOpens: number;
        totalClicks: number;
        openRate: number;
        clickRate: number;
        conversionRate: number;
    }>;
    sendEmail(data: {
        recipients: string[];
        subject: string;
        content: string;
        templateId?: string;
    }): Promise<{
        total: number;
        sent: number;
        failed: number;
        results: any[];
    }>;
    getEmailTemplates(): Promise<{
        id: string;
        name: string;
        subject: string;
        content: string;
    }[]>;
    getEmailStats(startDate?: string, endDate?: string): Promise<{
        totalEmails: number;
        sentEmails: number;
        failedEmails: number;
        successRate: string | number;
    }>;
    getAudienceSegments(): Promise<{
        id: string;
        name: string;
        description: string;
        count: number;
    }[]>;
    getAudienceSegment(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        count: number;
    }>;
    createAudienceSegment(data: {
        name: string;
        criteria: any;
    }): Promise<{
        id: string;
        name: string;
        criteria: any;
        count: number;
        createdAt: Date;
    }>;
    getROIAnalysis(startDate?: string, endDate?: string): Promise<{
        totalSpent: number;
        totalRevenue: number;
        roi: number;
        campaigns: number;
        averageROI: number;
        topPerformingCampaign: string;
        topPerformingChannel: string;
    }>;
    getConversionFunnel(_startDate?: string, _endDate?: string): Promise<{
        visitors: number;
        leads: number;
        prospects: number;
        customers: number;
        conversionRates: {
            visitorToLead: number;
            leadToProspect: number;
            prospectToCustomer: number;
            overall: number;
        };
    }>;
    private getTargetAudience;
    private sendEmailCampaign;
    private sendSMSCampaign;
    private sendPushCampaign;
    private sendSocialCampaign;
}
