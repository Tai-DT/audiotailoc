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
var AdminOrKeyGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_guard_1 = require("./admin.guard");
const jwt = __importStar(require("jsonwebtoken"));
let AdminOrKeyGuard = AdminOrKeyGuard_1 = class AdminOrKeyGuard {
    constructor(config, adminGuard) {
        this.config = config;
        this.adminGuard = adminGuard;
        this.logger = new common_1.Logger(AdminOrKeyGuard_1.name);
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const headerKey = (req.headers['x-admin-key'] || req.headers['X-Admin-Key'] || '');
        const envKey = this.config.get('ADMIN_API_KEY') || '';
        this.logger.debug(`AdminOrKeyGuard: headerKey=${headerKey}, envKey=${envKey}, path=${req.path}`);
        if (envKey && headerKey && headerKey === envKey) {
            this.logger.debug('AdminOrKeyGuard: API key match, access granted');
            return true;
        }
        this.logger.debug('AdminOrKeyGuard: API key mismatch, trying role-based auth');
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            this.logger.debug('AdminOrKeyGuard: No JWT token provided');
            return false;
        }
        const token = authHeader.slice(7);
        try {
            const secret = this.config.get('JWT_ACCESS_SECRET');
            if (!secret) {
                this.logger.error('JWT_ACCESS_SECRET is not configured');
                return false;
            }
            const payload = jwt.verify(token, secret);
            req.user = payload;
            this.logger.debug(`AdminOrKeyGuard: JWT verified for user ${payload.email}, role: ${payload.role}`);
        }
        catch (err) {
            this.logger.debug('AdminOrKeyGuard: Invalid JWT token', err);
            return false;
        }
        try {
            return await this.adminGuard.canActivate(context);
        }
        catch {
            this.logger.debug('AdminOrKeyGuard: Role-based auth failed');
            return false;
        }
    }
};
exports.AdminOrKeyGuard = AdminOrKeyGuard;
exports.AdminOrKeyGuard = AdminOrKeyGuard = AdminOrKeyGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        admin_guard_1.AdminGuard])
], AdminOrKeyGuard);
//# sourceMappingURL=admin-or-key.guard.js.map