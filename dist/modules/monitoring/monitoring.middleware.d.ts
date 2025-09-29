import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from './monitoring.service';
export declare class MonitoringMiddleware implements NestMiddleware {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    use(req: Request, res: Response, next: NextFunction): void;
    private getRoute;
}
