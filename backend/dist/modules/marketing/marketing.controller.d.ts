import { MarketingService } from './marketing.service';
declare class CreateCampaignDto {
    name: string;
    description: string;
    type: 'EMAIL' | 'SMS' | 'PUSH' | 'SOCIAL';
    targetAudience?: string;
    discountPercent?: number;
    discountAmount?: number;
    startDate?: string;
    endDate?: string;
}
declare class SendEmailDto {
    recipients: string[];
    subject: string;
    content: string;
    templateId?: string;
}
export declare class MarketingController {
    private readonly marketingService;
    constructor(marketingService: MarketingService);
    getCampaigns(status?: string): Promise<({
        _count: {
            clicks: number;
            opens: number;
            recipients: number;
        };
    } & {
        status: import(".prisma/client").$Enums.CampaignStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.CampaignType;
        startDate: Date | null;
        endDate: Date | null;
        targetAudience: string | null;
        discountPercent: number | null;
        discountAmount: number | null;
        sentAt: Date | null;
    })[]>;
    getCampaign(id: string): Promise<{
        _count: {
            clicks: number;
            opens: number;
            recipients: number;
        };
        clicks: {
            id: string;
            createdAt: Date;
            url: string | null;
            recipientEmail: string | null;
            campaignId: string;
        }[];
        opens: {
            id: string;
            createdAt: Date;
            recipientEmail: string | null;
            campaignId: string;
        }[];
        recipients: {
            id: string;
            email: string;
            name: string | null;
            createdAt: Date;
            campaignId: string;
        }[];
    } & {
        status: import(".prisma/client").$Enums.CampaignStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.CampaignType;
        startDate: Date | null;
        endDate: Date | null;
        targetAudience: string | null;
        discountPercent: number | null;
        discountAmount: number | null;
        sentAt: Date | null;
    }>;
    createCampaign(createCampaignDto: CreateCampaignDto): Promise<{
        status: import(".prisma/client").$Enums.CampaignStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.CampaignType;
        startDate: Date | null;
        endDate: Date | null;
        targetAudience: string | null;
        discountPercent: number | null;
        discountAmount: number | null;
        sentAt: Date | null;
    }>;
    updateCampaign(id: string, updateCampaignDto: Partial<CreateCampaignDto>): Promise<{
        status: import(".prisma/client").$Enums.CampaignStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        type: import(".prisma/client").$Enums.CampaignType;
        startDate: Date | null;
        endDate: Date | null;
        targetAudience: string | null;
        discountPercent: number | null;
        discountAmount: number | null;
        sentAt: Date | null;
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
        openRate: string | number;
        clickRate: string | number;
        conversionRate: number;
    }>;
    sendEmail(sendEmailDto: SendEmailDto): Promise<{
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
    createAudienceSegment(segmentData: {
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
    getConversionFunnel(startDate?: string, endDate?: string): Promise<{
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
}
export {};
