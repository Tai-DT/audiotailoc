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
var PerformanceInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const performance_service_1 = require("../../modules/monitoring/performance.service");
let PerformanceInterceptor = PerformanceInterceptor_1 = class PerformanceInterceptor {
    constructor(performanceService) {
        this.performanceService = performanceService;
        this.logger = new common_1.Logger(PerformanceInterceptor_1.name);
    }
    intercept(context, next) {
        const startTime = Date.now();
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, ip, headers } = request;
        const userAgent = headers['user-agent'];
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                this.recordMetrics(startTime, method, url, response.statusCode, ip, userAgent);
            },
            error: error => {
                const statusCode = error.status || 500;
                this.recordMetrics(startTime, method, url, statusCode, ip, userAgent);
            },
        }));
    }
    recordMetrics(startTime, method, path, statusCode, ip, userAgent) {
        const duration = Date.now() - startTime;
        const cleanPath = this.cleanPath(path);
        this.performanceService.recordRequest({
            method,
            path: cleanPath,
            statusCode,
            duration,
            timestamp: new Date(),
            userAgent,
            ip,
        });
        this.performanceService.recordMetric('api_response_time', duration, {
            method,
            path: cleanPath,
            status: statusCode.toString(),
        });
        if (duration > 1000) {
            this.logger.warn(`Slow request: ${method} ${cleanPath} - ${duration}ms`);
        }
        if (statusCode >= 400) {
            this.logger.error(`Error request: ${method} ${cleanPath} - ${statusCode} - ${duration}ms`);
        }
    }
    cleanPath(path) {
        const pathWithoutQuery = path.split('?')[0];
        return pathWithoutQuery
            .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
            .replace(/\/\d+/g, '/:id')
            .replace(/\/[a-z0-9-]+$/i, '/:slug');
    }
};
exports.PerformanceInterceptor = PerformanceInterceptor;
exports.PerformanceInterceptor = PerformanceInterceptor = PerformanceInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [performance_service_1.PerformanceService])
], PerformanceInterceptor);
//# sourceMappingURL=performance.interceptor.js.map