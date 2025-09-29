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
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
const config_1 = require("@nestjs/config");
let MonitoringService = class MonitoringService {
    constructor(configService) {
        this.configService = configService;
        this.requestCounter = new prom_client_1.Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
        });
        this.responseTimeHistogram = new prom_client_1.Histogram({
            name: 'http_request_duration_seconds',
            help: 'HTTP request duration in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.1, 0.5, 1, 2, 5, 10],
        });
        this.activeConnectionsGauge = new prom_client_1.Gauge({
            name: 'active_websocket_connections',
            help: 'Number of active WebSocket connections',
            labelNames: ['type'],
        });
        this.dbConnectionPoolGauge = new prom_client_1.Gauge({
            name: 'database_connection_pool_size',
            help: 'Database connection pool size',
            labelNames: ['state'],
        });
        this.memoryUsageGauge = new prom_client_1.Gauge({
            name: 'memory_usage_bytes',
            help: 'Memory usage in bytes',
            labelNames: ['type'],
        });
        this.errorCounter = new prom_client_1.Counter({
            name: 'application_errors_total',
            help: 'Total number of application errors',
            labelNames: ['type', 'endpoint'],
        });
        setInterval(() => this.updateMemoryMetrics(), 30000);
    }
    recordRequest(method, route, statusCode, duration) {
        this.requestCounter.inc({ method, route, status_code: statusCode.toString() });
        this.responseTimeHistogram.observe({ method, route, status_code: statusCode.toString() }, duration / 1000);
    }
    updateActiveConnections(type, count) {
        this.activeConnectionsGauge.set({ type }, count);
    }
    updateDatabasePoolMetrics(used, available, pending) {
        this.dbConnectionPoolGauge.set({ state: 'used' }, used);
        this.dbConnectionPoolGauge.set({ state: 'available' }, available);
        this.dbConnectionPoolGauge.set({ state: 'pending' }, pending);
    }
    recordError(type, endpoint) {
        this.errorCounter.inc({ type, endpoint });
    }
    updateMemoryMetrics() {
        const memUsage = process.memoryUsage();
        this.memoryUsageGauge.set({ type: 'rss' }, memUsage.rss);
        this.memoryUsageGauge.set({ type: 'heapUsed' }, memUsage.heapUsed);
        this.memoryUsageGauge.set({ type: 'heapTotal' }, memUsage.heapTotal);
        this.memoryUsageGauge.set({ type: 'external' }, memUsage.external);
    }
    getMetrics() {
        return prom_client_1.register.metrics();
    }
    getHealthCheck() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.env.npm_package_version || '1.0.0',
        };
    }
    getDetailedHealth() {
        const memUsage = process.memoryUsage();
        const totalMemory = memUsage.heapUsed + memUsage.heapTotal;
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                used: Math.round(memUsage.heapUsed / 1024 / 1024),
                total: Math.round(totalMemory / 1024 / 1024),
                percentage: Math.round((memUsage.heapUsed / totalMemory) * 100),
            },
            system: {
                platform: process.platform,
                nodeVersion: process.version,
                pid: process.pid,
            },
            database: {
                status: 'connected',
                lastCheck: new Date().toISOString(),
            },
        };
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map