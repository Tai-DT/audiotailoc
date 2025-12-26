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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertSection(section, value) {
        return this.prisma.system_configs.upsert({
            where: { key: `site.${section}` },
            update: {
                value: JSON.stringify(value),
                type: 'JSON',
                updatedAt: new Date(),
            },
            create: {
                id: (0, crypto_1.randomUUID)(),
                key: `site.${section}`,
                value: JSON.stringify(value),
                type: 'JSON',
                updatedAt: new Date(),
            },
        });
    }
    buildSettingsObject(configs) {
        const settings = {};
        for (const config of configs) {
            const section = config.key.split('.')[1];
            try {
                settings[section] = JSON.parse(config.value);
            }
            catch {
                settings[section] = config.value;
            }
        }
        return settings;
    }
    async getSettings() {
        const configs = await this.prisma.system_configs.findMany({
            where: {
                key: {
                    startsWith: 'site.',
                },
            },
        });
        return this.buildSettingsObject(configs);
    }
    async getPublicSettings() {
        const allowedSections = new Set(['general', 'about', 'socials', 'store', 'business']);
        const configs = await this.prisma.system_configs.findMany({
            where: {
                key: {
                    startsWith: 'site.',
                },
            },
        });
        const filtered = configs.filter(c => {
            const section = c.key.split('.')[1];
            return allowedSections.has(section);
        });
        return this.buildSettingsObject(filtered);
    }
    async getSection(section) {
        const config = await this.prisma.system_configs.findUnique({
            where: {
                key: `site.${section}`,
            },
        });
        if (!config) {
            return null;
        }
        try {
            return JSON.parse(config.value);
        }
        catch {
            return config.value;
        }
    }
    async getPublicSection(section) {
        const allowedSections = new Set(['general', 'about', 'socials', 'store', 'business']);
        if (!allowedSections.has(section)) {
            return null;
        }
        return this.getSection(section);
    }
    async updateSettings(data) {
        const updates = [];
        if (data.general) {
            updates.push(this.upsertSection('general', data.general));
        }
        if (data.about) {
            updates.push(this.upsertSection('about', data.about));
        }
        if (data.socials) {
            updates.push(this.upsertSection('socials', data.socials));
        }
        if (data.store) {
            updates.push(this.upsertSection('store', data.store));
        }
        if (data.business) {
            updates.push(this.upsertSection('business', data.business));
        }
        if (data.email) {
            updates.push(this.upsertSection('email', data.email));
        }
        if (data.notifications) {
            updates.push(this.upsertSection('notifications', data.notifications));
        }
        if (data.security) {
            updates.push(this.upsertSection('security', data.security));
        }
        if (updates.length > 0) {
            await this.prisma.$transaction(updates);
        }
        return this.getSettings();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map