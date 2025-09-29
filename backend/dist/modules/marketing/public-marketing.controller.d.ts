import { MarketingService, CampaignsResponse, CampaignsStatsResponse, EmailTemplateResponse } from './marketing.service';
export declare class PublicMarketingController {
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
    getCampaignStats(id: string): Promise<{
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
