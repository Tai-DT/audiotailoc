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
var PerformanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceService = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../caching/cache.service");
let PerformanceService = PerformanceService_1 = class PerformanceService {
    constructor(cacheService) {
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(PerformanceService_1.name);
        this.metrics = [];
        this.requestMetrics = [];
        this.maxMetrics = 10000;
        setInterval(() => {
            this.cleanupMetrics();
        }, 60 * 60 * 1000);
    }
    recordMetric(name, value, tags) {
        const metric = {
            name,
            value,
            timestamp: new Date(),
            tags,
        };
        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }
        if (this.shouldLogMetric(name, value)) {
            this.logger.log(`Metric: ${name} = ${value}`, tags);
        }
    }
    recordRequest(metrics) {
        this.requestMetrics.push(metrics);
        if (this.requestMetrics.length > this.maxMetrics) {
            this.requestMetrics = this.requestMetrics.slice(-this.maxMetrics);
        }
        if (metrics.duration > 1000) {
            this.logger.warn(`Slow request: ${metrics.method} ${metrics.path} took ${metrics.duration}ms`);
        }
        this.updateAggregatedMetrics(metrics);
    }
    async getStats(timeRange = 'hour') {
        const now = new Date();
        const timeRangeMs = this.getTimeRangeMs(timeRange);
        const cutoff = new Date(now.getTime() - timeRangeMs);
        const recentRequests = this.requestMetrics.filter(r => r.timestamp >= cutoff);
        const totalRequests = recentRequests.length;
        const averageResponseTime = totalRequests > 0
            ? recentRequests.reduce((sum, r) => sum + r.duration, 0) / totalRequests
            : 0;
        const errorRequests = recentRequests.filter(r => r.statusCode >= 400).length;
        const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
        const requestsPerMinute = totalRequests / (timeRangeMs / 60000);
        const endpointStats = new Map();
        recentRequests.forEach(request => {
            const key = `${request.method}:${request.path}`;
            const existing = endpointStats.get(key) || {
                count: 0,
                totalDuration: 0,
                errors: 0,
                method: request.method,
            };
            existing.count++;
            existing.totalDuration += request.duration;
            if (request.statusCode >= 400) {
                existing.errors++;
            }
            endpointStats.set(key, existing);
        });
        const endpoints = Array.from(endpointStats.entries())
            .map(([key, stats]) => ({
            path: key.split(':')[1],
            method: stats.method,
            count: stats.count,
            averageResponseTime: stats.totalDuration / stats.count,
            errorRate: (stats.errors / stats.count) * 100,
        }))
            .sort((a, b) => b.count - a.count);
        const memoryUsage = process.memoryUsage();
        const uptime = process.uptime();
        const cpuUsage = process.cpuUsage();
        const cacheStats = await this.cacheService.getStats();
        return {
            requests: {
                total: totalRequests,
                averageResponseTime,
                errorRate,
                requestsPerMinute,
            },
            endpoints,
            system: {
                memoryUsage,
                uptime,
                cpuUsage,
            },
            cache: {
                hitRate: 0,
                keyCount: cacheStats.keysCount || 0,
                memoryUsage: cacheStats.memoryUsage || 'Unknown',
            },
        };
    }
    getRealTimeMetrics() {
        return {
            activeRequests: this.getActiveRequestCount(),
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
        };
    }
    getCustomMetrics(name, timeRange = 'hour') {
        const now = new Date();
        const timeRangeMs = this.getTimeRangeMs(timeRange);
        const cutoff = new Date(now.getTime() - timeRangeMs);
        let filtered = this.metrics.filter(m => m.timestamp >= cutoff);
        if (name) {
            filtered = filtered.filter(m => m.name === name);
        }
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    async getHealthStatus() {
        const checks = [];
        let overallStatus = 'healthy';
        const memoryUsage = process.memoryUsage();
        const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
        checks.push({
            name: 'memory',
            status: memoryUsagePercent < 90 ? 'pass' : 'fail',
            message: `Memory usage: ${memoryUsagePercent.toFixed(1)}%`,
        });
        if (memoryUsagePercent > 90) {
            overallStatus = 'unhealthy';
        }
        else if (memoryUsagePercent > 80) {
            overallStatus = 'degraded';
        }
        const recentRequests = this.requestMetrics.slice(-100);
        if (recentRequests.length > 0) {
            const avgResponseTime = recentRequests.reduce((sum, r) => sum + r.duration, 0) / recentRequests.length;
            checks.push({
                name: 'response_time',
                status: avgResponseTime < 1000 ? 'pass' : 'fail',
                message: `Average response time: ${avgResponseTime.toFixed(0)}ms`,
                duration: avgResponseTime,
            });
            if (avgResponseTime > 2000) {
                overallStatus = 'unhealthy';
            }
            else if (avgResponseTime > 1000 && overallStatus === 'healthy') {
                overallStatus = 'degraded';
            }
        }
        const recentErrors = recentRequests.filter(r => r.statusCode >= 500).length;
        const errorRate = recentRequests.length > 0 ? (recentErrors / recentRequests.length) * 100 : 0;
        checks.push({
            name: 'error_rate',
            status: errorRate < 5 ? 'pass' : 'fail',
            message: `Error rate: ${errorRate.toFixed(1)}%`,
        });
        if (errorRate > 10) {
            overallStatus = 'unhealthy';
        }
        else if (errorRate > 5 && overallStatus === 'healthy') {
            overallStatus = 'degraded';
        }
        try {
            const cacheStats = await this.cacheService.getStats();
            checks.push({
                name: 'cache',
                status: cacheStats.connected ? 'pass' : 'fail',
                message: cacheStats.connected ? 'Cache connected' : 'Cache disconnected',
            });
            if (!cacheStats.connected && overallStatus === 'healthy') {
                overallStatus = 'degraded';
            }
        }
        catch (error) {
            checks.push({
                name: 'cache',
                status: 'fail',
                message: 'Cache check failed',
            });
            overallStatus = 'degraded';
        }
        return {
            status: overallStatus,
            checks,
        };
    }
    shouldLogMetric(name, value) {
        if (name.includes('db_query') && value > 100)
            return true;
        if (name.includes('cache_miss_rate') && value > 50)
            return true;
        if (name.includes('api_response_time') && value > 500)
            return true;
        return false;
    }
    updateAggregatedMetrics(request) {
        const key = `metrics:requests:${request.method}:${request.path}`;
        this.cacheService.increment(key, 1, { ttl: 3600 });
    }
    getTimeRangeMs(timeRange) {
        switch (timeRange) {
            case 'hour':
                return 60 * 60 * 1000;
            case 'day':
                return 24 * 60 * 60 * 1000;
            case 'week':
                return 7 * 24 * 60 * 60 * 1000;
            default:
                return 60 * 60 * 1000;
        }
    }
    getActiveRequestCount() {
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
        return this.requestMetrics.filter(r => r.timestamp >= thirtySecondsAgo).length;
    }
    cleanupMetrics() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
        this.requestMetrics = this.requestMetrics.filter(r => r.timestamp > oneHourAgo);
        this.logger.log(`Cleaned up old metrics. Current count: ${this.metrics.length} metrics, ${this.requestMetrics.length} requests`);
    }
};
exports.PerformanceService = PerformanceService;
exports.PerformanceService = PerformanceService = PerformanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], PerformanceService);
//# sourceMappingURL=performance.service.js.map