import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerModule,
  OpenAPIObject,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

export interface DocumentationConfig {
  title: string;
  description: string;
  version: string;
  tag?: string;
}

export interface ApiVersionConfig {
  version: string;
  title: string;
  description: string;
  deprecated?: boolean;
  deprecatedAt?: string;
  sunsetDate?: string;
}

@Injectable()
export class DocumentationService {
  private readonly apiVersions: ApiVersionConfig[] = [
    {
      version: 'v1',
      title: 'Audio Tài Lộc API v1',
      description: 'Legacy API version - Deprecated',
      deprecated: true,
      deprecatedAt: '2024-03-01',
      sunsetDate: '2024-12-31',
    },
    {
      version: 'v1.1',
      title: 'Audio Tài Lộc API v1.1',
      description: 'Enhanced API with AI features - Deprecated',
      deprecated: true,
      deprecatedAt: '2024-03-01',
      sunsetDate: '2025-01-31',
    },
    {
      version: 'v2',
      title: 'Audio Tài Lộc API v2',
      description: 'Latest API with advanced security and monitoring',
      deprecated: false,
    },
  ];

  constructor(private configService: ConfigService) {}

  // Create documentation for specific API version
  createVersionedDocument(app: any, version: string): OpenAPIObject {
    const versionConfig = this.apiVersions.find(v => v.version === version);

    if (!versionConfig) {
      throw new Error(`API version ${version} not found`);
    }

    const baseConfig = new DocumentBuilder()
      .setTitle(versionConfig.title)
      .setDescription(this.buildVersionDescription(versionConfig))
      .setVersion(versionConfig.version)
      .setContact(
        'Audio Tài Lộc Support',
        'https://audiotailoc.com',
        'support@audiotailoc.com'
      )
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .setTermsOfService('https://audiotailoc.com/terms')
      .addServer('https://api.audiotailoc.com', 'Production Server')
      .addServer('https://staging-api.audiotailoc.com', 'Staging Server')
      .addServer('http://localhost:3000', 'Development Server')
      .addServer('http://localhost:3010', 'Local Development');

    // Add authentication based on version
    if (version === 'v1') {
      baseConfig.addApiKey({
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API Key for authentication'
      }, 'api-key');
    } else {
      baseConfig.addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        },
        'access-token'
      );

