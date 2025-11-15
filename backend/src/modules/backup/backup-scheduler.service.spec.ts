import { Test, TestingModule } from "@nestjs/testing";
import { BackupSchedulerService } from "./backup-scheduler.service";
import { ConfigService } from "@nestjs/config";
import { BackupService } from "./backup.service";
import { LoggingService } from "../logging/logging.service";
import { Logger } from "@nestjs/common";

describe("BackupSchedulerService", () => {
  let service: BackupSchedulerService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockBackupService = {
    createFullBackup: jest.fn().mockResolvedValue({ backupId: "b1", size: 100, duration: 100 }),
    createIncrementalBackup: jest.fn().mockResolvedValue({ backupId: "b2", size: 10, duration: 20 }),
    createFileBackup: jest.fn().mockResolvedValue({ backupId: "b3", size: 20, duration: 50 }),
  };

  const mockLoggingService = {
    logBusinessEvent: jest.fn(),
    logError: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    // ensure test env
    process.env.NODE_ENV = "test";

    // spy on Nest Logger's warn so we can assert it's not called
    jest.spyOn(Logger.prototype, "warn").mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupSchedulerService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: BackupService, useValue: mockBackupService },
        { provide: LoggingService, useValue: mockLoggingService },
      ],
    }).compile();

    service = module.get<BackupSchedulerService>(BackupSchedulerService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes schedules and does not warn about cron when in test env", async () => {
    await service.onModuleInit();

    // 3 default schedules expected
    const schedules = service.getAllSchedules();
    expect(schedules.length).toBeGreaterThanOrEqual(3);

    // The logger.warn should not be called in test environment
    expect(Logger.prototype.warn).not.toHaveBeenCalled();
  });
});
