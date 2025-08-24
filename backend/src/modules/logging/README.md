# Comprehensive Logging System

Advanced logging system with Winston, correlation IDs, and structured logging for Audio Tài Lộc backend.

## Features

### ✅ **Implemented:**
- **Winston Integration** - Professional logging with multiple transports
- **Correlation IDs** - Request tracing across services
- **Structured Logging** - JSON format with context
- **Performance Logging** - Operation duration tracking
- **Security Event Logging** - Audit trail for security events
- **Business Logic Logging** - Track business operations
- **Error Tracking** - Detailed error logging with stack traces
- **Log Rotation** - Daily rotation with size limits

### 📋 **Log Types Supported:**

1. **HTTP Request/Response** - All API calls with correlation IDs
2. **Error Logs** - Detailed error tracking with context
3. **Security Events** - Authentication, authorization, attacks
4. **Business Events** - Order processing, payments, user actions
5. **Performance Metrics** - Operation duration, database queries
6. **AI Operations** - Gemini AI interactions, prompts, responses
7. **Database Operations** - Query tracking, connection issues
8. **Health Checks** - System health monitoring

## Log Structure

### Standard Log Entry:
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info",
  "message": "HTTP Request",
  "correlationId": "req_123456789_abc123",
  "userId": "user_123",
  "requestId": "uuid-v4",
  "endpoint": "/api/v1/products",
  "method": "GET",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "duration": 150,
  "statusCode": 200,
  "event": "request_complete"
}
```

### Error Log Entry:
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "error",
  "message": "Database connection failed",
  "correlationId": "req_123456789_abc123",
  "error": {
    "code": "CONNECTION_ERROR",
    "message": "Unable to connect to database",
    "stack": "Error: connect ECONNREFUSED...",
    "details": {
      "host": "localhost",
      "port": 5432
    }
  },
  "event": "error"
}
```

## Usage Examples

### Basic Logging:
```typescript
import { LoggingService } from './logging';

@Injectable()
export class ExampleService {
  constructor(private loggingService: LoggingService) {}

  async processOrder(orderId: string) {
    // Log business event
    this.loggingService.logBusinessEvent('order_processing_started', {
      orderId,
      timestamp: new Date()
    });

    try {
      // Process order logic
      await this.processOrderLogic(orderId);

      // Log success
      this.loggingService.logBusinessEvent('order_processing_completed', {
        orderId,
        status: 'success'
      });
    } catch (error) {
      // Log error
      this.loggingService.logError(error, {
        orderId,
        operation: 'processOrder'
      });
    }
  }
}
```

### Performance Logging:
```typescript
const start = Date.now();
await this.databaseService.query('SELECT * FROM products');
const duration = Date.now() - start;

this.loggingService.logPerformance('database_query', duration, {
  query: 'SELECT * FROM products',
  collection: 'products'
});
```

### Security Event Logging:
```typescript
// Log failed authentication
this.loggingService.logSecurityEvent('authentication_failed', {
  username: 'attempted_user',
  ip: '192.168.1.100',
  reason: 'invalid_password'
});

// Log suspicious activity
this.loggingService.logSecurityEvent('suspicious_request', {
  ip: '10.0.0.5',
  endpoint: '/api/admin',
  userAgent: 'curl/7.68.0',
  pattern: 'directory_traversal'
});
```

### AI Operation Logging:
```typescript
this.loggingService.logAI('text_generation', 'gemini-1.5-flash', {
  prompt: 'Generate product description',
  tokens: 150,
  model: 'gemini-1.5-flash',
  duration: 2.5
});
```

### Payment Logging:
```typescript
this.loggingService.logPayment('payment_initiated', 1000000, 'VND', {
  orderId: 'order_123',
  method: 'VNPAY',
  amount: 1000000,
  currency: 'VND'
});
```

## Correlation IDs

### Automatic Correlation:
```typescript
// Correlation IDs are automatically added to all logs
// Extracted from headers: x-correlation-id, x-request-id
// Generated automatically if not present
```

### Manual Correlation Context:
```typescript
import { CorrelationService } from './logging';

@Injectable()
export class AsyncService {
  async processAsync(orderId: string) {
    // Create child context for async operations
    const childContext = CorrelationService.createChildContext();

    return CorrelationService.runInContext(childContext, async () => {
      // All logs in this block will have the child correlation ID
      this.loggingService.logBusinessEvent('async_processing_started', { orderId });

      // Process logic
      await this.processLogic(orderId);

      return { success: true };
    });
  }
}
```

## Log Files Structure

### Production Setup:
```
logs/
├── error-2024-01-01.log      # Error logs
├── combined-2024-01-01.log   # All logs
├── security-2024-01-01.log   # Security events
├── exceptions.log            # Uncaught exceptions
└── rejections.log            # Unhandled promise rejections
```

### Configuration:
```typescript
// Environment variables
LOG_LEVEL=info                    # debug, info, warn, error
LOG_DIR=./logs                    # Log directory
LOG_MAX_FILES=30d                 # Keep 30 days
LOG_MAX_SIZE=20m                  # Max 20MB per file
NODE_ENV=production               # Enable file logging
```

## Log Levels

### Available Levels:
- `error` - Errors that need immediate attention
- `warn` - Warnings about potential issues
- `info` - General information about application flow
- `debug` - Detailed debugging information
- `verbose` - Very detailed logs for development

