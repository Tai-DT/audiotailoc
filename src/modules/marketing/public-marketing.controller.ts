import { Controller, Get, Query, Param } from '@nestjs/common';
import { MarketingService, CampaignsResponse, CampaignsStatsResponse, EmailTemplateResponse } from './marketing.service';

@Controller('marketing')
export class PublicMarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get()
  async getCampaigns(
    @Query('status') status?: string,
  ): Promise<{ campaigns: CampaignsResponse[]; stats: CampaignsStatsResponse }> {
    const result = this.marketingService.getCampaigns(status as any);
    return result as any;
  }

  @Get('campaigns/:id')
  async getCampaign(
    @Param('id') id: string,
  ): Promise<{ campaign: CampaignsResponse; stats: CampaignsStatsResponse }> {
    const result = this.marketingService.getCampaigns(id);
    return { campaign: (result as any).campaigns, stats: (result as any).stats };
  }

  @Get('campaigns/:id/stats')
  async getCampaignStats(@Param('id') id: string) {
    return this.marketingService.getCampaignsStats(id);
  }

  @Get('email/templates')
  async getEmailTemplates(): Promise<{ templates: EmailTemplateResponse[] }> {
    return this.marketingService.getEmailTemplates();
  }

  @Get('email/templates/:id')
  async getEmailTemplate(@Param('id') id: string): Promise<EmailTemplateResponse> {
    return this.marketingService.getEmailTemplate(id);
  }

  @Get('email/stats')
  async getEmailStats(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.marketingService.getEmailStats(startDate, endDate);
  }

  @Get('audience/segments')
  async getAudienceSegments() {
    return this.marketingService.getAudienceSegments();
  }

  @Get('audience/segments/:id')
  async getAudienceSegment(@Param('id') id: string) {
    return this.marketingService.getAudienceSegment(id);
  }

  @Get('roi/analysis')
  async getROIAnalysis(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.marketingService.getROIAnalysis(startDate, endDate);
  }

  @Get('conversion/funnel')
  async getConversionFunnel(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.marketingService.getConversionFunnel(startDate, endDate);
  }
}
