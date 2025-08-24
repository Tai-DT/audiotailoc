# API Versioning System

Comprehensive API versioning system with backward compatibility, deprecation warnings, and migration support.

## Features

### ✅ **Implemented:**
- **Multi-version API Support** - Support v1, v1.1, v2 simultaneously
- **Version Detection** - Multiple methods to specify API version
- **Deprecation Management** - Automatic deprecation warnings
- **Migration Guides** - Built-in migration assistance
- **Version Guards** - Protect endpoints by version constraints
- **Comprehensive Logging** - Track API version usage

### 📋 **Supported Version Methods:**

1. **URL Path**: `/api/v1/endpoint` or `/api/v2/endpoint`
2. **Accept Header**: `application/vnd.api.v1+json`
3. **Custom Header**: `X-API-Version: v1`
4. **Query Parameter**: `?api_version=v1` or `?version=v1`
5. **Default**: Falls back to latest version (v2)

## API Endpoints

### Version Information
```bash
GET /api/versioning/info           # Current version info
GET /api/versioning/versions       # All available versions
GET /api/versioning/versions/:version  # Specific version details
GET /api/versioning/validate?version=v1  # Validate version
GET /api/versioning/migration-guide?from=v1&to=v2  # Migration guide
GET /api/versioning/changelog      # Complete changelog
```

## Usage Examples

### 1. **Controller Versioning**

```typescript
import { ApiVersions, ApiVersionDeprecated, ApiVersionMin } from './api-versioning';

@Controller('products')
export class ProductsController {

  @Get()
  @ApiVersions('v1', 'v2')  // Available in both versions
  getProducts() {
    // Implementation
  }

  @Post()
  @ApiVersionMin('v1.1')    // Requires v1.1 or higher
  createProduct() {
    // Implementation
  }

  @Put(':id')
  @ApiVersionDeprecated('v2', 'Use PATCH /api/v2/products/:id instead')
  updateProduct() {
    // Implementation
  }
}
```

### 2. **Method-Level Versioning**

```typescript
import { ApiVersions, ApiVersionExperimental } from './api-versioning';

@Controller('search')
export class SearchController {

  @Get('basic')
  @ApiVersions('v1', 'v1.1')  // Only in older versions
  basicSearch() {
    // Basic search implementation
  }

  @Get('ai')
  @ApiVersions('v1.1', 'v2')  // Enhanced search in newer versions
  aiSearch() {
    // AI-powered search
  }

  @Get('semantic')
  @ApiVersionMin('v2')        // Only in v2+
  @ApiVersionExperimental()    // Mark as experimental
  semanticSearch() {
    // Advanced semantic search
  }
}
```

### 3. **Breaking Changes Management**

```typescript
import { ApiVersionBreakingChanges, ApiVersionNewFeatures } from './api-versioning';

@Controller('orders')
export class OrdersController {

  @Post()
  @ApiVersionBreakingChanges('v2', [
    'Order status field changed from string to enum',
    'Payment method validation is now stricter'
  ])
  @ApiVersionNewFeatures('v2', [
    'Real-time order tracking',
    'Webhook notifications'
  ])
  createOrder() {
    // Implementation
  }
}
```

## Version Response Format

### Successful Response (v2):
```json
{
  "data": { ... },
  "_api": {
    "version": "v2",
    "deprecated": false,
    "latest": "v2"
  }
}
```

### Deprecation Warning Headers:
```
X-API-Deprecation-Warning: API version v1 is deprecated. Please upgrade to v2.
Deprecation: true
X-API-Version-Sunset-Date: 2024-12-31T00:00:00.000Z
```

## Migration Support

### Automatic Migration Detection:
```typescript
// The system automatically detects version transitions
// and provides appropriate warnings and guides

GET /api/versioning/migration-guide?from=v1&to=v2
```

### Response:
```json
{
  "success": true,
  "migration": {
    "from": "v1",
    "to": "v2",
    "steps": [
      "Update authentication headers: Use Bearer tokens consistently",
      "Replace /api/products/search with /api/v2/search with AI enhancement",
      "Update error response format to include correlation IDs",
      "Implement webhook endpoints for real-time notifications",
      "Use new security headers and enhanced error handling"
    ],
    "estimatedEffort": "High - Major API changes required"
  }
}
```

## Version Constraints

### Minimum Version:
```typescript
@ApiVersionMin('v1.1')  // Requires v1.1 or higher
```

### Maximum Version:
```typescript
@ApiVersionMax('v1')    // Not available in v2+
```

### Specific Versions:
```typescript
@ApiVersions('v1', 'v2')  // Only in v1 and v2
```

## Error Handling

### Version Validation Errors:
```json
{
  "success": false,
  "error": {
    "code": "API_VERSION_TOO_LOW",
    "message": "This endpoint requires API version v1.1 or higher. Current: v1"
  }
}
```

### Version Not Supported:
```json
{
  "success": false,
  "error": {
    "code": "API_VERSION_NOT_SUPPORTED",
    "message": "API version v3 is not supported for this endpoint. Supported: v1, v2"
  }
}
```

## Production Deployment

### Docker Compose Configuration:
```yaml
version: '3.8'
services:
  api-v1:
    image: audio-tailoc-api:v1
    environment:
      - API_VERSION=v1
    routes:
      - /api/v1/*

  api-v2:
    image: audio-tailoc-api:v2
    environment:
      - API_VERSION=v2
    routes:
      - /api/v2/*

  api-latest:
    image: audio-tailoc-api:latest
    environment:
      - API_VERSION=v2
    routes:
      - /api/*
```

### Nginx Configuration:
```nginx
location /api/v1 {
    proxy_pass http://api-v1:3000;
}

location /api/v2 {
    proxy_pass http://api-v2:3000;
}

location /api {
    proxy_pass http://api-latest:3000;
}
```

## Best Practices

### 1. **Version Planning:**
- Plan versions before implementation
- Document breaking changes clearly
- Provide migration guides
- Set realistic deprecation timelines

### 2. **Backward Compatibility:**
- Avoid breaking changes in minor versions
- Use feature flags for new functionality
- Provide alternative endpoints during transition

### 3. **Communication:**
- Announce deprecations in advance
- Provide clear migration documentation
- Monitor usage of deprecated endpoints

### 4. **Testing:**
- Test all versions in parallel
- Automate version validation
- Monitor version-specific error rates

## Current Version Support

| Version | Status | Release Date | Sunset Date | Notes |
|---------|--------|--------------|-------------|-------|
| v1 | Deprecated | 2024-01-01 | 2024-12-31 | Legacy support |
| v1.1 | Deprecated | 2024-02-01 | 2025-01-31 | Enhanced features |
| v2 | Current | 2024-03-01 | - | Latest features |

## Monitoring & Analytics

The system automatically tracks:
- API version usage by endpoint
- Deprecation warnings triggered
- Version validation errors
- Migration guide requests

All metrics are available via the monitoring endpoints and can be visualized in Grafana.