### Setting Log Level:
```typescript
// In environment
LOG_LEVEL=debug

// Or programmatically
this.loggingService.winstonLogger.level = 'debug';
```

## Monitoring & Alerting

### Log-Based Alerts:
```yaml
# Prometheus Alert Rules
groups:
  - name: audio_tailoc_logging_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(log_messages_total{level="error"}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning

      - alert: SecurityEventDetected
        expr: log_messages_total{event="security"} > 0
        for: 1m
        labels:
          severity: critical
```

### Log Analysis:
```bash
# Search for errors
grep "level.*error" logs/combined-*.log

# Find correlation ID
grep "correlationId.*req_123456789" logs/combined-*.log

# Count requests by endpoint
grep "event.*request_complete" logs/combined-*.log | jq -r '.endpoint' | sort | uniq -c
```

## Integration with Other Systems

### ELK Stack Integration:
```typescript
// Send logs to Elasticsearch
const elasticsearchTransport = new ElasticsearchTransport({
  level: 'info',
  clientOpts: {
    node: 'http://localhost:9200'
  }
});

this.winstonLogger.add(elasticsearchTransport);
```

### CloudWatch Integration:
```typescript
// AWS CloudWatch
const cloudWatchTransport = new WinstonCloudWatch({
  logGroupName: 'audio-tailoc-backend',
  logStreamName: 'application-logs',
  awsRegion: 'us-east-1'
});

this.winstonLogger.add(cloudWatchTransport);
```

### DataDog Integration:
```typescript
// DataDog
const datadogTransport = new DatadogWinston({
  apiKey: process.env.DATADOG_API_KEY,
  hostname: 'audio-tailoc-backend'
});

this.winstonLogger.add(datadogTransport);
```

## Best Practices

### 1. **Structured Logging:**
```typescript
// Good
this.loggingService.logBusinessEvent('user_registered', {
  userId: 'user_123',
  email: 'user@example.com',
  registrationMethod: 'email'
});

// Bad
this.loggingService.log(`User user_123 registered with email user@example.com via email`);
```

### 2. **Correlation IDs:**
```typescript
// Always include correlation ID in async operations
const result = await this.externalService.call(data);
this.loggingService.logBusinessEvent('external_api_call', {
  service: 'payment_gateway',
  result: result.success ? 'success' : 'failed',
  duration: result.duration
});
```

### 3. **Error Context:**
```typescript
// Include relevant context with errors
catch (error) {
  this.loggingService.logError(error, {
    userId,
    operation: 'createOrder',
    orderData: { productId, quantity },
    step: 'payment_processing'
  });
}
```

### 4. **Security Logging:**
```typescript
// Log security events with minimal sensitive data
this.loggingService.logSecurityEvent('password_reset_requested', {
  userId: hashedUserId, // Hash sensitive data
  ip: clientIP,
  userAgent: sanitizeUserAgent(userAgent)
});
```

### 5. **Performance Monitoring:**
```typescript
const start = performance.now();
// Operation
const duration = performance.now() - start;

if (duration > 1000) { // Log slow operations
  this.loggingService.logPerformance('slow_operation', duration, {
    operation: 'database_query',
    threshold: 1000
  });
}
```

## Log Retention & Cleanup

### Automatic Cleanup:
```typescript
// Winston automatically handles file rotation
// Files older than LOG_MAX_FILES are deleted
// Files larger than LOG_MAX_SIZE trigger rotation
```

### Manual Cleanup:
```typescript
// Clean old correlation contexts
const cleaned = CorrelationService.cleanup(30 * 60 * 1000); // 30 minutes
this.loggingService.log(`Cleaned ${cleaned} old correlation contexts`);
```

## Troubleshooting

### Common Issues:

1. **Logs not appearing:**
   - Check LOG_LEVEL environment variable
   - Verify log directory permissions
   - Ensure NODE_ENV is set correctly

2. **Missing correlation IDs:**
   - Check if LoggingMiddleware is applied
   - Verify request headers contain correlation ID
   - Check if AsyncLocalStorage is supported

3. **Large log files:**
   - Adjust LOG_MAX_SIZE
   - Increase LOG_MAX_FILES
   - Consider log aggregation service

4. **Performance impact:**
   - Use appropriate log levels in production
   - Avoid logging large objects
   - Use sampling for high-volume operations

## Development vs Production

### Development:
```typescript
// Console logging with colors
// Detailed debug information
// All log levels enabled
LOG_LEVEL=debug
```

### Production:
```typescript
// File logging with rotation
// Structured JSON logs
// Appropriate log levels
LOG_LEVEL=info
NODE_ENV=production
```

## API Endpoints

The logging system doesn't expose direct endpoints but integrates with:

- `/api/v1/monitoring/metrics` - Performance metrics
- `/api/v1/monitoring/health` - Health status
- `/api/versioning/info` - Version usage tracking

## Future Enhancements

### Potential Improvements:
1. **Log Aggregation** - Centralized log management
2. **Real-time Log Streaming** - WebSocket log streaming
3. **Log Analysis Dashboard** - Built-in log analysis UI
4. **Automated Alerting** - Log-based alerting system
5. **Log Encryption** - Encrypt sensitive log data
6. **Distributed Tracing** - Integration with OpenTelemetry

This comprehensive logging system provides enterprise-grade observability for the Audio Tài Lộc backend, enabling better debugging, monitoring, and maintenance.
