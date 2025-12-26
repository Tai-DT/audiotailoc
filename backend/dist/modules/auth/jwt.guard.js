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
var JwtGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("@nestjs/config");
let JwtGuard = JwtGuard_1 = class JwtGuard {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(JwtGuard_1.name);
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const path = req.route?.path || req.path;
        const publicRoutes = [
            '/auth/register',
            '/auth/login',
            '/auth/refresh',
            '/auth/forgot-password',
            '/auth/reset-password',
            '/auth/status',
            '/catalog/products',
            '/catalog/categories',
            '/services',
            '/service-types',
            '/services/types',
            '/health',
            '/testimonials',
            '/homepage-stats',
            '/chat/conversations',
            '/chat/messages',
        ];
        if (publicRoutes.some(route => path.includes(route))) {
            return true;
        }
        const header = req.headers['authorization'];
        if (!header || !header.startsWith('Bearer ')) {
            this.logger.warn(`Missing or invalid authorization header for ${path}`);
            throw new common_1.UnauthorizedException('Missing bearer token');
        }
        const token = header.slice(7);
        try {
            const secret = this.config.get('JWT_ACCESS_SECRET');
            if (!secret) {
                this.logger.error('JWT_ACCESS_SECRET is not configured');
                throw new common_1.UnauthorizedException('JWT configuration error');
            }
            const payload = jwt.verify(token, secret);
            req.user = payload;
            return true;
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                this.logger.warn(`Expired token for ${path}`);
                throw new common_1.UnauthorizedException('Token has expired');
            }
            else if (error instanceof jwt.JsonWebTokenError) {
                this.logger.warn(`Invalid token for ${path}: ${error.message}`);
                throw new common_1.UnauthorizedException('Invalid token');
            }
            this.logger.error(`Token verification failed for ${path}:`, error);
            throw new common_1.UnauthorizedException('Token verification failed');
        }
    }
};
exports.JwtGuard = JwtGuard;
exports.JwtGuard = JwtGuard = JwtGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtGuard);
//# sourceMappingURL=jwt.guard.js.map