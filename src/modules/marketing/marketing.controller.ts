import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import {
  MarketingService,
  CampaignsResponse,
  CampaignsStatsResponse,
  EmailTemplateResponse,
} from './marketing.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { IsString, IsEmail, IsOptional, IsArray, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { CampaignStatus, CampaignType } from '@prisma/client';

class CreateCampaignDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  type!: 'EMAIL' | 'SMS' | 'PUSH' | 'SOCIAL';

  @IsOptional()
  @IsString()
  targetAudience?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

class SendEmailDto {
  @IsArray()
  @IsEmail({}, { each: true })
  recipients!: string[];

  @IsString()
  subject!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  templateId?: string;
}

class ScheduleCampaignDto {
  @IsString()
  scheduledAt!: string;
}

class CreateTemplateDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  subject!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@Controller('marketing')
export class MarketingController {
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

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('campaigns')
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto): Promise<CampaignsResponse> {
    return this.marketingService.createCampaigns({
      ...createCampaignDto,
      type: createCampaignDto.type.toUpperCase() as CampaignType,
    });
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Put('campaigns/:id')
  async updateCampaign(
    @Param('id') id: string,
    @Body() updateCampaignDto: Partial<CreateCampaignDto>,
  ): Promise<CampaignsResponse> {
    const payload: Partial<CreateCampaignDto> = { ...updateCampaignDto };
    if (payload.type) {
      payload.type = payload.type.toUpperCase() as any;
    }
    if ((payload as any).status) {
      (payload as any).status = ((payload as any).status as string).toUpperCase() as CampaignStatus;
    }
    return this.marketingService.updateCampaigns(id, payload as any);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete('campaigns/:id')
  async deleteCampaign(@Param('id') id: string) {
    return this.marketingService.deleteCampaigns(id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('campaigns/:id/send')
  async sendCampaign(@Param('id') id: string) {
    return this.marketingService.sendCampaigns(id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('campaigns/:id/duplicate')
  async duplicateCampaign(@Param('id') id: string): Promise<CampaignsResponse> {
    return this.marketingService.duplicateCampaigns(id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('campaigns/:id/schedule')
  async scheduleCampaign(
    @Param('id') id: string,
    @Body() dto: ScheduleCampaignDto,
  ): Promise<CampaignsResponse> {
    return this.marketingService.scheduleCampaigns(id, dto.scheduledAt);
  }

  @Get('campaigns/:id/stats')
  async getCampaignStats(@Param('id') id: string) {
    return this.marketingService.getCampaignsStats(id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('email/send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.marketingService.sendEmail(sendEmailDto);
  }

  @Get('email/templates')
  async getEmailTemplates(): Promise<{ templates: EmailTemplateResponse[] }> {
    return this.marketingService.getEmailTemplates();
  }

  @Get('email/templates/:id')
  async getEmailTemplate(@Param('id') id: string): Promise<EmailTemplateResponse> {
    return this.marketingService.getEmailTemplate(id);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('email/templates')
  async createEmailTemplate(@Body() dto: CreateTemplateDto): Promise<EmailTemplateResponse> {
    return this.marketingService.createEmailTemplate(dto);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Put('email/templates/:id')
  async updateEmailTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ): Promise<EmailTemplateResponse> {
    return this.marketingService.updateEmailTemplate(id, dto);
  }

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Delete('email/templates/:id')
  async deleteEmailTemplate(@Param('id') id: string) {
    return this.marketingService.deleteEmailTemplate(id);
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

  @UseGuards(JwtGuard, AdminOrKeyGuard)
  @Post('audience/segments')
  async createAudienceSegment(@Body() segmentData: { name: string; criteria: any }) {
    return this.marketingService.createAudienceSegment(segmentData);
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
