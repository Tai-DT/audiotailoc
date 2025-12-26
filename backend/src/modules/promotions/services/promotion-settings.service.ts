import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Global promotion system settings
 */
export interface GlobalPromotionSettings {
  // Basic settings
  maxConcurrentPromotions: number; // Max active promotions per customer
  maxPromotionsPerOrder: number; // Max promotions allowed in single order
  allowStackingPromotions: boolean; // Can customer use multiple promo codes
  requirePromoCodeFormat: string; // Regex pattern for promo codes

  // Discount limits
  maxDiscountPercentage: number; // Max discount % allowed
  maxDiscountAmount: number; // Max discount amount in currency
  minOrderValue: number; // Minimum order value to use promotions
  minOrderValuePercentage: number; // Min order value as % of product price

  // Timing
  minPromotionDuration: number; // Minimum duration in days
  maxPromotionDuration: number; // Maximum duration in days
  advanceNotificationDays: number; // Days before promotion starts to notify
  expiryWarningDays: number; // Days before expiry to show warning

  // Usage limits
  maxUsagePerCustomer: number; // Lifetime uses per customer
  dailyUsageLimit: number; // Max uses per day globally
  weeklyUsageLimit: number; // Max uses per week globally
  monthlyUsageLimit: number; // Max uses per month globally

  // Behavior
  autoExpireUnusedDays: number; // Auto-expire unused promotions after X days
  allowMultipleSamePromotion: boolean; // Can same promo be applied multiple times
  requireVerifiedEmail: boolean; // Must have verified email to use
  requireMinAccountAge: number; // Min account age in days to use promotions
  trackCustomerBehavior: boolean; // Track usage for analytics
  enableABTesting: boolean; // Allow A/B testing promotions

  // Notifications
  notifyAdminOnLaunch: boolean;
  notifyAdminOnExpiry: boolean;
  notifyCustomersOnExpiryWarning: boolean;
  notifyCustomersOnNewPromotion: boolean;

  // Compliance
  requireApprovalBeforeLaunch: boolean; // Manual approval required
  auditAllTransactions: boolean; // Log all promo-related transactions
  preventFraudDetection: boolean; // Enable fraud detection

  updatedAt: Date;
  updatedBy: string;
}

/**
 * Per-promotion settings override
 */
export interface PromotionSettings {
  promotionId: string;

  // Override global settings
  maxUsagePerCustomer?: number;
  maxTotalUsage?: number;
  allowStackingWith?: string[]; // List of promotion IDs that can stack with this
  requirePromoCode?: boolean;
  customPromoCode?: string;

  // Display & visibility
  displayName: string;
  displayDescription: string;
  displayImage?: string;
  displayPriority: number; // Higher = shown first
  showInPublicListing: boolean;
  showInCustomerDashboard: boolean;
  targetSegments?: string[]; // Customer segments to show this promotion to

  // Advanced targeting
  applicableProductIds?: string[];
  applicableProductCategories?: string[];
  applicableCustomerSegments?: string[];
  excludeProductIds?: string[];
  excludeCustomerIds?: string[];

  // Behavioral settings
  requireMinimumPurchaseValue?: number;
  requireMinimumItemQuantity?: number;
  requireFirstPurchase?: boolean;
  requireRepeatCustomer?: boolean;
  requireSpecificPaymentMethod?: string[];
  requireShippingToCountries?: string[];
  excludeShippingToCountries?: string[];

  // Personalization
  enablePersonalization: boolean;
  personalizedDiscountRange?: { min: number; max: number };
  adjustByCLV: boolean; // Adjust discount by customer lifetime value
  adjustByPurchaseFrequency: boolean;
  adjustBySeasonality: boolean;

  // Performance
  enablePerformanceTracking: boolean;
  targetROI: number;
  targetConversionRate: number;
  targetAverageOrderValue: number;

  // Gamification
  enableGamification: boolean;
  gamificationBadge?: string;
  gamificationMultiplier: number;

  // Integration
  integrateWithLoyalty: boolean;
  loyaltyPointsMultiplier: number;

