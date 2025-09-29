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
exports.ZaloService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
let ZaloService = class ZaloService {
    constructor(cfg, prisma) {
        this.cfg = cfg;
        this.prisma = prisma;
    }
    get accessToken() {
        return this.cfg.get('ZALO_OA_ACCESS_TOKEN') || '';
    }
    get secret() {
        return this.cfg.get('ZALO_OA_SECRET') || '';
    }
    async handleIncoming(headers, body) {
        const event = body;
        const userId = null;
        const text = event?.message?.text || event?.event_name || 'Zalo message';
        const customerQuestion = await this.prisma.customerQuestion.create({
            data: {
                userId,
                question: text,
                category: 'ZALO_SUPPORT'
            }
        });
        return customerQuestion.id;
    }
    async replyToUser(zaloUserId, text) {
        if (!this.accessToken)
            throw new common_1.UnauthorizedException('Missing ZALO_OA_ACCESS_TOKEN');
        await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
            method: 'POST',
            headers: { 'content-type': 'application/json', access_token: this.accessToken },
            body: JSON.stringify({ recipient: { user_id: zaloUserId }, message: { text } }),
        }).catch(() => undefined);
    }
};
exports.ZaloService = ZaloService;
exports.ZaloService = ZaloService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, prisma_service_1.PrismaService])
], ZaloService);
//# sourceMappingURL=zalo.service.js.map