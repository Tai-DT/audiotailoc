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
exports.NewsletterController = void 0;
const common_1 = require("@nestjs/common");
const newsletter_service_1 = require("./newsletter.service");
const subscribe_newsletter_dto_1 = require("./dto/subscribe-newsletter.dto");
const swagger_1 = require("@nestjs/swagger");
let NewsletterController = class NewsletterController {
    constructor(newsletterService) {
        this.newsletterService = newsletterService;
    }
    async subscribe(subscribeNewsletterDto) {
        return this.newsletterService.subscribe(subscribeNewsletterDto);
    }
};
exports.NewsletterController = NewsletterController;
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Subscribe to newsletter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully subscribed to newsletter' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid email or already subscribed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscribe_newsletter_dto_1.SubscribeNewsletterDto]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "subscribe", null);
exports.NewsletterController = NewsletterController = __decorate([
    (0, swagger_1.ApiTags)('Newsletter'),
    (0, common_1.Controller)('newsletter'),
    __metadata("design:paramtypes", [newsletter_service_1.NewsletterService])
], NewsletterController);
//# sourceMappingURL=newsletter.controller.js.map