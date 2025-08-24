# Comprehensive API Documentation System

Enterprise-grade API documentation with multiple version support, interactive testing, and comprehensive developer resources.

## Features

### ✅ **Implemented:**
- **Multi-Version API Documentation** - Separate docs for v1, v1.1, v2 with deprecation warnings
- **Interactive Swagger UI** - Enhanced with custom styling, filtering, and examples
- **Custom Decorators** - Easy-to-use decorators for consistent documentation
- **Response Schemas** - Standardized error and success response formats
- **Authentication Examples** - JWT, API keys, refresh tokens
- **Migration Guides** - Step-by-step upgrade instructions
- **SDK Information** - Multi-language SDK support
- **Testing Integration** - API testing instructions and Postman collections
- **Documentation Generation** - JSON/YAML specs and HTML documentation
- **Changelog Management** - Version history and breaking changes

### 🎯 **Documentation URLs:**
```
📚 Interactive Documentation:
   - V1 (Legacy):     http://localhost:3000/docs/v1
   - V1.1 (Enhanced): http://localhost:3000/docs/v1.1
   - V2 (Latest):     http://localhost:3000/docs/v2

🔧 API Tooling Access:
   - V1:              http://localhost:3000/api/v1/docs
   - V1.1:            http://localhost:3000/api/v1.1/docs
   - V2:              http://localhost:3000/api/v2/docs

📋 Documentation API:
   - Versions:        http://localhost:3000/api/docs/versions
   - Migration:       http://localhost:3000/api/docs/migration
   - Changelog:       http://localhost:3000/api/docs/changelog
   - SDK Info:        http://localhost:3000/api/docs/sdk
   - Testing Guide:   http://localhost:3000/api/docs/testing
   - Stats:           http://localhost:3000/api/docs/stats
```

## Quick Start

### 1. **Access Documentation**

Visit the documentation URLs above to explore the interactive API documentation.

### 2. **Authentication in Swagger**

For **API v1** (Legacy):
- Click "Authorize" button
- Enter your API key: `your-api-key-here`

For **API v1.1+** (JWT):
- Click "Authorize" button
- Enter: `Bearer your-jwt-token-here`
- For refresh tokens, add `x-refresh-token` header

### 3. **Test Endpoints**

1. Open any documentation URL
2. Authorize with your credentials
3. Find an endpoint and click "Try it out"
4. Fill in required parameters
5. Click "Execute" to test the endpoint
6. View response in the "Responses" section

## Custom Decorators

### Standard Response Decorators

```typescript
import { ApiStandardResponses, ApiStandardList, ApiStandardGet } from './documentation.decorators';

// Basic CRUD operations with consistent responses
export class ProductsController {
  @ApiStandardList('products', ProductSchema)
  @Get()
  async getProducts(@Query() query: ListProductsDto) {
    // Implementation
  }

  @ApiStandardGet('products', ProductSchema)
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    // Implementation
  }

  @ApiStandardCreate('products', CreateProductDto, ProductSchema)
  @Post()
  async createProduct(@Body() data: CreateProductDto) {
    // Implementation
  }

  @ApiStandardUpdate('products', UpdateProductDto)
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto) {
    // Implementation
  }

  @ApiStandardDelete('products')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    // Implementation
  }
}
```

### Authentication Decorators

```typescript
import { ApiAuth, ApiV2Endpoint, ApiV1Endpoint } from './documentation.decorators';

export class AuthController {
  // V1 endpoint with API key authentication
  @ApiV1Endpoint(true) // true = deprecated
  @ApiAuth('v1') // API key authentication
  @Post('login')
  async loginV1() {
    // Implementation
  }

  // V2 endpoint with JWT authentication
  @ApiV2Endpoint()
  @ApiAuth('v2') // JWT authentication
  @Post('login')
  async loginV2() {
    // Implementation
  }
}
```

### AI and Payment Endpoints

```typescript
import { ApiAIEndpoint, ApiPaymentEndpoint } from './documentation.decorators';

export class AIController {
  @ApiAIEndpoint('Generate Product Description')
  @Post('generate-description')
  async generateDescription(@Body() data: GenerateDescriptionDto) {
    // Implementation
  }
}

export class PaymentController {
  @ApiPaymentEndpoint('Create Payment')
  @Post('create')
  async createPayment(@Body() data: CreatePaymentDto) {
    // Implementation
  }
}
```

## API Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "_api": {
    "version": "v2",
    "deprecated": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": "email",
      "issue": "must be a valid email"
    },
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/v1/users",
    "correlationId": "req_123456789_abc123"
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Configuration

### Environment Variables

