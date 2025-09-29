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
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AdminGuard = class AdminGuard {
    constructor(usersService, config) {
        this.usersService = usersService;
        this.config = config;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        if (user.role === 'ADMIN') {
            return true;
        }
        if (user.sub) {
            try {
                const userDetails = await this.usersService.findById(user.sub);
                if (userDetails && userDetails.role === 'ADMIN') {
                    return true;
                }
                const adminEmails = this.config.get('ADMIN_EMAILS', '');
                if (adminEmails && userDetails) {
                    const allowedEmails = adminEmails.split(',').map(email => email.trim().toLowerCase());
                    return allowedEmails.includes(userDetails.email.toLowerCase());
                }
                return false;
            }
            catch (error) {
                return false;
            }
        }
        return false;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map