import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringMiddleware implements NestMiddleware {
  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const method = req.method;
    const route = this.getRoute(req);

    // Override res.end to capture response metrics
    const originalEnd = res.end;
    const monitoringService = this.monitoringService;
    res.end = function (chunk?: any, encoding?: BufferEncoding | (() => void)) {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      // Record metrics
      monitoringService.recordRequest(method, route, statusCode, duration);

      // Call original end method
      if (typeof encoding === 'function') {
        return (originalEnd as any).call(this, chunk, encoding);
      } else {
        return (originalEnd as any).call(this, chunk, encoding);
      }
    };

    next();
  }

  private getRoute(req: Request): string {
    // Extract route pattern from request
    const baseUrl = req.baseUrl || '';
    const path = req.path || req.url || '/';

    // Remove query parameters
    const cleanPath = path.split('?')[0];

    // Try to get route from express app if available
    if (req.route) {
      return req.route.path || cleanPath;
    }

    // Fallback to cleaned path
    return `${baseUrl}${cleanPath}`.replace(/\/$/, '') || '/';
  }
}
