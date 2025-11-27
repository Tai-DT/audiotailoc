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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../notifications/mail.service");
const nodemailer = __importStar(require("nodemailer"));
let SettingsService = class SettingsService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async sendTestEmail(to, config) {
        if (config) {
            try {
                const transporter = nodemailer.createTransport({
                    host: config.host,
                    port: config.port,
                    secure: config.port === 465,
                    auth: {
                        user: config.user,
                        pass: config.pass,
                    },
                });
                await transporter.verify();
                await transporter.sendMail({
                    from: config.from || config.user,
                    to,
                    subject: 'Test Email from Audio Tài Lộc Settings',
                    text: 'This is a test email to verify your SMTP settings.',
                    html: '<p>This is a test email to verify your SMTP settings.</p>',
                });
                return { success: true, message: 'Email sent successfully' };
            }
            catch (error) {
                throw new Error(`Failed to send test email: ${error.message}`);
            }
        }
        else {
            try {
                const emailSettings = await this.getSection('email');
                if (emailSettings && emailSettings.smtp) {
                    return this.sendTestEmail(to, {
                        host: emailSettings.smtp.host,
                        port: Number(emailSettings.smtp.port),
                        user: emailSettings.smtp.user,
                        pass: emailSettings.smtp.pass,
                        from: emailSettings.smtp.from,
                    });
                }
                await this.mailService.send(to, 'Test Email from Audio Tài Lộc Settings', 'This is a test email to verify your SMTP settings.');
                return { success: true, message: 'Email sent successfully using system configuration' };
            }
            catch (error) {
                throw new Error(`Failed to send test email: ${error.message}`);
            }
        }
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
                    updatedAt: new Date(),
                },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    key: 'site.general',
                    value: JSON.stringify(data.general),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
            }));
        }
        if (data.about) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.about' },
                update: {
                    value: JSON.stringify(data.about),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    key: 'site.about',
                    value: JSON.stringify(data.about),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
            }));
        }
        if (data.socials) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.socials' },
                update: {
                    value: JSON.stringify(data.socials),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    key: 'site.socials',
                    value: JSON.stringify(data.socials),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
            }));
        }
        if (data.business) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.business' },
                update: {
                    value: JSON.stringify(data.business),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    key: 'site.business',
                    value: JSON.stringify(data.business),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
            }));
        }
        if (data.email) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.email' },
                update: {
                    value: JSON.stringify(data.email),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    key: 'site.email',
                    value: JSON.stringify(data.email),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
            }));
        }
        if (data.notifications) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.notifications' },
                update: {
                    value: JSON.stringify(data.notifications),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    key: 'site.notifications',
                    value: JSON.stringify(data.notifications),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
            }));
        }
        if (data.security) {
            updates.push(this.prisma.system_configs.upsert({
                where: { key: 'site.security' },
                update: {
                    value: JSON.stringify(data.security),
                    type: 'JSON',
                    updatedAt: new Date(),
                },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    key: 'site.security',
                    value: JSON.stringify(data.security),
                    type: 'JSON',
                    updatedAt: new Date(),
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map