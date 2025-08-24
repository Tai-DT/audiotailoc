// Backup & Disaster Recovery Examples for Audio Tài Lộc Backend
// This file demonstrates comprehensive backup and recovery strategies

import { BackupService, BackupResult, RestoreResult } from './src/modules/backup/backup.service';
import { BackupSchedulerService, BackupSchedule } from './src/modules/backup/backup-scheduler.service';
import { LoggingService } from './src/modules/logging/logging.service';

// Example 1: Manual Backup Operations
export class BackupOperationsExample {
  constructor(
    private backupService: BackupService,
    private loggingService: LoggingService,
  ) {}

  // Create different types of backups
  async createVariousBackups() {
    try {
      // 1. Full database backup with files
      this.loggingService.logBusinessEvent('backup_operation_started', {
        type: 'full_backup',
        includeFiles: true,
      });

      const fullBackup = await this.backupService.createFullBackup({
        includeFiles: true,
        compress: true,
        encrypt: false,
        comment: 'Weekly full backup with files',
      });

      this.loggingService.logBusinessEvent('backup_operation_completed', {
        backupId: fullBackup.backupId,
        size: fullBackup.size,
        duration: fullBackup.duration,
      });

      // 2. Incremental backup for recent changes
      const incrementalBackup = await this.backupService.createIncrementalBackup({
        since: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        tables: ['orders', 'payments', 'users'],
        compress: true,
        comment: 'Daily incremental backup',
      });

      // 3. File backup for uploads and configurations
      const fileBackup = await this.backupService.createFileBackup(
        `files_backup_${Date.now()}`,
        {
          directories: ['./uploads', './public/images', './config'],
          excludePatterns: ['*.tmp', '*.log', 'node_modules/**'],
          compress: true,
        }
      );

      return {
        fullBackup,
        incrementalBackup,
        fileBackup,
      };

    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'create_various_backups',
      });
      throw error;
    }
  }

  // Backup verification and validation
  async verifyAndValidateBackup(backupId: string) {
    const backups = await this.backupService.listBackups();
    const backup = backups.find(b => b.id === backupId);

    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`);
    }

    // Check backup integrity
    const isValid = await this.verifyBackupIntegrity(backupId);

    // Get backup statistics
    const stats = await this.getBackupStatistics(backupId);

    // Validate backup can be restored
    const canRestore = await this.validateRestorability(backupId);

    return {
      backup,
      isValid,
      stats,
      canRestore,
    };
  }

  private async verifyBackupIntegrity(backupId: string): Promise<boolean> {
    // Implementation would check file integrity, checksums, etc.
    return true;
  }

  private async getBackupStatistics(backupId: string) {
    const backup = (await this.backupService.listBackups()).find(b => b.id === backupId);
    return {
      size: backup?.size || 0,
      compressed: backup?.compressed || false,
      encrypted: backup?.encrypted || false,
      createdAt: backup?.timestamp,
    };
  }

  private async validateRestorability(backupId: string): Promise<boolean> {
    // Implementation would test if backup can be restored
    return true;
  }
}

// Example 2: Automated Backup Scheduling
export class BackupSchedulingExample {
  constructor(private backupScheduler: BackupSchedulerService) {}

  // Set up comprehensive backup schedules
  async setupBackupSchedules() {
    const schedules: Partial<BackupSchedule>[] = [
      // Daily full backup at 2 AM
      {
        id: 'daily_full_backup',
        name: 'Daily Full Backup',
        type: 'full',
        cronExpression: '0 2 * * *',
        enabled: true,
        options: {
          includeFiles: true,
          compress: true,
          encrypt: false,
          retentionDays: 30,
          comment: 'Automated daily full backup',
        },
      },

      // Hourly incremental backup
      {
        id: 'hourly_incremental_backup',
        name: 'Hourly Incremental Backup',
        type: 'incremental',
        cronExpression: '0 * * * *',
        enabled: true,
        options: {
          compress: true,
          comment: 'Automated hourly incremental backup',
        },
      },

      // Weekly file backup on Sunday
      {
        id: 'weekly_file_backup',
        name: 'Weekly File Backup',
        type: 'files',
        cronExpression: '0 3 * * 0',
        enabled: true,
        options: {
          directories: ['./uploads', './logs'],
          excludePatterns: ['*.tmp', '*.log'],
          compress: true,
          comment: 'Automated weekly file backup',
        },
      },

      // Monthly archive backup
      {
        id: 'monthly_archive_backup',
        name: 'Monthly Archive Backup',
        type: 'full',
        cronExpression: '0 4 1 * *',
        enabled: true,
        options: {
          includeFiles: true,
          compress: true,
          encrypt: true,
          retentionDays: 365,
          comment: 'Monthly encrypted archive backup',
        },
      },
    ];

    const createdSchedules = [];
    for (const schedule of schedules) {
      const created = await this.backupScheduler.createSchedule(schedule);
      createdSchedules.push(created);
    }

    return createdSchedules;
  }

  // Monitor and manage backup schedules
  async monitorBackupSchedules() {
    const allSchedules = this.backupScheduler.getAllSchedules();
    const schedulerStats = this.backupScheduler.getSchedulerStats();
    const detailedStatus = this.backupScheduler.getDetailedStatus();

    // Check for failed schedules
    const failedSchedules = allSchedules.filter(s => s.status === 'error');

    // Check for schedules that haven't run recently
    const now = Date.now();
    const staleSchedules = allSchedules.filter(s => {
      if (!s.lastRun) return false;
      const hoursSinceLastRun = (now - s.lastRun.getTime()) / (1000 * 60 * 60);
      return hoursSinceLastRun > 25; // More than 25 hours for daily schedules
    });

    // Send alerts for issues
    if (failedSchedules.length > 0) {
      console.error(`❌ ${failedSchedules.length} backup schedules have failed`);
      failedSchedules.forEach(schedule => {
        console.error(`  - ${schedule.name}: ${schedule.errorMessage}`);
      });
    }

    if (staleSchedules.length > 0) {
      console.warn(`⚠️ ${staleSchedules.length} backup schedules haven't run recently`);
      staleSchedules.forEach(schedule => {
        console.warn(`  - ${schedule.name}: Last run ${schedule.lastRun}`);
      });
    }

    return {
      totalSchedules: allSchedules.length,
      activeSchedules: schedulerStats.activeSchedules,
      failedSchedules: failedSchedules.length,
      staleSchedules: staleSchedules.length,
      nextBackup: schedulerStats.nextScheduledBackup,
      isHealthy: detailedStatus.isHealthy,
    };
  }

  // Emergency backup creation
  async createEmergencyBackup(reason: string) {
    const backupId = `emergency_${Date.now()}`;

    const emergencyBackup = await this.backupScheduler.createSchedule({
      id: backupId,
      name: `Emergency Backup: ${reason}`,
      type: 'full',
      cronExpression: new Date(Date.now() + 60000).toISOString(), // Run in 1 minute
      enabled: true,
      options: {
        includeFiles: true,
        compress: true,
        encrypt: true,
        comment: `Emergency backup: ${reason}`,
      },
    });

    // Force run immediately
    await this.backupScheduler.forceRunSchedule(backupId);

    return emergencyBackup;
  }
}

