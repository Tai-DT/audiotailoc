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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const security_service_1 = require("../security/security.service");
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const config_1 = require("@nestjs/config");
let AuthService = AuthService_1 = class AuthService {
    constructor(users, config, securityService) {
        this.users = users;
        this.config = config;
        this.securityService = securityService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const passwordValidation = this.securityService.validatePasswordStrength(dto.password);
        if (!passwordValidation.isValid) {
            throw new common_1.BadRequestException({
                message: 'Password does not meet security requirements',
                errors: passwordValidation.errors,
            });
        }
        return this.users.create({ email: dto.email, password: dto.password, name: dto.name ?? '' });
    }
    async login(dto) {
        if (this.securityService.isAccountLocked(dto.email)) {
            const remainingTime = this.securityService.getRemainingLockoutTime(dto.email);
            throw new Error(`Account is locked. Try again in ${Math.ceil(remainingTime / 60000)} minutes.`);
        }
        const user = await this.users.findByEmail(dto.email);
        if (!user) {
            this.securityService.recordLoginAttempt(dto.email, false);
            throw new Error('Invalid email or password');
        }
        const ok = await this.securityService.verifyPassword(dto.password, user.password);
        this.securityService.recordLoginAttempt(dto.email, ok);
        if (!ok) {
            throw new Error('Invalid email or password');
        }
        const accessSecret = this.config.get('JWT_ACCESS_SECRET');
        const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
        if (!accessSecret || !refreshSecret) {
            throw new Error('JWT secrets are not configured');
        }
        const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role ?? 'USER' }, accessSecret, { expiresIn: '15m' });
        const refreshTokenExpiry = dto.rememberMe ? '30d' : '7d';
        const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, {
            expiresIn: refreshTokenExpiry,
        });
        return { accessToken, refreshToken, userId: user.id };
    }
    async refresh(refreshToken) {
        try {
            const refreshSecret = this.config.get('JWT_REFRESH_SECRET');
            if (!refreshSecret) {
                throw new Error('JWT refresh secret is not configured');
            }
            const payload = jwt.verify(refreshToken, refreshSecret);
            const user = await this.users.findById(payload.sub);
            if (!user)
                throw new Error('User not found');
            const userRole = user.role;
            if (userRole === 'DISABLED') {
                throw new Error('User account has been disabled');
            }
            const accessSecret = this.config.get('JWT_ACCESS_SECRET');
            if (!accessSecret) {
                throw new Error('JWT access secret is not configured');
            }
            const newAccessToken = jwt.sign({ sub: user.id, email: user.email, role: userRole ?? 'USER' }, accessSecret, { expiresIn: '15m' });
            return { accessToken: newAccessToken, refreshToken };
        }
        catch (error) {
            if (error instanceof Error && error.message !== 'Invalid refresh token') {
                throw error;
            }
            throw new Error('Invalid refresh token');
        }
    }
    async forgotPassword(email) {
        const user = await this.users.findByEmail(email);
        if (!user) {
            return { success: true };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await this.users.setResetToken(user.id, resetToken, resetTokenExpiry);
        if (process.env.NODE_ENV === 'development') {
            this.logger.debug(`[DEV ONLY] Password reset token for ${email}: ${resetToken}`);
            this.logger.debug(`[DEV ONLY] Reset link: http://localhost:3000/reset-password?token=${resetToken}`);
        }
        else {
            this.logger.log(`Password reset requested for ${email}`);
        }
        return { success: true };
    }
    async resetPassword(token, newPassword) {
        const passwordValidation = this.securityService.validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            throw new common_1.BadRequestException({
                message: 'New password does not meet security requirements',
                errors: passwordValidation.errors,
            });
        }
        const user = await this.users.findByResetToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Mã xác thực không hợp lệ hoặc đã hết hạn');
        }
        const hashedPassword = await this.securityService.hashPassword(newPassword);
        await this.users.updatePasswordAndClearResetToken(user.id, hashedPassword);
        this.logger.log(`Password reset completed for user ${user.id}`);
        return { success: true };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isCurrentPasswordValid = await this.securityService.verifyPassword(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        const passwordValidation = this.securityService.validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            throw new common_1.BadRequestException({
                message: 'New password does not meet security requirements',
                errors: passwordValidation.errors,
            });
        }
        const hashedPassword = await this.securityService.hashPassword(newPassword);
        await this.users.updatePassword(userId, hashedPassword);
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService,
        security_service_1.SecurityService])
], AuthService);
//# sourceMappingURL=auth.service.js.map