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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const security_service_1 = require("../security/security.service");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(users, config, securityService) {
        this.users = users;
        this.config = config;
        this.securityService = securityService;
    }
    async register(dto) {
        return this.users.create({ email: dto.email, password: dto.password, name: dto.name ?? '' });
    }
    async login(dto) {
        console.log('🔍 Login attempt for:', dto.email);
        if (this.securityService.isAccountLocked(dto.email)) {
            const remainingTime = this.securityService.getRemainingLockoutTime(dto.email);
            console.log('🔒 Account is locked, remaining time:', Math.ceil(remainingTime / 60000), 'minutes');
            throw new Error(`Account is locked. Try again in ${Math.ceil(remainingTime / 60000)} minutes.`);
        }
        const user = await this.users.findByEmail(dto.email);
        console.log('👤 User lookup result:', !!user);
        if (user) {
            console.log('   User ID:', user.id);
            console.log('   User Email:', user.email);
            console.log('   User Role:', user.role);
            console.log('   Password hash exists:', !!user.password);
        }
        if (!user) {
            console.log('❌ User not found in database');
            throw new Error('not found');
        }
        console.log('🔐 Comparing passwords...');
        const ok = await bcrypt.compare(dto.password, user.password);
        console.log('🔐 Password comparison result:', ok);
        const success = ok;
        this.securityService.recordLoginAttempt(dto.email, success);
        if (!ok) {
            console.log('❌ Password mismatch');
            throw new Error('bad pass');
        }
        console.log('✅ Login successful, generating tokens...');
        const accessSecret = this.config.get('JWT_ACCESS_SECRET') || 'dev_access';
        const refreshSecret = this.config.get('JWT_REFRESH_SECRET') || 'dev_refresh';
        const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role ?? 'USER' }, accessSecret, { expiresIn: '15m' });
        const refreshTokenExpiry = dto.rememberMe ? '30d' : '7d';
        const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: refreshTokenExpiry });
        console.log('✅ Tokens generated successfully');
        return { accessToken, refreshToken, userId: user.id };
    }
    async refresh(refreshToken) {
        try {
            const refreshSecret = this.config.get('JWT_REFRESH_SECRET') || 'dev_refresh';
            const payload = jwt.verify(refreshToken, refreshSecret);
            const user = await this.users.findById(payload.sub);
            if (!user)
                throw new Error('User not found');
            const accessSecret = this.config.get('JWT_ACCESS_SECRET') || 'dev_access';
            const newAccessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role ?? 'USER' }, accessSecret, { expiresIn: '15m' });
            return { accessToken: newAccessToken, refreshToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    async forgotPassword(email) {
        const user = await this.users.findByEmail(email);
        if (!user) {
            return { success: true };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const _resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        console.log(`Password reset token for ${email}: ${resetToken}`);
        console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);
        return { success: true };
    }
    async resetPassword(token, newPassword) {
        if (!token || token.length !== 64) {
            throw new Error('Invalid reset token');
        }
        const mockUserId = 'demo-user-id';
        const _hashedPassword = await bcrypt.hash(newPassword, 12);
        console.log(`Password reset for user ${mockUserId} with token ${token}`);
        return { success: true };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.users.updatePassword(userId, hashedPassword);
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService,
        security_service_1.SecurityService])
], AuthService);
//# sourceMappingURL=auth.service.js.map