// Example 3: Disaster Recovery Scenarios
export class DisasterRecoveryExample {
  constructor(
    private backupService: BackupService,
    private loggingService: LoggingService,
  ) {}

  // Complete system recovery
  async performCompleteRecovery(targetTime?: Date) {
    this.loggingService.logBusinessEvent('disaster_recovery_started', {
      type: 'complete_recovery',
      targetTime: targetTime?.toISOString(),
    });

    try {
      let recoveryResult;

      if (targetTime) {
        // Point-in-time recovery
        recoveryResult = await this.backupService.pointInTimeRecovery(targetTime, {
          dryRun: false,
          verify: true,
        });
      } else {
        // Latest recovery
        const backups = await this.backupService.listBackups({ type: 'full' });
        const latestBackup = backups
          .filter(b => b.status === 'completed')
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

        if (!latestBackup) {
          throw new Error('No completed full backup found');
        }

        recoveryResult = await this.backupService.restoreFromBackup(latestBackup.id, {
          dropExisting: true,
          verifyBeforeRestore: true,
        });
      }

      this.loggingService.logBusinessEvent('disaster_recovery_completed', {
        success: true,
        duration: recoveryResult.duration,
        backupId: recoveryResult.backupId,
      });

      return recoveryResult;

    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'complete_recovery',
        targetTime: targetTime?.toISOString(),
      });

      this.loggingService.logBusinessEvent('disaster_recovery_failed', {
        error: error.message,
        targetTime: targetTime?.toISOString(),
      });

