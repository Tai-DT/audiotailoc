import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  private async upsertSection(section: string, value: unknown) {
    return this.prisma.system_configs.upsert({
      where: { key: `site.${section}` },
      update: {
        value: JSON.stringify(value),
        type: 'JSON',
        updatedAt: new Date(),
      },
      create: {
        id: randomUUID(),
        key: `site.${section}`,
        value: JSON.stringify(value),
        type: 'JSON',
        updatedAt: new Date(),
      },
    });
  }

  private buildSettingsObject(configs: { key: string; value: string }[]) {
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

  async getSection(section: string) {
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
    } catch {
      return config.value;
    }
  }

  async getPublicSection(section: string) {
    const allowedSections = new Set(['general', 'about', 'socials', 'store', 'business']);
    if (!allowedSections.has(section)) {
      return null;
    }
    return this.getSection(section);
  }

  async updateSettings(data: UpdateSettingsDto) {
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
}
