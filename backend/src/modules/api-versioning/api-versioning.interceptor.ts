import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiVersioningService } from './api-versioning.service';

@Injectable()
export class ApiVersioningInterceptor implements NestInterceptor {
  constructor(private readonly versioningService: ApiVersioningService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    // Extract version from URL or headers
    const version = this.extractVersion(request);

    // Validate version
    const versionValidation = this.versioningService.validateVersion(version);
    if (!versionValidation.isValid) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'INVALID_API_VERSION',
            message: versionValidation.message || 'Invalid API version',
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Add version headers
    this.addVersionHeaders(response, version);

    // Add deprecation warning if needed
    if (this.versioningService.shouldShowDeprecationWarning(version)) {
      const deprecationMessage = this.versioningService.getDeprecationMessage(version);
      if (deprecationMessage) {
        response.setHeader('X-API-Deprecation-Warning', deprecationMessage);
        response.setHeader('Deprecation', 'true');
      }
    }

    return next.handle().pipe(
      map(data => {
        // Add version information to successful responses
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          return {
            ...data,
            _api: {
              version,
              deprecated: this.versioningService.isVersionDeprecated(version),
              latest: 'v2',
            },
          };
        }
        return data;
      }),
    );
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

  private addVersionHeaders(response: Response, version: string) {
    const versionInfo = this.versioningService.getVersionDetails(version);

    response.setHeader('X-API-Version', version);
    response.setHeader('X-API-Supported-Versions', 'v1, v1.1, v2');
    response.setHeader('X-API-Latest-Version', 'v2');

    if (versionInfo) {
      response.setHeader('X-API-Version-Release-Date', versionInfo.releaseDate.toISOString());
      if (versionInfo.isDeprecated) {
        response.setHeader('X-API-Version-Deprecated', 'true');
        if (versionInfo.sunsetDate) {
          response.setHeader('X-API-Version-Sunset-Date', versionInfo.sunsetDate.toISOString());
        }
      }
    }
  }
}