      throw error;
    }
  }

  // Database corruption recovery
  async recoverFromDatabaseCorruption() {
    this.loggingService.logBusinessEvent('database_corruption_recovery_started', {});

    try {
      // Step 1: Get latest healthy backup
      const fullBackups = await this.backupService.listBackups({
        type: 'full',
        status: 'completed',
      });

      const latestBackup = fullBackups[0];
      if (!latestBackup) {
        throw new Error('No healthy full backup found');
      }

      // Step 2: Restore full backup
      await this.backupService.restoreFromBackup(latestBackup.id, {
        dropExisting: true,
        verifyBeforeRestore: true,
      });

      // Step 3: Apply incremental backups if available
      const incrementalBackups = await this.backupService.listBackups({
        type: 'incremental',
        status: 'completed',
      });

      for (const backup of incrementalBackups) {
        if (backup.timestamp > latestBackup.timestamp) {
          await this.backupService.restoreFromBackup(backup.id, {
            dropExisting: false,
          });
        }
      }

      // Step 4: Verify database integrity
      await this.verifyDatabaseAfterRecovery();

      this.loggingService.logBusinessEvent('database_corruption_recovery_completed', {
        backupId: latestBackup.id,
        incrementalBackupsApplied: incrementalBackups.length,
      });

    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'database_corruption_recovery',
      });
      throw error;
    }
  }

  // Data loss recovery (specific tables)
  async recoverSpecificTables(tableNames: string[], targetTime: Date) {
    this.loggingService.logBusinessEvent('table_recovery_started', {
      tables: tableNames,
      targetTime: targetTime.toISOString(),
    });

    try {
      // Create incremental backup up to target time
      const incrementalBackup = await this.backupService.createIncrementalBackup({
        since: targetTime,
        tables: tableNames,
        comment: `Table recovery backup for ${tableNames.join(', ')}`,
      });

      // Restore the specific tables
      await this.restoreSpecificTables(incrementalBackup.backupId, tableNames);

      this.loggingService.logBusinessEvent('table_recovery_completed', {
        tables: tableNames,
        backupId: incrementalBackup.backupId,
      });

    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'table_recovery',
        tables: tableNames,
        targetTime: targetTime.toISOString(),
      });
      throw error;
    }
  }

  private async restoreSpecificTables(backupId: string, tableNames: string[]) {
    // Implementation would restore only specific tables
    // This is a placeholder for the actual implementation
    console.log(`Restoring tables ${tableNames.join(', ')} from backup ${backupId}`);
  }

  private async verifyDatabaseAfterRecovery() {
    // Implementation would run database integrity checks
    console.log('Verifying database integrity after recovery');
  }
}

// Example 4: Backup Monitoring and Analytics
export class BackupMonitoringExample {
  constructor(
    private backupService: BackupService,
    private backupScheduler: BackupSchedulerService,
  ) {}

  // Comprehensive backup health check
  async performBackupHealthCheck() {
    const healthStatus = {
      overall: 'healthy',
      issues: [],
      recommendations: [],
      metrics: {} as any,
    };

    try {
      // Check backup status
      const backupStatus = await this.backupService.getBackupStatus();

      // Check scheduler health
      const schedulerStatus = this.backupScheduler.getDetailedStatus();

      // Check storage space
      const storageHealth = await this.checkStorageHealth();

      // Check backup success rate
      const successRate = await this.calculateBackupSuccessRate();

      // Check backup freshness
      const freshness = await this.checkBackupFreshness();

      // Aggregate results
      healthStatus.metrics = {
        totalBackups: backupStatus.totalBackups,
        latestBackup: backupStatus.latestBackup,
        activeSchedules: schedulerStatus.activeSchedules,
        storageUsage: storageHealth.usage,
        successRate,
        ...freshness,
      };

      // Check for issues
      if (backupStatus.failedBackups > 0) {
        healthStatus.issues.push(`${backupStatus.failedBackups} backup(s) have failed`);
        healthStatus.overall = 'warning';
      }

      if (!schedulerStatus.isHealthy) {
        healthStatus.issues.push('Backup scheduler is not healthy');
        healthStatus.overall = 'error';
      }

      if (storageHealth.usage > 90) {
        healthStatus.issues.push(`Storage usage is ${storageHealth.usage}%`);
        healthStatus.overall = 'warning';
      }

      if (successRate < 90) {
        healthStatus.issues.push(`Backup success rate is only ${successRate}%`);
        healthStatus.overall = 'warning';
      }

      if (freshness.hoursSinceLastBackup > 25) {
        healthStatus.issues.push(`Last backup was ${freshness.hoursSinceLastBackup} hours ago`);
        healthStatus.overall = 'warning';
      }

      // Generate recommendations
      if (healthStatus.issues.length > 0) {
        healthStatus.recommendations = await this.generateRecommendations(healthStatus.issues);
      }

      return healthStatus;

    } catch (error) {
      healthStatus.overall = 'error';
      healthStatus.issues.push(`Health check failed: ${error.message}`);
      return healthStatus;
    }
  }

