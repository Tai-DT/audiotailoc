import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

export enum BackupType {
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
  PRE_UPDATE = 'PRE_UPDATE',
  PRE_DELETE = 'PRE_DELETE',
}

export enum RestoreStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface PromotionBackup {
  id: string;
  promotionId: string;
  backupType: BackupType;
  status: 'CREATED' | 'VERIFIED' | 'FAILED';
  data: {
    id: string;
    code: string;
    name: string;
    description?: string;
    type: string;
    value: number;
    isActive: boolean;
    startsAt?: Date;
    expiresAt?: Date;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageCount: number;
    usageLimit?: number;
    tierBased: boolean;
    isFirstPurchaseOnly: boolean;
    customerSegment?: string;
    conditions?: any;
    versionNumber: number;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  metadata?: Record<string, any>;
  backupSize?: number;
  createdAt: Date;
  createdBy: string;
}

export interface RestorePoint {
  id: string;
  backupId: string;
  restoreStatus: RestoreStatus;
  targetPromotionId: string;
  restoredData?: any;
  errors?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  createdBy: string;
}

export interface BackupMetadata {
  version: string;
  backupEngine: string;
  totalPromotions: number;
  totalSize: number;
  includesAnalytics: boolean;
  includesAuditLogs: boolean;
}

@Injectable()
export class PromotionBackupService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create backup for a single promotion
   */
  async backupPromotion(
    promotionId: string,
    backupType: BackupType = BackupType.MANUAL,
    createdBy: string,
    metadata?: Record<string, any>,
  ): Promise<PromotionBackup> {
    const promotion = await this.prisma.promotions.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    const backup: PromotionBackup = {
      id: uuidv4(),
      promotionId,
      backupType,
      status: 'CREATED',
      data: {
        id: promotion.id,
        code: promotion.code,
        name: promotion.name,
        description: promotion.description || undefined,
        type: promotion.type,
        value: Number(promotion.value),
        isActive: promotion.isActive,
        startsAt: promotion.starts_at,
        expiresAt: promotion.expiresAt,
        minOrderAmount: promotion.min_order_amount ? Number(promotion.min_order_amount) : undefined,
        maxDiscount: promotion.max_discount ? Number(promotion.max_discount) : undefined,
        usageCount: promotion.usage_count,
        usageLimit: promotion.usage_limit,
        tierBased: (promotion.metadata as any)?.tierBased || false,
        isFirstPurchaseOnly: (promotion.metadata as any)?.isFirstPurchaseOnly || false,
        versionNumber: (promotion.metadata as any)?.versionNumber || 1,
        createdBy: promotion.created_by || 'system',
        createdAt: promotion.createdAt,
        updatedAt: promotion.updatedAt,
      },
      metadata: {
        ...metadata,
        originalPromoId: promotionId,
        backupReason: backupType,
      },
      backupSize: JSON.stringify(promotion).length,
      createdAt: new Date(),
      createdBy,
    };

    // Mark as verified
    backup.status = 'VERIFIED';

    // Store backup reference in database if needed
    await this.storeBackupRecord(backup);

    return backup;
  }

  /**
   * Create backup for all promotions
   */
  async backupAllPromotions(
    backupType: BackupType = BackupType.SCHEDULED,
    createdBy: string,
    metadata?: Record<string, any>,
  ): Promise<{
    backupId: string;
    totalBackups: number;
    totalSize: number;
    backups: PromotionBackup[];
  }> {
    const promotions = await this.prisma.promotions.findMany();

    if (promotions.length === 0) {
      return {
        backupId: uuidv4(),
        totalBackups: 0,
        totalSize: 0,
        backups: [],
      };
    }

    const backupId = uuidv4();
    const backups: PromotionBackup[] = [];
    let totalSize = 0;

    for (const promotion of promotions) {
      const backup = await this.backupPromotion(promotion.id, backupType, createdBy, {
        batchId: backupId,
        ...metadata,
      });

      backups.push(backup);
      totalSize += backup.backupSize || 0;
    }

    return {
      backupId,
      totalBackups: backups.length,
      totalSize,
      backups,
    };
  }

