import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

export enum BackupType {
  FULL = 'FULL',
  INCREMENTAL = 'INCREMENTAL',
  DIFFERENTIAL = 'DIFFERENTIAL',
}

export enum BackupStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  VERIFIED = 'VERIFIED',
}

export interface BackupMetadata {
  id: string;
  type: BackupType;
  status: BackupStatus;
  campaignId?: string;
  promotionId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // milliseconds
  recordCount: number;
  fileSize: number; // bytes
  checksum: string;
  location: string; // file path or S3 location
  compressed: boolean;
  encrypted: boolean;
  retentionDays: number;
  createdBy?: string;
  notes?: string;
}

export interface RestoreOptions {
  backupId: string;
  targetDate?: Date;
  validateOnly?: boolean;
  dryRun?: boolean;
  rollbackOnError?: boolean;
}

@Injectable()
export class PromotionBackupEnhancedService {
  private readonly logger = new Logger(PromotionBackupEnhancedService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups', 'promotions');
  private backupRegistry: Map<string, BackupMetadata> = new Map();

  constructor(private prisma: PrismaService) {
    this.initializeBackupDirectory();
  }

  /**
   * Create a full backup of all promotion data
   */
  async createFullBackup(createdBy?: string): Promise<BackupMetadata> {
    const backupId = uuidv4();
    const startTime = new Date();

    try {
      this.logger.log(`Starting full backup: ${backupId}`);

      const metadata: BackupMetadata = {
        id: backupId,
        type: BackupType.FULL,
        status: BackupStatus.IN_PROGRESS,
        startTime,
        recordCount: 0,
        fileSize: 0,
        checksum: '',
        location: '',
        compressed: true,
        encrypted: false,
        retentionDays: 90,
        createdBy,
      };

      // Fetch all promotion-related data
      const data = await this.gatherAllData();

      // Create backup file
      const backupData = JSON.stringify(data, null, 2);
      const filePath = await this.saveBackupFile(backupId, backupData, true);

      // Calculate metadata
      const fileStats = fs.statSync(filePath);
      metadata.fileSize = fileStats.size;
      metadata.recordCount = this.countRecords(data);
      metadata.checksum = this.calculateChecksum(backupData);
      metadata.location = filePath;
      metadata.endTime = new Date();
      metadata.duration = metadata.endTime.getTime() - startTime.getTime();
      metadata.status = BackupStatus.COMPLETED;

      // Save metadata
      this.backupRegistry.set(backupId, metadata);
      await this.saveBackupMetadata(metadata);

      this.logger.log(`Full backup completed: ${backupId}`);
      return metadata;
    } catch (error) {
      this.logger.error(`Full backup failed: ${(error as any).message}`);
      throw new BadRequestException(`Backup failed: ${(error as any).message}`);
    }
  }

  /**
   * Create an incremental backup (only changes since last backup)
   */
  async createIncrementalBackup(createdBy?: string): Promise<BackupMetadata> {
    const backupId = uuidv4();
    const startTime = new Date();

    try {
      const lastBackup = await this.getLastBackup();
      const lastBackupTime = lastBackup?.endTime || new Date(0);

      this.logger.log(`Starting incremental backup since ${lastBackupTime}`);

      const metadata: BackupMetadata = {
        id: backupId,
        type: BackupType.INCREMENTAL,
        status: BackupStatus.IN_PROGRESS,
        startTime,
        recordCount: 0,
        fileSize: 0,
        checksum: '',
        location: '',
        compressed: true,
        encrypted: false,
        retentionDays: 30,
        createdBy,
      };

      // Fetch only changed records
      const changes = await this.gatherChangedData(lastBackupTime);

      const backupData = JSON.stringify(changes, null, 2);
      const filePath = await this.saveBackupFile(backupId, backupData, true);

      const fileStats = fs.statSync(filePath);
      metadata.fileSize = fileStats.size;
      metadata.recordCount = this.countRecords(changes);
      metadata.checksum = this.calculateChecksum(backupData);
      metadata.location = filePath;
      metadata.endTime = new Date();
      metadata.duration = metadata.endTime.getTime() - startTime.getTime();
      metadata.status = BackupStatus.COMPLETED;

      this.backupRegistry.set(backupId, metadata);
      await this.saveBackupMetadata(metadata);

      this.logger.log(`Incremental backup completed: ${backupId}`);
      return metadata;
    } catch (error) {
      this.logger.error(`Incremental backup failed: ${(error as any).message}`);
      throw new BadRequestException(`Incremental backup failed: ${(error as any).message}`);
    }
  }

  /**
   * Create backup for a specific campaign
   */
  async createCampaignBackup(campaignId: string, createdBy?: string): Promise<BackupMetadata> {
    try {
      const campaign = await this.prisma.campaigns.findUnique({
        where: { id: campaignId },
        include: {
          campaign_promotions: { include: { promotions: true } },
          campaign_metrics: true,
        },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      const backupId = uuidv4();
      const startTime = new Date();

      const backupData = JSON.stringify({ campaign }, null, 2);
      const filePath = await this.saveBackupFile(backupId, backupData, true);

      const fileStats = fs.statSync(filePath);
      const metadata: BackupMetadata = {
        id: backupId,
        type: BackupType.FULL,
        status: BackupStatus.COMPLETED,
        campaignId,
        startTime,
        endTime: new Date(),
        duration: new Date().getTime() - startTime.getTime(),
        recordCount: 1,
        fileSize: fileStats.size,
        checksum: this.calculateChecksum(backupData),
        location: filePath,
        compressed: true,
        encrypted: false,
        retentionDays: 90,
        createdBy,
      };

      this.backupRegistry.set(backupId, metadata);
      await this.saveBackupMetadata(metadata);

      return metadata;
    } catch (error) {
      throw new BadRequestException(`Campaign backup failed: ${(error as any).message}`);
    }
  }

  /**
   * List all backups with filtering
   */
  async listBackups(filters?: {
    type?: BackupType;
    status?: BackupStatus;
    campaignId?: string;
    skip?: number;
    take?: number;
  }): Promise<{
    backups: BackupMetadata[];
    total: number;
  }> {
    try {
      let backups = Array.from(this.backupRegistry.values());

      if (filters?.type) {
        backups = backups.filter(b => b.type === filters.type);
      }

      if (filters?.status) {
        backups = backups.filter(b => b.status === filters.status);
      }

      if (filters?.campaignId) {
        backups = backups.filter(b => b.campaignId === filters.campaignId);
      }

      // Sort by start time descending
      backups.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

      const skip = filters?.skip || 0;
      const take = filters?.take || 20;

      return {
        backups: backups.slice(skip, skip + take),
        total: backups.length,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to list backups: ${(error as any).message}`);
    }
  }

  /**
   * Get backup details
   */
  async getBackupDetails(backupId: string): Promise<{
    metadata: BackupMetadata;
    preview?: any;
  }> {
    try {
      const metadata = this.backupRegistry.get(backupId);

      if (!metadata) {
        throw new NotFoundException('Backup not found');
      }

      // Load preview of backup content
      const preview = await this.loadBackupPreview(backupId);

      return { metadata, preview };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get backup details: ${(error as any).message}`);
    }
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(options: RestoreOptions): Promise<{
    success: boolean;
    recordsRestored: number;
    message: string;
  }> {
    try {
      const metadata = this.backupRegistry.get(options.backupId);

      if (!metadata) {
        throw new NotFoundException('Backup not found');
      }

      // Load backup file
      const backupContent = await this.loadBackupFile(options.backupId);
      const backupData = JSON.parse(backupContent);

      if (options.validateOnly) {
        return {
          success: true,
          recordsRestored: metadata.recordCount,
          message: `Backup is valid. Would restore ${metadata.recordCount} records.`,
        };
      }

      if (options.dryRun) {
        return {
          success: true,
          recordsRestored: 0,
          message: 'Dry run completed. No changes made.',
        };
      }

      // Perform restore
      const recordsRestored = await this.performRestore(backupData, options.rollbackOnError);

      this.logger.log(
        `Restore completed. ${recordsRestored} records restored from backup ${options.backupId}`,
      );

      return {
        success: true,
        recordsRestored,
        message: `Successfully restored ${recordsRestored} records from backup.`,
      };
    } catch (error) {
      this.logger.error(`Restore failed: ${(error as any).message}`);
      throw new BadRequestException(`Restore failed: ${(error as any).message}`);
    }
  }

  /**
   * Verify backup integrity
   */
  async verifyBackup(backupId: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const metadata = this.backupRegistry.get(backupId);

      if (!metadata) {
        throw new NotFoundException('Backup not found');
      }

      const errors: string[] = [];
      const warnings: string[] = [];

      // Check file existence
      if (!fs.existsSync(metadata.location)) {
        errors.push('Backup file not found');
        return { valid: false, errors, warnings };
      }

      // Check checksum
      const content = await this.loadBackupFile(backupId);
      const currentChecksum = this.calculateChecksum(content);

      if (currentChecksum !== metadata.checksum) {
        errors.push('Checksum mismatch - backup may be corrupted');
      }

      // Check retention
      const age = (Date.now() - metadata.startTime.getTime()) / (1000 * 60 * 60 * 24);
      if (age > metadata.retentionDays) {
        warnings.push(
          `Backup is ${Math.floor(age)} days old (retention: ${metadata.retentionDays} days)`,
        );
      }

      // Try parsing JSON
      try {
        JSON.parse(content);
      } catch (parseError) {
        errors.push('Backup file is not valid JSON');
      }

      if (metadata.status !== BackupStatus.VERIFIED) {
        await this.updateBackupStatus(backupId, BackupStatus.VERIFIED);
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      throw new BadRequestException(`Verification failed: ${(error as any).message}`);
    }
  }

  /**
   * Delete old backups based on retention policy
   */
  async cleanupOldBackups(): Promise<{
    deleted: number;
    freed: number; // bytes
  }> {
    try {
      const now = Date.now();
      let deleted = 0;
      let freed = 0;

      for (const [backupId, metadata] of this.backupRegistry.entries()) {
        const age = (now - metadata.startTime.getTime()) / (1000 * 60 * 60 * 24);

        if (age > metadata.retentionDays) {
          try {
            freed += metadata.fileSize;
            fs.unlinkSync(metadata.location);
            this.backupRegistry.delete(backupId);
            deleted++;
            this.logger.log(`Deleted old backup: ${backupId}`);
          } catch (error) {
            this.logger.warn(`Failed to delete backup ${backupId}: ${(error as any).message}`);
          }
        }
      }

      return { deleted, freed };
    } catch (error) {
      this.logger.error(`Cleanup failed: ${(error as any).message}`);
      throw new BadRequestException(`Cleanup failed: ${(error as any).message}`);
    }
  }

  /**
   * Get backup statistics
   */
  getBackupStats(): {
    totalBackups: number;
    completedBackups: number;
    failedBackups: number;
    totalSize: number;
    oldestBackup?: Date;
    newestBackup?: Date;
  } {
    const backups = Array.from(this.backupRegistry.values());

    const completed = backups.filter(b => b.status === BackupStatus.COMPLETED).length;
    const failed = backups.filter(b => b.status === BackupStatus.FAILED).length;
    const totalSize = backups.reduce((sum, b) => sum + b.fileSize, 0);

    const dates = backups.map(b => b.startTime).sort((a, b) => a.getTime() - b.getTime());

    return {
      totalBackups: backups.length,
      completedBackups: completed,
      failedBackups: failed,
      totalSize,
      oldestBackup: dates[0],
      newestBackup: dates[dates.length - 1],
    };
  }

  /**
   * Schedule automated backups
   */
  scheduleAutomatedBackups(intervalHours: number = 24): void {
    setInterval(
      async () => {
        try {
          this.logger.log(`Running scheduled backup...`);
          await this.createIncrementalBackup('SYSTEM');
        } catch (error) {
          this.logger.error(`Scheduled backup failed: ${(error as any).message}`);
        }
      },
      intervalHours * 60 * 60 * 1000,
    );

    this.logger.log(`Scheduled automated backups every ${intervalHours} hours`);
  }

  /**
   * Export backup for archive
   */
  async exportBackupForArchive(backupId: string): Promise<Buffer> {
    try {
      const metadata = this.backupRegistry.get(backupId);

      if (!metadata) {
        throw new NotFoundException('Backup not found');
      }

      const content = await this.loadBackupFile(backupId);

      // Create archive with metadata
      const archive = JSON.stringify({
        metadata,
        backup: JSON.parse(content),
        exportedAt: new Date(),
      });

      return Buffer.from(archive);
    } catch (error) {
      throw new BadRequestException(`Export failed: ${(error as any).message}`);
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async gatherAllData(): Promise<any> {
    const [campaigns, promotions, reviews] = await Promise.all([
      this.prisma.campaigns.findMany({
        include: {
          campaign_promotions: true,
          campaign_metrics: true,
        },
      }),
      this.prisma.promotions.findMany({
        include: {
          products: true,
          categories: true,
          customerUsage: true,
        },
      }),
      this.prisma.project_promotion_reviews.findMany(),
    ]);

    return { campaigns, promotions, reviews };
  }

  private async gatherChangedData(sinceTime: Date): Promise<any> {
    const [campaigns, promotions, reviews] = await Promise.all([
      this.prisma.campaigns.findMany({
        where: { updatedAt: { gte: sinceTime } },
        include: {
          campaign_promotions: true,
          campaign_metrics: true,
        },
      }),
      this.prisma.promotions.findMany({
        where: { updatedAt: { gte: sinceTime } },
      }),
      this.prisma.project_promotion_reviews.findMany({
        where: { updatedAt: { gte: sinceTime } },
      }),
    ]);

    return { campaigns, promotions, reviews };
  }

  private async saveBackupFile(
    backupId: string,
    content: string,
    compress: boolean = true,
  ): Promise<string> {
    const fileName = compress ? `${backupId}.json.gz` : `${backupId}.json`;
    const filePath = path.join(this.backupDir, fileName);

    if (compress) {
      return new Promise((resolve, reject) => {
        const gzip = zlib.createGzip();
        const stream = fs.createWriteStream(filePath);

        stream.on('finish', () => {
          resolve(filePath);
        });

        stream.on('error', reject);
        gzip.pipe(stream);
        gzip.write(content);
        gzip.end();
      });
    } else {
      fs.writeFileSync(filePath, content);
      return filePath;
    }
  }

  private async loadBackupFile(backupId: string): Promise<string> {
    let filePath = path.join(this.backupDir, `${backupId}.json.gz`);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(this.backupDir, `${backupId}.json`);
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Backup file not found');
    }

    if (filePath.endsWith('.gz')) {
      return new Promise((resolve, reject) => {
        const gunzip = zlib.createGunzip();
        let data = '';

        gunzip.on('data', chunk => {
          data += chunk;
        });

        gunzip.on('end', () => {
          resolve(data);
        });

        gunzip.on('error', reject);

        fs.createReadStream(filePath).pipe(gunzip);
      });
    } else {
      return fs.readFileSync(filePath, 'utf-8');
    }
  }

  private async loadBackupPreview(backupId: string, lines: number = 10): Promise<any> {
    try {
      const content = await this.loadBackupFile(backupId);
      const data = JSON.parse(content);

      // Return first few items as preview
      return {
        campaigns: Array.isArray(data.campaigns) ? data.campaigns.slice(0, lines) : null,
        promotions: Array.isArray(data.promotions) ? data.promotions.slice(0, lines) : null,
      };
    } catch {
      return null;
    }
  }

  private async performRestore(data: any, rollbackOnError: boolean): Promise<number> {
    let restored = 0;

    try {
      // Restore campaigns
      if (data.campaigns) {
        for (const campaign of data.campaigns) {
          try {
            await this.prisma.campaigns.upsert({
              where: { id: campaign.id },
              update: campaign,
              create: campaign,
            });
            restored++;
          } catch (error) {
            if (!rollbackOnError) {
              this.logger.warn(
                `Failed to restore campaign ${campaign.id}: ${(error as any).message}`,
              );
            } else {
              throw error;
            }
          }
        }
      }

      return restored;
    } catch (error) {
      if (rollbackOnError) {
        throw error;
      }
      return restored;
    }
  }

  private calculateChecksum(content: string): string {
    // Simple checksum implementation
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private countRecords(data: any): number {
    let count = 0;
    if (data.campaigns) count += data.campaigns.length;
    if (data.promotions) count += data.promotions.length;
    if (data.reviews) count += data.reviews.length;
    return count;
  }

  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const metadataPath = path.join(this.backupDir, `${metadata.id}.metadata.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  }

  private async getLastBackup(): Promise<BackupMetadata | null> {
    const backups = Array.from(this.backupRegistry.values()).sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime(),
    );

    return backups[0] || null;
  }

  private async updateBackupStatus(backupId: string, status: BackupStatus): Promise<void> {
    const metadata = this.backupRegistry.get(backupId);
    if (metadata) {
      metadata.status = status;
      await this.saveBackupMetadata(metadata);
    }
  }

  private initializeBackupDirectory(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      this.logger.log(`Created backup directory: ${this.backupDir}`);
    }
  }
}
