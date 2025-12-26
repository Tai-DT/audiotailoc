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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
            log: [
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'warn' },
            ],
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
        this.isConnected = false;
        this.reconnectTimer = null;
        this.$on('error', (e) => {
            this.logger.error(`Prisma error: ${e.message}`);
            this.handleConnectionError();
        });
        const useAccelerate = process.env.USE_PRISMA_ACCELERATE === 'true' || process.env.NODE_ENV === 'production';
        if (useAccelerate) {
            Object.assign(this, this.$extends((0, extension_accelerate_1.withAccelerate)()));
        }
        const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
        const logDbUrl = (process.env.LOG_DB_URL || '').toLowerCase() === 'true';
        if (logPrisma && logDbUrl) {
            const url = process.env.DATABASE_URL || '';
            const masked = url.replace(/:(.*?)@/, ':***@');
            console.log('[Prisma] DATABASE_URL =', masked);
        }
    }
    async handleConnectionError() {
        if (this.reconnectTimer)
            return;
        this.isConnected = false;
        this.logger.warn('Database connection lost, attempting to reconnect...');
        this.reconnectTimer = setTimeout(async () => {
            try {
                await this.$disconnect();
                await this.$connect();
                this.isConnected = true;
                this.logger.log('Database reconnected successfully');
            }
            catch (error) {
                this.logger.error('Failed to reconnect to database:', error);
            }
            finally {
                this.reconnectTimer = null;
            }
        }, 1000);
    }
    async executeWithRetry(operation, maxRetries = 3) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                const isConnectionError = error.message?.includes('Closed') ||
                    error.message?.includes('Connection') ||
                    error.code === 'P1017' ||
                    error.code === 'P1001' ||
                    error.code === 'P1002';
                if (isConnectionError && attempt < maxRetries) {
                    this.logger.warn(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying...`);
                    await this.handleConnectionError();
                    await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
                }
                else {
                    throw error;
                }
            }
        }
        throw lastError;
    }
    getAcceleratedClient() {
        return this.$extends((0, extension_accelerate_1.withAccelerate)());
    }
    async onModuleInit() {
        if (process.env.ALLOW_START_WITHOUT_DB === 'true') {
            const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
            if (logPrisma)
                console.warn('[Prisma] Skipping DB connect on startup (ALLOW_START_WITHOUT_DB=true)');
            return;
        }
        const maxAttempts = Number(process.env.DB_CONNECT_MAX_ATTEMPTS || 20);
        const baseDelayMs = Number(process.env.DB_CONNECT_BASE_DELAY_MS || 500);
        let attempt = 0;
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        while (true) {
            try {
                attempt += 1;
                await this.$connect();
                const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
                if (logPrisma)
                    console.log(`[Prisma] Connected to database after ${attempt} attempt(s)`);
                break;
            }
            catch (err) {
                const isLast = attempt >= maxAttempts;
                const message = err?.message || String(err);
                const logPrisma = (process.env.LOG_PRISMA_STARTUP || '').toLowerCase() === 'true';
                if (logPrisma)
                    console.warn(`[Prisma] DB connection attempt ${attempt}/${maxAttempts} failed: ${message}`);
                if (isLast) {
                    if (process.env.ALLOW_START_WITHOUT_DB === 'fallback') {
                        if (logPrisma)
                            console.warn('[Prisma] Failed to connect after max attempts; continuing without DB (fallback mode)');
                        return;
                    }
                    throw err;
                }
                const jitter = Math.floor(Math.random() * 250);
                const delay = baseDelayMs * Math.min(attempt, 10) + jitter;
                await sleep(delay);
            }
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map