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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaloWebhookController = void 0;
const common_1 = require("@nestjs/common");
const zalo_service_1 = require("./zalo.service");
let ZaloWebhookController = class ZaloWebhookController {
    constructor(zalo) {
        this.zalo = zalo;
    }
    async handle(headers, body) {
        await this.zalo.handleIncoming(headers, body);
        return { ok: true };
    }
};
exports.ZaloWebhookController = ZaloWebhookController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], ZaloWebhookController.prototype, "handle", null);
exports.ZaloWebhookController = ZaloWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/zalo'),
    __metadata("design:paramtypes", [zalo_service_1.ZaloService])
], ZaloWebhookController);
//# sourceMappingURL=zalo.controller.js.map