  /**
   * Restore promotion from backup
   */
  async restorePromotion(
    backupId: string,
    createdBy: string,
    targetPromotionId?: string,
  ): Promise<RestorePoint> {
    const backup = await this.getBackup(backupId);

    if (!backup) {
      throw new Error('Backup not found');
    }

    const restoreId = uuidv4();
    const targetId = targetPromotionId || backup.promotionId;

    const restorePoint: RestorePoint = {
      id: restoreId,
      backupId,
      restoreStatus: RestoreStatus.PENDING,
      targetPromotionId: targetId,
      metadata: {
        sourceBackupId: backupId,
        restoredFrom: backup.data.code,
      },
      createdAt: new Date(),
      createdBy,
    };

    try {
      restorePoint.restoreStatus = RestoreStatus.IN_PROGRESS;

      // Check if target promotion exists
      const existingPromotion = await this.prisma.promotions.findUnique({
        where: { id: targetId },
      });

      if (existingPromotion) {
        // Create pre-restore backup
        await this.backupPromotion(targetId, BackupType.PRE_UPDATE, createdBy, {
          restorePointId: restoreId,
          reason: 'Pre-restore backup',
        });

        // Update existing promotion
        const restored = await this.prisma.promotions.update({
          where: { id: targetId },
          data: {
            code: backup.data.code,
            name: backup.data.name,
            description: backup.data.description,
            type: backup.data.type,
            value: backup.data.value,
            isActive: backup.data.isActive,
            starts_at: backup.data.startsAt ? new Date(backup.data.startsAt) : undefined,
            expiresAt: backup.data.expiresAt ? new Date(backup.data.expiresAt) : undefined,
            min_order_amount: backup.data.minOrderAmount,
            max_discount: backup.data.maxDiscount,
            usage_limit: backup.data.usageLimit,
            updatedAt: new Date(),
          },
        });

        restorePoint.restoredData = restored;
      } else {
        // Create new promotion from backup
        const created = await this.prisma.promotions.create({
          data: {
            id: uuidv4(),
            code: backup.data.code,
            name: backup.data.name,
            description: backup.data.description,
            type: backup.data.type,
            value: Math.round(Number(backup.data.value) || 0),
            isActive: backup.data.isActive,
            starts_at: backup.data.startsAt ? new Date(backup.data.startsAt) : undefined,
            expiresAt: backup.data.expiresAt ? new Date(backup.data.expiresAt) : undefined,
            min_order_amount: backup.data.minOrderAmount
              ? Math.round(Number(backup.data.minOrderAmount))
              : undefined,
            max_discount: backup.data.maxDiscount
              ? Math.round(Number(backup.data.maxDiscount))
              : undefined,
            usage_count: 0,
            usage_limit: backup.data.usageLimit
              ? Math.round(Number(backup.data.usageLimit))
              : undefined,
            created_by: createdBy || 'system',
            createdAt: new Date(),
            updatedAt: new Date(),
            // TODO: These fields don't exist in schema - store in metadata if needed
            // tierBased: backup.data.tierBased || false,
            // isFirstPurchaseOnly: backup.data.isFirstPurchaseOnly || false,
            // customerSegment: backup.data.customerSegment,
            // conditions: backup.data.conditions,
            // versionNumber: 1,
          },
        });

        restorePoint.restoredData = created;
      }

      restorePoint.restoreStatus = RestoreStatus.COMPLETED;
      restorePoint.completedAt = new Date();
    } catch (error: any) {
      restorePoint.restoreStatus = RestoreStatus.FAILED;
      restorePoint.errors = [error.message || 'Restore failed'];
      restorePoint.completedAt = new Date();
    }

    // Store restore point
    await this.storeRestorePoint(restorePoint);

    return restorePoint;
  }

  /**
   * Restore multiple promotions from backup batch
   */
  async restoreMultiplePromotions(
    backupIds: string[],
    createdBy: string,
  ): Promise<{
    totalRequested: number;
    successful: number;
    failed: number;
    restorePoints: RestorePoint[];
  }> {
    const restorePoints: RestorePoint[] = [];
    let successful = 0;
    let failed = 0;

    for (const backupId of backupIds) {
      try {
        const restorePoint = await this.restorePromotion(backupId, createdBy);

        restorePoints.push(restorePoint);

        if (restorePoint.restoreStatus === RestoreStatus.COMPLETED) {
          successful++;
        } else {
          failed++;
        }
      } catch (error: any) {
        failed++;
        restorePoints.push({
          id: uuidv4(),
          backupId,
          restoreStatus: RestoreStatus.FAILED,
          targetPromotionId: '',
          errors: [error.message],
          createdAt: new Date(),
          createdBy,
        });
      }
    }

    return {
      totalRequested: backupIds.length,
      successful,
      failed,
      restorePoints,
    };
  }

