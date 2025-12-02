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
var BackupSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const backup_service_1 = require("./backup.service");
const logging_service_1 = require("../logging/logging.service");
let CronJobCtor = null;
let isCronAvailable = false;
try {
    const cronModule = require("cron");
    CronJobCtor = cronModule.CronJob;
    isCronAvailable = true;
}
catch (error) {
    isCronAvailable = false;
    CronJobCtor = null;
}
let BackupSchedulerService = BackupSchedulerService_1 = class BackupSchedulerService {
    constructor(configService, backupService, loggingService) {
        this.configService = configService;
        this.backupService = backupService;
        this.loggingService = loggingService;
        this.logger = new common_1.Logger(BackupSchedulerService_1.name);
        this.schedules = new Map();
        this.cronJobs = new Map();
        this.isShuttingDown = false;
    }
    async onModuleInit() {
        await this.initializeDefaultSchedules();
        if (isCronAvailable) {
            this.startAllSchedules();
        }
        else {
            if (process.env.NODE_ENV !== 'test') {
                this.logger.warn('Cron package not available - backup schedules created but not automatically executed. Install "cron" package to enable automatic scheduling.');
            }
        }
    }
    async onModuleDestroy() {
        this.isShuttingDown = true;
        await this.stopAllSchedules();
    }
    async initializeDefaultSchedules() {
        const defaultSchedules = [
            {
                id: "full_backup_daily",
                name: "Daily Full Backup",
                type: "full",
                cronExpression: "0 2 * * *",
                enabled: true,
                options: {
                    includeFiles: true,
                    compress: true,
                    encrypt: false,
                    retentionDays: 30,
                    comment: "Automated daily full backup",
                },
            },
            {
                id: "incremental_backup_hourly",
                name: "Hourly Incremental Backup",
                type: "incremental",
                cronExpression: "0 * * * *",
                enabled: true,
                options: {
                    compress: true,
                    comment: "Automated hourly incremental backup",
                },
            },
            {
                id: "file_backup_weekly",
                name: "Weekly File Backup",
                type: "files",
                cronExpression: "0 3 * * 0",
                enabled: true,
                options: {
                    compress: true,
                    comment: "Automated weekly file backup",
                },
            },
        ];
        const configuredSchedules = this.configService.get("BACKUP_SCHEDULES") || defaultSchedules;
        for (const schedule of configuredSchedules) {
            await this.createSchedule(schedule);
        }
        this.logger.log(`Initialized ${this.schedules.size} backup schedules`);
    }
    async createSchedule(scheduleData) {
        const schedule = {
            id: scheduleData.id || `schedule_${Date.now()}`,
            name: scheduleData.name || "Unnamed Schedule",
            type: scheduleData.type || "full",
            cronExpression: scheduleData.cronExpression || "0 2 * * *",
            enabled: scheduleData.enabled ?? true,
            options: scheduleData.options || {},
            status: "inactive",
        };
        schedule.nextRun = this.calculateNextRun(schedule.cronExpression);
        this.schedules.set(schedule.id, schedule);
        if (schedule.enabled) {
            this.createCronJob(schedule);
        }
        this.loggingService.logBusinessEvent("backup_schedule_created", {
            scheduleId: schedule.id,
            scheduleName: schedule.name,
            type: schedule.type,
            cronExpression: schedule.cronExpression,
        });
        return schedule;
    }
    async updateSchedule(scheduleId, updates) {
        const schedule = this.schedules.get(scheduleId);
        if (!schedule) {
            throw new Error(`Schedule not found: ${scheduleId}`);
        }
        await this.stopSchedule(scheduleId);
        Object.assign(schedule, updates);
        if (updates.cronExpression) {
            schedule.nextRun = this.calculateNextRun(schedule.cronExpression);
        }
        if (schedule.enabled) {
            this.createCronJob(schedule);
        }
        this.loggingService.logBusinessEvent("backup_schedule_updated", {
            scheduleId,
            updates,
        });
        return schedule;
    }
    async deleteSchedule(scheduleId) {
        const schedule = this.schedules.get(scheduleId);
        if (!schedule) {
            return false;
        }
        await this.stopSchedule(scheduleId);
        this.schedules.delete(scheduleId);
        this.loggingService.logBusinessEvent("backup_schedule_deleted", {
            scheduleId,
            scheduleName: schedule.name,
        });
        return true;
    }
    async enableSchedule(scheduleId) {
        const schedule = this.schedules.get(scheduleId);
        if (!schedule) {
            return false;
        }
        schedule.enabled = true;
        schedule.status = "active";
        this.createCronJob(schedule);
        this.loggingService.logBusinessEvent("backup_schedule_enabled", {
            scheduleId,
            scheduleName: schedule.name,
        });
        return true;
    }
    async disableSchedule(scheduleId) {
        const schedule = this.schedules.get(scheduleId);
        if (!schedule) {
            return false;
        }
        schedule.enabled = false;
        await this.stopSchedule(scheduleId);
        this.loggingService.logBusinessEvent("backup_schedule_disabled", {
            scheduleId,
            scheduleName: schedule.name,
        });
        return true;
    }
    getAllSchedules() {
        return Array.from(this.schedules.values());
    }
    getSchedule(scheduleId) {
        return this.schedules.get(scheduleId);
    }
    startAllSchedules() {
        for (const schedule of this.schedules.values()) {
            if (schedule.enabled) {
                this.createCronJob(schedule);
            }
        }
        this.logger.log("All backup schedules started");
    }
    async stopAllSchedules() {
        for (const scheduleId of this.schedules.keys()) {
            await this.stopSchedule(scheduleId);
        }
        this.logger.log("All backup schedules stopped");
    }
    createCronJob(schedule) {
        try {
            if (!isCronAvailable || !CronJobCtor) {
                if (process.env.NODE_ENV !== 'test') {
                    this.logger.warn(`Cron scheduling not available for schedule: ${schedule.name}. Install 'cron' package to enable automatic backups.`);
                }
                schedule.status = "inactive";
                schedule.errorMessage = "cron package not available";
                return;
            }
            const cronJob = new CronJobCtor(schedule.cronExpression, async () => {
                if (this.isShuttingDown)
                    return;
                await this.executeScheduledBackup(schedule);
            }, null, false, "UTC");
            this.cronJobs.set(schedule.id, cronJob);
            cronJob.start();
            schedule.status = "active";
            this.logger.log(`Created cron job for schedule: ${schedule.name} (${schedule.cronExpression})`);
        }
        catch (error) {
            this.logger.error(`Failed to create cron job for schedule: ${schedule.name}`, error);
            schedule.status = "error";
            schedule.errorMessage = error.message;
        }
    }
    async stopSchedule(scheduleId) {
        const cronJob = this.cronJobs.get(scheduleId);
        if (cronJob) {
            cronJob.stop();
            this.cronJobs.delete(scheduleId);
        }
        const schedule = this.schedules.get(scheduleId);
        if (schedule) {
            schedule.status = "inactive";
        }
    }
    async executeScheduledBackup(schedule) {
        const startTime = Date.now();
        schedule.status = "running";
        try {
            this.loggingService.logBusinessEvent("scheduled_backup_started", {
                scheduleId: schedule.id,
                scheduleName: schedule.name,
                type: schedule.type,
            });
            let result;
            switch (schedule.type) {
                case "full":
                    result = await this.backupService.createFullBackup(schedule.options);
                    break;
                case "incremental":
                    result = await this.backupService.createIncrementalBackup(schedule.options);
                    break;
                case "files":
                    const backupId = `scheduled_files_${Date.now()}`;
                    result = await this.backupService.createFileBackup(backupId, schedule.options);
                    break;
                default:
                    throw new Error(`Unknown backup type: ${schedule.type}`);
            }
            schedule.lastRun = new Date();
            schedule.nextRun = this.calculateNextRun(schedule.cronExpression);
            schedule.status = "active";
            schedule.errorMessage = undefined;
            this.loggingService.logBusinessEvent("scheduled_backup_completed", {
                scheduleId: schedule.id,
                scheduleName: schedule.name,
                backupId: result.backupId,
                size: result.size,
                duration: result.duration,
                success: true,
            });
        }
        catch (error) {
            schedule.status = "error";
            schedule.errorMessage = error.message;
            schedule.nextRun = this.calculateNextRun(schedule.cronExpression);
            this.loggingService.logError(error, {
                metadata: {
                    operation: "scheduled_backup",
                    scheduleId: schedule.id,
                    scheduleName: schedule.name,
                    type: schedule.type,
                },
            });
            this.loggingService.logBusinessEvent("scheduled_backup_failed", {
                scheduleId: schedule.id,
                scheduleName: schedule.name,
                error: error.message,
                duration: Date.now() - startTime,
            });
        }
    }
    calculateNextRun(cronExpression) {
        try {
            if (!isCronAvailable || !CronJobCtor) {
                return new Date(Date.now() + 24 * 60 * 60 * 1000);
            }
            const cronJob = new CronJobCtor(cronExpression, () => { }, null, false, "UTC");
            return cronJob.nextDate().toJSDate();
        }
        catch (error) {
            this.logger.error(`Invalid cron expression: ${cronExpression}`, error);
            return new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
    }
    getSchedulerStats() {
        const activeSchedules = Array.from(this.schedules.values()).filter((s) => s.enabled);
        const runningSchedules = Array.from(this.schedules.values()).filter((s) => s.status === "running");
        const errorSchedules = Array.from(this.schedules.values()).filter((s) => s.status === "error");
        return {
            totalSchedules: this.schedules.size,
            activeSchedules: activeSchedules.length,
            runningSchedules: runningSchedules.length,
            errorSchedules: errorSchedules.length,
            cronJobsRunning: this.cronJobs.size,
            nextScheduledBackup: this.getNextScheduledBackup(),
        };
    }
    getNextScheduledBackup() {
        const activeSchedules = Array.from(this.schedules.values()).filter((s) => s.enabled);
        if (activeSchedules.length === 0) {
            return null;
        }
        const nextRuns = activeSchedules
            .map((s) => s.nextRun)
            .filter((date) => date !== undefined);
        if (nextRuns.length === 0) {
            return null;
        }
        return new Date(Math.min(...nextRuns.map((d) => d.getTime())));
    }
    async forceRunSchedule(scheduleId) {
        const schedule = this.schedules.get(scheduleId);
        if (!schedule) {
            return false;
        }
        setImmediate(() => {
            this.executeScheduledBackup(schedule);
        });
        this.loggingService.logBusinessEvent("schedule_force_run", {
            scheduleId,
            scheduleName: schedule.name,
        });
        return true;
    }
    validateCronExpression(cronExpression) {
        try {
            if (!CronJobCtor)
                return false;
            new CronJobCtor(cronExpression, () => { });
            return true;
        }
        catch {
            return false;
        }
    }
    getScheduleHistory(_scheduleId) {
        return [];
    }
    isHealthy() {
        return !this.isShuttingDown;
    }
    getDetailedStatus() {
        const schedules = Array.from(this.schedules.values());
        const cronJobs = Array.from(this.cronJobs.keys());
        return {
            isHealthy: this.isHealthy(),
            isShuttingDown: this.isShuttingDown,
            totalSchedules: schedules.length,
            schedulesByType: schedules.reduce((acc, schedule) => {
                acc[schedule.type] = (acc[schedule.type] || 0) + 1;
                return acc;
            }, {}),
            schedulesByStatus: schedules.reduce((acc, schedule) => {
                acc[schedule.status] = (acc[schedule.status] || 0) + 1;
                return acc;
            }, {}),
            activeCronJobs: cronJobs.length,
            nextBackup: this.getNextScheduledBackup(),
            schedules: schedules.map((s) => ({
                id: s.id,
                name: s.name,
                type: s.type,
                enabled: s.enabled,
                status: s.status,
                lastRun: s.lastRun,
                nextRun: s.nextRun,
                cronExpression: s.cronExpression,
            })),
        };
    }
};
exports.BackupSchedulerService = BackupSchedulerService;
exports.BackupSchedulerService = BackupSchedulerService = BackupSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        backup_service_1.BackupService,
        logging_service_1.LoggingService])
], BackupSchedulerService);
//# sourceMappingURL=backup-scheduler.service.js.map