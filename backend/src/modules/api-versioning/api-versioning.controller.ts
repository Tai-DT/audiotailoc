import { Controller, Get, Query, Param, Header } from '@nestjs/common';
import { ApiVersioningService, VersionInfo } from './api-versioning.service';

@Controller('api/versioning')
export class ApiVersioningController {
  constructor(private readonly versioningService: ApiVersioningService) {}

  @Get('info')
  @Header('Cache-Control', 'public, max-age=300') // Cache for 5 minutes
  getVersionInfo(): VersionInfo {
    return this.versioningService.getVersionInfo();
  }

  @Get('versions')
  @Header('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
  getAllVersions() {
    const versionInfo = this.versioningService.getVersionInfo();
    const versions: { [key: string]: any } = {};

    versionInfo.supported.forEach(version => {
      const details = this.versioningService.getVersionDetails(version);
      if (details) {
        versions[version] = {
          version: details.version,
          releaseDate: details.releaseDate,
          isDeprecated: details.isDeprecated,
          deprecatedAt: details.deprecatedAt,
          sunsetDate: details.sunsetDate,
          changes: details.changes,
          breakingChanges: details.breakingChanges || [],
        };
      }
    });

    versionInfo.deprecated.forEach(version => {
      const details = this.versioningService.getVersionDetails(version);
      if (details) {
        versions[version] = {
          version: details.version,
          releaseDate: details.releaseDate,
          isDeprecated: details.isDeprecated,
          deprecatedAt: details.deprecatedAt,
          sunsetDate: details.sunsetDate,
          changes: details.changes,
          breakingChanges: details.breakingChanges || [],
        };
      }
    });

    return {
      versions,
      summary: versionInfo,
    };
  }

  @Get('versions/:version')
  @Header('Cache-Control', 'public, max-age=3600')
  getVersionDetails(@Param('version') version: string) {
    const details = this.versioningService.getVersionDetails(version);

    if (!details) {
      return {
        success: false,
        error: {
          code: 'VERSION_NOT_FOUND',
          message: `Version ${version} not found`,
        },
      };
    }

    return {
      success: true,
      version: {
        version: details.version,
        releaseDate: details.releaseDate,
        isDeprecated: details.isDeprecated,
        deprecatedAt: details.deprecatedAt,
        sunsetDate: details.sunsetDate,
        changes: details.changes,
        breakingChanges: details.breakingChanges || [],
        isSupported: this.versioningService.isVersionSupported(version),
        deprecationMessage: this.versioningService.getDeprecationMessage(version),
      },
    };
  }

  @Get('migration-guide')
  getMigrationGuide(
    @Query('from') fromVersion: string,
    @Query('to') toVersion: string,
  ) {
    if (!fromVersion || !toVersion) {
      return {
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Both from and to parameters are required',
        },
      };
    }

    const migrationSteps = this.versioningService.getMigrationGuide(fromVersion, toVersion);

    return {
      success: true,
      migration: {
        from: fromVersion,
        to: toVersion,
        steps: migrationSteps,
        estimatedEffort: this.estimateMigrationEffort(fromVersion, toVersion),
      },
    };
  }

  @Get('validate')
  validateVersion(@Query('version') version: string) {
    if (!version) {
      return {
        success: false,
        error: {
          code: 'MISSING_VERSION',
          message: 'Version parameter is required',
        },
      };
    }

    const validation = this.versioningService.validateVersion(version);

    return {
      success: validation.isValid,
      version,
      isValid: validation.isValid,
      message: validation.message,
      isSupported: this.versioningService.isVersionSupported(version),
      isDeprecated: this.versioningService.isVersionDeprecated(version),
      deprecationMessage: this.versioningService.getDeprecationMessage(version),
    };
  }

  @Get('changelog')
  @Header('Cache-Control', 'public, max-age=3600')
  getChangelog(@Query('version') version?: string) {
    if (version) {
      const changes = this.versioningService.getVersionChanges(version);
      const breakingChanges = this.versioningService.getBreakingChanges(version);

      return {
        success: true,
        version,
        changes,
        breakingChanges,
      };
    }

    // Return changelog for all versions
    const versionInfo = this.versioningService.getVersionInfo();
    const allVersions = [...versionInfo.supported, ...versionInfo.deprecated];
    const changelog: { [key: string]: any } = {};

    allVersions.forEach(v => {
      const details = this.versioningService.getVersionDetails(v);
      if (details) {
        changelog[v] = {
          releaseDate: details.releaseDate,
          changes: details.changes,
          breakingChanges: details.breakingChanges || [],
          isDeprecated: details.isDeprecated,
        };
      }
    });

    return {
      success: true,
      changelog,
    };
  }

  private estimateMigrationEffort(fromVersion: string, toVersion: string): string {
    const efforts: { [key: string]: string } = {
      'v1_to_v2': 'High - Major API changes required',
      'v1.1_to_v2': 'Medium - Minor adjustments needed',
      'v1_to_v1.1': 'Low - Simple feature additions',
    };

    const key = `${fromVersion}_to_${toVersion}`;
    return efforts[key] || 'Unknown - Please check migration guide';
  }
}
