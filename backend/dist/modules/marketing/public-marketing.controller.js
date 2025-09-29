"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicMarketingController = void 0;
const common_1 = require("@nestjs/common");
const marketing_service_1 = require("./marketing.service");
let PublicMarketingController = class PublicMarketingController {
    constructor(marketingService) {
        this.marketingService = marketingService;
    }
    async getCampaigns(status) {
        const result = this.marketingService.getCampaigns(status);
        return result;
    }
    async getCampaign(id) {
        const result = this.marketingService.getCampaigns(id);
        return { campaign: result.campaigns, stats: result.stats };
    }
    async getCampaignStats(id) {
        return this.marketingService.getCampaignsStats(id);
    }
    async getEmailTemplates() {
        return this.marketingService.getEmailTemplates();
    }
    async getEmailTemplate(id) {
        return this.marketingService.getEmailTemplate(id);
    }
    async getEmailStats(startDate, endDate) {
        return this.marketingService.getEmailStats(startDate, endDate);
    }
    async getAudienceSegments() {
        return this.marketingService.getAudienceSegments();
    }
    async getAudienceSegment(id) {
        return this.marketingService.getAudienceSegment(id);
    }
    async getROIAnalysis(startDate, endDate) {
        return this.marketingService.getROIAnalysis(startDate, endDate);
    }
    async getConversionFunnel(startDate, endDate) {
        return this.marketingService.getConversionFunnel(startDate, endDate);
    }
};
exports.PublicMarketingController = PublicMarketingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], PublicMarketingController.prototype, "getCampaigns", null);
__decorate([
    (0, common_1.Get)('campaigns/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], PublicMarketingController.prototype, "getCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns/:id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicMarketingController.prototype, "getCampaignStats", null);
__decorate([
    (0, common_1.Get)('email/templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], PublicMarketingController.prototype, "getEmailTemplates", null);
__decorate([
    (0, common_1.Get)('email/templates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], PublicMarketingController.prototype, "getEmailTemplate", null);
__decorate([
    (0, common_1.Get)('email/stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicMarketingController.prototype, "getEmailStats", null);
__decorate([
    (0, common_1.Get)('audience/segments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicMarketingController.prototype, "getAudienceSegments", null);
__decorate([
    (0, common_1.Get)('audience/segments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicMarketingController.prototype, "getAudienceSegment", null);
__decorate([
    (0, common_1.Get)('roi/analysis'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicMarketingController.prototype, "getROIAnalysis", null);
__decorate([
    (0, common_1.Get)('conversion/funnel'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicMarketingController.prototype, "getConversionFunnel", null);
exports.PublicMarketingController = PublicMarketingController = __decorate([
    (0, common_1.Controller)('marketing'),
    __metadata("design:paramtypes", [marketing_service_1.MarketingService])
], PublicMarketingController);
//# sourceMappingURL=public-marketing.controller.js.map