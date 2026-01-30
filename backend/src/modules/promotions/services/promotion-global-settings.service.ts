import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export enum SettingCategory {
  GENERAL = 'GENERAL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  ANALYTICS = 'ANALYTICS',
  BACKUP = 'BACKUP',
  SECURITY = 'SECURITY',
  FEATURE_FLAGS = 'FEATURE_FLAGS',
  AB_TESTING = 'AB_TESTING',
  RATE_LIMITING = 'RATE_LIMITING',
}

export interface GlobalSetting {
  id: string;
  key: string;
  value: string | Record<string, any>;
  category: SettingCategory;
  description?: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  isEncrypted: boolean;
  isRequired: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  updatedAt: Date;
  updatedBy?: string;
  createdAt: Date;
}

export interface UpdateSettingDto {
  value: string | Record<string, any>;
  description?: string;
  updatedBy?: string;
}

@Injectable()
export class PromotionGlobalSettingsService {
  private settingsCache: Map<string, GlobalSetting> = new Map();
  private cacheTimestamp: Date = new Date();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private prisma: PrismaService) {
    this.initializeDefaultSettings();
  }

  /**
   * Get a setting by key
   */
  async getSetting(key: string): Promise<GlobalSetting | null> {
    try {
      // Check cache first
      const cached = this.getFromCache(key);
      if (cached) {
        return cached;
      }

      const setting = await this.prisma.system_configs.findUnique({
        where: { key },
      });

      if (!setting) {
        return null;
      }

      const formatted = this.formatSetting(setting);
      this.settingsCache.set(key, formatted);

      return formatted;
    } catch (error) {
      throw new BadRequestException(`Failed to get setting: ${(error as any).message}`);
    }
  }

  /**
   * Get all settings by category
   */
  async getSettingsByCategory(category: SettingCategory): Promise<GlobalSetting[]> {
    try {
      const settings = await this.prisma.system_configs.findMany();

      return settings
        .filter(s => {
          const formatted = this.formatSetting(s);
          return formatted.category === category;
        })
        .map(s => this.formatSetting(s));
    } catch (error) {
      throw new BadRequestException(`Failed to get settings: ${(error as any).message}`);
    }
  }

  /**
   * Get all settings
   */
  async getAllSettings(): Promise<GlobalSetting[]> {
    try {
      const settings = await this.prisma.system_configs.findMany();
      return settings.map(s => this.formatSetting(s));
    } catch (error) {
      throw new BadRequestException(`Failed to get all settings: ${(error as any).message}`);
    }
  }

  /**
   * Update a setting
   */
  async updateSetting(key: string, data: UpdateSettingDto): Promise<GlobalSetting> {
    try {
      const existing = await this.prisma.system_configs.findUnique({
        where: { key },
      });

      if (!existing) {
        throw new NotFoundException(`Setting ${key} not found`);
      }

      // Validate new value
      const formatted = this.formatSetting(existing);
      this.validateSetting(formatted, data.value);

      const updated = await this.prisma.system_configs.update({
        where: { key },
        data: {
          value: typeof data.value === 'string' ? data.value : JSON.stringify(data.value),
        },
      });

      const result = this.formatSetting(updated);

      // Invalidate cache
      this.settingsCache.delete(key);
      this.cacheTimestamp = new Date();

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update setting: ${(error as any).message}`);
    }
  }

  /**
   * Create a new setting
   */
  async createSetting(
    key: string,
    value: string | Record<string, any>,
    category: SettingCategory,
    options?: {
      description?: string;
      dataType?: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
      isEncrypted?: boolean;
      isRequired?: boolean;
      validation?: any;
      createdBy?: string;
    },
  ): Promise<GlobalSetting> {
    try {
      // Check if key already exists
      const existing = await this.prisma.system_configs.findUnique({
        where: { key },
      });

      if (existing) {
        throw new BadRequestException(`Setting ${key} already exists`);
      }

      const setting = await this.prisma.system_configs.create({
        data: {
          id: uuidv4(),
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          type: options?.dataType || 'STRING',
          updatedAt: new Date(),
        },
      });

      return this.formatSetting(setting);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create setting: ${(error as any).message}`);
    }
  }

  /**
   * Delete a setting
   */
  async deleteSetting(key: string): Promise<boolean> {
    try {
      const setting = await this.prisma.system_configs.findUnique({
        where: { key },
      });

      if (!setting) {
        throw new NotFoundException(`Setting ${key} not found`);
      }

      await this.prisma.system_configs.delete({
        where: { key },
      });

      this.settingsCache.delete(key);
      this.cacheTimestamp = new Date();

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete setting: ${(error as any).message}`);
    }
  }

  /**
   * Enable/Disable feature flag
   */
  async setFeatureFlag(flag: string, enabled: boolean): Promise<GlobalSetting> {
    const key = `feature.${flag}`;

    return this.updateSetting(key, {
      value: enabled.toString(),
    });
  }

  /**
   * Get feature flag status
   */
  async isFeatureEnabled(flag: string): Promise<boolean> {
    try {
      const key = `feature.${flag}`;
      const setting = await this.getSetting(key);

      if (!setting) {
        return false;
      }

      return String(setting.value) === 'true' || (setting.value as any) === true;
    } catch {
      return false;
    }
  }

  /**
   * Configure email provider
   */
  async configureEmailProvider(
    provider: 'SMTP' | 'SENDGRID' | 'AWS_SES',
    config: Record<string, string>,
  ): Promise<{
    provider: string;
    configured: boolean;
  }> {
    try {
      const key = `email.provider.${provider}`;

      await this.updateSetting(key, {
        value: config,
      });

      return {
        provider,
        configured: true,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to configure email provider: ${(error as any).message}`,
      );
    }
  }

  /**
   * Get email provider configuration
   */
  async getEmailProviderConfig(provider: string): Promise<Record<string, string> | null> {
    try {
      const key = `email.provider.${provider}`;
      const setting = await this.getSetting(key);

      if (!setting) {
        return null;
      }

      return typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
    } catch {
      return null;
    }
  }

  /**
   * Configure A/B testing
   */
  async configureABTest(
    testName: string,
    variants: Array<{
      name: string;
      percentage: number;
      config?: Record<string, any>;
    }>,
  ): Promise<{
    testName: string;
    active: boolean;
  }> {
    try {
      // Validate percentages sum to 100
      const totalPercentage = variants.reduce((sum, v) => sum + v.percentage, 0);
      if (totalPercentage !== 100) {
        throw new BadRequestException('Variant percentages must sum to 100%');
      }

      const key = `abtesting.${testName}`;

      await this.updateSetting(key, {
        value: { variants, active: true, createdAt: new Date() },
      });

      return {
        testName,
        active: true,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to configure A/B test: ${(error as any).message}`);
    }
  }

  /**
   * Get A/B test configuration
   */
  async getABTestConfig(testName: string): Promise<any | null> {
    try {
      const key = `abtesting.${testName}`;
      const setting = await this.getSetting(key);

      if (!setting) {
        return null;
      }

      return typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
    } catch {
      return null;
    }
  }

  /**
   * Configure rate limiting
   */
  async configureRateLimiting(
    resource: string,
    limit: number,
    window: number, // seconds
  ): Promise<void> {
    try {
      const key = `ratelimit.${resource}`;

      await this.updateSetting(key, {
        value: { limit, window },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to configure rate limiting: ${(error as any).message}`);
    }
  }

  /**
   * Get rate limit configuration
   */
  async getRateLimitConfig(resource: string): Promise<{
    limit: number;
    window: number;
  } | null> {
    try {
      const key = `ratelimit.${resource}`;
      const setting = await this.getSetting(key);

      if (!setting) {
        return null;
      }

      return (typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value) as {
        limit: number;
        window: number;
      };
    } catch {
      return null;
    }
  }

  /**
   * Reset to default settings
   */
  async resetToDefaults(): Promise<void> {
    try {
      this.settingsCache.clear();
      this.cacheTimestamp = new Date();

      // Delete all settings
      await this.prisma.system_configs.deleteMany();

      // Reinitialize defaults
      await this.initializeDefaultSettings();
    } catch (error) {
      throw new BadRequestException(`Failed to reset settings: ${(error as any).message}`);
    }
  }

  /**
   * Export settings configuration
   */
  async exportSettings(): Promise<Record<string, any>> {
    try {
      const settings = await this.getAllSettings();

      const exported: Record<string, any> = {};

      for (const setting of settings) {
        exported[setting.key] = {
          value: setting.value,
          category: setting.category,
          dataType: setting.dataType,
          isEncrypted: setting.isEncrypted,
        };
      }

      return exported;
    } catch (error) {
      throw new BadRequestException(`Export failed: ${(error as any).message}`);
    }
  }

  /**
   * Import settings configuration
   */
  async importSettings(settings: Record<string, any>): Promise<{
    imported: number;
    failed: number;
  }> {
    try {
      let imported = 0;
      let failed = 0;

      for (const [key, config] of Object.entries(settings)) {
        try {
          const existing = await this.prisma.system_configs.findUnique({
            where: { key },
          });

          if (existing) {
            await this.updateSetting(key, { value: (config as any).value });
          } else {
            await this.createSetting(key, (config as any).value, SettingCategory.GENERAL);
          }

          imported++;
        } catch (error) {
          failed++;
        }
      }

      return { imported, failed };
    } catch (error) {
      throw new BadRequestException(`Import failed: ${(error as any).message}`);
    }
  }

  /**
   * Get configuration summary
   */
  async getConfigurationSummary(): Promise<{
    totalSettings: number;
    byCategory: Record<string, number>;
    encryptedSettings: number;
    requiredSettings: Record<string, boolean>;
  }> {
    try {
      const settings = await this.getAllSettings();

      const byCategory: Record<string, number> = {};
      let encrypted = 0;
      const requiredSettings: Record<string, boolean> = {};

      for (const setting of settings) {
        byCategory[setting.category] = (byCategory[setting.category] || 0) + 1;

        if (setting.isEncrypted) {
          encrypted++;
        }

        if (setting.isRequired) {
          requiredSettings[setting.key] = !!setting.value;
        }
      }

      return {
        totalSettings: settings.length,
        byCategory,
        encryptedSettings: encrypted,
        requiredSettings,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get summary: ${(error as any).message}`);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async initializeDefaultSettings(): Promise<void> {
    const defaults = [
      {
        key: 'promotions.maxDiscount',
        value: '50',
        category: SettingCategory.GENERAL,
        description: 'Maximum allowed discount percentage',
      },
      {
        key: 'promotions.minOrderAmount',
        value: '10',
        category: SettingCategory.GENERAL,
        description: 'Minimum order amount for promotions',
      },
      {
        key: 'email.enabled',
        value: 'true',
        category: SettingCategory.EMAIL,
      },
      {
        key: 'sms.enabled',
        value: 'false',
        category: SettingCategory.SMS,
      },
      {
        key: 'push.enabled',
        value: 'false',
        category: SettingCategory.PUSH,
      },
      {
        key: 'analytics.retention_days',
        value: '90',
        category: SettingCategory.ANALYTICS,
      },
      {
        key: 'backup.auto_backup_enabled',
        value: 'true',
        category: SettingCategory.BACKUP,
      },
      {
        key: 'backup.retention_days',
        value: '90',
        category: SettingCategory.BACKUP,
      },
    ];

    for (const setting of defaults) {
      try {
        await this.prisma.system_configs.create({
          data: {
            id: uuidv4(),
            key: setting.key,
            value: setting.value,
            type: 'STRING',
            updatedAt: new Date(),
          },
        });
      } catch (error) {
        // Setting may already exist
      }
    }
  }

  private formatSetting(setting: any): GlobalSetting {
    let value: string | Record<string, any>;

    try {
      value = JSON.parse(setting.value);
    } catch {
      value = setting.value;
    }

    return {
      id: setting.id,
      key: setting.key,
      value,
      category: this.determineCategoryFromKey(setting.key),
      dataType: setting.type || 'STRING',
      isEncrypted: false,
      isRequired: false,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
  }

  private determineCategoryFromKey(key: string): SettingCategory {
    if (key.startsWith('email.')) return SettingCategory.EMAIL;
    if (key.startsWith('sms.')) return SettingCategory.SMS;
    if (key.startsWith('push.')) return SettingCategory.PUSH;
    if (key.startsWith('analytics.')) return SettingCategory.ANALYTICS;
    if (key.startsWith('backup.')) return SettingCategory.BACKUP;
    if (key.startsWith('security.')) return SettingCategory.SECURITY;
    if (key.startsWith('feature.')) return SettingCategory.FEATURE_FLAGS;
    if (key.startsWith('abtesting.')) return SettingCategory.AB_TESTING;
    if (key.startsWith('ratelimit.')) return SettingCategory.RATE_LIMITING;

    return SettingCategory.GENERAL;
  }

  private getFromCache(key: string): GlobalSetting | null {
    const cached = this.settingsCache.get(key);

    if (cached && Date.now() - this.cacheTimestamp.getTime() < this.CACHE_TTL) {
      return cached;
    }

    return null;
  }

  private validateSetting(setting: GlobalSetting, newValue: any): void {
    if (!setting.validation) {
      return;
    }

    const val = newValue.toString();
    const rules = setting.validation;

    if (rules.minLength && val.length < rules.minLength) {
      throw new BadRequestException(`Value is too short (minimum: ${rules.minLength})`);
    }

    if (rules.maxLength && val.length > rules.maxLength) {
      throw new BadRequestException(`Value is too long (maximum: ${rules.maxLength})`);
    }

    if (rules.pattern) {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(val)) {
        throw new BadRequestException(`Value does not match required pattern`);
      }
    }

    if (setting.dataType === 'NUMBER') {
      const numVal = Number(newValue);

      if (rules.min && numVal < rules.min) {
        throw new BadRequestException(`Value is too small (minimum: ${rules.min})`);
      }

      if (rules.max && numVal > rules.max) {
        throw new BadRequestException(`Value is too large (maximum: ${rules.max})`);
      }
    }
  }
}