  updatedAt: Date;
  updatedBy: string;
}

/**
 * A/B Testing configuration
 */
export interface ABTestConfig {
  testId: string;
  promotionId: string;
  controlGroupPromotion: string; // Promo code for control group
  testGroupPromotion: string; // Promo code for test group
  splitPercentage: number; // % of traffic to test group (0-100)
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'running' | 'completed' | 'paused';
  metrics: {
    controlConversions: number;
    testConversions: number;
    controlRevenue: number;
    testRevenue: number;
    statisticalSignificance: number; // 0-1
  };
  winner?: 'control' | 'test' | 'tie';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fraud detection rules
 */
export interface FraudDetectionRule {
  ruleId: string;
  name: string;
  description: string;
  enabled: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  action: 'block' | 'flag' | 'monitor';

  // Detection criteria
  maxUsesPerIPAddress?: number;
  maxUsesPerDevice?: number;
  flagSuspiciousVelocity?: boolean; // Multiple uses in short time
  flagNewAccounts?: boolean;
  flagGeolocationJumps?: boolean; // Suspicious location changes
  flagVPNUsage?: boolean;
  flagProxyUsage?: boolean;

  updatedAt: Date;
}

/**
 * Promotion analytics configuration
 */
export interface AnalyticsConfig {
  trackDimensions: string[];
  trackMetrics: string[];
  customDashboards: Array<{
    name: string;
    metrics: string[];
    filters: Record<string, any>;
  }>;
  alertRules: Array<{
    name: string;
    metric: string;
    operator: 'gt' | 'lt' | 'eq';
    threshold: number;
    notifyEmail: string[];
  }>;
  updatedAt: Date;
}

@Injectable()
export class PromotionSettingsService {
  private globalSettings: GlobalPromotionSettings | null = null;

  private static readonly KEY_GLOBAL_SETTINGS = 'promotions.globalSettings';
  private static readonly KEY_ANALYTICS_CONFIG = 'promotions.analyticsConfig';
  private static readonly KEY_PROMOTION_SETTINGS_PREFIX = 'promotions.promotionSettings.';
  private static readonly KEY_AB_TEST_PREFIX = 'promotions.abTest.';
  private static readonly KEY_FRAUD_RULE_PREFIX = 'promotions.fraudRule.';

  constructor(private prisma: PrismaService) {
    this.initializeDefaultSettings();
  }

  private serialize(value: any): string {
    return JSON.stringify(value);
  }

  private deserialize<T>(value: string): T {
    return JSON.parse(value) as T;
  }

  private normalizeDate(input: any): Date {
    if (input instanceof Date) return input;
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }

  private toSystemConfigKeyForPromotion(promotionId: string): string {
    return `${PromotionSettingsService.KEY_PROMOTION_SETTINGS_PREFIX}${promotionId}`;
  }

  private toSystemConfigKeyForAbTest(testId: string): string {
    return `${PromotionSettingsService.KEY_AB_TEST_PREFIX}${testId}`;
  }

  private toSystemConfigKeyForFraudRule(ruleId: string): string {
    return `${PromotionSettingsService.KEY_FRAUD_RULE_PREFIX}${ruleId}`;
  }

  /**
   * Initialize default global settings
   */
  private initializeDefaultSettings(): void {
    this.globalSettings = {
      maxConcurrentPromotions: 5,
      maxPromotionsPerOrder: 1,
      allowStackingPromotions: false,
      requirePromoCodeFormat: '^[A-Z0-9]{4,12}$',
      maxDiscountPercentage: 50,
      maxDiscountAmount: 1000000,
      minOrderValue: 0,
      minOrderValuePercentage: 0,
      minPromotionDuration: 1,
      maxPromotionDuration: 365,
      advanceNotificationDays: 7,
      expiryWarningDays: 7,
      maxUsagePerCustomer: 10,
      dailyUsageLimit: 10000,
      weeklyUsageLimit: 50000,
      monthlyUsageLimit: 200000,
      autoExpireUnusedDays: 90,
      allowMultipleSamePromotion: false,
      requireVerifiedEmail: true,
      requireMinAccountAge: 0,
      trackCustomerBehavior: true,
      enableABTesting: true,
      notifyAdminOnLaunch: true,
      notifyAdminOnExpiry: true,
      notifyCustomersOnExpiryWarning: true,
      notifyCustomersOnNewPromotion: true,
      requireApprovalBeforeLaunch: false,
      auditAllTransactions: true,
      preventFraudDetection: true,
      updatedAt: new Date(),
      updatedBy: 'system',
    };
  }