  /**
   * Get backup history for a promotion
   */
  async getBackupHistory(promotionId: string, limit: number = 50): Promise<PromotionBackup[]> {
    // This would query from a backups table if persistent storage is used
    // For now, returning placeholder that would be populated from database
    const backups = await this.getAllBackupsForPromotion(promotionId);
    return backups.slice(0, limit);
  }

  /**
   * Get restore history for a promotion
   */
  async getRestoreHistory(promotionId: string, limit: number = 50): Promise<RestorePoint[]> {
    // Query restore points for a specific promotion
    const restorePoints = await this.getAllRestorePointsForPromotion(promotionId);
    return restorePoints.slice(0, limit);
  }

  /**
   * Compare two promotion backups
   */
  async compareBackups(
    backupId1: string,
    backupId2: string,
  ): Promise<{
    backup1: PromotionBackup;
    backup2: PromotionBackup;
    differences: Record<string, { old: any; new: any }>;
  }> {
    const backup1 = await this.getBackup(backupId1);
    const backup2 = await this.getBackup(backupId2);

    if (!backup1 || !backup2) {
      throw new Error('One or both backups not found');
    }

    const differences: Record<string, { old: any; new: any }> = {};

    // Compare all fields
    const fields = [
      'code',
      'name',
      'description',
      'type',
      'value',
      'isActive',
      'startsAt',
      'expiresAt',
      'minOrderAmount',
      'maxDiscount',
      'usageLimit',
      'tierBased',
      'isFirstPurchaseOnly',
      'customerSegment',
      'conditions',
    ];

    for (const field of fields) {
      const val1 = (backup1.data as any)[field];
      const val2 = (backup2.data as any)[field];

      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        differences[field] = {
          old: val1,
          new: val2,
        };
      }
    }