```env
# Documentation Configuration
ENABLE_SWAGGER=true                    # Enable/disable Swagger UI
GENERATE_DOCS_FILES=false              # Generate JSON/YAML files
DOCS_DIR=./docs                        # Documentation output directory

# API Information
API_TITLE=Audio Tài Lộc API
API_DESCRIPTION=API documentation for Audio Tài Lộc platform
API_VERSION=2.0.0
API_CONTACT_EMAIL=support@audiotailoc.com

# Server Configuration
NODE_ENV=development
PORT=3000
```

### Custom Styling

The documentation includes custom CSS for enhanced visual appeal:

- **Color-coded HTTP methods**: GET (blue), POST (green), PUT (orange), DELETE (red), PATCH (teal)
- **Status code highlighting**: Success (green), Client errors (orange), Server errors (red)
- **Version badges** for easy identification
- **Deprecation warnings** for legacy versions
- **Professional typography** and spacing

## API Version Management

### Version Strategy

1. **URL Path Versioning**: `/api/v1/endpoint`, `/api/v2/endpoint`
2. **Accept Header**: `Accept: application/vnd.api.v1+json`
3. **Query Parameter**: `/api/endpoint?v=1`
4. **Header**: `X-API-Version: v1`

### Deprecation Process

1. **Announce**: Add deprecation warning in documentation
2. **Deprecation Period**: 3 months with warnings
3. **Sunset Period**: 3 months with limited support
4. **End of Life**: Complete removal

### Migration Guides

#### V1 to V2 Migration

**Breaking Changes:**
1. Authentication: API keys → JWT tokens
2. Error format: Simple → Structured with correlation IDs
3. Pagination: `page`/`limit` → Enhanced with metadata
4. Validation: Basic → Comprehensive with detailed messages

**Migration Steps:**
1. Update authentication to use JWT
2. Replace `x-api-key` with `Authorization: Bearer`
3. Handle new error response format
4. Update pagination handling
5. Add correlation ID tracking

#### V1.1 to V2 Migration

**Enhancements:**
1. AI features: Basic → Advanced
2. Real-time: Basic WebSocket → Enhanced notifications
3. Security: Basic → Advanced with rate limiting
4. Monitoring: None → Comprehensive metrics

## Documentation Generation

### Generate Documentation Files

```bash
# Enable file generation
export GENERATE_DOCS_FILES=true

# Start the application
npm run start:dev

# Files will be generated in ./docs/
# - api-v1.json, api-v1.html
# - api-v1.1.json, api-v1.1.html
# - api-v2.json, api-v2.html
```

### Custom Documentation

```typescript
// Generate specific version
const document = await documentationService.createVersionedDocument(app, 'v2');

// Save as JSON
await documentationService.saveDocumentation(document, 'v2');

// Generate HTML
await documentationService.generateHtmlDocumentation(document, 'v2');
```

## Testing Integration

### API Testing Instructions

1. **Open Swagger UI** at any documentation URL
2. **Authorize** with your credentials
3. **Find endpoint** and click "Try it out"
4. **Fill parameters** and request body
5. **Execute** and view response
6. **Check status codes** and data structure

### Postman Collection

Download the Postman collection from:
```
http://localhost:3000/api/docs/postman.json
```

### Automated Testing

```bash
# Run API tests
npm run test:api

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## SDK Support

### Available SDKs

**JavaScript/TypeScript:**
```bash
npm install @audiotailoc/js-sdk
```

**Python:**
```bash
pip install audiotailoc-sdk
```

**Java:**
```xml
<dependency>
    <groupId>com.audiotailoc</groupId>
    <artifactId>java-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

**PHP:**
```bash
composer require audiotailoc/php-sdk
```

### SDK Features

- **Type-safe** API calls
- **Automatic retries** with exponential backoff
- **Request/response** validation
- **Authentication** handling
- **Error handling** with proper exceptions
- **Rate limiting** awareness

## Developer Resources

### Support Channels

- **Documentation**: https://docs.audiotailoc.com
- **Developer Portal**: https://developer.audiotailoc.com
- **Status Page**: https://status.audiotailoc.com
- **Support Email**: support@audiotailoc.com

### Community

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share knowledge
- **Contributing**: Submit pull requests

### Best Practices

1. **Version Your API** calls appropriately
2. **Handle Errors** gracefully with correlation IDs
3. **Rate Limit** awareness in your applications
4. **Test Endpoints** before going to production
5. **Monitor** your API usage and performance
6. **Stay Updated** with the latest API changes

## Production Deployment

### Nginx Configuration

```nginx
# API Documentation
location /docs {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# API Tooling
location /api/v1/docs {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /api/v2/docs {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Docker Configuration

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Generate documentation on build
ENV GENERATE_DOCS_FILES=true
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Monitoring

Monitor documentation usage with:

```typescript
// Track documentation access
GET /api/docs/stats
GET /api/docs/versions
GET /api/docs/changelog
```

This comprehensive documentation system ensures developers have all the resources they need to successfully integrate with your Audio Tài Lộc API, with clear migration paths, testing tools, and professional documentation presentation.
