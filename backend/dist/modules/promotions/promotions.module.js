"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionsModule = void 0;
const common_1 = require("@nestjs/common");
const promotions_controller_1 = require("./promotions.controller");
const promotions_service_1 = require("./promotions.service");
const promotion_service_1 = require("./promotion.service");
const promotion_audit_service_1 = require("./services/promotion-audit.service");
const promotion_analytics_service_1 = require("./services/promotion-analytics.service");
const promotion_customer_service_1 = require("./services/promotion-customer.service");
const promotion_advanced_service_1 = require("./services/promotion-advanced.service");
const promotion_checkout_service_1 = require("./services/promotion-checkout.service");
const promotion_reporting_service_1 = require("./services/promotion-reporting.service");
const promotion_notification_service_1 = require("./services/promotion-notification.service");
const promotion_backup_service_1 = require("./services/promotion-backup.service");
const promotion_dashboard_service_1 = require("./services/promotion-dashboard.service");
const promotion_campaigns_service_1 = require("./services/promotion-campaigns.service");
const promotion_projects_service_1 = require("./services/promotion-projects.service");
const promotion_settings_service_1 = require("./services/promotion-settings.service");
const prisma_module_1 = require("../../prisma/prisma.module");
let PromotionsModule = class PromotionsModule {
};
exports.PromotionsModule = PromotionsModule;
exports.PromotionsModule = PromotionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [promotions_controller_1.PromotionsController],
        providers: [
            promotions_service_1.PromotionsService,
            promotion_service_1.PromotionService,
            promotion_audit_service_1.PromotionAuditService,
            promotion_analytics_service_1.PromotionAnalyticsService,
            promotion_customer_service_1.PromotionCustomerService,
            promotion_advanced_service_1.PromotionAdvancedService,
            promotion_checkout_service_1.PromotionCheckoutService,
            promotion_reporting_service_1.PromotionReportingService,
            promotion_notification_service_1.PromotionNotificationService,
            promotion_backup_service_1.PromotionBackupService,
            promotion_dashboard_service_1.PromotionDashboardService,
            promotion_campaigns_service_1.PromotionCampaignsService,
            promotion_projects_service_1.PromotionProjectsService,
            promotion_settings_service_1.PromotionSettingsService,
        ],
        exports: [
            promotions_service_1.PromotionsService,
            promotion_service_1.PromotionService,
            promotion_audit_service_1.PromotionAuditService,
            promotion_analytics_service_1.PromotionAnalyticsService,
            promotion_customer_service_1.PromotionCustomerService,
            promotion_advanced_service_1.PromotionAdvancedService,
            promotion_checkout_service_1.PromotionCheckoutService,
            promotion_reporting_service_1.PromotionReportingService,
            promotion_notification_service_1.PromotionNotificationService,
            promotion_backup_service_1.PromotionBackupService,
            promotion_dashboard_service_1.PromotionDashboardService,
            promotion_campaigns_service_1.PromotionCampaignsService,
            promotion_projects_service_1.PromotionProjectsService,
            promotion_settings_service_1.PromotionSettingsService,
        ],
    })
], PromotionsModule);
//# sourceMappingURL=promotions.module.js.map