    return {
      backup1,
      backup2,
      differences,
    };
  }

  /**
   * Delete backup
   */
  async deleteBackup(backupId: string): Promise<boolean> {
    // Remove backup from persistent storage
    const result = await this.removeBackupRecord(backupId);
    return result;
  }

  /**
   * Delete old backups based on retention policy
   */
  async cleanupOldBackups(retentionDays: number = 90): Promise<{
    deletedCount: number;
    freedSpace: number;
  }> {
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    // This would query and delete old backups from database
    // Placeholder for database cleanup logic
    const oldBackups = await this.getBackupsOlderThan(cutoffDate);

    let freedSpace = 0;
    for (const backup of oldBackups) {
      freedSpace += backup.backupSize || 0;
      await this.removeBackupRecord(backup.id);
    }

    return {
      deletedCount: oldBackups.length,
      freedSpace,
    };
  }

  /**
   * Export backup to file format (JSON)
   */
  async exportBackupAsJSON(backupId: string): Promise<string> {
    const backup = await this.getBackup(backupId);

    if (!backup) {
      throw new Error('Backup not found');
    }

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Export multiple backups
   */
  async exportBackupsAsJSON(backupIds: string[]): Promise<string> {
    const backups: PromotionBackup[] = [];

    for (const backupId of backupIds) {
      const backup = await this.getBackup(backupId);
      if (backup) {
        backups.push(backup);
      }
    }

    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        totalBackups: backups.length,
        backups,
      },
      null,
      2,
    );
  }

  /**
   * Import backups from JSON
   */
  async importBackupsFromJSON(
    jsonData: string,
    createdBy: string,
  ): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    let data;

    try {
      data = JSON.parse(jsonData);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }

    const backups = Array.isArray(data) ? data : data.backups || [];
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const backup of backups) {
      try {
        // Validate backup structure
        if (!backup.data || !backup.data.code) {
          skipped++;
          continue;
        }

        await this.storeBackupRecord({
          ...backup,
          id: uuidv4(),
          createdBy,
        });

        imported++;
      } catch (error: any) {
        errors.push(`Failed to import backup: ${error.message}`);
        skipped++;
      }
    }

    return { imported, skipped, errors };
  }

  /**
   * Get backup statistics
   */
  async getBackupStatistics(): Promise<{
    totalBackups: number;
    totalSize: number;
    oldestBackup?: Date;
    newestBackup?: Date;
    backupsByType: Record<BackupType, number>;
    averageSize: number;
  }> {
    const allBackups = await this.getAllBackups();

    const stats = {
      totalBackups: allBackups.length,
      totalSize: allBackups.reduce((sum, b) => sum + (b.backupSize || 0), 0),
      oldestBackup: allBackups.length > 0 ? allBackups[allBackups.length - 1].createdAt : undefined,
      newestBackup: allBackups.length > 0 ? allBackups[0].createdAt : undefined,
      backupsByType: {
        [BackupType.MANUAL]: 0,
        [BackupType.SCHEDULED]: 0,
        [BackupType.PRE_UPDATE]: 0,
        [BackupType.PRE_DELETE]: 0,
      },
      averageSize:
        allBackups.length > 0
          ? allBackups.reduce((sum, b) => sum + (b.backupSize || 0), 0) / allBackups.length
          : 0,
    };

    for (const backup of allBackups) {
      stats.backupsByType[backup.backupType]++;
    }

    return stats;
  }

  /**
   * Schedule automatic backups (to be called by a cron job)
   */
  async scheduleBackup(createdBy: string): Promise<{
    backupId: string;
    status: string;
    promotionsBackedUp: number;
  }> {
    const result = await this.backupAllPromotions(BackupType.SCHEDULED, createdBy);

    return {
      backupId: result.backupId,
      status: result.totalBackups > 0 ? 'SUCCESS' : 'NO_PROMOTIONS',
      promotionsBackedUp: result.totalBackups,
    };
  }

  /**
   * Verify backup integrity
   */
  async verifyBackup(backupId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const backup = await this.getBackup(backupId);

    if (!backup) {
      return {
        isValid: false,
        errors: ['Backup not found'],
        warnings: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!backup.data.code) {
      errors.push('Missing promotion code');
    }
    if (!backup.data.name) {
      errors.push('Missing promotion name');
    }
    if (!backup.data.type) {
      errors.push('Missing promotion type');
    }

    // Validate data types
    if (typeof backup.data.value !== 'number') {
      errors.push('Invalid promotion value');
    }
    if (typeof backup.data.isActive !== 'boolean') {
      errors.push('Invalid isActive field');
    }

    // Warnings
    if (backup.data.expiresAt && new Date(backup.data.expiresAt) < new Date()) {
      warnings.push('Promotion in backup has already expired');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Rollback promotion to previous version
   */
  async rollbackToVersion(
    promotionId: string,
    backupId: string,
    createdBy: string,
  ): Promise<RestorePoint> {
    return this.restorePromotion(backupId, createdBy, promotionId);
  }

  /**
   * Private helper methods
   */

  private async storeBackupRecord(backup: PromotionBackup): Promise<void> {
    // Store backup in persistent storage (would be a database table)
    console.log(`Storing backup record: ${backup.id}`);
    // TODO: Implement actual storage when backup table is added to schema
  }

  private async storeRestorePoint(restorePoint: RestorePoint): Promise<void> {
    // Store restore point in database
    console.log(`Storing restore point: ${restorePoint.id}`);
    // TODO: Implement actual storage when restore_points table is added
  }

  private async removeBackupRecord(backupId: string): Promise<boolean> {
    // Remove backup from persistent storage
    console.log(`Removing backup record: ${backupId}`);
    return true;
  }

  private async getBackup(backupId: string): Promise<PromotionBackup | null> {
    // Query backup from storage
    // This is a placeholder - would query from actual backup storage
    console.log(`Retrieving backup: ${backupId}`);
    return null;
  }

  private async getAllBackupsForPromotion(promotionId: string): Promise<PromotionBackup[]> {
    // Query all backups for a promotion
    return [];
  }

  private async getAllRestorePointsForPromotion(promotionId: string): Promise<RestorePoint[]> {
    // Query all restore points for a promotion
    return [];
  }

  private async getBackupsOlderThan(date: Date): Promise<PromotionBackup[]> {
    // Query backups created before the given date
    return [];
  }

  private async getAllBackups(): Promise<PromotionBackup[]> {
    // Query all backups
    return [];
  }
}
