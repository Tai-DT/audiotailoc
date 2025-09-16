import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MonitoringService } from './monitoring.service';
import { Request, Response } from 'express';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const method = request.method;
        const route = this.getRoutePattern(context);
        const statusCode = response.statusCode;

        this.monitoringService.recordRequest(method, route, statusCode, duration);
      }),
      catchError((error) => {
        const duration = Date.now() - start;
        const method = request.method;
        const route = this.getRoutePattern(context);

        // Record error
        this.monitoringService.recordError(error.name || 'UnknownError', route);

        // Record failed request
        this.monitoringService.recordRequest(method, route, 500, duration);

        return throwError(() => error);
      }),
    );
  }

  private getRoutePattern(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();
    const controller = context.getClass();

    // Try to get route from metadata
    const route = Reflect.getMetadata('path', controller);
    const methodPath = Reflect.getMetadata('path', handler);

    if (route && methodPath) {
      return `/${route}/${methodPath}`.replace(/\/+/g, '/');
    }

    // Fallback to request path
    return request.path || '/';
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly monitoringService: MonitoringService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.status || 500;
    const route = request.path || '/';

    // Record error
    this.monitoringService.recordError(
      exception.constructor.name || 'UnknownError',
      route
    );

    // Record failed request
    this.monitoringService.recordRequest(
      request.method,
      route,
      status,
      0 // We don't have duration here
    );

    // Continue with default error handling
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
    });
  }
}
