import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { BackupService, RestoreOptions } from './backup.service';
import { AdminGuard } from '../auth/admin.guard';
import { LoggingService } from '../monitoring/logging.service';

@Controller('admin/backup')
@UseGuards(AdminGuard)
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly loggingService: LoggingService
  ) {}

  @Post('full')
  async createFullBackup() {
    try {
      this.loggingService.logAudit('backup_initiated', {
        type: 'full',
        initiatedBy: 'admin',
      });

      const backup = await this.backupService.createFullBackup();
      
      this.loggingService.logAudit('backup_completed', {
        backupId: backup.id,
        type: 'full',
        size: backup.size,
        duration: backup.duration,
      });

      return {
        success: true,
        backup,
        message: 'Full backup created successfully',
      };
    } catch (error) {
      this.loggingService.error('Full backup failed', { error });
      throw new HttpException(
        'Failed to create full backup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('incremental')
  async createIncrementalBackup(@Body() body: { lastBackupId?: string }) {
    try {
      this.loggingService.logAudit('backup_initiated', {
        type: 'incremental',
        lastBackupId: body.lastBackupId,
        initiatedBy: 'admin',
      });

      const backup = await this.backupService.createIncrementalBackup(body.lastBackupId);
      
      this.loggingService.logAudit('backup_completed', {
        backupId: backup.id,
        type: 'incremental',
        size: backup.size,
        duration: backup.duration,
      });

      return {
        success: true,
        backup,
        message: 'Incremental backup created successfully',
      };
    } catch (error) {
      this.loggingService.error('Incremental backup failed', { error });
      throw new HttpException(
        'Failed to create incremental backup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async getBackups(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('type') type?: string
  ) {
    try {
      const backups = this.backupService.getBackups();
      
      // Filter by type if specified
      let filteredBackups = type 
        ? backups.filter(backup => backup.type === type)
        : backups;

      // Pagination
      const pageNum = parseInt(page || '1', 10);
      const pageSizeNum = parseInt(pageSize || '10', 10);
      const startIndex = (pageNum - 1) * pageSizeNum;
      const endIndex = startIndex + pageSizeNum;

      const paginatedBackups = filteredBackups.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          backups: paginatedBackups,
          pagination: {
            page: pageNum,
            pageSize: pageSizeNum,
            totalItems: filteredBackups.length,
            totalPages: Math.ceil(filteredBackups.length / pageSizeNum),
          },
        },
      };
    } catch (error) {
      this.loggingService.error('Failed to get backups', { error });
      throw new HttpException(
        'Failed to retrieve backups',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('stats')
  async getBackupStats() {
    try {
      const stats = this.backupService.getBackupStats();
      return {
        success: true,
        stats,
      };
    } catch (error) {
      this.loggingService.error('Failed to get backup stats', { error });
      throw new HttpException(
        'Failed to retrieve backup statistics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getBackup(@Param('id') id: string) {
    try {
      const backup = this.backupService.getBackup(id);
      
      if (!backup) {
        throw new HttpException('Backup not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        backup,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.loggingService.error('Failed to get backup', { backupId: id, error });
      throw new HttpException(
        'Failed to retrieve backup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/verify')
  async verifyBackup(@Param('id') id: string) {
    try {
      const backup = this.backupService.getBackup(id);
      
      if (!backup) {
        throw new HttpException('Backup not found', HttpStatus.NOT_FOUND);
      }

      const isValid = await this.backupService.verifyBackupIntegrity(backup);
      
      this.loggingService.logAudit('backup_verified', {
        backupId: id,
        isValid,
        verifiedBy: 'admin',
      });

      return {
        success: true,
        isValid,
        message: isValid ? 'Backup is valid' : 'Backup integrity check failed',
      };
    } catch (error) {
      this.loggingService.error('Backup verification failed', { backupId: id, error });
      throw new HttpException(
        'Failed to verify backup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/restore')
  async restoreBackup(@Param('id') id: string, @Body() options: RestoreOptions) {
    try {
      this.loggingService.logAudit('restore_initiated', {
        backupId: id,
        options,
        initiatedBy: 'admin',
      });

      await this.backupService.restoreFromBackup({
        ...options,
        backupId: id,
      });
      
      this.loggingService.logAudit('restore_completed', {
        backupId: id,
        targetDatabase: options.targetDatabase,
        tables: options.tables,
        dryRun: options.dryRun,
      });

      return {
        success: true,
        message: options.dryRun 
          ? 'Dry run restore completed successfully'
          : 'Restore completed successfully',
      };
    } catch (error) {
      this.loggingService.error('Restore failed', { backupId: id, error });
      throw new HttpException(
        'Failed to restore from backup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deleteBackup(@Param('id') id: string) {
    try {
      await this.backupService.deleteBackup(id);
      
      this.loggingService.logAudit('backup_deleted', {
        backupId: id,
        deletedBy: 'admin',
      });

      return {
        success: true,
        message: 'Backup deleted successfully',
      };
    } catch (error) {
      this.loggingService.error('Failed to delete backup', { backupId: id, error });
      throw new HttpException(
        'Failed to delete backup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
