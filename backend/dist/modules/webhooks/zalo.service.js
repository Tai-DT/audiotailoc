"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
const crypto = __importStar(require("crypto"));
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
    verifySignature(headers, body) {
        const signatureHeader = headers['x-zalo-signature'] || headers['X-Zalo-Signature'] || '';
        if (!this.secret || !signatureHeader) {
            return false;
        }
        const payload = typeof body === 'string' ? body : JSON.stringify(body);
        const hmac = crypto.createHmac('sha256', this.secret);
        hmac.update(payload);
        const expected = hmac.digest('hex');
        return expected === signatureHeader;
    }
    async handleIncoming(headers, body) {
        const signatureValid = this.verifySignature(headers, body);
        if (this.secret && !signatureValid) {
            throw new common_1.UnauthorizedException('Invalid Zalo signature');
        }
        const event = body;
        const userId = null;
        const text = event?.message?.text || event?.event_name || 'Zalo message';
        const customerQuestion = await this.prisma.customer_questions.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                question: String(text),
                category: 'ZALO_SUPPORT',
                updatedAt: new Date(),
                ...(userId && { users: { connect: { id: userId } } }),
            },
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
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], ZaloService);
//# sourceMappingURL=zalo.service.js.map