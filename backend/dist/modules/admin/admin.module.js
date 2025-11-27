"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../../prisma/prisma.module");
const guards_module_1 = require("../auth/guards.module");
const activity_log_service_1 = require("../logging/activity-log.service");
const monitoring_module_1 = require("../monitoring/monitoring.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, prisma_module_1.PrismaModule, guards_module_1.GuardsModule, monitoring_module_1.MonitoringModule],
        controllers: [admin_controller_1.AdminController],
        providers: [activity_log_service_1.ActivityLogService],
        exports: [],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map