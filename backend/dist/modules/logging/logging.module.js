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
exports.LoggingModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const logging_service_1 = require("./logging.service");
const logging_interceptor_1 = require("./logging.interceptor");
const logging_middleware_1 = require("./logging.middleware");
const correlation_service_1 = require("./correlation.service");
const activity_log_service_1 = require("./activity-log.service");
let LoggingModule = class LoggingModule {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    configure(consumer) {
        consumer
            .apply(logging_middleware_1.LoggingMiddleware)
            .exclude('health', 'monitoring/health', 'api/v1/monitoring/health')
            .forRoutes('*');
    }
    onModuleDestroy() {
        const cleaned = this.constructor.cleanup();
        if (cleaned > 0) {
            this.loggingService.log(`Cleaned up ${cleaned} correlation contexts`, 'LoggingModule');
        }
    }
};
exports.LoggingModule = LoggingModule;
exports.LoggingModule = LoggingModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            logging_service_1.LoggingService,
            correlation_service_1.CorrelationService,
            activity_log_service_1.ActivityLogService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
        ],
        exports: [logging_service_1.LoggingService, correlation_service_1.CorrelationService, activity_log_service_1.ActivityLogService],
    }),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], LoggingModule);
//# sourceMappingURL=logging.module.js.map