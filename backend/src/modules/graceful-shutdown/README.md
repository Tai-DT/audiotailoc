# Graceful Shutdown & Process Management

Enterprise-grade graceful shutdown system with comprehensive process management, health checks, and monitoring for production deployments.

## Features

### ✅ **Implemented:**
- **Signal Handling** - Proper handling of SIGTERM, SIGINT, SIGUSR2 signals
- **Connection Draining** - Graceful draining of HTTP/WebSocket connections
- **Database Cleanup** - Proper closure of database connections
- **Redis Cleanup** - Safe Redis connection termination
- **External Services** - Cleanup of payment gateways, AI services, file storage
- **Health Checks** - Readiness and liveness probes for orchestrators
- **Process Monitoring** - Real-time process information and metrics
- **Timeout Management** - Configurable shutdown timeouts with force fallback
- **Error Recovery** - Uncaught exception and unhandled rejection handling
- **Resource Cleanup** - Comprehensive cleanup of timers, caches, and resources

### 🎯 **Shutdown Process:**
1. **Stop Accepting** - New connections are rejected
2. **Close Server** - HTTP server stops listening
3. **Drain Connections** - Existing connections complete naturally
4. **Close Database** - Database connections are closed
5. **Close Redis** - Redis connections are terminated
6. **Close External** - Payment, AI, file storage connections closed
7. **Cleanup Resources** - Timers, caches, and resources cleaned up
8. **Exit Process** - Application exits cleanly

## Quick Start

### 1. **Automatic Shutdown**

The service automatically handles shutdown signals:

```bash
# Graceful shutdown with SIGTERM (recommended)
kill -TERM <pid>

# Force shutdown with SIGKILL (last resort)
kill -KILL <pid>

# Graceful shutdown in development
Ctrl+C # Sends SIGINT
```

### 2. **Manual Shutdown via API**

```bash
# Trigger graceful shutdown
curl -X POST http://localhost:3000/api/v1/shutdown/shutdown

# Force immediate shutdown (emergency)
curl -X DELETE http://localhost:3000/api/v1/shutdown/shutdown

# Check shutdown status
curl http://localhost:3000/api/v1/shutdown/status
```

### 3. **Health Checks**

```bash
# Readiness check (for load balancers)
curl http://localhost:3000/api/v1/shutdown/ready

# Liveness check (for orchestrators)
curl http://localhost:3000/api/v1/shutdown/alive

# Health status
curl http://localhost:3000/api/v1/shutdown/health
```

## API Endpoints

### Shutdown Management
```bash
GET    /api/v1/shutdown/status           # Get shutdown status
GET    /api/v1/shutdown/health           # Get health status
GET    /api/v1/shutdown/ready            # Readiness check
GET    /api/v1/shutdown/alive            # Liveness check
GET    /api/v1/shutdown/process          # Get process information
GET    /api/v1/shutdown/metrics          # Get system metrics
GET    /api/v1/shutdown/config           # Get shutdown configuration
GET    /api/v1/shutdown/overview         # Get application overview
POST   /api/v1/shutdown/shutdown         # Trigger graceful shutdown
DELETE /api/v1/shutdown/shutdown         # Force immediate shutdown
```

## Configuration

### Environment Variables

```env
# Graceful Shutdown Configuration
SHUTDOWN_TIMEOUT_MS=30000                # Graceful shutdown timeout (30s)
FORCE_SHUTDOWN_TIMEOUT_MS=5000           # Force shutdown timeout (5s)
ENABLE_CONNECTION_DRAINING=true          # Enable connection draining
MAX_CONNECTION_DRAIN_TIME=20000          # Max time to drain connections (20s)

# Health Check Configuration
HEALTH_CHECK_INTERVAL=30000              # Health check interval
READINESS_CHECK_ENABLED=true             # Enable readiness checks
LIVENESS_CHECK_ENABLED=true              # Enable liveness checks

# Process Management
PROCESS_MONITORING_ENABLED=true          # Enable process monitoring
MEMORY_THRESHOLD_MB=1024                 # Memory usage threshold
CPU_THRESHOLD_PERCENT=80                 # CPU usage threshold

# Database Configuration
DB_SHUTDOWN_TIMEOUT_MS=10000             # Database connection timeout
DB_FORCE_CLOSE=true                      # Force close DB connections

# Redis Configuration
REDIS_SHUTDOWN_TIMEOUT_MS=5000           # Redis connection timeout
REDIS_GRACEFUL_CLOSE=true               # Graceful Redis close

# External Services
EXTERNAL_SERVICES_TIMEOUT_MS=15000       # External services timeout
PAYMENT_GATEWAY_CLOSE=true              # Close payment connections
AI_SERVICE_CLOSE=true                   # Close AI service connections
FILE_STORAGE_CLOSE=true                 # Close file storage connections
```

