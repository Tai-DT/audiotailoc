import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BackupService } from './backup.service';

@Injectable()
export class BackupHealthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(BackupHealthMiddleware.name);
  private lastHealthCheck = 0;
  private readonly healthCheckInterval = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly backupService: BackupService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Only check backup health periodically
    const now = Date.now();
    if (now - this.lastHealthCheck > this.healthCheckInterval) {
      this.checkBackupHealth();
      this.lastHealthCheck = now;
    }

    next();
  }

  private async checkBackupHealth(): Promise<void> {
    try {
      const status = await this.backupService.getBackupStatus();
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Check if we have recent backups
      const backups = await this.backupService.listBackups();
      const recentBackups = backups.filter(backup => backup.timestamp > twentyFourHoursAgo);

      if (recentBackups.length === 0) {
        this.logger.warn('No recent backups found in the last 24 hours');
      }

      // Check success rate
      // If there are failed backups recently, warn (approximation)
      const failedCount = backups.filter(b => b.status === 'failed').length;
      const total = backups.length || 1;
      const successRate = Math.round(((total - failedCount) / total) * 100);
      if (successRate < 90) this.logger.warn(`Low backup success rate: ${successRate}%`);

      // Check total backup count
      if (status.totalBackups === 0) {
        this.logger.error('No backups found in the system');
      }
    } catch (error) {
      this.logger.error('Failed to check backup health:', error);
    }
  }
}
