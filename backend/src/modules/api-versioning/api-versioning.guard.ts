import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiVersioningService } from './api-versioning.service';
import {
  getApiVersions,
  getApiVersionMin,
  getApiVersionMax,
  getApiVersionDeprecated,
  isApiVersionExperimental,
  getApiReplacedBy,
} from './api-versioning.decorators';

@Injectable()
export class ApiVersioningGuard implements CanActivate {
  private readonly logger = new Logger(ApiVersioningGuard.name);

  constructor(
    private reflector: Reflector,
    private versioningService: ApiVersioningService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const handler = context.getHandler();
    const controller = context.getClass();

    // Extract API version from request
    const requestedVersion = this.extractVersion(request);

    // Get version constraints from decorators
    const supportedVersions = getApiVersions(handler) || getApiVersions(controller) || [];
    const minVersion = getApiVersionMin(handler) || getApiVersionMin(controller);
    const maxVersion = getApiVersionMax(handler) || getApiVersionMax(controller);
    const deprecated = getApiVersionDeprecated(handler) || getApiVersionDeprecated(controller);
    const replacedBy = getApiReplacedBy(handler) || getApiReplacedBy(controller);
    const isExperimental = isApiVersionExperimental(handler) || isApiVersionExperimental(controller);

    // Validate version constraints
    if (minVersion && this.compareVersions(requestedVersion, minVersion) < 0) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'API_VERSION_TOO_LOW',
            message: `This endpoint requires API version ${minVersion} or higher. Current: ${requestedVersion}`,
            details: {
              requested: requestedVersion,
              minimum: minVersion,
            },
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (maxVersion && this.compareVersions(requestedVersion, maxVersion) > 0) {
      const replacement = replacedBy
        ? ` Please use ${replacedBy.path} (available from ${replacedBy.version})`
        : '';

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'API_VERSION_TOO_HIGH',
            message: `This endpoint is not available in API version ${requestedVersion}. Maximum supported: ${maxVersion}${replacement}`,
            details: {
              requested: requestedVersion,
              maximum: maxVersion,
              replacement: replacedBy,
            },
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if version is in supported list
    if (supportedVersions.length > 0 && !supportedVersions.includes(requestedVersion)) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'API_VERSION_NOT_SUPPORTED',
            message: `API version ${requestedVersion} is not supported for this endpoint. Supported: ${supportedVersions.join(', ')}`,
            details: {
              requested: requestedVersion,
              supported: supportedVersions,
            },
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Handle deprecated versions
    if (deprecated && this.compareVersions(requestedVersion, deprecated.version) >= 0) {
      const warning = deprecated.message || `This endpoint is deprecated from version ${deprecated.version}`;

      response.setHeader('X-API-Deprecation-Warning', warning);
      response.setHeader('Deprecation', 'true');

      this.logger.warn(`Deprecated API usage: ${requestedVersion} - ${warning}`, {
        endpoint: request.url,
        method: request.method,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
      });
    }

    // Handle experimental endpoints
    if (isExperimental) {
      response.setHeader('X-API-Experimental', 'true');
      response.setHeader('X-API-Experimental-Warning', 'This endpoint is experimental and may change without notice');

      this.logger.debug(`Experimental API usage: ${requestedVersion}`, {
        endpoint: request.url,
        method: request.method,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
      });
    }

    // Log API version usage for analytics
    this.logger.debug(`API version usage: ${requestedVersion}`, {
      endpoint: request.url,
      method: request.method,
      version: requestedVersion,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
    });

    return true;
  }

  private extractVersion(request: any): string {
    // Check URL path first (e.g., /api/v1/endpoint)
    const urlMatch = request.url.match(/^\/api\/(v\d+(?:\.\d+)?)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Check Accept header (e.g., application/vnd.api.v1+json)
    const acceptHeader = request.get('Accept') || '';
    const acceptMatch = acceptHeader.match(/application\/vnd\.[^.]+\.(v\d+(?:\.\d+)?)\+json/);
    if (acceptMatch) {
      return acceptMatch[1];
    }

    // Check custom header
    const versionHeader = request.get('X-API-Version');
    if (versionHeader) {
      return versionHeader.toLowerCase();
    }

    // Check query parameter
    const queryVersion = request.query.api_version || request.query.version;
    if (queryVersion) {
      return queryVersion.toLowerCase();
    }

    // Default to current version
    return 'v2';
  }

  private compareVersions(version1: string, version2: string): number {
    const v1 = this.parseVersion(version1);
    const v2 = this.parseVersion(version2);

    if (v1.major !== v2.major) {
      return v1.major - v2.major;
    }

    if (v1.minor !== v2.minor) {
      return v1.minor - v2.minor;
    }

    return 0;
  }

  private parseVersion(version: string): { major: number; minor: number } {
    const match = version.match(/v(\d+)(?:\.(\d+))?/);
    if (!match) {
      return { major: 0, minor: 0 };
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2] || '0', 10),
    };
  }
}