### Programmatic Configuration

```typescript
// Configure shutdown service
const shutdownService = app.get(GracefulShutdownService);

// Custom shutdown timeout
process.env.SHUTDOWN_TIMEOUT_MS = '45000';

// Custom force shutdown timeout
process.env.FORCE_SHUTDOWN_TIMEOUT_MS = '8000';
```

## Signal Handling

### Supported Signals

| Signal | Description | Action |
|--------|-------------|--------|
| `SIGTERM` | Termination | Graceful shutdown |
| `SIGINT` | Interrupt (Ctrl+C) | Graceful shutdown |
| `SIGUSR2` | User signal 2 | Graceful shutdown |
| `SIGBREAK` | Windows break | Graceful shutdown (Windows) |

### Signal Flow

1. **Signal Received** → Log signal and start shutdown
2. **Stop Accepting** → Server stops accepting new connections
3. **Drain Connections** → Wait for existing connections to complete
4. **Close Services** → Close database, Redis, external services
5. **Cleanup Resources** → Clear timers, caches, event listeners
6. **Exit Process** → Process exits with code 0

## Connection Management

### HTTP Connection Draining

```typescript
// Automatic connection tracking
server.on('connection', (socket) => {
  if (!isShuttingDown) {
    activeConnections.add(socket);

    socket.on('close', () => {
      activeConnections.delete(socket);
    });
  }
});
```

### Connection Draining Strategy

1. **Stop New Connections** - Server stops accepting connections
2. **Monitor Active** - Track remaining connections
3. **Wait for Completion** - Allow existing requests to finish
4. **Force Close** - Close remaining connections after timeout

### WebSocket Connection Handling

```typescript
// Close WebSocket connections gracefully
await this.closeWebSocketConnections();

// Implementation in your WebSocket gateway
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  async handleDisconnect(client: Socket) {
    // Clean up client resources
    await this.cleanupClientResources(client);
  }

  async closeAllConnections() {
    // Close all WebSocket connections
    for (const client of this.connectedClients) {
      client.disconnect(true);
    }
  }
}
```

## Database Connection Management

### Prisma Database Cleanup

```typescript
// Graceful database shutdown
private async closeDatabaseConnections(): Promise<void> {
  try {
    this.logger.log('🗄️ Closing database connections');

    if (this.prisma) {
      await this.prisma.$disconnect();
      this.logger.log('✅ Database connections closed');
    }
  } catch (error) {
    this.logger.error('Error closing database connections', error);
  }
}
```

### Connection Pool Management

```typescript
// Configure connection pool for graceful shutdown
export const databaseConfig = {
  // ... other config
  connection: {
    pool: {
      min: 2,
      max: 10,
      idle: 30000,
      acquire: 60000,
    },
  },
  // Graceful shutdown hooks
  hooks: {
    beforeShutdown: async () => {
      // Close connections gracefully
      await database.close();
    },
  },
};
```

## Redis Connection Management

### Graceful Redis Shutdown

```typescript
// Close Redis connections
private async closeRedisConnections(): Promise<void> {
  try {
    this.logger.log('🔴 Closing Redis connections');

    const redisClient = await this.getRedisClient();
    if (redisClient) {
      await redisClient.quit();
      this.logger.log('✅ Redis connections closed');
    }
  } catch (error) {
    this.logger.error('Error closing Redis connections', error);
  }
}
```

### Redis Configuration

```typescript
// Redis client with graceful shutdown
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,

  // Graceful shutdown settings
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,

  // Connection management
  lazyConnect: true,
  keepAlive: 30000,
});
```

## External Services Cleanup

### Payment Gateway Cleanup

```typescript
// Close payment gateway connections
private async closePaymentConnections(): Promise<void> {
  try {
    this.logger.log('💳 Closing payment gateway connections');

    // Close VNPAY connections
    if (this.vnpayService) {
      await this.vnpayService.close();
    }

    // Close MOMO connections
    if (this.momoService) {
      await this.momoService.close();
    }

    this.logger.log('✅ Payment gateway connections closed');
  } catch (error) {
    this.logger.error('Error closing payment connections', error);
  }
}
```

### File Storage Cleanup

