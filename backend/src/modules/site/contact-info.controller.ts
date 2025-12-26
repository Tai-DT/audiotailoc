import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

interface ContactInfo {
    phone: {
        hotline: string;
        display: string;
    };
    email: string;
    address: {
        full: string;
        street: string;
        ward: string;
        district: string;
        city: string;
        country: string;
    };
    social: {
        facebook: string;
        instagram: string;
        youtube: string;
        zalo: string;
    };
    businessHours: {
        display: string;
    };
    zalo: {
        phoneNumber: string;
        displayName: string;
    };
}

const DEFAULT_CONTACT: ContactInfo = {
    phone: {
        hotline: '0768426262',
        display: '0768 426 262',
    },
    email: 'audiotailoc@gmail.com',
    address: {
        full: '37/9 Đường 44, Phường Linh Đông, TP. Thủ Đức, TP.HCM',
        street: '37/9 Đường 44',
        ward: 'Phường Linh Đông',
        district: 'TP. Thủ Đức',
        city: 'TP. Hồ Chí Minh',
        country: 'Việt Nam',
    },
    social: {
        facebook: 'https://facebook.com/audiotailoc',
        instagram: 'https://instagram.com/audiotailoc',
        youtube: 'https://youtube.com/audiotailoc',
        zalo: 'https://zalo.me/0768426262',
    },
    businessHours: {
        display: '08:00 - 21:00 (T2 - CN)',
    },
    zalo: {
        phoneNumber: '0768426262',
        displayName: 'Audio Tài Lộc',
    },
};

@Controller('site/contact-info')
export class ContactInfoController {
    constructor(private readonly prisma: PrismaService) { }

    // Public: Get contact info
    @Get()
    async getContactInfo(): Promise<ContactInfo> {
        try {
            const setting = await this.prisma.site_settings.findUnique({
                where: { key: 'contact_info' },
            });

            if (setting && setting.value) {
                return JSON.parse(setting.value);
            }
            return DEFAULT_CONTACT;
        } catch {
            return DEFAULT_CONTACT;
        }
    }

    // Admin: Update contact info
    @Patch()
    @UseGuards(JwtGuard, AdminGuard)
    async updateContactInfo(@Body() data: Partial<ContactInfo>): Promise<ContactInfo> {
        const current = await this.getContactInfo();
        const updated = { ...current, ...data };

        await this.prisma.site_settings.upsert({
            where: { key: 'contact_info' },
            update: {
                value: JSON.stringify(updated),
                updatedAt: new Date(),
            },
            create: {
                id: crypto.randomUUID(),
                key: 'contact_info',
                value: JSON.stringify(updated),
                updatedAt: new Date(),
            },
        });

        return updated;
    }
}
