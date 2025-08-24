import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { BackupService, BackupResult, RestoreResult, BackupStatus, BackupMetadata } from './backup.service';
import { LoggingService } from '../logging/logging.service';

@Controller('api/v1/backup')
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly loggingService: LoggingService,
  ) {}

  // Get backup status
  @Get('status')
  async getStatus(): Promise<{ success: boolean; status: BackupStatus }> {
    try {
      const status = await this.backupService.getBackupStatus();

      this.loggingService.logBusinessEvent('backup_status_requested', {
        status: status.isBackupInProgress ? 'in_progress' : 'idle',
        totalBackups: status.totalBackups,
      });

      return {
        success: true,
        status,
      };
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'get_backup_status',
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_STATUS_ERROR',
            message: 'Failed to get backup status',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // List backups
  @Get('list')
  async listBackups(
    @Query('type') type?: 'full' | 'incremental' | 'files',
    @Query('status') status?: 'completed' | 'failed' | 'in_progress',
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<{ success: boolean; backups: BackupMetadata[]; total: number }> {
    try {
      const backups = await this.backupService.listBackups({
        type,
        status,
        limit: limit || 50,
        offset: offset || 0,
      });

      const total = backups.length; // In a real implementation, you'd have a separate count query

      this.loggingService.logBusinessEvent('backup_list_requested', {
        type: type || 'all',
        limit: limit || 50,
        offset: offset || 0,
        returnedCount: backups.length,
      });

      return {
        success: true,
        backups,
        total,
      };
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'list_backups',
        type,
        status,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_LIST_ERROR',
            message: 'Failed to list backups',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get backup details
  @Get(':backupId')
  async getBackupDetails(
    @Param('backupId') backupId: string,
  ): Promise<{ success: boolean; backup?: BackupMetadata }> {
    try {
      const backups = await this.backupService.listBackups();
      const backup = backups.find(b => b.id === backupId);

      if (!backup) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'BACKUP_NOT_FOUND',
              message: `Backup not found: ${backupId}`,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      this.loggingService.logBusinessEvent('backup_details_requested', {
        backupId,
        backupType: backup.type,
      });

      return {
        success: true,
        backup,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.loggingService.logError(error, {
        operation: 'get_backup_details',
        backupId,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_DETAILS_ERROR',
            message: 'Failed to get backup details',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create full backup
  @Post('full')
  async createFullBackup(
    @Body() options: {
      includeFiles?: boolean;
      compress?: boolean;
      encrypt?: boolean;
      comment?: string;
    } = {},
  ): Promise<{ success: boolean; result: BackupResult }> {
    try {
      this.loggingService.logBusinessEvent('full_backup_started', {
        includeFiles: options.includeFiles || false,
        compress: options.compress || false,
        encrypt: options.encrypt || false,
      });

      const result = await this.backupService.createFullBackup(options);

      this.loggingService.logBusinessEvent('full_backup_completed', {
        backupId: result.backupId,
        size: result.size,
        duration: result.duration,
      });

      return {
        success: true,
        result,
      };
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'create_full_backup',
        options,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'FULL_BACKUP_ERROR',
            message: 'Failed to create full backup',
            details: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create incremental backup
  @Post('incremental')
  async createIncrementalBackup(
    @Body() options: {
      since?: string; // ISO date string
      tables?: string[];
      compress?: boolean;
      comment?: string;
    } = {},
  ): Promise<{ success: boolean; result: BackupResult }> {
    try {
      const backupOptions = {
        ...options,
        since: options.since ? new Date(options.since) : undefined,
      };

      this.loggingService.logBusinessEvent('incremental_backup_started', {
        since: backupOptions.since?.toISOString(),
        tablesCount: backupOptions.tables?.length || 0,
        compress: options.compress || false,
      });

      const result = await this.backupService.createIncrementalBackup(backupOptions);

      this.loggingService.logBusinessEvent('incremental_backup_completed', {
        backupId: result.backupId,
        size: result.size,
        duration: result.duration,
      });

      return {
        success: true,
        result,
      };
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'create_incremental_backup',
        options,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'INCREMENTAL_BACKUP_ERROR',
            message: 'Failed to create incremental backup',
            details: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create file backup
  @Post('files')
  async createFileBackup(
    @Body() options: {
      directories?: string[];
      excludePatterns?: string[];
      compress?: boolean;
    } = {},
  ): Promise<{ success: boolean; result: BackupResult }> {
    try {
      const backupId = `files_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      this.loggingService.logBusinessEvent('file_backup_started', {
        backupId,
        directoriesCount: options.directories?.length || 0,
        compress: options.compress || false,
      });

      const result = await this.backupService.createFileBackup(backupId, options);

      this.loggingService.logBusinessEvent('file_backup_completed', {
        backupId: result.backupId,
        size: result.size,
        duration: result.duration,
      });

      return {
        success: true,
        result,
      };
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'create_file_backup',
        options,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'FILE_BACKUP_ERROR',
            message: 'Failed to create file backup',
            details: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Restore from backup
  @Post('restore/:backupId')
  async restoreFromBackup(
    @Param('backupId') backupId: string,
    @Body() options: {
      dropExisting?: boolean;
      verifyBeforeRestore?: boolean;
      dryRun?: boolean;
    } = {},
  ): Promise<{ success: boolean; result: RestoreResult }> {
    try {
      this.loggingService.logBusinessEvent('backup_restore_started', {
        backupId,
        dropExisting: options.dropExisting || false,
        verifyBeforeRestore: options.verifyBeforeRestore || false,
        dryRun: options.dryRun || false,
      });

      const result = await this.backupService.restoreFromBackup(backupId, options);

      this.loggingService.logBusinessEvent('backup_restore_completed', {
        backupId,
        dryRun: result.dryRun || false,
        duration: result.duration,
        success: result.success,
      });

      return {
        success: true,
        result,
      };
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'restore_from_backup',
        backupId,
        options,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_RESTORE_ERROR',
            message: 'Failed to restore from backup',
            details: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Point-in-time recovery
  @Post('restore/point-in-time')
  async pointInTimeRecovery(
    @Body() options: {
      targetTime: string; // ISO date string
      dryRun?: boolean;
      verify?: boolean;
    },
  ): Promise<{ success: boolean; result: RestoreResult }> {
    try {
      const targetTime = new Date(options.targetTime);

      if (isNaN(targetTime.getTime())) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'INVALID_DATE',
              message: 'Invalid target time format',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      this.loggingService.logBusinessEvent('point_in_time_recovery_started', {
        targetTime: targetTime.toISOString(),
        dryRun: options.dryRun || false,
        verify: options.verify || false,
      });

      const result = await this.backupService.pointInTimeRecovery(targetTime, options);

      this.loggingService.logBusinessEvent('point_in_time_recovery_completed', {
        targetTime: targetTime.toISOString(),
        dryRun: result.dryRun || false,
        duration: result.duration,
        success: result.success,
      });

      return {
        success: true,
        result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.loggingService.logError(error, {
        operation: 'point_in_time_recovery',
        options,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'POINT_IN_TIME_RECOVERY_ERROR',
            message: 'Failed to perform point-in-time recovery',
            details: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Download backup file
  @Get(':backupId/download')
  async downloadBackup(
    @Param('backupId') backupId: string,
    @Res() response: Response,
  ): Promise<void> {
    try {
      const backups = await this.backupService.listBackups();
      const backup = backups.find(b => b.id === backupId);

      if (!backup) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'BACKUP_NOT_FOUND',
              message: `Backup not found: ${backupId}`,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Check if backup file exists
      const fs = require('fs');
      if (!fs.existsSync(backup.path)) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'BACKUP_FILE_NOT_FOUND',
              message: `Backup file not found: ${backupId}`,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      this.loggingService.logBusinessEvent('backup_download_started', {
        backupId,
        backupType: backup.type,
        size: backup.size,
      });

      // Set response headers
      response.setHeader('Content-Type', 'application/octet-stream');
      response.setHeader('Content-Disposition', `attachment; filename="${backupId}.backup"`);
      response.setHeader('Content-Length', backup.size.toString());

      // Stream the file
      const readStream = fs.createReadStream(backup.path);
      readStream.pipe(response);

      readStream.on('end', () => {
        this.loggingService.logBusinessEvent('backup_download_completed', {
          backupId,
          success: true,
        });
      });

      readStream.on('error', (error) => {
        this.loggingService.logError(error, {
          operation: 'download_backup',
          backupId,
        });
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: {
            code: 'DOWNLOAD_ERROR',
            message: 'Failed to download backup file',
          },
        });
      });

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.loggingService.logError(error, {
        operation: 'download_backup',
        backupId,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'DOWNLOAD_ERROR',
            message: 'Failed to download backup file',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete backup
  @Delete(':backupId')
  async deleteBackup(
    @Param('backupId') backupId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if backup exists
      const backups = await this.backupService.listBackups();
      const backup = backups.find(b => b.id === backupId);

      if (!backup) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'BACKUP_NOT_FOUND',
              message: `Backup not found: ${backupId}`,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Delete the backup file and metadata
      const fs = require('fs').promises;
      try {
        await fs.unlink(backup.path);
      } catch (error) {
        // Log but don't fail if file deletion fails
        this.loggingService.logError(error, {
          operation: 'delete_backup_file',
          backupId,
          path: backup.path,
        });
      }

      // Delete metadata (this would be handled by the service in a real implementation)
      const metadataPath = `./backups/metadata/${backupId}.json`;
      try {
        await fs.unlink(metadataPath);
      } catch (error) {
        // Log but don't fail if metadata deletion fails
        this.loggingService.logError(error, {
          operation: 'delete_backup_metadata',
          backupId,
          path: metadataPath,
        });
      }

      this.loggingService.logBusinessEvent('backup_deleted', {
        backupId,
        backupType: backup.type,
        size: backup.size,
      });

      return {
        success: true,
        message: `Backup ${backupId} deleted successfully`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.loggingService.logError(error, {
        operation: 'delete_backup',
        backupId,
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'DELETE_BACKUP_ERROR',
            message: 'Failed to delete backup',
            details: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Clean up old backups
  @Post('cleanup')
  async cleanupOldBackups(): Promise<{ success: boolean; deletedCount: number }> {
    try {
      this.loggingService.logBusinessEvent('backup_cleanup_started', {});

      const deletedCount = await this.backupService.cleanupOldBackups();

      this.loggingService.logBusinessEvent('backup_cleanup_completed', {
        deletedCount,
      });

      return {
        success: true,
        deletedCount,
      };
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'cleanup_old_backups',
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_CLEANUP_ERROR',
            message: 'Failed to cleanup old backups',
            details: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get backup analytics
  @Get('analytics/overview')
  async getBackupAnalytics(): Promise<{ success: boolean; analytics: any }> {
    try {
      const backups = await this.backupService.listBackups();
      const status = await this.backupService.getBackupStatus();

      const analytics = {
        totalBackups: backups.length,
        backupTypes: {
          full: backups.filter(b => b.type === 'full').length,
          incremental: backups.filter(b => b.type === 'incremental').length,
          files: backups.filter(b => b.type === 'files').length,
        },
        statusBreakdown: {
          completed: backups.filter(b => b.status === 'completed').length,
          failed: backups.filter(b => b.status === 'failed').length,
          inProgress: backups.filter(b => b.status === 'in_progress').length,
        },
        totalSize: backups.reduce((sum, b) => sum + b.size, 0),
        averageBackupSize: backups.length > 0 ? backups.reduce((sum, b) => sum + b.size, 0) / backups.length : 0,
        largestBackup: backups.length > 0 ? Math.max(...backups.map(b => b.size)) : 0,
        oldestBackup: backups.length > 0 ? backups.reduce((oldest, current) =>
          current.timestamp < oldest.timestamp ? current : oldest
        ).timestamp : null,
        newestBackup: backups.length > 0 ? backups.reduce((newest, current) =>
          current.timestamp > newest.timestamp ? current : newest
        ).timestamp : null,
        successRate: backups.length > 0 ? (backups.filter(b => b.status === 'completed').length / backups.length) * 100 : 0,
        ...status,
      };

      this.loggingService.logBusinessEvent('backup_analytics_requested', {
        totalBackups: analytics.totalBackups,
        totalSize: analytics.totalSize,
      });

      return {
        success: true,
        analytics,
      };
    } catch (error) {
      this.loggingService.logError(error, {
        operation: 'get_backup_analytics',
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_ANALYTICS_ERROR',
            message: 'Failed to get backup analytics',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}