  /**
   * Get global settings
   */
  async getGlobalSettings(): Promise<GlobalPromotionSettings> {
    const stored = await this.retrieveGlobalSettings();
    return stored || this.globalSettings!;
  }

  /**
   * Update global settings
   */
  async updateGlobalSettings(
    updates: Partial<GlobalPromotionSettings>,
    updatedBy: string,
  ): Promise<GlobalPromotionSettings> {
    const current = await this.getGlobalSettings();

    const updated: GlobalPromotionSettings = {
      ...current,
      ...updates,
      updatedAt: new Date(),
      updatedBy,
    };

    await this.storeGlobalSettings(updated);
    this.globalSettings = updated;

    return updated;
  }

  /**
   * Reset global settings to defaults
   */
  async resetGlobalSettings(resetBy: string): Promise<GlobalPromotionSettings> {
    this.initializeDefaultSettings();
    const defaults = this.globalSettings!;
    defaults.updatedBy = resetBy;
    defaults.updatedAt = new Date();

    await this.storeGlobalSettings(defaults);

    return defaults;
  }

  /**
   * Get promotion-specific settings
   */
  async getPromotionSettings(promotionId: string): Promise<PromotionSettings | null> {
    return this.retrievePromotionSettings(promotionId);
  }

  /**
   * Create or update promotion settings
   */
  async savePromotionSettings(
    promotionId: string,
    settings: Omit<PromotionSettings, 'promotionId' | 'updatedAt' | 'updatedBy'> & {
      updatedBy: string;
    },
  ): Promise<PromotionSettings> {
    const updated: PromotionSettings = {
      promotionId,
      ...settings,
      updatedAt: new Date(),
    };

    await this.storePromotionSettings(updated);

    return updated;
  }

  /**
   * Delete promotion settings (revert to global defaults)
   */
  async deletePromotionSettings(promotionId: string): Promise<boolean> {
    return this.removePromotionSettings(promotionId);
  }

  /**
   * Validate promotion against settings
   */
  async validatePromotion(promotionData: {
    code: string;
    discountPercentage?: number;
    discountAmount?: number;
    duration?: number;
    customerEmail?: string;
    customerAccountAge?: number;
    orderValue?: number;
    itemCount?: number;
  }): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const settings = await this.getGlobalSettings();

    // Validate promo code format
    const codeRegex = new RegExp(settings.requirePromoCodeFormat);
    if (!codeRegex.test(promotionData.code)) {
      errors.push(`Promo code must match format: ${settings.requirePromoCodeFormat}`);
    }

    // Validate discount percentage
    if (
      promotionData.discountPercentage &&
      promotionData.discountPercentage > settings.maxDiscountPercentage
    ) {
      errors.push(`Discount percentage cannot exceed ${settings.maxDiscountPercentage}%`);
    }

    // Validate discount amount
    if (promotionData.discountAmount && promotionData.discountAmount > settings.maxDiscountAmount) {
      errors.push(`Discount amount cannot exceed ${settings.maxDiscountAmount}`);
    }

    // Validate duration
    if (promotionData.duration) {
      if (promotionData.duration < settings.minPromotionDuration) {
        errors.push(`Promotion duration must be at least ${settings.minPromotionDuration} days`);
      }
      if (promotionData.duration > settings.maxPromotionDuration) {
        errors.push(`Promotion duration cannot exceed ${settings.maxPromotionDuration} days`);
      }
    }