```typescript
// Close file storage connections
private async closeFileStorage(): Promise<void> {
  try {
    this.logger.log('📁 Closing file storage connections');

    // Close Cloudinary connections
    if (this.cloudinaryService) {
      await this.cloudinaryService.close();
    }

    this.logger.log('✅ File storage connections closed');
  } catch (error) {
    this.logger.error('Error closing file storage', error);
  }
}
```

## Health Checks & Monitoring

### Kubernetes Integration

```yaml
# Deployment with readiness and liveness probes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: audio-tailoc-api
spec:
  template:
    spec:
      containers:
      - name: api
        image: audio-tailoc/api:latest
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /api/v1/shutdown/ready
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/v1/shutdown/alive
            port: 3000
          initialDelaySeconds: 60
          periodSeconds: 30
        lifecycle:
          preStop:
            httpGet:
              path: /api/v1/shutdown/shutdown
              port: 3000
```

### Load Balancer Integration

```nginx
# Nginx with health checks
upstream backend {
    server backend1:3000;
    server backend2:3000;
}

server {
    location /health/ready {
        proxy_pass http://backend/api/v1/shutdown/ready;
        proxy_connect_timeout 5s;
        proxy_send_timeout 5s;
        proxy_read_timeout 5s;
    }

    location /health/alive {
        proxy_pass http://backend/api/v1/shutdown/alive;
        proxy_connect_timeout 5s;
        proxy_send_timeout 5s;
        proxy_read_timeout 5s;
    }
}
```

### Monitoring Integration

```typescript
// Prometheus metrics for graceful shutdown
const gracefulShutdownMetrics = {
  shutdown_duration_seconds: {
    type: 'histogram',
    name: 'graceful_shutdown_duration_seconds',
    help: 'Time taken for graceful shutdown',
    buckets: [1, 5, 10, 30, 60, 120],
  },
  active_connections: {
    type: 'gauge',
    name: 'graceful_shutdown_active_connections',
    help: 'Number of active connections during shutdown',
  },
  shutdown_success: {
    type: 'counter',
    name: 'graceful_shutdown_success_total',
    help: 'Total number of successful graceful shutdowns',
  },
  shutdown_failure: {
    type: 'counter',
    name: 'graceful_shutdown_failure_total',
    help: 'Total number of failed graceful shutdowns',
  },
};
```

## Error Handling & Recovery

### Uncaught Exceptions

```typescript
// Handle uncaught exceptions
process.on('uncaughtException', async (error, origin) => {
  logger.error('💥 Uncaught Exception', {
    error: error.message,
    stack: error.stack,
    origin,
    timestamp: new Date().toISOString(),
  });

  // Try graceful shutdown first
  await shutdownService.manualShutdown('UNCAUGHT_EXCEPTION');

  // Force exit after timeout
  setTimeout(() => {
    logger.error('💥 Force exiting due to uncaught exception');
    process.exit(1);
  }, forceShutdownTimeoutMs);
});
```

### Unhandled Rejections

```typescript
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Unhandled Rejection', {
    reason: reason?.toString(),
    promise: promise.toString(),
    timestamp: new Date().toISOString(),
  });

  // Log but don't shutdown - might be handled later
});
```

## Resource Cleanup

### Timer Management

```typescript
// Clear all timers and intervals
private async clearIntervals(): Promise<void> {
  // Clear setTimeout timers
  // Clear setInterval timers
  // Clear setImmediate callbacks

  this.logger.log('⏰ Intervals cleared');
}
```

### Cache Management

```typescript
// Clear in-memory caches
private async clearCaches(): Promise<void> {
  try {
    // Clear Node.js require cache (selective)
    // Clear application caches
    // Clear temporary files

    this.logger.log('🗂️ Caches cleared');
  } catch (error) {
    this.logger.error('Error clearing caches', error);
  }
}
```

### Event Listener Cleanup

```typescript
// Remove signal handlers
private removeSignalHandlers(): void {
  for (const signal of shutdownSignals) {
    process.removeAllListeners(signal);
  }
  this.logger.log('📡 Signal handlers removed');
}
```

## Production Deployment

### Docker Configuration

```dockerfile
# Dockerfile with graceful shutdown
FROM node:18-alpine

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Graceful shutdown signal handling
STOPSIGNAL SIGTERM

# Start application
CMD ["npm", "run", "start:prod"]
```

### Systemd Service

