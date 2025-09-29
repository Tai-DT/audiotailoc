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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const jwt_guard_1 = require("./jwt.guard");
const users_service_1 = require("../users/users.service");
const class_validator_1 = require("class-validator");
class RegisterDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
class LoginDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LoginDto.prototype, "rememberMe", void 0);
class RefreshTokenDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
class ForgotPasswordDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
class ChangePasswordDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
let AuthController = class AuthController {
    constructor(auth, users) {
        this.auth = auth;
        this.users = users;
    }
    async status() {
        return {
            authenticated: false,
            message: 'Authentication status endpoint',
            timestamp: new Date().toISOString()
        };
    }
    async register(dto) {
        if (!dto.email || !dto.password)
            throw new common_1.HttpException('Invalid payload', common_1.HttpStatus.BAD_REQUEST);
        const user = await this.auth.register(dto);
        const tokens = await this.auth.login({ email: dto.email, password: dto.password });
        return {
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: { id: user.id, email: user.email, name: user.name }
        };
    }
    async login(dto) {
        const tokens = await this.auth.login(dto).catch(() => {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        });
        const user = await this.users.findById(tokens.userId);
        return {
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user?.id,
                email: user?.email,
                name: user?.name,
                role: user?.role ?? 'USER'
            }
        };
    }
    async refresh(dto) {
        const tokens = await this.auth.refresh(dto.refreshToken).catch(() => {
            throw new common_1.HttpException('Invalid refresh token', common_1.HttpStatus.UNAUTHORIZED);
        });
        return tokens;
    }
    async forgotPassword(dto) {
        const _result = await this.auth.forgotPassword(dto.email).catch(() => {
            throw new common_1.HttpException('Failed to process forgot password request', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        });
        return { message: 'If the email exists, a password reset link has been sent' };
    }
    async resetPassword(dto) {
        const _result = await this.auth.resetPassword(dto.token, dto.newPassword).catch(() => {
            throw new common_1.HttpException('Invalid or expired reset token', common_1.HttpStatus.BAD_REQUEST);
        });
        return { message: 'Password has been reset successfully' };
    }
    async changePassword(req, dto) {
        const userId = req.user?.sub;
        if (!userId)
            throw new common_1.HttpException('User not authenticated', common_1.HttpStatus.UNAUTHORIZED);
        const _result = await this.auth.changePassword(userId, dto.currentPassword, dto.newPassword).catch(() => {
            throw new common_1.HttpException('Current password is incorrect', common_1.HttpStatus.BAD_REQUEST);
        });
        return { message: 'Password has been changed successfully' };
    }
    async me(req) {
        const userId = req.user?.sub;
        if (!userId)
            return { userId: null };
        const u = await this.users.findById(userId);
        return { userId, email: u?.email ?? null, role: u?.role ?? null };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "status", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 3600000 } }),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Put)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, throttler_1.SkipThrottle)(),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map