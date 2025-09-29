"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupController = void 0;
const common_1 = require("@nestjs/common");
const backup_service_1 = require("./backup.service");
const logging_service_1 = require("../logging/logging.service");
let BackupController = class BackupController {
    constructor(backupService, loggingService) {
        this.backupService = backupService;
        this.loggingService = loggingService;
    }
    async getStatus() {
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
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'get_backup_status' } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'BACKUP_STATUS_ERROR',
                    message: 'Failed to get backup status',
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async listBackups(type, status, limit, offset) {
        try {
            const backups = await this.backupService.listBackups({
                type,
                status,
                limit: limit || 50,
                offset: offset || 0,
            });
            const total = backups.length;
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
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'list_backups', type, status } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'BACKUP_LIST_ERROR',
                    message: 'Failed to list backups',
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPreflight() {
        try {
            const status = await this.backupService.getPreflightStatus();
            return { success: true, status };
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'backup_preflight' } });
            throw new common_1.HttpException({
                success: false,
                error: { code: 'BACKUP_PREFLIGHT_ERROR', message: 'Failed to run backup preflight', details: error.message },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBackupDetails(backupId) {
        try {
            const backups = await this.backupService.listBackups();
            const backup = backups.find(b => b.id === backupId);
            if (!backup) {
                throw new common_1.HttpException({
                    success: false,
                    error: {
                        code: 'BACKUP_NOT_FOUND',
                        message: `Backup not found: ${backupId}`,
                    },
                }, common_1.HttpStatus.NOT_FOUND);
            }
            this.loggingService.logBusinessEvent('backup_details_requested', {
                backupId,
                backupType: backup.type,
            });
            return {
                success: true,
                backup,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.loggingService.logError(error, { metadata: { operation: 'get_backup_details', backupId } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'BACKUP_DETAILS_ERROR',
                    message: 'Failed to get backup details',
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createFullBackup(options = {}) {
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
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'create_full_backup', options } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'FULL_BACKUP_ERROR',
                    message: 'Failed to create full backup',
                    details: error.message,
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createIncrementalBackup(options = {}) {
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
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'create_incremental_backup', options } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'INCREMENTAL_BACKUP_ERROR',
                    message: 'Failed to create incremental backup',
                    details: error.message,
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createFileBackup(options = {}) {
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
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'create_file_backup', options } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'FILE_BACKUP_ERROR',
                    message: 'Failed to create file backup',
                    details: error.message,
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async restoreFromBackup(backupId, options = {}) {
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
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'restore_from_backup', backupId, options } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'BACKUP_RESTORE_ERROR',
                    message: 'Failed to restore from backup',
                    details: error.message,
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async pointInTimeRecovery(options) {
        try {
            const targetTime = new Date(options.targetTime);
            if (isNaN(targetTime.getTime())) {
                throw new common_1.HttpException({
                    success: false,
                    error: {
                        code: 'INVALID_DATE',
                        message: 'Invalid target time format',
                    },
                }, common_1.HttpStatus.BAD_REQUEST);
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
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.loggingService.logError(error, { metadata: { operation: 'point_in_time_recovery', options } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'POINT_IN_TIME_RECOVERY_ERROR',
                    message: 'Failed to perform point-in-time recovery',
                    details: error.message,
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async downloadBackup(backupId, response) {
        try {
            const backups = await this.backupService.listBackups();
            const backup = backups.find(b => b.id === backupId);
            if (!backup) {
                throw new common_1.HttpException({
                    success: false,
                    error: {
                        code: 'BACKUP_NOT_FOUND',
                        message: `Backup not found: ${backupId}`,
                    },
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const fs = require('fs');
            if (!fs.existsSync(backup.path)) {
                throw new common_1.HttpException({
                    success: false,
                    error: {
                        code: 'BACKUP_FILE_NOT_FOUND',
                        message: `Backup file not found: ${backupId}`,
                    },
                }, common_1.HttpStatus.NOT_FOUND);
            }
            this.loggingService.logBusinessEvent('backup_download_started', {
                backupId,
                backupType: backup.type,
                size: backup.size,
            });
            response.setHeader('Content-Type', 'application/octet-stream');
            response.setHeader('Content-Disposition', `attachment; filename="${backupId}.backup"`);
            response.setHeader('Content-Length', backup.size.toString());
            const readStream = fs.createReadStream(backup.path);
            readStream.pipe(response);
            readStream.on('end', () => {
                this.loggingService.logBusinessEvent('backup_download_completed', {
                    backupId,
                    success: true,
                });
            });
            readStream.on('error', (error) => {
                this.loggingService.logError(error, { metadata: { operation: 'download_backup', backupId } });
                response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: {
                        code: 'DOWNLOAD_ERROR',
                        message: 'Failed to download backup file',
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.loggingService.logError(error, { metadata: { operation: 'download_backup', backupId } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'DOWNLOAD_ERROR',
                    message: 'Failed to download backup file',
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteBackup(backupId) {
        try {
            const backups = await this.backupService.listBackups();
            const backup = backups.find(b => b.id === backupId);
            if (!backup) {
                throw new common_1.HttpException({
                    success: false,
                    error: {
                        code: 'BACKUP_NOT_FOUND',
                        message: `Backup not found: ${backupId}`,
                    },
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const fs = require('fs').promises;
            try {
                await fs.unlink(backup.path);
            }
            catch (error) {
                this.loggingService.logError(error, { metadata: { operation: 'delete_backup_file', backupId, path: backup.path } });
            }
            const metadataPath = `./backups/metadata/${backupId}.json`;
            try {
                await fs.unlink(metadataPath);
            }
            catch (error) {
                this.loggingService.logError(error, { metadata: { operation: 'delete_backup_metadata', backupId, path: metadataPath } });
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
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.loggingService.logError(error, { metadata: { operation: 'delete_backup', backupId } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'DELETE_BACKUP_ERROR',
                    message: 'Failed to delete backup',
                    details: error.message,
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async cleanupOldBackups() {
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
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'cleanup_old_backups' } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'BACKUP_CLEANUP_ERROR',
                    message: 'Failed to cleanup old backups',
                    details: error.message,
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBackupAnalytics() {
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
                oldestBackup: backups.length > 0 ? backups.reduce((oldest, current) => current.timestamp < oldest.timestamp ? current : oldest).timestamp : null,
                newestBackup: backups.length > 0 ? backups.reduce((newest, current) => current.timestamp > newest.timestamp ? current : newest).timestamp : null,
                successRate: backups.length > 0 ? (backups.filter(b => b.status === 'completed').length / backups.length) * 100 : 0,
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
        }
        catch (error) {
            this.loggingService.logError(error, { metadata: { operation: 'get_backup_analytics' } });
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'BACKUP_ANALYTICS_ERROR',
                    message: 'Failed to get backup analytics',
                },
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "listBackups", null);
__decorate([
    (0, common_1.Get)('preflight'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getPreflight", null);
__decorate([
    (0, common_1.Get)(':backupId'),
    __param(0, (0, common_1.Param)('backupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupDetails", null);
__decorate([
    (0, common_1.Post)('full'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createFullBackup", null);
__decorate([
    (0, common_1.Post)('incremental'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createIncrementalBackup", null);
__decorate([
    (0, common_1.Post)('files'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createFileBackup", null);
__decorate([
    (0, common_1.Post)('restore/:backupId'),
    __param(0, (0, common_1.Param)('backupId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "restoreFromBackup", null);
__decorate([
    (0, common_1.Post)('restore/point-in-time'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "pointInTimeRecovery", null);
__decorate([
    (0, common_1.Get)(':backupId/download'),
    __param(0, (0, common_1.Param)('backupId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "downloadBackup", null);
__decorate([
    (0, common_1.Delete)(':backupId'),
    __param(0, (0, common_1.Param)('backupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteBackup", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "cleanupOldBackups", null);
__decorate([
    (0, common_1.Get)('analytics/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupAnalytics", null);
exports.BackupController = BackupController = __decorate([
    (0, common_1.Controller)('api/v1/backup'),
    __metadata("design:paramtypes", [backup_service_1.BackupService,
        logging_service_1.LoggingService])
], BackupController);
//# sourceMappingURL=backup.controller.js.map