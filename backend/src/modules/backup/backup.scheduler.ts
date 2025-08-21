import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { BackupService } from './backup.service';
import { LoggingService } from '../monitoring/logging.service';

@Injectable()
export class BackupScheduler {
  private readonly logger = new Logger(BackupScheduler.name);
  private readonly isEnabled: boolean;

  constructor(
    private readonly backupService: BackupService,
    private readonly loggingService: LoggingService,
    private readonly config: ConfigService
  ) {
    this.isEnabled = this.config.get<boolean>('BACKUP_SCHEDULER_ENABLED') || true;
  }

  // Daily full backup at 2 AM
  @Cron('0 2 * * *', {
    name: 'daily-full-backup',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleDailyFullBackup() {
    if (!this.isEnabled) {
      this.logger.log('Backup scheduler is disabled');
      return;
    }

    try {
      this.logger.log('Starting scheduled daily full backup');
      
      const backup = await this.backupService.createFullBackup();
      
      this.loggingService.logAudit('scheduled_backup_completed', {
        type: 'full',
        backupId: backup.id,
        size: backup.size,
        duration: backup.duration,
        scheduled: true,
      });

      this.logger.log(`Daily full backup completed: ${backup.id}`);

    } catch (error) {
      this.loggingService.error('Scheduled daily full backup failed', { error });
      this.logger.error('Daily full backup failed:', error);
      
      // Could send alert notification here
      await this.sendBackupFailureAlert('daily-full-backup', error);
    }
  }

  // Hourly incremental backup during business hours (8 AM - 8 PM)
  @Cron('0 8-20 * * *', {
    name: 'hourly-incremental-backup',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleHourlyIncrementalBackup() {
    if (!this.isEnabled) {
      return;
    }

    try {
      this.logger.log('Starting scheduled hourly incremental backup');
      
      const backup = await this.backupService.createIncrementalBackup();
      
      this.loggingService.logAudit('scheduled_backup_completed', {
        type: 'incremental',
        backupId: backup.id,
        size: backup.size,
        duration: backup.duration,
        scheduled: true,
      });

      this.logger.log(`Hourly incremental backup completed: ${backup.id}`);

    } catch (error) {
      this.loggingService.error('Scheduled hourly incremental backup failed', { error });
      this.logger.error('Hourly incremental backup failed:', error);
    }
  }

  // Weekly backup verification on Sundays at 3 AM
  @Cron('0 3 * * 0', {
    name: 'weekly-backup-verification',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleWeeklyBackupVerification() {
    if (!this.isEnabled) {
      return;
    }

    try {
      this.logger.log('Starting weekly backup verification');
      
      const backups = this.backupService.getBackups();
      const recentBackups = backups
        .filter(backup => backup.status === 'completed')
        .slice(0, 10); // Verify last 10 backups

      let verifiedCount = 0;
      let failedCount = 0;

      for (const backup of recentBackups) {
        try {
          const isValid = await this.backupService.verifyBackupIntegrity(backup);
          if (isValid) {
            verifiedCount++;
          } else {
            failedCount++;
            this.logger.warn(`Backup verification failed: ${backup.id}`);
          }
        } catch (error) {
          failedCount++;
          this.logger.error(`Backup verification error for ${backup.id}:`, error);
        }
      }

      this.loggingService.logAudit('backup_verification_completed', {
        totalChecked: recentBackups.length,
        verified: verifiedCount,
        failed: failedCount,
        scheduled: true,
      });

      this.logger.log(`Weekly backup verification completed: ${verifiedCount} verified, ${failedCount} failed`);

      if (failedCount > 0) {
        await this.sendBackupVerificationAlert(verifiedCount, failedCount);
      }

    } catch (error) {
      this.loggingService.error('Weekly backup verification failed', { error });
      this.logger.error('Weekly backup verification failed:', error);
    }
  }

  // Monthly cleanup of old backups on the 1st at 4 AM
  @Cron('0 4 1 * *', {
    name: 'monthly-backup-cleanup',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleMonthlyBackupCleanup() {
    if (!this.isEnabled) {
      return;
    }

    try {
      this.logger.log('Starting monthly backup cleanup');
      
      const backups = this.backupService.getBackups();
      const retentionDays = this.config.get<number>('BACKUP_RETENTION_DAYS') || 30;
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
      
      const oldBackups = backups.filter(backup => backup.timestamp < cutoffDate);
      
      let deletedCount = 0;
      let failedCount = 0;

      for (const backup of oldBackups) {
        try {
          await this.backupService.deleteBackup(backup.id);
          deletedCount++;
        } catch (error) {
          failedCount++;
          this.logger.error(`Failed to delete backup ${backup.id}:`, error);
        }
      }

      this.loggingService.logAudit('backup_cleanup_completed', {
        totalOldBackups: oldBackups.length,
        deleted: deletedCount,
        failed: failedCount,
        retentionDays,
        scheduled: true,
      });

      this.logger.log(`Monthly backup cleanup completed: ${deletedCount} deleted, ${failedCount} failed`);

    } catch (error) {
      this.loggingService.error('Monthly backup cleanup failed', { error });
      this.logger.error('Monthly backup cleanup failed:', error);
    }
  }

  // Health check every 6 hours
  @Cron(CronExpression.EVERY_6_HOURS, {
    name: 'backup-health-check',
  })
  async handleBackupHealthCheck() {
    if (!this.isEnabled) {
      return;
    }

    try {
      const stats = this.backupService.getBackupStats();
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Check if we have recent backups
      const recentBackups = this.backupService.getBackups()
        .filter(backup => backup.timestamp > twentyFourHoursAgo);

      const hasRecentFullBackup = recentBackups.some(backup => backup.type === 'full');
      const hasRecentIncrementalBackup = recentBackups.some(backup => backup.type === 'incremental');

      const healthStatus = {
        totalBackups: stats.totalBackups,
        successRate: stats.successRate,
        hasRecentFullBackup,
        hasRecentIncrementalBackup,
        oldestBackup: stats.oldestBackup,
        newestBackup: stats.newestBackup,
        totalSize: stats.totalSize,
      };

      this.loggingService.logAudit('backup_health_check', {
        ...healthStatus,
        scheduled: true,
      });

      // Alert if no recent backups
      if (!hasRecentFullBackup && !hasRecentIncrementalBackup) {
        await this.sendBackupHealthAlert('No recent backups found');
      }

      // Alert if success rate is low
      if (stats.successRate < 90) {
        await this.sendBackupHealthAlert(`Low backup success rate: ${stats.successRate}%`);
      }

    } catch (error) {
      this.loggingService.error('Backup health check failed', { error });
      this.logger.error('Backup health check failed:', error);
    }
  }

  // Manual trigger methods
  async triggerFullBackup(): Promise<void> {
    this.logger.log('Manually triggering full backup');
    await this.handleDailyFullBackup();
  }

  async triggerIncrementalBackup(): Promise<void> {
    this.logger.log('Manually triggering incremental backup');
    await this.handleHourlyIncrementalBackup();
  }

  async triggerBackupVerification(): Promise<void> {
    this.logger.log('Manually triggering backup verification');
    await this.handleWeeklyBackupVerification();
  }

  async triggerBackupCleanup(): Promise<void> {
    this.logger.log('Manually triggering backup cleanup');
    await this.handleMonthlyBackupCleanup();
  }

  // Enable/disable scheduler
  enableScheduler(): void {
    this.logger.log('Backup scheduler enabled');
  }

  disableScheduler(): void {
    this.logger.log('Backup scheduler disabled');
  }

  // Get scheduler status
  getSchedulerStatus(): {
    enabled: boolean;
    nextRuns: Array<{
      name: string;
      nextRun: Date;
    }>;
  } {
    // This would integrate with the actual cron scheduler to get next run times
    // For now, return mock data
    return {
      enabled: this.isEnabled,
      nextRuns: [
        {
          name: 'daily-full-backup',
          nextRun: new Date(), // Would calculate actual next run time
        },
        {
          name: 'hourly-incremental-backup',
          nextRun: new Date(),
        },
        {
          name: 'weekly-backup-verification',
          nextRun: new Date(),
        },
        {
          name: 'monthly-backup-cleanup',
          nextRun: new Date(),
        },
      ],
    };
  }

  // Alert methods
  private async sendBackupFailureAlert(jobName: string, error: any): Promise<void> {
    try {
      // This would integrate with notification services (email, Slack, etc.)
      this.logger.error(`BACKUP FAILURE ALERT: ${jobName} failed`, error);
      
      // Could send email, Slack message, etc.
      // await this.notificationService.sendAlert({
      //   type: 'backup_failure',
      //   jobName,
      //   error: error.message,
      //   timestamp: new Date(),
      // });

    } catch (alertError) {
      this.logger.error('Failed to send backup failure alert:', alertError);
    }
  }

  private async sendBackupVerificationAlert(verified: number, failed: number): Promise<void> {
    try {
      this.logger.warn(`BACKUP VERIFICATION ALERT: ${failed} backups failed verification`);
      
      // Could send notification
      // await this.notificationService.sendAlert({
      //   type: 'backup_verification',
      //   verified,
      //   failed,
      //   timestamp: new Date(),
      // });

    } catch (alertError) {
      this.logger.error('Failed to send backup verification alert:', alertError);
    }
  }

  private async sendBackupHealthAlert(message: string): Promise<void> {
    try {
      this.logger.warn(`BACKUP HEALTH ALERT: ${message}`);
      
      // Could send notification
      // await this.notificationService.sendAlert({
      //   type: 'backup_health',
      //   message,
      //   timestamp: new Date(),
      // });

    } catch (alertError) {
      this.logger.error('Failed to send backup health alert:', alertError);
    }
  }
}
