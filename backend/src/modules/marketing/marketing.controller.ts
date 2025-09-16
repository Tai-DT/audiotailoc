import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtGuard } from '../auth/jwt.guard';
import { IsString, IsEmail, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';

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

@Controller('marketing')
@UseGuards(JwtGuard, AdminGuard)
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get()
  async getCampaigns(@Query('status') status?: string) {
    return this.marketingService.getCampaigns(status as any);
  }

  @Get('campaigns/:id')
  async getCampaign(@Param('id') id: string) {
    return this.marketingService.getCampaign(id);
  }

  @Post('campaigns')
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.marketingService.createCampaign(createCampaignDto);
  }

  @Put('campaigns/:id')
  async updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: Partial<CreateCampaignDto>) {
    return this.marketingService.updateCampaign(id, updateCampaignDto);
  }

  @Delete('campaigns/:id')
  async deleteCampaign(@Param('id') id: string) {
    return this.marketingService.deleteCampaign(id);
  }

  @Post('campaigns/:id/send')
  async sendCampaign(@Param('id') id: string) {
    return this.marketingService.sendCampaign(id);
  }

  @Get('campaigns/:id/stats')
  async getCampaignStats(@Param('id') id: string) {
    return this.marketingService.getCampaignStats(id);
  }

  @Post('email/send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.marketingService.sendEmail(sendEmailDto);
  }

  @Get('email/templates')
  async getEmailTemplates() {
    return this.marketingService.getEmailTemplates();
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
