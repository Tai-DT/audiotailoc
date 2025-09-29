import { MarketingService, CampaignsResponse, CampaignsStatsResponse, EmailTemplateResponse } from './marketing.service';
declare class CreateCampaignDto {
    name: string;
    description: string;
    type: 'EMAIL' | 'SMS' | 'PUSH' | 'SOCIAL';
    targetAudience?: string;
    discountPercent?: number;
    discountAmount?: number;
    startDate?: string;
    endDate?: string;
    subject?: string;
    content?: string;
    scheduledAt?: string;
    templateId?: string;
    createdBy?: string;
}
declare class SendEmailDto {
    recipients: string[];
    subject: string;
    content: string;
    templateId?: string;
}
declare class ScheduleCampaignDto {
    scheduledAt: string;
}
declare class CreateTemplateDto {
    name: string;
    description?: string;
    category?: string;
    subject: string;
    content: string;
    isActive?: boolean;
}
declare class UpdateTemplateDto {
    name?: string;
    description?: string;
    category?: string;
    subject?: string;
    content?: string;
    isActive?: boolean;
}
export declare class MarketingController {
    private readonly marketingService;
    constructor(marketingService: MarketingService);
    getCampaigns(status?: string): Promise<{
        campaigns: CampaignsResponse[];
        stats: CampaignsStatsResponse;
    }>;
    getCampaign(id: string): Promise<{
        campaign: CampaignsResponse;
        stats: CampaignsStatsResponse;
    }>;
    createCampaign(createCampaignDto: CreateCampaignDto): Promise<CampaignsResponse>;
    updateCampaign(id: string, updateCampaignDto: Partial<CreateCampaignDto>): Promise<CampaignsResponse>;
    deleteCampaign(id: string): Promise<{
        message: string;
    }>;
    sendCampaign(id: string): Promise<{
        message: string;
        recipientCount: number;
    }>;
    duplicateCampaign(id: string): Promise<CampaignsResponse>;
    scheduleCampaign(id: string, dto: ScheduleCampaignDto): Promise<CampaignsResponse>;
    getCampaignStats(id: string): Promise<{
        totalRecipients: any;
        totalOpens: any;
        totalClicks: any;
        openRate: number;
        clickRate: number;
        conversionRate: number;
    }>;
    sendEmail(sendEmailDto: SendEmailDto): Promise<{
        total: number;
        sent: number;
        failed: number;
        results: {
            email: string;
            status: "skipped";
        }[];
    }>;
    getEmailTemplates(): Promise<{
        templates: EmailTemplateResponse[];
    }>;
    getEmailTemplate(id: string): Promise<EmailTemplateResponse>;
    createEmailTemplate(dto: CreateTemplateDto): Promise<EmailTemplateResponse>;
    updateEmailTemplate(id: string, dto: UpdateTemplateDto): Promise<EmailTemplateResponse>;
    deleteEmailTemplate(id: string): Promise<{
        message: string;
    }>;
    getEmailStats(startDate?: string, endDate?: string): Promise<{
        totalEmails: number;
        sentEmails: number;
        failedEmails: number;
        successRate: number;
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
        campaignss: number;
        averageROI: number;
        topPerformingCampaigns: string;
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