      // Add refresh token auth for v2
      if (version === 'v2') {
        baseConfig.addApiKey({
          type: 'apiKey',
          name: 'x-refresh-token',
          in: 'header',
          description: 'Refresh token for token renewal'
        }, 'refresh-token');
      }
    }

    // Add tags based on version
    const tags = this.getVersionTags(version);
    tags.forEach(tag => {
      baseConfig.addTag(tag.name, tag.description, tag.externalDocs);
    });

    // Skip global parameters to avoid type issues

    const config = baseConfig.build();

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);

    // Add custom extensions and examples
    this.enhanceDocument(document, version);

    return document;
  }

  // Build version-specific description
  private buildVersionDescription(versionConfig: ApiVersionConfig): string {
    let description = `
# ${versionConfig.title}

${versionConfig.description}

## Features

`;

    // Add feature list based on version
    if (versionConfig.version === 'v1') {
      description += `
- ✅ Basic authentication
- ✅ Product catalog management
- ✅ Order processing
- ✅ User management
- ✅ Basic search functionality
`;
    } else if (versionConfig.version === 'v1.1') {
      description += `
- ✅ JWT authentication
- ✅ AI-powered search
- ✅ Real-time chat
- ✅ Payment gateway integration
- ✅ Inventory management
- ✅ Enhanced product management
`;
    } else if (versionConfig.version === 'v2') {
      description += `
- ✅ Advanced JWT authentication with refresh tokens
- ✅ AI-powered semantic search
- ✅ Real-time WebSocket notifications
- ✅ Multiple payment gateway support (VNPAY, MOMO, PayOS)
- ✅ Advanced inventory with stock reservations
- ✅ Comprehensive monitoring and analytics
- ✅ Automated backup and recovery
- ✅ API versioning and deprecation management
- ✅ Advanced security with rate limiting
- ✅ Performance monitoring with Prometheus
- ✅ Comprehensive error handling with correlation IDs
- ✅ Redis-based caching with intelligent invalidation
`;
    }

    // Add deprecation notice
    if (versionConfig.deprecated) {
      description += `

## ⚠️ Deprecation Notice

This API version is **deprecated** and will be sunset on **${versionConfig.sunsetDate}**.

### Migration Guide
Please upgrade to the latest API version (v2) for:
- Enhanced security features
- Better performance
- Improved error handling
- New functionality and improvements

### Breaking Changes in v2
- Authentication now uses JWT tokens instead of API keys
- Enhanced validation for all endpoints
- New error response format with correlation IDs
- Updated pagination format
- New required headers for security

### Support Timeline
- **Deprecated**: ${versionConfig.deprecatedAt}
- **Sunset Date**: ${versionConfig.sunsetDate}
- **End of Support**: 3 months after sunset date

For migration assistance, please contact support@audiotailoc.com
`;
    }

    // Add common sections
    description += `

## Authentication

### For API v1
\`\`\`bash
curl -H "x-api-key: your-api-key" https://api.audiotailoc.com/api/v1/endpoint
\`\`\`

### For API v1.1+ (JWT)
\`\`\`bash
# 1. Get access token
curl -X POST https://api.audiotailoc.com/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "password": "password"}'

# 2. Use token in requests
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
     -H "Content-Type: application/json" \\
     https://api.audiotailoc.com/api/v1/endpoint
\`\`\`

## Response Format

All API responses follow a consistent format:

### Success Response
\`\`\`json
{
  "success": true,
  "data": {
    // Response data
  },
  "_api": {
    "version": "${versionConfig.version}",
    "deprecated": ${versionConfig.deprecated || false}
  }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {},
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/v1/endpoint",
    "correlationId": "req_123456789_abc123"
  }
}
\`\`\`

## Rate Limiting

- **General**: 1000 requests per 15 minutes per IP
- **Authentication**: 5 attempts per 15 minutes per IP
- **File Upload**: 10 uploads per hour per user

Rate limit headers are included in responses:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Remaining requests
- \`X-RateLimit-Reset\`: Time when limit resets (Unix timestamp)

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| VALIDATION_ERROR | Invalid request data | 422 |
| UNAUTHORIZED | Authentication required | 401 |
| FORBIDDEN | Insufficient permissions | 403 |
| NOT_FOUND | Resource not found | 404 |
| CONFLICT | Resource conflict | 409 |
| RATE_LIMIT_EXCEEDED | Too many requests | 429 |
| INTERNAL_ERROR | Server error | 500 |

## Support

For API support and questions:
- **Email**: support@audiotailoc.com
- **Documentation**: https://docs.audiotailoc.com
- **Status Page**: https://status.audiotailoc.com
- **Developer Portal**: https://developer.audiotailoc.com
`;

    return description;
  }

  // Get tags for specific version
  private getVersionTags(version: string) {
    const baseTags = [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
        externalDocs: {
          description: 'Auth Guide',
          url: 'https://docs.audiotailoc.com/auth',
        },
      },
      {
        name: 'Users',
        description: 'User management and profiles',
        externalDocs: {
          description: 'User Guide',
          url: 'https://docs.audiotailoc.com/users',
        },
      },
      {
        name: 'Products',
        description: 'Product catalog and management',
        externalDocs: {
          description: 'Products Guide',
          url: 'https://docs.audiotailoc.com/products',
        },
      },
      {
        name: 'Orders',
        description: 'Order processing and management',
        externalDocs: {
          description: 'Orders Guide',
          url: 'https://docs.audiotailoc.com/orders',
        },
      },
      {
        name: 'Categories',
        description: 'Product categories and organization',
        externalDocs: {
          description: 'Categories Guide',
          url: 'https://docs.audiotailoc.com/categories',
        },
      },
    ];

    // Add version-specific tags
    if (version === 'v1.1' || version === 'v2') {
      baseTags.push({
        name: 'AI',
        description: 'AI-powered features and recommendations',
        externalDocs: {
          description: 'AI Guide',
          url: 'https://docs.audiotailoc.com/ai',
        },
      });
    }

    if (version === 'v2') {
      baseTags.push(
        {
          name: 'Monitoring',
          description: 'System monitoring and health checks',
          externalDocs: {
            description: 'Monitoring Guide',
            url: 'https://docs.audiotailoc.com/monitoring',
          },
        },
        {
          name: 'Backup',
          description: 'Backup and recovery operations',
          externalDocs: {
            description: 'Backup Guide',
            url: 'https://docs.audiotailoc.com/backup',
          },
        },
        {
          name: 'Analytics',
          description: 'Business analytics and reporting',
          externalDocs: {
            description: 'Analytics Guide',
            url: 'https://docs.audiotailoc.com/analytics',
          },
        }
      );
    }

    return baseTags;
  }

  // Enhance document with custom extensions
  private enhanceDocument(document: OpenAPIObject, version: string) {
    // Add custom extensions
    (document as any)['x-api-version'] = version;
    (document as any)['x-generated-at'] = new Date().toISOString();
    (document as any)['x-environment'] = this.configService.get('NODE_ENV', 'development');

    // Add examples for common schemas
    if (document.components?.schemas) {
      this.addResponseExamples(document.components.schemas, version);
    }

    // Add security examples
    if (document.components?.securitySchemes) {
      this.addSecurityExamples(document.components.securitySchemes, version);
    }

    // Add custom webhooks documentation for v2
    if (version === 'v2') {
      (document as any)['x-webhooks'] = {
        'order.created': {
          post: {
            summary: 'Order Created Webhook',
            description: 'Triggered when a new order is created',
            operationId: 'orderCreatedWebhook',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/WebhookOrderPayload',
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Webhook received successfully',
              },
            },
          },
        },
        'payment.completed': {
          post: {
            summary: 'Payment Completed Webhook',
            description: 'Triggered when a payment is completed',
            operationId: 'paymentCompletedWebhook',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/WebhookPaymentPayload',
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Webhook received successfully',
              },
            },
          },
        },
      };
    }
  }

  // Add response examples to schemas
  private addResponseExamples(schemas: any, version: string) {
    // Add common response schemas
    schemas['SuccessResponse'] = {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        data: {
          type: 'object',
          description: 'Response data',
        },
        _api: {
          type: 'object',
          properties: {
            version: {
              type: 'string',
              example: version,
            },
            deprecated: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
    };

    schemas['ErrorResponse'] = {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        error: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR',
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            details: {
              type: 'object',
              description: 'Error details',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
            path: {
              type: 'string',
              example: '/api/v1/users',
            },
            correlationId: {
              type: 'string',
              example: 'req_123456789_abc123',
            },
          },
        },
      },
    };

    schemas['PaginationMeta'] = {
      type: 'object',
      properties: {
        page: {
          type: 'integer',
          example: 1,
          minimum: 1,
        },
        limit: {
          type: 'integer',
          example: 20,
          minimum: 1,
          maximum: 100,
        },
        total: {
          type: 'integer',
          example: 150,
          minimum: 0,
        },
        totalPages: {
          type: 'integer',
          example: 8,
          minimum: 1,
        },
        hasNext: {
          type: 'boolean',
          example: true,
        },
        hasPrev: {
          type: 'boolean',
          example: false,
        },
      },
    };

    // Add webhook payload schemas for v2
    if (version === 'v2') {
      schemas['WebhookOrderPayload'] = {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'wh_order_123',
          },
          event: {
            type: 'string',
            example: 'order.created',
          },
          data: {
            type: 'object',
            properties: {
              orderId: {
                type: 'string',
                example: 'order_456',
              },
              userId: {
                type: 'string',
                example: 'user_789',
              },
              total: {
                type: 'number',
                example: 150000,
              },
              status: {
                type: 'string',
                example: 'PENDING',
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    productId: { type: 'string' },
                    quantity: { type: 'integer' },
                    price: { type: 'number' },
                  },
                },
              },
            },
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      };

      schemas['WebhookPaymentPayload'] = {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'wh_payment_123',
          },
          event: {
            type: 'string',
            example: 'payment.completed',
          },
          data: {
            type: 'object',
            properties: {
              paymentId: {
                type: 'string',
                example: 'payment_456',
              },
              orderId: {
                type: 'string',
                example: 'order_789',
              },
              amount: {
                type: 'number',
                example: 150000,
              },
              currency: {
                type: 'string',
                example: 'VND',
              },
              method: {
                type: 'string',
                example: 'VNPAY',
              },
              status: {
                type: 'string',
                example: 'COMPLETED',
              },
            },
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      };
    }
  }

  // Add security examples
  private addSecurityExamples(securitySchemes: any, version: string) {
    if (version === 'v1') {
      securitySchemes['api-key'].example = 'your-api-key-here';
    } else {
      securitySchemes['access-token'].example = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

      if (version === 'v2' && securitySchemes['refresh-token']) {
        securitySchemes['refresh-token'].example = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      }
    }
  }

  // Save documentation to file
  async saveDocumentation(document: OpenAPIObject, version: string): Promise<string> {
    const docsDir = this.configService.get('DOCS_DIR', './docs');
    await fs.promises.mkdir(docsDir, { recursive: true });

    const fileName = `api-${version}.json`;
    const filePath = path.join(docsDir, fileName);

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(document, null, 2),
      'utf-8'
    );

    return filePath;
  }

  // Generate HTML documentation
  async generateHtmlDocumentation(document: OpenAPIObject, version: string): Promise<string> {
    const docsDir = this.configService.get('DOCS_DIR', './docs');
    await fs.promises.mkdir(docsDir, { recursive: true });

    const fileName = `api-${version}.html`;
    const filePath = path.join(docsDir, fileName);

    // Generate basic HTML documentation
    const html = this.generateHtmlFromOpenApi(document, version);

    await fs.promises.writeFile(filePath, html, 'utf-8');

    return filePath;
  }

  // Generate HTML from OpenAPI document
  private generateHtmlFromOpenApi(document: OpenAPIObject, version: string): string {
    const endpoints = this.extractEndpoints(document);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audio Tài Lộc API ${version} - Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .endpoint {
            background: white;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
        }
        .get { background: #61affe; }
        .post { background: #49cc90; }
        .put { background: #fca130; }
        .delete { background: #f93e3e; }
        .patch { background: #50e3c2; }
        .deprecated { opacity: 0.6; text-decoration: line-through; }
        .deprecated-tag {
            background: #ff6b6b;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            margin-left: 10px;
        }
        code {
            background: #f6f8fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
        }
        pre {
            background: #f6f8fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        .response-example {
            margin-top: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-left: 4px solid #28a745;
        }
        .error-example {
            margin-top: 15px;
            padding: 10px;
            background: #f8d7da;
            border-left: 4px solid #dc3545;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎵 Audio Tài Lộc API ${version}</h1>
        <p>${document.info?.description || 'API Documentation'}</p>
        <p><strong>Version:</strong> ${document.info?.version}</p>
        ${document.info?.contact ? `<p><strong>Contact:</strong> ${document.info.contact.email}</p>` : ''}
    </div>

    <h2>📚 API Endpoints</h2>

    ${endpoints.map(endpoint => `
    <div class="endpoint ${endpoint.deprecated ? 'deprecated' : ''}">
        <h3>
            <span class="method ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
            <code>${endpoint.path}</code>
            ${endpoint.deprecated ? '<span class="deprecated-tag">DEPRECATED</span>' : ''}
        </h3>
        <p><strong>${endpoint.summary || endpoint.operationId}</strong></p>
        ${endpoint.description ? `<p>${endpoint.description}</p>` : ''}

        ${endpoint.parameters && endpoint.parameters.length > 0 ? `
        <h4>Parameters:</h4>
        <ul>
            ${(endpoint.parameters as any[]).map((param: any) => `
            <li><code>${param.name}</code> (${param.in}) - ${param.description || 'No description'}</li>
            `).join('')}
        </ul>
        ` : ''}

        <h4>Responses:</h4>
        ${Object.entries(endpoint.responses || {}).map(([code, response]: [string, any]) => `
        <div class="response-example">
            <strong>${code}:</strong> ${response.description || 'No description'}
        </div>
        `).join('')}

        ${endpoint.requestBody ? `
        <h4>Request Body:</h4>
        <p>Content-Type: application/json</p>
        ` : ''}
    </div>
    `).join('')}

    <div class="endpoint">
        <h3>Common Response Formats</h3>

        <h4>Success Response:</h4>
        <pre><code>{
  "success": true,
  "data": {
    // Response data
  },
  "_api": {
    "version": "${version}",
    "deprecated": false
  }
}</code></pre>

        <h4>Error Response:</h4>
        <div class="error-example">
        <pre><code>{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {},
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/v1/endpoint",
    "correlationId": "req_123456789_abc123"
  }
}</code></pre>
        </div>
    </div>

    <div class="endpoint">
        <h3>Authentication Examples</h3>

        <h4>Login:</h4>
        <pre><code>curl -X POST http://localhost:3000/api/${version}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "password": "password"}'</code></pre>

        <h4>Use JWT Token:</h4>
        <pre><code>curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
     -H "Content-Type: application/json" \\
     http://localhost:3000/api/${version}/users/profile</code></pre>
    </div>

    <footer style="margin-top: 50px; text-align: center; color: #666;">
        <p>Generated on ${new Date().toISOString()}</p>
        <p>Audio Tài Lộc API Documentation - ${version}</p>
    </footer>
</body>
</html>`;
  }

  // Extract endpoints from OpenAPI document
  private extractEndpoints(document: OpenAPIObject): any[] {
    const endpoints: any[] = [];

    if (document.paths) {
      Object.entries(document.paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
          if (method !== 'parameters' && method !== 'summary' && method !== 'description') {
            endpoints.push({
              path,
              method: method.toUpperCase(),
              summary: operation.summary,
              description: operation.description,
              operationId: operation.operationId,
              parameters: operation.parameters || [],
              requestBody: operation.requestBody,
              responses: operation.responses,
              deprecated: operation.deprecated || false,
            });
          }
        });
      });
    }

    return endpoints;
  }

  // Get all API versions
  getApiVersions(): ApiVersionConfig[] {
    return this.apiVersions;
  }

  // Get specific version info
  getVersionInfo(version: string): ApiVersionConfig | undefined {
    return this.apiVersions.find(v => v.version === version);
  }

  // Generate documentation for all versions
  async generateAllVersions(app: any): Promise<Record<string, OpenAPIObject>> {
    const documents: Record<string, OpenAPIObject> = {};

    for (const versionConfig of this.apiVersions) {
      try {
        documents[versionConfig.version] = this.createVersionedDocument(app, versionConfig.version);
      } catch (error) {
        console.error(`Failed to generate docs for version ${versionConfig.version}:`, error);
      }
    }

    return documents;
  }

  // Generate and save all documentation
  async generateAndSaveAllDocumentation(app: any): Promise<string[]> {
    const savedFiles: string[] = [];
    const documents = await this.generateAllVersions(app);

    for (const [version, document] of Object.entries(documents)) {
      try {
        // Save JSON documentation
        const jsonPath = await this.saveDocumentation(document, version);
        savedFiles.push(jsonPath);

        // Generate and save HTML documentation
        const htmlPath = await this.generateHtmlDocumentation(document, version);
        savedFiles.push(htmlPath);

        console.log(`✅ Documentation generated for ${version}: ${jsonPath}, ${htmlPath}`);
      } catch (error) {
        console.error(`❌ Failed to save documentation for ${version}:`, error);
      }
    }

    return savedFiles;
  }
}