```ini
# /etc/systemd/system/audio-tailoc-api.service
[Unit]
Description=Audio Tài Lộc API
After=network.target

[Service]
Type=simple
User=nodejs
Group=nodejs
WorkingDirectory=/opt/audio-tailoc-api
ExecStart=/usr/bin/npm run start:prod
Restart=always

# Graceful shutdown
TimeoutStopSec=45
KillSignal=SIGTERM
SendSIGKILL=no

# Environment
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### PM2 Configuration

```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'audio-tailoc-api',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    // Graceful shutdown
    kill_timeout: 30000,
    wait_ready: true,
    listen_timeout: 3000,
    shutdown_with_message: true,
  }],
};
```

## Monitoring & Alerting

### Application Metrics

```typescript
// System metrics collection
const metrics = {
  process: {
    pid: process.pid,
    platform: process.platform,
    version: process.version,
    uptime: process.uptime(),
  },
  memory: {
    usage: process.memoryUsage(),
    percentage: (heapUsed / heapTotal) * 100,
  },
  cpu: {
    usage: process.cpuUsage(),
    percentage: (totalCpu / (uptime * 1000000)) * 100,
  },
  connections: {
    active: activeConnections.size,
  },
};
```

### Alerting Rules

```yaml
# Prometheus alerting rules
groups:
  - name: graceful_shutdown_alerts
    rules:
      - alert: GracefulShutdownFailure
        expr: rate(graceful_shutdown_failure_total[5m]) > 0
        for: 1m
        labels:
          severity: error
        annotations:
          summary: "Graceful shutdown failed"
          description: "Application failed to shutdown gracefully"

      - alert: HighConnectionCount
        expr: graceful_shutdown_active_connections > 100
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High connection count during shutdown"
          description: "Too many active connections during shutdown phase"

      - alert: LongShutdownDuration
        expr: graceful_shutdown_duration_seconds{quantile="0.95"} > 60
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Slow graceful shutdown"
          description: "Graceful shutdown is taking too long"
```

## Troubleshooting

### Common Issues

1. **Shutdown Timeout**
   ```bash
   # Check shutdown logs
   tail -f /var/log/audio-tailoc-api/shutdown.log

   # Increase timeout
   export SHUTDOWN_TIMEOUT_MS=60000
   ```

2. **Stuck Connections**
   ```bash
   # Check active connections
   curl http://localhost:3000/api/v1/shutdown/status

   # Force close connections
   curl -X DELETE http://localhost:3000/api/v1/shutdown/shutdown
   ```

3. **Database Connection Issues**
   ```bash
   # Check database connectivity
   pg_isready -h localhost -p 5432

   # Check connection pool
   curl http://localhost:3000/api/v1/shutdown/metrics
   ```

4. **Redis Connection Issues**
   ```bash
   # Check Redis connectivity
   redis-cli ping

   # Check Redis connections
   redis-cli info clients
   ```

### Debug Mode

```bash
# Enable debug logging
export DEBUG=graceful-shutdown:*

# Check process information
curl http://localhost:3000/api/v1/shutdown/process

# Get system metrics
curl http://localhost:3000/api/v1/shutdown/metrics

# Get application overview
curl http://localhost:3000/api/v1/shutdown/overview
```

## Best Practices

### 1. **Timeout Configuration**
```typescript
// Set appropriate timeouts
const SHUTDOWN_TIMEOUT_MS = 30000;        // 30 seconds
const FORCE_SHUTDOWN_TIMEOUT_MS = 5000;   // 5 seconds
const CONNECTION_DRAIN_TIME = 20000;      // 20 seconds
```

### 2. **Resource Management**
```typescript
// Always cleanup resources
process.on('beforeExit', async () => {
  await cleanupResources();
});

// Handle async operations
const asyncOps = new Set();
process.on('asyncOperation', (op) => {
  asyncOps.add(op);
  op.on('complete', () => asyncOps.delete(op));
});
```

### 3. **Health Check Integration**
```typescript
// Implement proper health checks
app.get('/health/ready', async (req, res) => {
  const isReady = await shutdownService.isReady();
  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
  });
});
```

### 4. **Monitoring Integration**
```typescript
// Log shutdown events
logger.log('🔄 Shutdown initiated', {
  reason,
  timestamp: new Date().toISOString(),
  activeConnections: activeConnections.size,
});

// Monitor shutdown metrics
metrics.shutdown_duration_seconds.observe(duration);
```

This comprehensive graceful shutdown system ensures your Audio Tài Lộc API handles shutdowns properly in production, preventing data loss, ensuring clean resource cleanup, and maintaining high availability.
