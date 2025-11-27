import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings-update.dto';
import { MailService } from '../notifications/mail.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async sendTestEmail(
    to: string,
    config?: { host: string; port: number; user: string; pass: string; from?: string },
  ) {
    if (config) {
      try {
        const transporter = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.port === 465, // true for 465, false for other ports
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
      } catch (error: any) {
        throw new Error(`Failed to send test email: ${error.message}`);
      }
    } else {
      // Use existing system configuration from DB
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

        // Fallback to MailService (env config) if no DB settings
        await this.mailService.send(
          to,
          'Test Email from Audio Tài Lộc Settings',
          'This is a test email to verify your SMTP settings.',
        );
        return { success: true, message: 'Email sent successfully using system configuration' };
      } catch (error: any) {
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

  async updateSettings(data: UpdateSettingsDto) {
    const updates = [];

    if (data.general) {
      updates.push(
        this.prisma.system_configs.upsert({
          where: { key: 'site.general' },
          update: {
            value: JSON.stringify(data.general),
            type: 'JSON',
            updatedAt: new Date(),
          },
          create: {
            id: randomUUID(),
            key: 'site.general',
            value: JSON.stringify(data.general),
            type: 'JSON',
            updatedAt: new Date(),
          },
        }),
      );
    }

    if (data.about) {
      updates.push(
        this.prisma.system_configs.upsert({
          where: { key: 'site.about' },
          update: {
            value: JSON.stringify(data.about),
            type: 'JSON',
            updatedAt: new Date(),
          },
          create: {
            id: randomUUID(),
            key: 'site.about',
            value: JSON.stringify(data.about),
            type: 'JSON',
            updatedAt: new Date(),
          },
        }),
      );
    }

    if (data.socials) {
      updates.push(
        this.prisma.system_configs.upsert({
          where: { key: 'site.socials' },
          update: {
            value: JSON.stringify(data.socials),
            type: 'JSON',
            updatedAt: new Date(),
          },
          create: {
            id: randomUUID(),
            key: 'site.socials',
            value: JSON.stringify(data.socials),
            type: 'JSON',
            updatedAt: new Date(),
          },
        }),
      );
    }

    if (data.business) {
      updates.push(
        this.prisma.system_configs.upsert({
          where: { key: 'site.business' },
          update: {
            value: JSON.stringify(data.business),
            type: 'JSON',
            updatedAt: new Date(),
          },
          create: {
            id: randomUUID(),
            key: 'site.business',
            value: JSON.stringify(data.business),
            type: 'JSON',
            updatedAt: new Date(),
          },
        }),
      );
    }

    if (data.email) {
      updates.push(
        this.prisma.system_configs.upsert({
          where: { key: 'site.email' },
          update: {
            value: JSON.stringify(data.email),
            type: 'JSON',
            updatedAt: new Date(),
          },
          create: {
            id: randomUUID(),
            key: 'site.email',
            value: JSON.stringify(data.email),
            type: 'JSON',
            updatedAt: new Date(),
          },
        }),
      );
    }

    if (data.notifications) {
      updates.push(
        this.prisma.system_configs.upsert({
          where: { key: 'site.notifications' },
          update: {
            value: JSON.stringify(data.notifications),
            type: 'JSON',
            updatedAt: new Date(),
          },
          create: {
            id: randomUUID(),
            key: 'site.notifications',
            value: JSON.stringify(data.notifications),
            type: 'JSON',
            updatedAt: new Date(),
          },
        }),
      );
    }

    if (data.security) {
      updates.push(
        this.prisma.system_configs.upsert({
          where: { key: 'site.security' },
          update: {
            value: JSON.stringify(data.security),
            type: 'JSON',
            updatedAt: new Date(),
          },
          create: {
            id: randomUUID(),
            key: 'site.security',
            value: JSON.stringify(data.security),
            type: 'JSON',
            updatedAt: new Date(),
          },
        }),
      );
    }

    if (updates.length > 0) {
      await this.prisma.$transaction(updates);
    }

    return this.getSettings();
  }
}