  private async checkStorageHealth() {
    // Implementation would check actual storage usage
    return {
      total: 100 * 1024 * 1024 * 1024, // 100GB
      used: 45 * 1024 * 1024 * 1024,   // 45GB
      usage: 45, // percentage
    };
  }

  private async calculateBackupSuccessRate(): Promise<number> {
    const backups = await this.backupService.listBackups();
    if (backups.length === 0) return 100;

    const successful = backups.filter(b => b.status === 'completed').length;
    return Math.round((successful / backups.length) * 100);
  }

  private async checkBackupFreshness() {
    const backupStatus = await this.backupService.getBackupStatus();

    if (!backupStatus.latestBackup) {
      return {
        hoursSinceLastBackup: Infinity,
        isFresh: false,
      };
    }

    const hoursSinceLastBackup = Math.round(
      (Date.now() - backupStatus.latestBackup.getTime()) / (1000 * 60 * 60)
    );

    return {
      hoursSinceLastBackup,
      isFresh: hoursSinceLastBackup <= 24,
      lastBackupDate: backupStatus.latestBackup,
    };
  }

  private async generateRecommendations(issues: string[]): Promise<string[]> {
    const recommendations = [];

    if (issues.some(issue => issue.includes('failed'))) {
      recommendations.push('Investigate and fix failed backup schedules');
      recommendations.push('Check database connectivity and permissions');
    }

    if (issues.some(issue => issue.includes('storage'))) {
      recommendations.push('Clean up old backup files');
      recommendations.push('Consider increasing backup storage capacity');
    }

    if (issues.some(issue => issue.includes('success rate'))) {
      recommendations.push('Review backup configurations');
      recommendations.push('Test backup and restore procedures');
    }

    if (issues.some(issue => issue.includes('scheduler'))) {
      recommendations.push('Restart backup scheduler service');
      recommendations.push('Check system resources and cron jobs');
    }

    if (issues.some(issue => issue.includes('Last backup'))) {
      recommendations.push('Run a manual backup immediately');
      recommendations.push('Review backup schedule configurations');
    }

    return recommendations;
  }

  // Generate backup report
  async generateBackupReport(period: 'daily' | 'weekly' | 'monthly' = 'weekly') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const backups = await this.backupService.listBackups();
    const periodBackups = backups.filter(b => b.timestamp >= startDate);

    const report = {
      period,
      startDate,
      endDate: now,
      summary: {
        totalBackups: periodBackups.length,
        successfulBackups: periodBackups.filter(b => b.status === 'completed').length,
        failedBackups: periodBackups.filter(b => b.status === 'failed').length,
        totalSize: periodBackups.reduce((sum, b) => sum + b.size, 0),
        averageSize: periodBackups.length > 0
          ? periodBackups.reduce((sum, b) => sum + b.size, 0) / periodBackups.length
          : 0,
      },
      byType: {
        full: periodBackups.filter(b => b.type === 'full').length,
        incremental: periodBackups.filter(b => b.type === 'incremental').length,
        files: periodBackups.filter(b => b.type === 'files').length,
      },
      largestBackup: periodBackups.length > 0
        ? periodBackups.reduce((largest, current) =>
            current.size > largest.size ? current : largest
          )
        : null,
      oldestBackup: periodBackups.length > 0
        ? periodBackups.reduce((oldest, current) =>
            current.timestamp < oldest.timestamp ? current : oldest
          )
        : null,
      newestBackup: periodBackups.length > 0
        ? periodBackups.reduce((newest, current) =>
            current.timestamp > newest.timestamp ? current : newest
          )
        : null,
    };

    return report;
  }
}

// Example 5: Integration with External Storage
export class ExternalStorageBackupExample {
  constructor(private backupService: BackupService) {}

