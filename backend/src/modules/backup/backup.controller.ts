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
import * as path from 'path';
import * as fs from 'fs';
import {
  BackupService,
  BackupResult,
  RestoreResult,
  BackupStatus,
  BackupMetadata,
} from './backup.service';
import { LoggingService } from '../logging/logging.service';
import { AdminOrKeyGuard } from '../auth/admin-or-key.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('backup')
@UseGuards(AdminOrKeyGuard)
@ApiBearerAuth()
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly loggingService: LoggingService,
  ) { }

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
      this.loggingService.logError(error as any, { metadata: { operation: 'get_backup_status' } });

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
      this.loggingService.logError(error as any, {
        metadata: { operation: 'list_backups', type, status },
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

  // Preflight status
  @Get('preflight')
  async getPreflight(): Promise<{ success: boolean; status: any }> {
    try {
      const status = await this.backupService.getPreflightStatus();
      return { success: true, status };
    } catch (error) {
      this.loggingService.logError(error as any, { metadata: { operation: 'backup_preflight' } });
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_PREFLIGHT_ERROR',
            message: 'Failed to run backup preflight',
            details: (error as Error).message,
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

      this.loggingService.logError(error as any, {
        metadata: { operation: 'get_backup_details', backupId },
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
    @Body()
    options: {
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
      this.loggingService.logError(error as any, {
        metadata: { operation: 'create_full_backup', options },
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'FULL_BACKUP_ERROR',
            message: 'Failed to create full backup',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create incremental backup
  @Post('incremental')
  async createIncrementalBackup(
    @Body()
    options: {
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
      this.loggingService.logError(error as any, {
        metadata: { operation: 'create_incremental_backup', options },
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'INCREMENTAL_BACKUP_ERROR',
            message: 'Failed to create incremental backup',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create file backup
  @Post('files')
  async createFileBackup(
    @Body()
    options: {
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
      this.loggingService.logError(error as any, {
        metadata: { operation: 'create_file_backup', options },
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'FILE_BACKUP_ERROR',
            message: 'Failed to create file backup',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('restore/:backupId')
  @UseGuards(AdminGuard)
  async restoreFromBackup(
    @Param('backupId') backupId: string,
    @Body()
    options: {
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
      this.loggingService.logError(error as any, {
        metadata: { operation: 'restore_from_backup', backupId, options },
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_RESTORE_ERROR',
            message: 'Failed to restore from backup',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('restore/point-in-time')
  @UseGuards(AdminGuard)
  async pointInTimeRecovery(
    @Body()
    options: {
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

      this.loggingService.logError(error as any, {
        metadata: { operation: 'point_in_time_recovery', options },
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'POINT_IN_TIME_RECOVERY_ERROR',
            message: 'Failed to perform point-in-time recovery',
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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
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

      const fileStat = fs.statSync(backup.path);
      const filename = path.basename(backup.path) || `${backupId}.backup`;

      // Set response headers
      // Allow browser JS to read filename from Content-Disposition.
      response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      response.setHeader('Content-Type', 'application/octet-stream');
      response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      response.setHeader('Content-Length', String(fileStat.size));

      // Stream the file
      const readStream = fs.createReadStream(backup.path);
      readStream.pipe(response);

      readStream.on('end', () => {
        this.loggingService.logBusinessEvent('backup_download_completed', {
          backupId,
          success: true,
        });
      });

      readStream.on('error', (error: Error) => {
        this.loggingService.logError(error as any, {
          metadata: { operation: 'download_backup', backupId },
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

      this.loggingService.logError(error as any, {
        metadata: { operation: 'download_backup', backupId },
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

  @Delete(':backupId')
  @UseGuards(AdminGuard)
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

      const deleted = await this.backupService.deleteBackupById(backupId);
      if (!deleted) {
        throw new HttpException(
          {
            success: false,
            error: {
              code: 'DELETE_BACKUP_ERROR',
              message: 'Failed to delete backup',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
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

      this.loggingService.logError(error as any, {
        metadata: { operation: 'delete_backup', backupId },
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'DELETE_BACKUP_ERROR',
            message: 'Failed to delete backup',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('cleanup')
  @UseGuards(AdminGuard)
  async cleanupOldBackups(
    @Body()
    options: {
      olderThanDays?: number;
      keepMinimum?: number;
    } = {},
  ): Promise<{ success: boolean; deletedCount: number }> {
    try {
      this.loggingService.logBusinessEvent('backup_cleanup_started', {});

      const deletedCount = await this.backupService.cleanupOldBackups(options);

      this.loggingService.logBusinessEvent('backup_cleanup_completed', {
        deletedCount,
      });

      return {
        success: true,
        deletedCount,
      };
    } catch (error) {
      this.loggingService.logError(error as any, {
        metadata: { operation: 'cleanup_old_backups' },
      });

      throw new HttpException(
        {
          success: false,
          error: {
            code: 'BACKUP_CLEANUP_ERROR',
            message: 'Failed to cleanup old backups',
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
        averageBackupSize:
          backups.length > 0 ? backups.reduce((sum, b) => sum + b.size, 0) / backups.length : 0,
        largestBackup: backups.length > 0 ? Math.max(...backups.map(b => b.size)) : 0,
        oldestBackup:
          backups.length > 0
            ? backups.reduce((oldest, current) =>
              current.timestamp < oldest.timestamp ? current : oldest,
            ).timestamp
            : null,
        newestBackup:
          backups.length > 0
            ? backups.reduce((newest, current) =>
              current.timestamp > newest.timestamp ? current : newest,
            ).timestamp
            : null,
        successRate:
          backups.length > 0
            ? (backups.filter(b => b.status === 'completed').length / backups.length) * 100
            : 0,
        status,
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
      this.loggingService.logError(error as any, {
        metadata: { operation: 'get_backup_analytics' },
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
