"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const backup_controller_1 = require("./backup.controller");
const backup_service_1 = require("./backup.service");
const backup_scheduler_service_1 = require("./backup-scheduler.service");
const logging_module_1 = require("../logging/logging.module");
const prisma_module_1 = require("../../prisma/prisma.module");
let BackupModule = class BackupModule {
};
exports.BackupModule = BackupModule;
exports.BackupModule = BackupModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, logging_module_1.LoggingModule, prisma_module_1.PrismaModule],
        controllers: [backup_controller_1.BackupController],
        providers: [backup_service_1.BackupService, backup_scheduler_service_1.BackupSchedulerService],
        exports: [backup_service_1.BackupService, backup_scheduler_service_1.BackupSchedulerService],
    })
], BackupModule);
//# sourceMappingURL=backup.module.js.map