  // Upload backup to cloud storage
  async uploadBackupToCloud(backupId: string, provider: 'aws' | 'gcp' | 'azure') {
    const backup = (await this.backupService.listBackups()).find(b => b.id === backupId);
    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`);
    }

    try {
      switch (provider) {
        case 'aws':
          await this.uploadToAWS(backup);
          break;
        case 'gcp':
          await this.uploadToGCP(backup);
          break;
        case 'azure':
          await this.uploadToAzure(backup);
          break;
      }

      console.log(`✅ Backup ${backupId} uploaded to ${provider} cloud storage`);
    } catch (error) {
      console.error(`❌ Failed to upload backup ${backupId} to ${provider}:`, error);
      throw error;
    }
  }

  private async uploadToAWS(backup: any) {
    // Implementation for AWS S3 upload
    console.log(`Uploading ${backup.path} to AWS S3 bucket`);
    // AWS SDK implementation would go here
  }

  private async uploadToGCP(backup: any) {
    // Implementation for Google Cloud Storage upload
    console.log(`Uploading ${backup.path} to Google Cloud Storage`);
    // Google Cloud Storage SDK implementation would go here
  }

  private async uploadToAzure(backup: any) {
    // Implementation for Azure Blob Storage upload
    console.log(`Uploading ${backup.path} to Azure Blob Storage`);
    // Azure SDK implementation would go here
  }

  // Download backup from cloud storage
  async downloadBackupFromCloud(backupId: string, provider: 'aws' | 'gcp' | 'azure') {
    try {
      const localPath = `./backups/downloads/${backupId}`;

      switch (provider) {
        case 'aws':
          await this.downloadFromAWS(backupId, localPath);
          break;
        case 'gcp':
          await this.downloadFromGCP(backupId, localPath);
          break;
        case 'azure':
          await this.downloadFromAzure(backupId, localPath);
          break;
      }

      console.log(`✅ Backup ${backupId} downloaded from ${provider} to ${localPath}`);
      return localPath;
    } catch (error) {
      console.error(`❌ Failed to download backup ${backupId} from ${provider}:`, error);
      throw error;
    }
  }

  private async downloadFromAWS(backupId: string, localPath: string) {
    // AWS S3 download implementation
  }

  private async downloadFromGCP(backupId: string, localPath: string) {
    // Google Cloud Storage download implementation
  }

  private async downloadFromAzure(backupId: string, localPath: string) {
    // Azure Blob Storage download implementation
  }
}

// Example 6: Backup Policy and Compliance
export class BackupComplianceExample {
  constructor(private backupService: BackupService) {}

  // Check compliance with backup policies
  async checkBackupCompliance() {
    const compliance = {
      overall: 'compliant',
      issues: [],
      checks: {} as any,
    };

    try {
      // Check 1: Recent backup exists
      compliance.checks.recentBackup = await this.checkRecentBackup();
      if (!compliance.checks.recentBackup.compliant) {
        compliance.issues.push(compliance.checks.recentBackup.message);
      }

      // Check 2: Backup retention policy
      compliance.checks.retentionPolicy = await this.checkRetentionPolicy();
      if (!compliance.checks.retentionPolicy.compliant) {
        compliance.issues.push(compliance.checks.retentionPolicy.message);
      }

      // Check 3: Backup storage capacity
      compliance.checks.storageCapacity = await this.checkStorageCapacity();
      if (!compliance.checks.storageCapacity.compliant) {
        compliance.issues.push(compliance.checks.storageCapacity.message);
      }

      // Check 4: Backup encryption
      compliance.checks.encryption = await this.checkEncryptionPolicy();
      if (!compliance.checks.encryption.compliant) {
        compliance.issues.push(compliance.checks.encryption.message);
      }

      // Check 5: Backup schedule compliance
      compliance.checks.scheduling = await this.checkBackupScheduling();
      if (!compliance.checks.scheduling.compliant) {
        compliance.issues.push(compliance.checks.scheduling.message);
      }

      // Overall compliance
      compliance.overall = compliance.issues.length === 0 ? 'compliant' : 'non-compliant';

      return compliance;

    } catch (error) {
      compliance.overall = 'error';
      compliance.issues.push(`Compliance check failed: ${error.message}`);
      return compliance;
    }
  }

  private async checkRecentBackup() {
    const status = await this.backupService.getBackupStatus();

    if (!status.latestBackup) {
      return {
        compliant: false,
        message: 'No backup found',
      };
    }

    const hoursSinceLastBackup = (Date.now() - status.latestBackup.getTime()) / (1000 * 60 * 60);
    const maxHours = 25; // 25 hours for daily backup

    return {
      compliant: hoursSinceLastBackup <= maxHours,
      message: hoursSinceLastBackup > maxHours
        ? `Last backup was ${Math.round(hoursSinceLastBackup)} hours ago (limit: ${maxHours}h)`
        : `Last backup: ${status.latestBackup.toISOString()}`,
      hoursSinceLastBackup: Math.round(hoursSinceLastBackup),
    };
  }

  private async checkRetentionPolicy() {
    const backups = await this.backupService.listBackups({ type: 'full' });
    const retentionDays = 30; // Required retention period

    const oldBackups = backups.filter(backup => {
      const daysOld = (Date.now() - backup.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysOld > retentionDays;
    });

    return {
      compliant: oldBackups.length === 0,
      message: oldBackups.length > 0
        ? `${oldBackups.length} backup(s) older than ${retentionDays} days`
        : `All backups within ${retentionDays} days retention period`,
    };
  }

  private async checkStorageCapacity() {
    const status = await this.backupService.getBackupStatus();
    const maxStorageBytes = 100 * 1024 * 1024 * 1024; // 100GB
    const usagePercent = (status.totalSize / maxStorageBytes) * 100;

    return {
      compliant: usagePercent < 90,
      message: usagePercent >= 90
        ? `Storage usage: ${usagePercent.toFixed(1)}% (limit: 90%)`
        : `Storage usage: ${usagePercent.toFixed(1)}%`,
      usagePercent: Math.round(usagePercent * 10) / 10,
    };
  }

  private async checkEncryptionPolicy() {
    const recentBackups = await this.backupService.listBackups();
    const recentFullBackups = recentBackups
      .filter(b => b.type === 'full')
      .slice(0, 5); // Check last 5 full backups

    const encryptedCount = recentFullBackups.filter(b => b.encrypted).length;
    const requiredEncrypted = Math.ceil(recentFullBackups.length * 0.8); // 80% must be encrypted

    return {
      compliant: encryptedCount >= requiredEncrypted,
      message: recentFullBackups.length === 0
        ? 'No full backups found'
        : `${encryptedCount}/${recentFullBackups.length} recent backups encrypted`,
    };
  }

  private async checkBackupScheduling() {
    const schedules = await this.backupService.listBackups();
    const fullBackups = schedules.filter(b => b.type === 'full');
    const incrementalBackups = schedules.filter(b => b.type === 'incremental');

    const hasFullBackup = fullBackups.length > 0;
    const hasIncrementalBackup = incrementalBackups.length > 0;

    return {
      compliant: hasFullBackup && hasIncrementalBackup,
      message: !hasFullBackup
        ? 'No full backup schedule found'
        : !hasIncrementalBackup
        ? 'No incremental backup schedule found'
        : 'Backup scheduling is compliant',
    };
  }

  // Generate compliance report
  async generateComplianceReport() {
    const compliance = await this.checkBackupCompliance();

    return {
      generatedAt: new Date().toISOString(),
      period: 'weekly',
      compliance: compliance.overall,
      score: compliance.issues.length === 0 ? 100 : Math.max(0, 100 - (compliance.issues.length * 20)),
      issues: compliance.issues,
      checks: compliance.checks,
      recommendations: this.generateComplianceRecommendations(compliance.issues),
    };
  }

  private generateComplianceRecommendations(issues: string[]): string[] {
    const recommendations = [];

    if (issues.some(issue => issue.includes('backup'))) {
      recommendations.push('Ensure backup schedules are active and running');
      recommendations.push('Test backup and restore procedures regularly');
    }

    if (issues.some(issue => issue.includes('storage'))) {
      recommendations.push('Implement backup cleanup procedures');
      recommendations.push('Consider increasing backup storage capacity');
    }

    if (issues.some(issue => issue.includes('encryption'))) {
      recommendations.push('Enable encryption for all sensitive backups');
      recommendations.push('Review encryption key management');
    }

    if (issues.some(issue => issue.includes('retention'))) {
      recommendations.push('Configure automatic cleanup of old backups');
      recommendations.push('Review backup retention policies');
    }

    return recommendations;
  }
}