    // Validate customer email
    if (settings.requireVerifiedEmail && !promotionData.customerEmail) {
      errors.push('Customer must have verified email to use promotion');
    }

    // Validate account age
    if (
      promotionData.customerAccountAge !== undefined &&
      promotionData.customerAccountAge < settings.requireMinAccountAge
    ) {
      errors.push(`Customer account must be at least ${settings.requireMinAccountAge} days old`);
    }

    // Validate order value
    if (
      promotionData.orderValue !== undefined &&
      promotionData.orderValue < settings.minOrderValue
    ) {
      errors.push(`Order value must be at least ${settings.minOrderValue}`);
    }

    // Warnings
    if (settings.requireApprovalBeforeLaunch) {
      warnings.push('This promotion requires approval before launch');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Create A/B test
   */
  async createABTest(
    promotionId: string,
    config: Omit<ABTestConfig, 'testId' | 'metrics' | 'createdAt' | 'updatedAt' | 'promotionId'>,
  ): Promise<ABTestConfig> {
    const test: ABTestConfig = {
      testId: `test_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      promotionId,
      ...config,
      metrics: {
        controlConversions: 0,
        testConversions: 0,
        controlRevenue: 0,
        testRevenue: 0,
        statisticalSignificance: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.storeABTest(test);

    return test;
  }

  /**
   * Get A/B test
   */
  async getABTest(testId: string): Promise<ABTestConfig | null> {
    return this.retrieveABTest(testId);
  }

  /**
   * Get active A/B tests for promotion
   */
  async getActiveABTests(promotionId: string): Promise<ABTestConfig[]> {
    const tests = await this.getAllABTests(promotionId);
    const now = new Date();

    return tests.filter(t => t.status === 'running' && t.startDate <= now && t.endDate >= now);
  }

  /**
   * Update A/B test metrics
   */
  async updateABTestMetrics(
    testId: string,
    metrics: Partial<ABTestConfig['metrics']>,
  ): Promise<ABTestConfig | null> {
    const test = await this.retrieveABTest(testId);

    if (!test) {
      return null;
    }

    const updated: ABTestConfig = {
      ...test,
      metrics: {
        ...test.metrics,
        ...metrics,
      },
      updatedAt: new Date(),
    };

    // Calculate statistical significance (simplified Chi-square)
    updated.metrics.statisticalSignificance = this.calculateStatisticalSignificance(
      updated.metrics.controlConversions,
      updated.metrics.testConversions,
      100, // Sample size assumption
    );

    // Determine winner if test is completed
    if (test.status === 'completed') {
      const controlRate = updated.metrics.controlConversions;
      const testRate = updated.metrics.testConversions;

      if (controlRate > testRate * 1.1) {
        updated.winner = 'control';
      } else if (testRate > controlRate * 1.1) {
        updated.winner = 'test';
      } else {
        updated.winner = 'tie';
      }
    }

    await this.storeABTest(updated);

    return updated;
  }

  /**
   * End A/B test and declare winner
   */
  async concludeABTest(testId: string): Promise<ABTestConfig | null> {
    const test = await this.retrieveABTest(testId);

    if (!test) {
      return null;
    }

    const updated: ABTestConfig = {
      ...test,
      status: 'completed',
      updatedAt: new Date(),
    };

    // Calculate final winner
    const controlRate = updated.metrics.controlConversions;
    const testRate = updated.metrics.testConversions;

    if (controlRate > testRate * 1.1) {
      updated.winner = 'control';
    } else if (testRate > controlRate * 1.1) {
      updated.winner = 'test';
    } else {
      updated.winner = 'tie';
    }

    await this.storeABTest(updated);

    return updated;
  }

  /**
   * Create fraud detection rule
   */
  async createFraudDetectionRule(
    rule: Omit<FraudDetectionRule, 'ruleId' | 'updatedAt'>,
  ): Promise<FraudDetectionRule> {
    const created: FraudDetectionRule = {
      ruleId: `rule_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ...rule,
      updatedAt: new Date(),
    };

    await this.storeFraudRule(created);

    return created;
  }

  /**
   * Get fraud detection rule
   */
  async getFraudDetectionRule(ruleId: string): Promise<FraudDetectionRule | null> {
    return this.retrieveFraudRule(ruleId);
  }

  /**
   * Get all enabled fraud detection rules
   */
  async getEnabledFraudRules(): Promise<FraudDetectionRule[]> {
    const rules = await this.getAllFraudRules();
    return rules.filter(r => r.enabled);
  }

  /**
   * Update fraud detection rule
   */
  async updateFraudDetectionRule(
    ruleId: string,
    updates: Partial<FraudDetectionRule>,
  ): Promise<FraudDetectionRule | null> {
    const existing = await this.retrieveFraudRule(ruleId);

    if (!existing) {
      return null;
    }

    const updated: FraudDetectionRule = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    await this.storeFraudRule(updated);

    return updated;
  }

  /**
   * Check fraud rules against transaction
   */
  async checkFraudRules(transaction: {
    customerId: string;
    ipAddress: string;
    deviceId: string;
    location: string;
    accountAge: number;
    promotionCode: string;
    amount: number;
  }): Promise<{
    isFraudulent: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    triggeredRules: string[];
    recommendations: string[];
  }> {
    const rules = await this.getEnabledFraudRules();
    const triggeredRules: string[] = [];
    let maxRiskLevel: 'low' | 'medium' | 'high' = 'low';

    for (const rule of rules) {
      let triggered = false;

      if (rule.maxUsesPerIPAddress) {
        // Check IP address usage (simplified)
        triggered = true; // Placeholder
      }

      if (rule.flagSuspiciousVelocity) {
        // Check for rapid-fire usage
        triggered = true; // Placeholder
      }

      if (rule.flagNewAccounts && transaction.accountAge < 7) {
        triggered = true;
      }

      if (rule.flagGeolocationJumps) {
        // Check for impossible location changes
        triggered = true; // Placeholder
      }

      if (triggered) {
        triggeredRules.push(rule.ruleId);
        if (rule.riskLevel === 'high' || maxRiskLevel === 'low') {
          maxRiskLevel = rule.riskLevel;
        }
      }
    }

    const recommendations: string[] = [];
    if (triggeredRules.length > 0) {
      if (maxRiskLevel === 'high') {
        recommendations.push('Block transaction - high fraud risk');
      } else if (maxRiskLevel === 'medium') {
        recommendations.push('Require additional verification');
        recommendations.push('Flag for manual review');
      } else {
        recommendations.push('Monitor customer for fraud patterns');
      }
    }

    return {
      isFraudulent: triggeredRules.length > 0,
      riskLevel: maxRiskLevel,
      triggeredRules,
      recommendations,
    };
  }

  /**
   * Create analytics configuration
   */
  async createAnalyticsConfig(
    config: Omit<AnalyticsConfig, 'updatedAt'>,
  ): Promise<AnalyticsConfig> {
    const created: AnalyticsConfig = {
      ...config,
      updatedAt: new Date(),
    };

    await this.storeAnalyticsConfig(created);

    return created;
  }

  /**
   * Get analytics configuration
   */
  async getAnalyticsConfig(): Promise<AnalyticsConfig | null> {
    return this.retrieveAnalyticsConfig();
  }

  /**
   * Update analytics configuration
   */
  async updateAnalyticsConfig(updates: Partial<AnalyticsConfig>): Promise<AnalyticsConfig> {
    const current = await this.getAnalyticsConfig();

    const updated: AnalyticsConfig = {
      trackDimensions: updates.trackDimensions || current?.trackDimensions || [],
      trackMetrics: updates.trackMetrics || current?.trackMetrics || [],
      customDashboards: updates.customDashboards || current?.customDashboards || [],
      alertRules: updates.alertRules || current?.alertRules || [],
      updatedAt: new Date(),
    };

    await this.storeAnalyticsConfig(updated);

    return updated;
  }

  /**
   * Calculate statistical significance (simplified Chi-square test)
   */
  private calculateStatisticalSignificance(
    control: number,
    test: number,
    sampleSize: number,
  ): number {
    if (control === 0 && test === 0) return 0;

    const controlRate = control / sampleSize;
    const testRate = test / sampleSize;
    const pooledRate = (control + test) / (2 * sampleSize);

    const denominator = pooledRate * (1 - pooledRate) * (2 / sampleSize);
    if (denominator === 0) return 0;

    const zScore = (testRate - controlRate) / Math.sqrt(denominator);
    // Approximate p-value from z-score (normal distribution)
    const significance = Math.min(1, Math.max(0, 1 - Math.abs(zScore) / 3));

    return Math.round(significance * 1000) / 1000;
  }

  /**
   * Private helper methods - Database placeholders
   */

  private async retrieveGlobalSettings(): Promise<GlobalPromotionSettings | null> {
    const config = await this.prisma.system_configs.findUnique({
      where: { key: PromotionSettingsService.KEY_GLOBAL_SETTINGS },
    });

    if (!config) return null;

    const parsed = this.deserialize<any>(config.value);
    return {
      ...parsed,
      updatedAt: this.normalizeDate(parsed.updatedAt),
    } as GlobalPromotionSettings;
  }

  private async storeGlobalSettings(settings: GlobalPromotionSettings): Promise<void> {
    const key = PromotionSettingsService.KEY_GLOBAL_SETTINGS;
    const value = this.serialize({
      ...settings,
      updatedAt: settings.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    });

    await this.prisma.system_configs.upsert({
      where: { key },
      update: {
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
      create: {
        id: uuidv4(),
        key,
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
    });
  }

  private async retrievePromotionSettings(promotionId: string): Promise<PromotionSettings | null> {
    const key = this.toSystemConfigKeyForPromotion(promotionId);
    const config = await this.prisma.system_configs.findUnique({
      where: { key },
    });

    if (!config) return null;

    const parsed = this.deserialize<any>(config.value);
    return {
      ...parsed,
      promotionId,
      updatedAt: this.normalizeDate(parsed.updatedAt),
    } as PromotionSettings;
  }

  private async storePromotionSettings(settings: PromotionSettings): Promise<void> {
    const key = this.toSystemConfigKeyForPromotion(settings.promotionId);
    const value = this.serialize({
      ...settings,
      updatedAt: settings.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    });

    await this.prisma.system_configs.upsert({
      where: { key },
      update: {
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
      create: {
        id: uuidv4(),
        key,
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
    });
  }

  private async removePromotionSettings(promotionId: string): Promise<boolean> {
    const key = this.toSystemConfigKeyForPromotion(promotionId);
    const existing = await this.prisma.system_configs.findUnique({
      where: { key },
      select: { key: true },
    });

    if (!existing) return false;

    await this.prisma.system_configs.delete({ where: { key } });
    return true;
  }

  private async storeABTest(test: ABTestConfig): Promise<void> {
    const key = this.toSystemConfigKeyForAbTest(test.testId);
    const value = this.serialize({
      ...test,
      startDate: test.startDate?.toISOString?.() ?? new Date(test.startDate).toISOString(),
      endDate: test.endDate?.toISOString?.() ?? new Date(test.endDate).toISOString(),
      createdAt: test.createdAt?.toISOString?.() ?? new Date(test.createdAt).toISOString(),
      updatedAt: test.updatedAt?.toISOString?.() ?? new Date(test.updatedAt).toISOString(),
    });

    await this.prisma.system_configs.upsert({
      where: { key },
      update: {
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
      create: {
        id: uuidv4(),
        key,
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
    });
  }

  private async retrieveABTest(testId: string): Promise<ABTestConfig | null> {
    const key = this.toSystemConfigKeyForAbTest(testId);
    const config = await this.prisma.system_configs.findUnique({
      where: { key },
    });

    if (!config) return null;
    const parsed = this.deserialize<any>(config.value);

    return {
      ...parsed,
      testId,
      startDate: this.normalizeDate(parsed.startDate),
      endDate: this.normalizeDate(parsed.endDate),
      createdAt: this.normalizeDate(parsed.createdAt),
      updatedAt: this.normalizeDate(parsed.updatedAt),
    } as ABTestConfig;
  }

  private async getAllABTests(promotionId: string): Promise<ABTestConfig[]> {
    const configs = await this.prisma.system_configs.findMany({
      where: {
        key: {
          startsWith: PromotionSettingsService.KEY_AB_TEST_PREFIX,
        },
      },
    });

    const results: ABTestConfig[] = [];
    for (const c of configs) {
      try {
        const parsed = this.deserialize<any>(c.value);
        if (parsed.promotionId !== promotionId) continue;
        results.push({
          ...parsed,
          testId: parsed.testId ?? c.key.replace(PromotionSettingsService.KEY_AB_TEST_PREFIX, ''),
          startDate: this.normalizeDate(parsed.startDate),
          endDate: this.normalizeDate(parsed.endDate),
          createdAt: this.normalizeDate(parsed.createdAt),
          updatedAt: this.normalizeDate(parsed.updatedAt),
        } as ABTestConfig);
      } catch {
        // Skip malformed rows
      }
    }

    return results;
  }

  private async storeFraudRule(rule: FraudDetectionRule): Promise<void> {
    const key = this.toSystemConfigKeyForFraudRule(rule.ruleId);
    const value = this.serialize({
      ...rule,
      updatedAt: rule.updatedAt?.toISOString?.() ?? new Date(rule.updatedAt).toISOString(),
    });

    await this.prisma.system_configs.upsert({
      where: { key },
      update: {
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
      create: {
        id: uuidv4(),
        key,
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
    });
  }

  private async retrieveFraudRule(ruleId: string): Promise<FraudDetectionRule | null> {
    const key = this.toSystemConfigKeyForFraudRule(ruleId);
    const config = await this.prisma.system_configs.findUnique({
      where: { key },
    });

    if (!config) return null;
    const parsed = this.deserialize<any>(config.value);

    return {
      ...parsed,
      ruleId,
      updatedAt: this.normalizeDate(parsed.updatedAt),
    } as FraudDetectionRule;
  }

  private async getAllFraudRules(): Promise<FraudDetectionRule[]> {
    const configs = await this.prisma.system_configs.findMany({
      where: {
        key: {
          startsWith: PromotionSettingsService.KEY_FRAUD_RULE_PREFIX,
        },
      },
    });

    const results: FraudDetectionRule[] = [];
    for (const c of configs) {
      try {
        const parsed = this.deserialize<any>(c.value);
        results.push({
          ...parsed,
          ruleId:
            parsed.ruleId ?? c.key.replace(PromotionSettingsService.KEY_FRAUD_RULE_PREFIX, ''),
          updatedAt: this.normalizeDate(parsed.updatedAt),
        } as FraudDetectionRule);
      } catch {
        // Skip malformed rows
      }
    }

    return results;
  }

  private async storeAnalyticsConfig(config: AnalyticsConfig): Promise<void> {
    const key = PromotionSettingsService.KEY_ANALYTICS_CONFIG;
    const value = this.serialize({
      ...config,
      updatedAt: config.updatedAt?.toISOString?.() ?? new Date(config.updatedAt).toISOString(),
    });

    await this.prisma.system_configs.upsert({
      where: { key },
      update: {
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
      create: {
        id: uuidv4(),
        key,
        value,
        type: 'JSON',
        updatedAt: new Date(),
      },
    });
  }

  private async retrieveAnalyticsConfig(): Promise<AnalyticsConfig | null> {
    const key = PromotionSettingsService.KEY_ANALYTICS_CONFIG;
    const config = await this.prisma.system_configs.findUnique({
      where: { key },
    });

    if (!config) return null;
    const parsed = this.deserialize<any>(config.value);
    return {
      ...parsed,
      updatedAt: this.normalizeDate(parsed.updatedAt),
    } as AnalyticsConfig;
  }
}
