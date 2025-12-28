import { Module } from '@nestjs/common';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { PromotionService } from './promotion.service';
import { PromotionAuditService } from './services/promotion-audit.service';
import { PromotionAnalyticsService } from './services/promotion-analytics.service';
import { PromotionCustomerService } from './services/promotion-customer.service';
import { PromotionAdvancedService } from './services/promotion-advanced.service';
import { PromotionCheckoutService } from './services/promotion-checkout.service';
import { PromotionReportingService } from './services/promotion-reporting.service';
import { PromotionNotificationService } from './services/promotion-notification.service';
import { PromotionBackupService } from './services/promotion-backup.service';
import { PromotionDashboardService } from './services/promotion-dashboard.service';
import { PromotionCampaignsService } from './services/promotion-campaigns.service';
import { PromotionProjectsService } from './services/promotion-projects.service';
import { PromotionSettingsService } from './services/promotion-settings.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionsController],
  providers: [
    PromotionsService,
    PromotionService,
    PromotionAuditService,
    PromotionAnalyticsService,
    PromotionCustomerService,
    PromotionAdvancedService,
    PromotionCheckoutService,
    PromotionReportingService,
    PromotionNotificationService,
    PromotionBackupService,
    PromotionDashboardService,
    PromotionCampaignsService,
    PromotionProjectsService,
    PromotionSettingsService,
  ],
  exports: [
    PromotionsService,
    PromotionService,
    PromotionAuditService,
    PromotionAnalyticsService,
    PromotionCustomerService,
    PromotionAdvancedService,
    PromotionCheckoutService,
    PromotionReportingService,
    PromotionNotificationService,
    PromotionBackupService,
    PromotionDashboardService,
    PromotionCampaignsService,
    PromotionProjectsService,
    PromotionSettingsService,
  ],
})
export class PromotionsModule {}
