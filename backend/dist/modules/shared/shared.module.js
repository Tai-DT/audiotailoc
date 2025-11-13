"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_guard_1 = require("../auth/admin.guard");
const admin_or_key_guard_1 = require("../auth/admin-or-key.guard");
const jwt_guard_1 = require("../auth/jwt.guard");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [admin_guard_1.AdminGuard, admin_or_key_guard_1.AdminOrKeyGuard, jwt_guard_1.JwtGuard],
        exports: [admin_guard_1.AdminGuard, admin_or_key_guard_1.AdminOrKeyGuard, jwt_guard_1.JwtGuard],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map