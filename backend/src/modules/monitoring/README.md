# Monitoring Module

Comprehensive monitoring and observability system for Audio Tài Lộc API.

## Features

### Metrics Collection
- HTTP request metrics (rate, duration, status codes)
- Memory usage tracking
- WebSocket connection monitoring
- Database connection pool metrics
- Error tracking and categorization

### Health Checks
- Basic health check endpoint
- Detailed health check with system metrics
- Readiness and liveness probes for Kubernetes

### Integration with Prometheus & Grafana
- Prometheus-compatible metrics endpoint
- Grafana dashboard configuration
- Custom metrics for business logic

## Endpoints

### Metrics
```
GET /api/v1/monitoring/metrics
```
Returns Prometheus-compatible metrics.

### Health Checks
```
GET /api/v1/monitoring/health          # Basic health
GET /api/v1/monitoring/health/detailed # Detailed health with metrics
GET /api/v1/monitoring/readiness       # Kubernetes readiness probe
GET /api/v1/monitoring/liveness        # Kubernetes liveness probe
```

## Usage

### Using Decorators

```typescript
import { TrackExecutionTime, TrackDatabaseOperation } from './monitoring';

export class ExampleService {
  @TrackExecutionTime('user_registration')
  async registerUser(userData: any) {
    // Your business logic
  }

  @TrackDatabaseOperation('user_creation')
  async createUserInDatabase(user: User) {
    // Database operations
  }
}
```

### Manual Metrics Recording

```typescript
import { MonitoringService } from './monitoring';

@Injectable()
export class ExampleService {
  constructor(private monitoringService: MonitoringService) {}

  async processOrder(orderId: string) {
    const start = Date.now();

    try {
      // Process order logic
      await this.processOrderLogic(orderId);

      const duration = Date.now() - start;
      this.monitoringService.recordRequest('POST', '/orders/process', 200, duration);
    } catch (error) {
      this.monitoringService.recordError('OrderProcessingError', '/orders/process');
      throw error;
    }
  }
}
```

## Setup

### 1. Prometheus Configuration

Use the provided `prometheus.yml` configuration:

```yaml
scrape_configs:
  - job_name: 'audio-tailoc-api'
    static_configs:
      - targets: ['localhost:3010']
    metrics_path: '/api/v1/monitoring/metrics'
    scrape_interval: 5s
```

### 2. Grafana Dashboard

Import the `grafana-dashboard.json` file into Grafana to visualize metrics.

### 3. Docker Compose (Optional)

Add to your docker-compose.yml:

```yaml
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  ports:
    - "3000:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

## Metrics Available

### HTTP Metrics
- `http_requests_total`: Total number of HTTP requests
- `http_request_duration_seconds`: Request duration histogram

### System Metrics
- `memory_usage_bytes`: Memory usage by type
- `active_websocket_connections`: Active WebSocket connections

### Application Metrics
- `application_errors_total`: Application errors by type and endpoint
- `database_connection_pool_size`: Database connection pool metrics

## Alerting

Example Prometheus alerts:

```yaml
groups:
  - name: audio_tailoc_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(application_errors_total[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"

      - alert: HighMemoryUsage
        expr: memory_usage_bytes{type="heapUsed"} / memory_usage_bytes{type="heapTotal"} > 0.9
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage"
```

## Best Practices

1. **Monitor Business Metrics**: Track user registrations, orders, revenue
2. **Set Up Alerts**: Configure alerts for critical metrics
3. **Use Correlation IDs**: Track requests across services
4. **Monitor External Dependencies**: Track payment gateway, AI service health
5. **Resource Monitoring**: Monitor CPU, memory, disk usage
6. **Error Categorization**: Classify errors by type and impact
