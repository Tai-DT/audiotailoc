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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let NewsletterService = class NewsletterService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async subscribe(subscribeNewsletterDto) {
        const { email, name } = subscribeNewsletterDto;
        const existingSubscription = await this.prisma.newsletter_subscriptions.findUnique({
            where: { email },
        });
        if (existingSubscription) {
            throw new common_1.ConflictException('Email already subscribed to newsletter');
        }
        const subscription = await this.prisma.newsletter_subscriptions.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                email,
                name,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return {
            message: 'Successfully subscribed to newsletter',
            subscription: {
                id: subscription.id,
                email: subscription.email,
                name: subscription.name,
                subscribedAt: subscription.createdAt,
            },
        };
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map