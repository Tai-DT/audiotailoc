import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface APIVersion {
  version: string;
  releaseDate: Date;
  isDeprecated: boolean;
  deprecatedAt?: Date;
  sunsetDate?: Date;
  changes: string[];
  breakingChanges?: string[];
}

export interface VersionInfo {
  current: string;
  supported: string[];
  deprecated: string[];
  latest: string;
}

@Injectable()
export class ApiVersioningService {
  private readonly versions: Map<string, APIVersion> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeVersions();
  }

  private initializeVersions() {
    // Version 1.0 - Initial release
    this.versions.set('v1', {
      version: 'v1',
      releaseDate: new Date('2024-01-01'),
      isDeprecated: false,
      changes: [
        'Initial API release',
        'Basic authentication',
        'Product catalog management',
        'Order processing',
        'User management'
      ]
    });

    // Version 1.1 - Enhanced features
    this.versions.set('v1.1', {
      version: 'v1.1',
      releaseDate: new Date('2024-02-01'),
      isDeprecated: false,
      changes: [
        'AI-powered search',
        'Zalo customer support integration',
        'Payment gateway integration',
        'Inventory management',
        'Performance monitoring'
      ]
    });

    // Version 2.0 - Major improvements (current)
    this.versions.set('v2', {
      version: 'v2',
      releaseDate: new Date('2024-03-01'),
      isDeprecated: false,
      changes: [
        'Enhanced security',
        'Advanced error handling',
        'GraphQL support (beta)',
        'Webhook system',
        'Advanced analytics',
        'Multi-language support'
      ]
    });
  }

  getVersionInfo(): VersionInfo {
    const current = this.configService.get('API_VERSION', 'v2');
    const supported = Array.from(this.versions.keys()).filter(v => !this.versions.get(v)?.isDeprecated);
    const deprecated = Array.from(this.versions.keys()).filter(v => this.versions.get(v)?.isDeprecated);
    const latest = 'v2';

    return {
      current,
      supported,
      deprecated,
      latest
    };
  }

  getVersionDetails(version: string): APIVersion | null {
    return this.versions.get(version) || null;
  }

  isVersionSupported(version: string): boolean {
    const versionInfo = this.versions.get(version);
    return versionInfo ? !versionInfo.isDeprecated : false;
  }

  isVersionDeprecated(version: string): boolean {
    const versionInfo = this.versions.get(version);
    return versionInfo?.isDeprecated || false;
  }

  shouldShowDeprecationWarning(version: string): boolean {
    const versionInfo = this.versions.get(version);
    if (!versionInfo?.isDeprecated) return false;

    // Show warning if deprecated but not yet sunset
    return !versionInfo.sunsetDate || versionInfo.sunsetDate > new Date();
  }

  getDeprecationMessage(version: string): string | null {
    const versionInfo = this.versions.get(version);
    if (!versionInfo?.isDeprecated) return null;

    const sunsetMessage = versionInfo.sunsetDate
      ? ` This version will be sunset on ${versionInfo.sunsetDate.toISOString().split('T')[0]}.`
      : '';

    return `API version ${version} is deprecated. Please upgrade to v2.${sunsetMessage}`;
  }

  getMigrationGuide(fromVersion: string, toVersion: string): string[] {
    const from = this.versions.get(fromVersion);
    const to = this.versions.get(toVersion);

    if (!from || !to) return [];

    const migrationSteps: string[] = [];

    // Basic migration steps
    if (fromVersion === 'v1' && toVersion === 'v2') {
      migrationSteps.push(
        'Update authentication headers: Use Bearer tokens consistently',
        'Replace /api/products/search with /api/v2/search with AI enhancement',
        'Update error response format to include correlation IDs',
        'Implement webhook endpoints for real-time notifications',
        'Use new security headers and enhanced error handling'
      );
    }

    if (fromVersion === 'v1.1' && toVersion === 'v2') {
      migrationSteps.push(
        'Implement correlation IDs for better request tracking',
        'Update payment endpoints to use enhanced security',
        'Use new monitoring endpoints for health checks',
        'Implement graceful error handling with structured responses'
      );
    }

    return migrationSteps;
  }

  validateVersion(version: string): { isValid: boolean; message?: string } {
    if (!version) {
      return { isValid: false, message: 'API version is required' };
    }

    if (!this.versions.has(version)) {
      return {
        isValid: false,
        message: `Unsupported API version: ${version}. Supported versions: ${Array.from(this.versions.keys()).join(', ')}`
      };
    }

    const versionInfo = this.versions.get(version)!;

    if (versionInfo.isDeprecated) {
      const sunsetMessage = versionInfo.sunsetDate && versionInfo.sunsetDate < new Date()
        ? ` Version ${version} has been sunset and is no longer available.`
        : '';

      return {
        isValid: false,
        message: `Deprecated API version: ${version}.${sunsetMessage} Please upgrade to v2.`
      };
    }

    return { isValid: true };
  }

  getVersionChanges(version: string): string[] {
    const versionInfo = this.versions.get(version);
    return versionInfo?.changes || [];
  }

  getBreakingChanges(version: string): string[] {
    const versionInfo = this.versions.get(version);
    return versionInfo?.breakingChanges || [];
  }
}
