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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingController = void 0;
const common_1 = require("@nestjs/common");
const marketing_service_1 = require("./marketing.service");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const jwt_guard_1 = require("../auth/jwt.guard");
const class_validator_1 = require("class-validator");
class CreateCampaignDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "targetAudience", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateCampaignDto.prototype, "discountPercent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCampaignDto.prototype, "discountAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "endDate", void 0);
class SendEmailDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], SendEmailDto.prototype, "recipients", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "templateId", void 0);
let MarketingController = class MarketingController {
    constructor(marketingService) {
        this.marketingService = marketingService;
    }
    async getCampaigns(status) {
        return this.marketingService.getCampaigns(status);
    }
    async getCampaign(id) {
        return this.marketingService.getCampaign(id);
    }
    async createCampaign(createCampaignDto) {
        return this.marketingService.createCampaign(createCampaignDto);
    }
    async updateCampaign(id, updateCampaignDto) {
        return this.marketingService.updateCampaign(id, updateCampaignDto);
    }
    async deleteCampaign(id) {
        return this.marketingService.deleteCampaign(id);
    }
    async sendCampaign(id) {
        return this.marketingService.sendCampaign(id);
    }
    async getCampaignStats(id) {
        return this.marketingService.getCampaignStats(id);
    }
    async sendEmail(sendEmailDto) {
        return this.marketingService.sendEmail(sendEmailDto);
    }
    async getEmailTemplates() {
        return this.marketingService.getEmailTemplates();
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
    async createAudienceSegment(segmentData) {
        return this.marketingService.createAudienceSegment(segmentData);
    }
    async getROIAnalysis(startDate, endDate) {
        return this.marketingService.getROIAnalysis(startDate, endDate);
    }
    async getConversionFunnel(startDate, endDate) {
        return this.marketingService.getConversionFunnel(startDate, endDate);
    }
};
exports.MarketingController = MarketingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getCampaigns", null);
__decorate([
    (0, common_1.Get)('campaigns/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getCampaign", null);
__decorate([
    (0, common_1.Post)('campaigns'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCampaignDto]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Put)('campaigns/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "updateCampaign", null);
__decorate([
    (0, common_1.Delete)('campaigns/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "deleteCampaign", null);
__decorate([
    (0, common_1.Post)('campaigns/:id/send'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "sendCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns/:id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getCampaignStats", null);
__decorate([
    (0, common_1.Post)('email/send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendEmailDto]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Get)('email/templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getEmailTemplates", null);
__decorate([
    (0, common_1.Get)('email/stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getEmailStats", null);
__decorate([
    (0, common_1.Get)('audience/segments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getAudienceSegments", null);
__decorate([
    (0, common_1.Get)('audience/segments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getAudienceSegment", null);
__decorate([
    (0, common_1.Post)('audience/segments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "createAudienceSegment", null);
__decorate([
    (0, common_1.Get)('roi/analysis'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getROIAnalysis", null);
__decorate([
    (0, common_1.Get)('conversion/funnel'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "getConversionFunnel", null);
exports.MarketingController = MarketingController = __decorate([
    (0, common_1.Controller)('marketing'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_or_key_guard_1.AdminOrKeyGuard),
    __metadata("design:paramtypes", [marketing_service_1.MarketingService])
], MarketingController);
//# sourceMappingURL=marketing.controller.js.map