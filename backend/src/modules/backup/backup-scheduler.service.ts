import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BackupService } from "./backup.service";
import { LoggingService } from "../logging/logging.service";

// Optional cron integration; gracefully degrade if not installed
let CronJobCtor: any = null;
let isCronAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cronModule = require("cron");
  CronJobCtor = cronModule.CronJob;
  isCronAvailable = true;
} catch (error) {
  // Cron package not installed - this is fine, we'll work without scheduling
  isCronAvailable = false;
  CronJobCtor = null;
}

export interface BackupSchedule {
  id: string;
  name: string;
  type: "full" | "incremental" | "files";
  cronExpression: string;
  enabled: boolean;
  options: {
    includeFiles?: boolean;
    compress?: boolean;
    encrypt?: boolean;
    retentionDays?: number;
    comment?: string;
  };
  lastRun?: Date;
  nextRun?: Date;
  status: "active" | "inactive" | "running" | "error";
  errorMessage?: string;
}

@Injectable()
export class BackupSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BackupSchedulerService.name);
  private schedules: Map<string, BackupSchedule> = new Map();
  private cronJobs: Map<string, any> = new Map();
  private isShuttingDown = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly backupService: BackupService,
    private readonly loggingService: LoggingService,
  ) {}

  async onModuleInit() {
    // Initialize backup schedules (will work without cron for manual backups)
    await this.initializeDefaultSchedules();

    if (isCronAvailable) {
      this.startAllSchedules();
    } else {
      this.logger.warn(
        'Cron package not available - backup schedules created but not automatically executed. Install "cron" package to enable automatic scheduling.',
      );
    }
  }

  async onModuleDestroy() {
    this.isShuttingDown = true;
    await this.stopAllSchedules();
  }

  // Initialize default backup schedules
  private async initializeDefaultSchedules() {
    const defaultSchedules: Partial<BackupSchedule>[] = [
      {
        id: "full_backup_daily",
        name: "Daily Full Backup",
        type: "full",
        cronExpression: "0 2 * * *", // Daily at 2 AM
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
        cronExpression: "0 * * * *", // Every hour
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
        cronExpression: "0 3 * * 0", // Weekly on Sunday at 3 AM
        enabled: true,
        options: {
          compress: true,
          comment: "Automated weekly file backup",
        },
      },
    ];

    // Load schedules from configuration or use defaults
    const configuredSchedules =
      this.configService.get("BACKUP_SCHEDULES") || defaultSchedules;

    for (const schedule of configuredSchedules) {
      await this.createSchedule(schedule);
    }

    this.logger.log(`Initialized ${this.schedules.size} backup schedules`);
  }

  // Create a new backup schedule
  async createSchedule(
    scheduleData: Partial<BackupSchedule>,
  ): Promise<BackupSchedule> {
    const schedule: BackupSchedule = {
      id: scheduleData.id || `schedule_${Date.now()}`,
      name: scheduleData.name || "Unnamed Schedule",
      type: scheduleData.type || "full",
      cronExpression: scheduleData.cronExpression || "0 2 * * *",
      enabled: scheduleData.enabled ?? true,
      options: scheduleData.options || {},
      status: "inactive",
    };

    // Calculate next run time
    schedule.nextRun = this.calculateNextRun(schedule.cronExpression);

    this.schedules.set(schedule.id, schedule);

    // Create cron job if enabled
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

  // Update an existing schedule
  async updateSchedule(
    scheduleId: string,
    updates: Partial<BackupSchedule>,
  ): Promise<BackupSchedule> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      throw new Error(`Schedule not found: ${scheduleId}`);
    }

    // Stop existing cron job
    await this.stopSchedule(scheduleId);

    // Update schedule
    Object.assign(schedule, updates);

    // Recalculate next run if cron expression changed
    if (updates.cronExpression) {
      schedule.nextRun = this.calculateNextRun(schedule.cronExpression);
    }

    // Create new cron job if enabled
    if (schedule.enabled) {
      this.createCronJob(schedule);
    }

    this.loggingService.logBusinessEvent("backup_schedule_updated", {
      scheduleId,
      updates,
    });

    return schedule;
  }

  // Delete a schedule
  async deleteSchedule(scheduleId: string): Promise<boolean> {
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

  // Enable a schedule
  async enableSchedule(scheduleId: string): Promise<boolean> {
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

  // Disable a schedule
  async disableSchedule(scheduleId: string): Promise<boolean> {
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

  // Get all schedules
  getAllSchedules(): BackupSchedule[] {
    return Array.from(this.schedules.values());
  }

  // Get schedule by ID
  getSchedule(scheduleId: string): BackupSchedule | undefined {
    return this.schedules.get(scheduleId);
  }

  // Start all enabled schedules
  private startAllSchedules() {
    for (const schedule of this.schedules.values()) {
      if (schedule.enabled) {
        this.createCronJob(schedule);
      }
    }
    this.logger.log("All backup schedules started");
  }

  // Stop all schedules
  private async stopAllSchedules() {
    for (const scheduleId of this.schedules.keys()) {
      await this.stopSchedule(scheduleId);
    }
    this.logger.log("All backup schedules stopped");
  }

  // Create cron job for a schedule
  private createCronJob(schedule: BackupSchedule) {
    try {
      if (!isCronAvailable || !CronJobCtor) {
        this.logger.warn(
          `Cron scheduling not available for schedule: ${schedule.name}. Install 'cron' package to enable automatic backups.`,
        );
        schedule.status = "inactive";
        schedule.errorMessage = "cron package not available";
        return;
      }

      const cronJob = new CronJobCtor(
        schedule.cronExpression,
        async () => {
          if (this.isShuttingDown) return;

          await this.executeScheduledBackup(schedule);
        },
        null, // onComplete
        false, // start immediately
        "UTC", // timezone
      );

      this.cronJobs.set(schedule.id, cronJob);
      cronJob.start();

      schedule.status = "active";

      this.logger.log(
        `Created cron job for schedule: ${schedule.name} (${schedule.cronExpression})`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to create cron job for schedule: ${schedule.name}`,
        error,
      );
      schedule.status = "error";
      schedule.errorMessage = error.message;
    }
  }

  // Stop a specific schedule
  private async stopSchedule(scheduleId: string): Promise<void> {
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

  // Execute scheduled backup
  private async executeScheduledBackup(schedule: BackupSchedule) {
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
          result = await this.backupService.createIncrementalBackup(
            schedule.options,
          );
          break;
        case "files":
          const backupId = `scheduled_files_${Date.now()}`;
          result = await this.backupService.createFileBackup(
            backupId,
            schedule.options,
          );
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
    } catch (error: any) {
      schedule.status = "error";
      schedule.errorMessage = error.message;
      schedule.nextRun = this.calculateNextRun(schedule.cronExpression);

      this.loggingService.logError(error as any, {
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

  // Calculate next run time from cron expression
  private calculateNextRun(cronExpression: string): Date {
    // Since cron package is not installed, return a default next run time
    // This is a fallback implementation
    try {
      if (!isCronAvailable || !CronJobCtor) {
        // Default to 24 hours from now
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      }

      const cronJob = new CronJobCtor(
        cronExpression,
        () => {}, // dummy callback
        null,
        false,
        "UTC",
      );

      return cronJob.nextDate().toJSDate();
    } catch (error: any) {
      this.logger.error(`Invalid cron expression: ${cronExpression}`, error);
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours from now
    }
  }

  // Get scheduler statistics
  getSchedulerStats() {
    const activeSchedules = Array.from(this.schedules.values()).filter(
      (s) => s.enabled,
    );
    const runningSchedules = Array.from(this.schedules.values()).filter(
      (s) => s.status === "running",
    );
    const errorSchedules = Array.from(this.schedules.values()).filter(
      (s) => s.status === "error",
    );

    return {
      totalSchedules: this.schedules.size,
      activeSchedules: activeSchedules.length,
      runningSchedules: runningSchedules.length,
      errorSchedules: errorSchedules.length,
      cronJobsRunning: this.cronJobs.size,
      nextScheduledBackup: this.getNextScheduledBackup(),
    };
  }

  // Get next scheduled backup time
  private getNextScheduledBackup(): Date | null {
    const activeSchedules = Array.from(this.schedules.values()).filter(
      (s) => s.enabled,
    );

    if (activeSchedules.length === 0) {
      return null;
    }

    const nextRuns = activeSchedules
      .map((s) => s.nextRun)
      .filter((date) => date !== undefined) as Date[];

    if (nextRuns.length === 0) {
      return null;
    }

    return new Date(Math.min(...nextRuns.map((d) => d.getTime())));
  }

  // Force run a schedule immediately
  async forceRunSchedule(scheduleId: string): Promise<boolean> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      return false;
    }

    // Execute backup in background
    setImmediate(() => {
      this.executeScheduledBackup(schedule);
    });

    this.loggingService.logBusinessEvent("schedule_force_run", {
      scheduleId,
      scheduleName: schedule.name,
    });

    return true;
  }

  // Validate cron expression
  validateCronExpression(cronExpression: string): boolean {
    try {
      if (!CronJobCtor) return false;
      new CronJobCtor(cronExpression, () => {});
      return true;
    } catch {
      return false;
    }
  }

  // Get schedule execution history
  getScheduleHistory(_scheduleId: string): any[] {
    // This would integrate with logging to get historical execution data
    // For now, return empty array
    return [];
  }

  // Health check for scheduler
  isHealthy(): boolean {
    return !this.isShuttingDown;
  }

  // Get detailed status for monitoring
  getDetailedStatus() {
    const schedules = Array.from(this.schedules.values());
    const cronJobs = Array.from(this.cronJobs.keys());

    return {
      isHealthy: this.isHealthy(),
      isShuttingDown: this.isShuttingDown,
      totalSchedules: schedules.length,
      schedulesByType: schedules.reduce(
        (acc, schedule) => {
          acc[schedule.type] = (acc[schedule.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      schedulesByStatus: schedules.reduce(
        (acc, schedule) => {
          acc[schedule.status] = (acc[schedule.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
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
}
