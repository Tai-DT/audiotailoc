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
const prisma_service_1 = require("../../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        const configs = await this.prisma.system_configs.findMany({
            where: {
                key: {
                    startsWith: 'site.',
                },
            },
        });
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
    async updateSettings(data) {
        const updates = [];
        if (data.general) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.general' },
                update: {
                    value: JSON.stringify(data.general),
                    type: 'JSON',
                },
                create: {
                    id: crypto.randomUUID(),
                    updatedAt: new Date(),
                    key: 'site.general',
                    value: JSON.stringify(data.general),
                    type: 'JSON',
                },
            }));
        }
        if (data.about) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.about' },
                update: {
                    value: JSON.stringify(data.about),
                    type: 'JSON',
                },
                create: {
                    id: crypto.randomUUID(),
                    updatedAt: new Date(),
                    key: 'site.about',
                    value: JSON.stringify(data.about),
                    type: 'JSON',
                },
            }));
        }
        if (data.socials) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.socials' },
                update: {
                    value: JSON.stringify(data.socials),
                    type: 'JSON',
                },
                create: {
                    id: crypto.randomUUID(),
                    updatedAt: new Date(),
                    key: 'site.socials',
                    value: JSON.stringify(data.socials),
                    type: 'JSON',
                },
            }));
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