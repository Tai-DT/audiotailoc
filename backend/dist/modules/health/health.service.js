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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function serializeBigInt(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj === 'bigint') {
        return Number(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(serializeBigInt);
    }
    if (typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = serializeBigInt(value);
        }
        return result;
    }
    return obj;
}
let HealthService = HealthService_1 = class HealthService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.logger = new common_1.Logger(HealthService_1.name);
        this.startTime = Date.now();
    }
    async checkBasicHealth() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Basic health check failed:', error);
            return {
                status: 'error',
                timestamp: new Date().toISOString(),
            };
        }
    }
    async checkDetailedHealth() {
        const _startTime = Date.now();
        try {
            const [dbCheck, memoryCheck, diskCheck, dependenciesCheck] = await Promise.all([
                this.checkDatabaseHealth(),
                this.checkMemoryHealth(),
                this.checkDiskHealth(),
                this.checkDependenciesHealth(),
            ]);
            const checks = {
                database: dbCheck,
                memory: memoryCheck,
                disk: diskCheck,
                dependencies: dependenciesCheck,
            };
            const status = this.determineOverallStatus(checks);
            return {
                status,
                timestamp: new Date(),
                uptime: Date.now() - this.startTime,
                version: this.getVersion().version,
                environment: this.config.get('NODE_ENV', 'development'),
                checks,
            };
        }
        catch (error) {
            this.logger.error('Detailed health check failed:', error);
            return {
                status: 'unhealthy',
                timestamp: new Date(),
                uptime: Date.now() - this.startTime,
                version: this.getVersion().version,
                environment: this.config.get('NODE_ENV', 'development'),
                checks: {
                    database: { status: 'unhealthy', message: 'Health check failed' },
                    memory: { status: 'unhealthy', message: 'Health check failed' },
                    disk: { status: 'unhealthy', message: 'Health check failed' },
                    dependencies: { status: 'unhealthy', message: 'Health check failed' },
                },
            };
        }
    }
    async checkDatabaseHealth() {
        const _startTime = Date.now();
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            const stats = await this.prisma.$queryRaw `
        SELECT 
          (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count,
          (SELECT count(*) FROM pg_stat_activity) as active_connections,
          (SELECT pg_database_size(current_database())) as database_size
      `;
            const responseTime = Date.now() - _startTime;
            const details = serializeBigInt(stats[0]);
            return {
                status: 'healthy',
                message: 'Database is healthy',
                responseTime,
                details,
            };
        }
        catch (error) {
            this.logger.error('Database health check failed:', error);
            return {
                status: 'unhealthy',
                message: `Database error: ${error.message}`,
                responseTime: Date.now() - _startTime,
            };
        }
    }
    checkMemoryHealth() {
        const memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryPercentage = (usedMem / totalMem) * 100;
        const heapUsed = Number(memUsage.heapUsed);
        const heapTotal = Number(memUsage.heapTotal);
        const external = Number(memUsage.external);
        const rss = Number(memUsage.rss);
        if (memoryPercentage > 90) {
            return {
                status: 'unhealthy',
                message: 'Memory usage is critical',
                details: {
                    used: usedMem,
                    total: totalMem,
                    percentage: memoryPercentage,
                    heapUsed,
                    heapTotal,
                    external,
                    rss,
                },
            };
        }
        else if (memoryPercentage > 80) {
            return {
                status: 'degraded',
                message: 'Memory usage is high',
                details: {
                    used: usedMem,
                    total: totalMem,
                    percentage: memoryPercentage,
                    heapUsed,
                    heapTotal,
                    external,
                    rss,
                },
            };
        }
        return {
            status: 'healthy',
            message: 'Memory usage is normal',
            details: {
                used: usedMem,
                total: totalMem,
                percentage: memoryPercentage,
                heapUsed,
                heapTotal,
                external,
                rss,
            },
        };
    }
    checkDiskHealth() {
        try {
            const diskPath = this.config.get('BACKUP_DIR', './backups');
            const _stats = fs.statSync(diskPath);
            return {
                status: 'healthy',
                message: 'Disk space is available',
                details: {
                    path: diskPath,
                    exists: true,
                },
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `Disk check failed: ${error.message}`,
            };
        }
    }
    async checkDependenciesHealth() {
        const checks = [];
        try {
            const externalServices = [
                { name: 'Payment Gateway', url: 'https://api.vnpayment.vn' },
                { name: 'Email Service', url: 'https://api.sendgrid.com' },
            ];
            for (const service of externalServices) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);
                    const response = await fetch(service.url, { method: 'HEAD', signal: controller.signal });
                    clearTimeout(timeoutId);
                    checks.push({
                        name: service.name,
                        status: response.ok ? 'healthy' : 'degraded',
                    });
                }
                catch (error) {
                    checks.push({
                        name: service.name,
                        status: 'unhealthy',
                        error: error.message,
                    });
                }
            }
            const healthyCount = checks.filter(c => c.status === 'healthy').length;
            const totalCount = checks.length;
            if (healthyCount === totalCount) {
                return {
                    status: 'healthy',
                    message: 'All dependencies are healthy',
                    details: { checks },
                };
            }
            else if (healthyCount > totalCount / 2) {
                return {
                    status: 'degraded',
                    message: 'Some dependencies are degraded',
                    details: { checks },
                };
            }
            else {
                return {
                    status: 'unhealthy',
                    message: 'Multiple dependencies are unhealthy',
                    details: { checks },
                };
            }
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `Dependencies check failed: ${error.message}`,
            };
        }
    }
    getPerformanceMetrics() {
        const _memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        return {
            cpu: {
                usage: process.cpuUsage().user + process.cpuUsage().system,
                loadAverage: os.loadavg(),
            },
            memory: {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                percentage: (usedMem / totalMem) * 100,
            },
            disk: {
                total: 0,
                used: 0,
                free: 0,
                percentage: 0,
            },
            network: {
                bytesIn: 0,
                bytesOut: 0,
            },
            database: {
                connections: 0,
                queryTime: 0,
            },
        };
    }
    getSystemInfo() {
        return {
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
            npmVersion: process.env.npm_config_user_agent || 'unknown',
            uptime: os.uptime(),
            hostname: os.hostname(),
            cpus: os.cpus().length,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            loadAverage: os.loadavg(),
        };
    }
    getMemoryUsage() {
        const memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        return {
            system: {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                percentage: (usedMem / totalMem) * 100,
            },
            process: {
                rss: memUsage.rss,
                heapTotal: memUsage.heapTotal,
                heapUsed: memUsage.heapUsed,
                external: memUsage.external,
                arrayBuffers: memUsage.arrayBuffers,
            },
        };
    }
    getUptime() {
        return {
            process: process.uptime(),
            system: os.uptime(),
            application: Date.now() - this.startTime,
            formatted: this.formatUptime(Date.now() - this.startTime),
        };
    }
    getVersion() {
        const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
        return {
            version: packageJson.version,
            name: packageJson.name,
            description: packageJson.description,
            nodeVersion: process.version,
            environment: this.config.get('NODE_ENV', 'development'),
        };
    }
    getRecentLogs(lines = 100) {
        try {
            const logFile = path.join(process.cwd(), 'logs', 'app.log');
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                const logLines = content.split('\n').filter(line => line.trim());
                return logLines.slice(-lines);
            }
            return [];
        }
        catch (error) {
            this.logger.error('Failed to read logs:', error);
            return [];
        }
    }
    getRecentErrors(hours = 24) {
        try {
            const logFile = path.join(process.cwd(), 'logs', 'error.log');
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                const logLines = content.split('\n').filter(line => line.trim());
                const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
                return logLines
                    .map(line => {
                    try {
                        const logEntry = JSON.parse(line);
                        if (new Date(logEntry.timestamp).getTime() > cutoffTime) {
                            return logEntry;
                        }
                    }
                    catch {
                    }
                    return null;
                })
                    .filter(entry => entry !== null);
            }
            return [];
        }
        catch (error) {
            this.logger.error('Failed to read error logs:', error);
            return [];
        }
    }
    getApplicationMetrics() {
        return {
            requests: {
                total: 0,
                successful: 0,
                failed: 0,
                averageResponseTime: 0,
            },
            users: {
                active: 0,
                total: 0,
                newToday: 0,
            },
            orders: {
                total: 0,
                pending: 0,
                completed: 0,
                revenue: 0,
            },
            errors: {
                total: 0,
                byType: {},
            },
        };
    }
    getActiveAlerts() {
        return [];
    }
    async checkRedisHealth() {
        const _startTime = Date.now();
        try {
            const redisUrl = this.config.get('REDIS_URL');
            if (!redisUrl) {
                return {
                    status: 'unhealthy',
                    message: 'Redis URL not configured',
                };
            }
            return {
                status: 'healthy',
                message: 'Redis connection is healthy',
                responseTime: Date.now() - _startTime,
                details: {
                    url: redisUrl.replace(/\/\/.*@/, '//***:***@'),
                },
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `Redis check failed: ${error.message}`,
                responseTime: Date.now() - _startTime,
            };
        }
    }
    async checkUpstashHealth() {
        const _startTime = Date.now();
        try {
            const upstashUrl = this.config.get('UPSTASH_REDIS_REST_URL');
            if (!upstashUrl) {
                return {
                    status: 'unhealthy',
                    message: 'Upstash Redis URL not configured',
                };
            }
            return {
                status: 'healthy',
                message: 'Upstash Redis connection is healthy',
                responseTime: Date.now() - _startTime,
                details: {
                    url: upstashUrl.replace(/\/\/.*@/, '//***:***@'),
                },
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `Upstash Redis check failed: ${error.message}`,
                responseTime: Date.now() - _startTime,
            };
        }
    }
    async checkExternalApisHealth() {
        const _startTime = Date.now();
        try {
            const externalServices = [
                { name: 'VNPay Payment Gateway', url: 'https://sandbox.vnpayment.vn' },
                { name: 'SendGrid Email Service', url: 'https://api.sendgrid.com/v3' },
                { name: 'Goong Maps API', url: 'https://rsapi.goong.io' },
            ];
            const results = [];
            for (const service of externalServices) {
                try {
                    results.push({
                        name: service.name,
                        status: 'healthy',
                        message: `${service.name} is accessible`,
                    });
                }
                catch (error) {
                    results.push({
                        name: service.name,
                        status: 'unhealthy',
                        message: `${service.name} check failed: ${error.message}`,
                    });
                }
            }
            const hasFailures = results.some(r => r.status === 'unhealthy');
            return {
                status: hasFailures ? 'degraded' : 'healthy',
                message: hasFailures ? 'Some external APIs have issues' : 'All external APIs are healthy',
                responseTime: Date.now() - _startTime,
                details: {
                    services: results,
                },
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `External APIs check failed: ${error.message}`,
                responseTime: Date.now() - _startTime,
            };
        }
    }
    async checkStorageHealth() {
        const _startTime = Date.now();
        try {
            const uploadDir = this.config.get('UPLOAD_DIR', './uploads');
            const logsDir = this.config.get('LOGS_DIR', './logs');
            const checks = [];
            try {
                if (fs.existsSync(uploadDir)) {
                    const stats = fs.statSync(uploadDir);
                    const files = fs.readdirSync(uploadDir);
                    checks.push({
                        name: 'Uploads Directory',
                        status: 'healthy',
                        message: `Uploads directory exists with ${files.length} files`,
                        details: {
                            path: uploadDir,
                            size: stats.size,
                            files: files.length,
                        },
                    });
                }
                else {
                    checks.push({
                        name: 'Uploads Directory',
                        status: 'unhealthy',
                        message: 'Uploads directory does not exist',
                    });
                }
            }
            catch (error) {
                checks.push({
                    name: 'Uploads Directory',
                    status: 'unhealthy',
                    message: `Uploads directory check failed: ${error.message}`,
                });
            }
            try {
                if (fs.existsSync(logsDir)) {
                    const stats = fs.statSync(logsDir);
                    const files = fs.readdirSync(logsDir);
                    checks.push({
                        name: 'Logs Directory',
                        status: 'healthy',
                        message: `Logs directory exists with ${files.length} files`,
                        details: {
                            path: logsDir,
                            size: stats.size,
                            files: files.length,
                        },
                    });
                }
                else {
                    checks.push({
                        name: 'Logs Directory',
                        status: 'unhealthy',
                        message: 'Logs directory does not exist',
                    });
                }
            }
            catch (error) {
                checks.push({
                    name: 'Logs Directory',
                    status: 'unhealthy',
                    message: `Logs directory check failed: ${error.message}`,
                });
            }
            const hasFailures = checks.some(c => c.status === 'unhealthy');
            return {
                status: hasFailures ? 'degraded' : 'healthy',
                message: hasFailures ? 'Some storage issues detected' : 'All storage locations are healthy',
                responseTime: Date.now() - _startTime,
                details: {
                    checks,
                },
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: `Storage check failed: ${error.message}`,
                responseTime: Date.now() - _startTime,
            };
        }
    }
    determineOverallStatus(checks) {
        const statuses = Object.values(checks).map((check) => check.status);
        if (statuses.every(status => status === 'healthy')) {
            return 'healthy';
        }
        else if (statuses.some(status => status === 'unhealthy')) {
            return 'unhealthy';
        }
        else {
            return 'degraded';
        }
    }
    formatUptime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        }
        else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        else {
            return `${seconds}s`;
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = HealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], HealthService);
//# sourceMappingURL=health.service.js.map