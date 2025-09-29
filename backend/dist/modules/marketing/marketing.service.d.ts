import { CampaignStatus, CampaignType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export interface CampaignsResponse {
    id: string;
    name: string;
    description: string;
    type: CampaignType;
    status: CampaignStatus;
    targetAudience?: string | null;
    discountPercent?: number | null;
    discountAmount?: number | null;
    subject?: string | null;
    content?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    scheduledAt?: string | null;
    sentAt?: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy?: string | null;
    templateId?: string | null;
    template?: {
        id: string;
        name: string;
        description?: string | null;
        subject: string;
        content: string;
    } | null;
    recipients: number;
    opens: number;
    clicks: number;
    conversions: number;
    revenue: number;
}
export interface CampaignsStatsResponse {
    totalCampaignss: number;
    activeCampaignss: number;
    sentCampaignss: number;
    totalRecipients: number;
    averageOpenRate: number;
    averageClickRate: number;
    totalRevenue: number;
    conversionRate: number;
}
export interface EmailTemplateResponse {
    id: string;
    name: string;
    description?: string | null;
    category?: string | null;
    subject: string;
    content: string;
    usageCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export declare class MarketingService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getCampaignss(status?: CampaignStatus): Promise<{
        campaignss: CampaignsResponse[];
        stats: CampaignsStatsResponse;
    }>;
    getCampaigns(id: string): Promise<{
        campaigns: CampaignsResponse;
        stats: CampaignsStatsResponse;
    }>;
    createCampaigns(data: {
        name: string;
        description: string;
        type: CampaignType;
        targetAudience?: string;
        discountPercent?: number;
        discountAmount?: number;
        subject?: string;
        content?: string;
        startDate?: string;
        endDate?: string;
        scheduledAt?: string;
        templateId?: string;
        createdBy?: string;
    }): Promise<CampaignsResponse>;
    updateCampaigns(id: string, data: Partial<{
        name: string;
        description: string;
        type: CampaignType;
        targetAudience: string;
        discountPercent: number;
        discountAmount: number;
        subject: string;
        content: string;
        startDate: string | null;
        endDate: string | null;
        scheduledAt: string | null;
        templateId: string | null;
        status: CampaignStatus;
        createdBy: string;
    }>): Promise<CampaignsResponse>;
    deleteCampaigns(id: string): Promise<{
        message: string;
    }>;
    duplicateCampaigns(id: string): Promise<CampaignsResponse>;
    scheduleCampaigns(id: string, scheduledAt: string): Promise<CampaignsResponse>;
    sendCampaigns(id: string): Promise<{
        message: string;
        recipientCount: number;
    }>;
    getCampaignsStats(id: string): Promise<{
        totalRecipients: any;
        totalOpens: any;
        totalClicks: any;
        openRate: number;
        clickRate: number;
        conversionRate: number;
    }>;
    getEmailTemplates(): Promise<{
        templates: EmailTemplateResponse[];
    }>;
    getEmailTemplate(id: string): Promise<EmailTemplateResponse>;
    createEmailTemplate(data: {
        name: string;
        description?: string;
        category?: string;
        subject: string;
        content: string;
        isActive?: boolean;
    }): Promise<EmailTemplateResponse>;
    updateEmailTemplate(id: string, data: Partial<{
        name: string;
        description: string;
        category: string;
        subject: string;
        content: string;
        isActive: boolean;
    }>): Promise<EmailTemplateResponse>;
    deleteEmailTemplate(id: string): Promise<{
        message: string;
    }>;
    getEmailStats(startDate?: string, endDate?: string): Promise<{
        totalEmails: number;
        sentEmails: number;
        failedEmails: number;
        successRate: number;
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
        results: {
            email: string;
            status: "skipped";
        }[];
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
    getROIAnalysis(_startDate?: string, _endDate?: string): Promise<{
        totalSpent: number;
        totalRevenue: number;
        roi: number;
        campaignss: number;
        averageROI: number;
        topPerformingCampaigns: string;
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
    private transformCampaigns;
    private buildCampaignsStats;
    private transformTemplate;
    private ensureTemplateExists;
    private getTargetAudience;
    private sendEmailCampaigns;
    private sendSMSCampaigns;
    private sendPushCampaigns;
    private sendSocialCampaigns;
}
