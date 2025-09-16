import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const configs = await this.prisma.systemConfig.findMany({
      where: {
        key: {
          startsWith: 'site.',
        },
      },
    });

    const settings: Record<string, any> = {};
    for (const config of configs) {
      const section = config.key.split('.')[1];
      try {
        settings[section] = JSON.parse(config.value);
      } catch {
        settings[section] = config.value;
      }
    }

    return settings;
  }

  async getSection(section: string) {
    const config = await this.prisma.systemConfig.findUnique({
      where: {
        key: `site.${section}`,
      },
    });

    if (!config) {
      return null;
    }

    try {
      return JSON.parse(config.value);
    } catch {
      return config.value;
    }
  }

  async updateSettings(data: UpdateSettingsDto) {
    const updates = [];

    if (data.general) {
      updates.push(
        this.prisma.systemConfig.upsert({
          where: { key: 'site.general' },
          update: { 
            value: JSON.stringify(data.general),
            type: 'JSON',
          },
          create: {
            key: 'site.general',
            value: JSON.stringify(data.general),
            type: 'JSON',
          },
        })
      );
    }

    if (data.about) {
      updates.push(
        this.prisma.systemConfig.upsert({
          where: { key: 'site.about' },
          update: { 
            value: JSON.stringify(data.about),
            type: 'JSON',
          },
          create: {
            key: 'site.about',
            value: JSON.stringify(data.about),
            type: 'JSON',
          },
        })
      );
    }

    if (data.socials) {
      updates.push(
        this.prisma.systemConfig.upsert({
          where: { key: 'site.socials' },
          update: { 
            value: JSON.stringify(data.socials),
            type: 'JSON',
          },
          create: {
            key: 'site.socials',
            value: JSON.stringify(data.socials),
            type: 'JSON',
          },
        })
      );
    }

    if (updates.length > 0) {
      await this.prisma.$transaction(updates);
    }

    return this.getSettings();
  }
}
