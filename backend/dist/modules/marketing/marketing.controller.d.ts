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
    getCampaigns(status?: string): Promise<{
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
    createCampaign(createCampaignDto: CreateCampaignDto): Promise<{
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
    updateCampaign(id: string, updateCampaignDto: Partial<CreateCampaignDto>): Promise<{
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
