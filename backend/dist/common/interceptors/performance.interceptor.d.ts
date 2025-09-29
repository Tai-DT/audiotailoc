import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PerformanceService } from '../../modules/monitoring/performance.service';
export declare class PerformanceInterceptor implements NestInterceptor {
    private readonly performanceService;
    private readonly logger;
    constructor(performanceService: PerformanceService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private recordMetrics;
    private cleanPath;
}
