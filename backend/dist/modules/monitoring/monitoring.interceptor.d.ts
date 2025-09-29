import { NestInterceptor, ExecutionContext, CallHandler, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MonitoringService } from './monitoring.service';
export declare class MonitoringInterceptor implements NestInterceptor {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private getRoutePattern;
}
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    catch(exception: any, host: ArgumentsHost): void;
}
