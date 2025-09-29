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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AdminOrKeyGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt = __importStar(require("jsonwebtoken"));
let AdminOrKeyGuard = AdminOrKeyGuard_1 = class AdminOrKeyGuard {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.logger = new common_1.Logger(AdminOrKeyGuard_1.name);
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const headerKey = (req.headers['x-admin-key'] || req.headers['X-Admin-Key'] || '');
        const envKey = this.config.get('ADMIN_API_KEY') || '';
        this.logger.debug(`AdminOrKeyGuard: Checking authentication for path ${req.path}`);
        this.logger.debug(`AdminOrKeyGuard: headerKey present: ${!!headerKey}, envKey present: ${!!envKey}`);
        if (envKey && headerKey && headerKey === envKey) {
            this.logger.debug('AdminOrKeyGuard: API key match - allowing access');
            return true;
        }
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            try {
                const secret = this.config.get('JWT_ACCESS_SECRET') || 'dev_access';
                const payload = jwt.verify(token, secret);
                req.user = payload;
                this.logger.debug('AdminOrKeyGuard: JWT token valid - allowing access');
                return true;
            }
            catch (error) {
                this.logger.debug('AdminOrKeyGuard: JWT token invalid:', error.message);
            }
        }
        this.logger.debug('AdminOrKeyGuard: Both API key and JWT token authentication failed - denying access');
        return false;
    }
};
exports.AdminOrKeyGuard = AdminOrKeyGuard;
exports.AdminOrKeyGuard = AdminOrKeyGuard = AdminOrKeyGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], AdminOrKeyGuard);
//# sourceMappingURL=admin-or-key.guard.js.map