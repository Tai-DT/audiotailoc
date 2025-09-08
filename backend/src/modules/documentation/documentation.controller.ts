import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { DocumentationService, ApiVersionConfig } from './documentation.service';
import { ApiStandardResponses } from './documentation.decorators';

@Controller('api/docs')
export class DocumentationController {
  constructor(private readonly documentationService: DocumentationService) {}

  // Get API versions information
  @Get('versions')
  @ApiStandardResponses.success('API versions retrieved successfully', {
    type: 'object',
    properties: {
      versions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            version: { type: 'string', example: 'v2' },
            title: { type: 'string', example: 'Audio Tài Lộc API v2' },
            description: { type: 'string' },
            deprecated: { type: 'boolean', example: false },
            deprecatedAt: { type: 'string', format: 'date', example: '2024-03-01' },
            sunsetDate: { type: 'string', format: 'date', example: '2024-12-31' },
          },
        },
      },
      current: { type: 'string', example: 'v2' },
      latest: { type: 'string', example: 'v2' },
    },
  })
  async getVersions(): Promise<{
    success: boolean;
    versions: ApiVersionConfig[];
    current: string;
    latest: string;
  }> {
    try {
      const versions = this.documentationService.getApiVersions();
      const current = 'v2'; // Could be from config
      const latest = 'v2';

      return {
        success: true,
        versions,
        current,
        latest,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'VERSIONS_ERROR',
            message: 'Failed to retrieve API versions',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get specific version information
  @Get('versions/:version')
  @ApiStandardResponses.success('Version information retrieved successfully')
  @ApiStandardResponses.notFound('Version not found')
  async getVersionInfo(@Param('version') version: string): Promise<{
    success: boolean;
    version?: ApiVersionConfig;
  }> {
    try {
      const versionInfo = this.documentationService.getVersionInfo(version);

      if (!versionInfo) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'VERSION_NOT_FOUND',
              message: `API version ${version} not found`,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        version: versionInfo,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'VERSION_INFO_ERROR',
            message: 'Failed to retrieve version information',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get migration guide
  @Get('migration')
  @ApiStandardResponses.success('Migration guide retrieved successfully', {
    type: 'object',
    properties: {
      from: { type: 'string', example: 'v1' },
      to: { type: 'string', example: 'v2' },
      steps: {
        type: 'array',
        items: { type: 'string' },
        example: [
          'Update authentication to use JWT tokens',
          'Replace API keys with Bearer tokens',
          'Update error response format',
          'Implement correlation IDs',
        ],
      },
      estimatedEffort: { type: 'string', example: 'Medium - Minor adjustments needed' },
    },
  })
  async getMigrationGuide(
    @Query('from') fromVersion: string,
    @Query('to') toVersion: string,
  ): Promise<{
    success: boolean;
    migration?: {
      from: string;
      to: string;
      steps: string[];
      estimatedEffort: string;
    };
  }> {
    try {
      if (!fromVersion || !toVersion) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'MISSING_PARAMETERS',
              message: 'Both from and to parameters are required',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // This would integrate with the API versioning service
      // For now, return a sample migration guide
      const migrationSteps = [
        'Update authentication to use JWT tokens instead of API keys',
        'Replace x-api-key headers with Authorization: Bearer tokens',
        'Update error response format to include correlation IDs',
        'Implement proper error handling with structured responses',
        'Update pagination format for list endpoints',
        'Add required security headers for all requests',
        'Implement proper rate limiting handling',
        'Update webhook endpoints for real-time notifications',
        'Use enhanced validation for all request payloads',
        'Implement proper correlation ID tracking',
      ];

      const estimatedEffort = fromVersion === 'v1' ? 'High - Major API changes required' :
                             fromVersion === 'v1.1' ? 'Medium - Minor adjustments needed' :
                             'Low - Simple updates only';

      return {
        success: true,
        migration: {
          from: fromVersion,
          to: toVersion,
          steps: migrationSteps,
          estimatedEffort,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'MIGRATION_GUIDE_ERROR',
            message: 'Failed to retrieve migration guide',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get changelog
  @Get('changelog')
  @ApiStandardResponses.success('Changelog retrieved successfully', {
    type: 'object',
    properties: {
      changelog: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            releaseDate: { type: 'string', format: 'date-time' },
            changes: { type: 'array', items: { type: 'string' } },
            breakingChanges: { type: 'array', items: { type: 'string' } },
            isDeprecated: { type: 'boolean' },
          },
        },
      },
    },
  })
  async getChangelog(@Query('version') version?: string): Promise<{
    success: boolean;
    changelog?: any;
  }> {
    try {
      // This would integrate with the API versioning service to get real changelog data
      const changelog: Record<string, {
        releaseDate: string;
        changes: string[];
        breakingChanges: string[];
        isDeprecated: boolean;
      }> = {
        'v2': {
          releaseDate: '2024-03-01T00:00:00Z',
          changes: [
            'Enhanced security with advanced authentication',
            'Real-time WebSocket notifications',
            'AI-powered semantic search',
            'Comprehensive monitoring and analytics',
            'Automated backup and recovery',
            'Advanced error handling with correlation IDs',
            'Performance monitoring with Prometheus',
            'Redis-based intelligent caching',
            'API versioning and deprecation management',
            'Comprehensive testing framework',
          ],
          breakingChanges: [
            'Authentication now uses JWT tokens instead of API keys',
            'Enhanced validation for all endpoints',
            'New error response format with correlation IDs',
            'Updated pagination format',
            'New required security headers',
          ],
          isDeprecated: false,
        },
        'v1.1': {
          releaseDate: '2024-02-01T00:00:00Z',
          changes: [
            'JWT authentication with refresh tokens',
            'AI-powered search and recommendations',
            'Real-time chat system',
            'Payment gateway integration (VNPAY, MOMO)',
            'Advanced inventory management',
            'Enhanced product management',
            'WebSocket real-time notifications',
            'Performance optimizations',
            'Better error handling',
          ],
          breakingChanges: [
            'API key authentication deprecated',
            'New JWT-based authentication required',
            'Enhanced request validation',
            'Updated response formats',
          ],
          isDeprecated: true,
        },
        'v1': {
          releaseDate: '2024-01-01T00:00:00Z',
          changes: [
            'Initial API release',
            'Basic authentication with API keys',
            'Product catalog management',
            'Order processing',
            'User management',
            'Basic search functionality',
          ],
          breakingChanges: [],
          isDeprecated: true,
        },
      };

      if (version) {
        if (!changelog[version]) {
          throw new HttpException(
            {
              success: false,
              error: {
                code: 'VERSION_NOT_FOUND',
                message: `Changelog not found for version ${version}`,
              },
            },
            HttpStatus.NOT_FOUND,
          );
        }

        return {
          success: true,
          changelog: { [version]: changelog[version] },
        };
      }

      return {
        success: true,
        changelog,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'CHANGELOG_ERROR',
            message: 'Failed to retrieve changelog',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get API specifications
  @Get('specs/:version')
  async getApiSpecification(
    @Param('version') version: string,
    @Query('format') format: 'json' | 'yaml' = 'json',
    @Res() response: Response,
  ): Promise<void> {
    try {
      // This would generate the OpenAPI specification for the specific version
      // For now, return a placeholder

      const spec = {
        openapi: '3.0.3',
        info: {
          title: `Audio Tài Lộc API ${version}`,
          description: `API specification for version ${version}`,
          version: version,
          contact: {
            name: 'Audio Tài Lộc Support',
            email: 'support@audiotailoc.com',
          },
        },
        servers: [
          {
            url: `https://api.audiotailoc.com/api/${version}`,
            description: 'Production server',
          },
          {
            url: `http://localhost:3000/api/${version}`,
            description: 'Development server',
          },
        ],
        security: [
          version === 'v1' ? { 'api-key': [] } : { 'access-token': [] },
        ],
        paths: {
          '/health': {
            get: {
              summary: 'Health Check',
              responses: {
                '200': {
                  description: 'API is healthy',
                },
              },
            },
          },
        },
      };

      if (format === 'yaml') {
        response.setHeader('Content-Type', 'application/yaml');
        response.send(this.convertToYaml(spec));
      } else {
        response.setHeader('Content-Type', 'application/json');
        response.json(spec);
      }
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'SPEC_ERROR',
            message: 'Failed to generate API specification',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get documentation statistics
  @Get('stats')
  @ApiStandardResponses.success('Documentation statistics retrieved successfully', {
    type: 'object',
    properties: {
      totalVersions: { type: 'integer', example: 3 },
      deprecatedVersions: { type: 'integer', example: 2 },
      activeVersions: { type: 'integer', example: 1 },
      totalEndpoints: { type: 'integer', example: 45 },
      documentedEndpoints: { type: 'integer', example: 42 },
      coveragePercentage: { type: 'number', example: 93.3 },
      lastUpdated: { type: 'string', format: 'date-time' },
    },
  })
  async getDocumentationStats(): Promise<{
    success: boolean;
    stats: {
      totalVersions: number;
      deprecatedVersions: number;
      activeVersions: number;
      totalEndpoints: number;
      documentedEndpoints: number;
      coveragePercentage: number;
      lastUpdated: string;
    };
  }> {
    try {
      const versions = this.documentationService.getApiVersions();

      // This would be calculated from actual endpoint analysis
      const stats = {
        totalVersions: versions.length,
        deprecatedVersions: versions.filter(v => v.deprecated).length,
        activeVersions: versions.filter(v => !v.deprecated).length,
        totalEndpoints: 45, // Would be calculated from routes
        documentedEndpoints: 42, // Would be calculated from documented routes
        coveragePercentage: 93.3,
        lastUpdated: new Date().toISOString(),
      };

      return {
        success: true,
        stats,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'STATS_ERROR',
            message: 'Failed to retrieve documentation statistics',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get API testing endpoints
  @Get('testing')
  @ApiStandardResponses.success('API testing information retrieved successfully', {
    type: 'object',
    properties: {
      testingUrl: { type: 'string', example: 'https://api.audiotailoc.com/docs' },
      swaggerUrl: { type: 'string', example: 'https://swagger.io/tools/swagger-ui/' },
      postmanCollection: { type: 'string', example: 'https://api.audiotailoc.com/docs/postman.json' },
      testingInstructions: { type: 'array', items: { type: 'string' } },
    },
  })
  async getTestingInfo(): Promise<{
    success: boolean;
    testing: {
      testingUrl: string;
      swaggerUrl: string;
      postmanCollection: string;
      testingInstructions: string[];
    };
  }> {
    try {
      const testing = {
        testingUrl: 'https://api.audiotailoc.com/docs',
        swaggerUrl: 'https://swagger.io/tools/swagger-ui/',
        postmanCollection: 'https://api.audiotailoc.com/docs/postman.json',
        testingInstructions: [
          '1. Visit the Swagger UI at the testing URL',
          '2. Authorize using your API key or JWT token',
          '3. Test endpoints using the "Try it out" feature',
          '4. Check response codes and data structure',
          '5. Use the Postman collection for automated testing',
          '6. Verify rate limiting behavior',
          '7. Test error scenarios and edge cases',
        ],
      };

      return {
        success: true,
        testing,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'TESTING_INFO_ERROR',
            message: 'Failed to retrieve testing information',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get SDK information
  @Get('sdk')
  @ApiStandardResponses.success('SDK information retrieved successfully', {
    type: 'object',
    properties: {
      availableSdks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            language: { type: 'string', example: 'javascript' },
            name: { type: 'string', example: 'audiotailoc-js-sdk' },
            repository: { type: 'string', example: 'https://github.com/audiotailoc/js-sdk' },
            documentation: { type: 'string', example: 'https://docs.audiotailoc.com/sdk/js' },
            latestVersion: { type: 'string', example: '1.2.0' },
          },
        },
      },
    },
  })
  async getSdkInfo(): Promise<{
    success: boolean;
    availableSdks: any[];
  }> {
    try {
      const availableSdks = [
        {
          language: 'javascript',
          name: 'audiotailoc-js-sdk',
          repository: 'https://github.com/audiotailoc/js-sdk',
          documentation: 'https://docs.audiotailoc.com/sdk/js',
          latestVersion: '1.2.0',
          installation: 'npm install @audiotailoc/js-sdk',
        },
        {
          language: 'python',
          name: 'audiotailoc-python-sdk',
          repository: 'https://github.com/audiotailoc/python-sdk',
          documentation: 'https://docs.audiotailoc.com/sdk/python',
          latestVersion: '1.1.0',
          installation: 'pip install audiotailoc-sdk',
        },
        {
          language: 'php',
          name: 'audiotailoc-php-sdk',
          repository: 'https://github.com/audiotailoc/php-sdk',
          documentation: 'https://docs.audiotailoc.com/sdk/php',
          latestVersion: '1.0.0',
          installation: 'composer require audiotailoc/php-sdk',
        },
        {
          language: 'java',
          name: 'audiotailoc-java-sdk',
          repository: 'https://github.com/audiotailoc/java-sdk',
          documentation: 'https://docs.audiotailoc.com/sdk/java',
          latestVersion: '1.0.0',
          installation: 'maven: com.audiotailoc:java-sdk:1.0.0',
        },
      ];

      return {
        success: true,
        availableSdks,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'SDK_INFO_ERROR',
            message: 'Failed to retrieve SDK information',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Utility method to convert JSON to YAML
  private convertToYaml(obj: any): string {
    // This is a simple conversion - in practice you'd use a proper YAML library
    return JSON.stringify(obj, null, 2)
      .replace(/"/g, '')
      .replace(/,/g, '\n')
      .replace(/{/g, '')
      .replace(/}/g, '')
      .replace(/:/g, ': ');
  }
}
