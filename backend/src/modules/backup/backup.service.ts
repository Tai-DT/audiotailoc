import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as archiver from 'archiver';
import * as crypto from 'crypto';

const execAsync = promisify(exec);

export interface BackupConfig {
  enabled: boolean;
  schedule: string; // Cron expression
  retention: number; // Days to keep backups
  compression: boolean;
  encryption: boolean;
  storage: 'local' | 's3' | 'gcs';
  storageConfig?: {
    bucket?: string;
    region?: string;
    accessKey?: string;
    secretKey?: string;
  };
}

export interface BackupResult {
  id: string;
  filename: string;
  size: number;
  checksum: string;
  createdAt: Date;
  status: 'success' | 'failed';
  error?: string;
}

export interface RestoreResult {
  success: boolean;
  message: string;
  restoredAt: Date;
}

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir: string;
  private readonly config: BackupConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.backupDir = this.configService.get<string>('BACKUP_DIR', './backups');
    this.config = {
      enabled: this.configService.get<boolean>('BACKUP_ENABLED', true),
      schedule: this.configService.get<string>('BACKUP_SCHEDULE', '0 2 * * *'), // Daily at 2 AM
      retention: this.configService.get<number>('BACKUP_RETENTION_DAYS', 30),
      compression: this.configService.get<boolean>('BACKUP_COMPRESSION', true),
      encryption: this.configService.get<boolean>('BACKUP_ENCRYPTION', false),
      storage: this.configService.get<'local' | 's3' | 'gcs'>('BACKUP_STORAGE', 'local'),
      storageConfig: {
        bucket: this.configService.get<string>('BACKUP_S3_BUCKET'),
        region: this.configService.get<string>('BACKUP_S3_REGION'),
        accessKey: this.configService.get<string>('BACKUP_S3_ACCESS_KEY'),
        secretKey: this.configService.get<string>('BACKUP_S3_SECRET_KEY'),
      },
    };

    this.ensureBackupDir();
  }

  private async ensureBackupDir() {
    try {
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }
    } catch (error) {
      this.logger.error('Failed to create backup directory:', error);
    }
  }

  // Create database backup
  async createBackup(): Promise<BackupResult> {
    const backupId = crypto.randomUUID();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}-${backupId}.sql`;
    const filepath = path.join(this.backupDir, filename);

    try {
      this.logger.log(`Starting database backup: ${filename}`);

      // Get database URL
      const databaseUrl = this.configService.get<string>('DATABASE_URL');
      if (!databaseUrl) {
        throw new Error('DATABASE_URL not configured');
      }

      // Extract database connection info
      const dbInfo = this.parseDatabaseUrl(databaseUrl);
      
      // Create pg_dump command
      const dumpCommand = this.buildDumpCommand(dbInfo, filepath);
      
      // Execute backup
      const { stdout, stderr } = await execAsync(dumpCommand);
      
      if (stderr && !stderr.includes('WARNING')) {
        throw new Error(`Backup failed: ${stderr}`);
      }

      // Get file stats
      const stats = fs.statSync(filepath);
      const fileBuffer = fs.readFileSync(filepath);
      const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Compress if enabled
      let finalFilename = filename;
      let finalSize = stats.size;
      if (this.config.compression) {
        const compressedFile = await this.compressFile(filepath);
        finalFilename = compressedFile;
        finalSize = fs.statSync(path.join(this.backupDir, compressedFile)).size;
      }

      // Encrypt if enabled
      if (this.config.encryption) {
        const encryptedFile = await this.encryptFile(path.join(this.backupDir, finalFilename));
        finalFilename = encryptedFile;
        finalSize = fs.statSync(path.join(this.backupDir, encryptedFile)).size;
      }

      // Upload to cloud storage if configured
      if (this.config.storage !== 'local') {
        await this.uploadToCloud(path.join(this.backupDir, finalFilename), finalFilename);
      }

      // Log backup in database
      await this.logBackup({
        id: backupId,
        filename: finalFilename,
        size: finalSize,
        checksum,
        createdAt: new Date(),
        status: 'success',
      });

      this.logger.log(`Backup completed successfully: ${finalFilename} (${finalSize} bytes)`);

      return {
        id: backupId,
        filename: finalFilename,
        size: finalSize,
        checksum,
        createdAt: new Date(),
        status: 'success',
      };
    } catch (error) {
      this.logger.error(`Backup failed: ${error.message}`);
      
      // Log failed backup
      await this.logBackup({
        id: backupId,
        filename,
        size: 0,
        checksum: '',
        createdAt: new Date(),
        status: 'failed',
        error: error.message,
      });

      return {
        id: backupId,
        filename,
        size: 0,
        checksum: '',
        createdAt: new Date(),
        status: 'failed',
        error: error.message,
      };
    }
  }

  // Restore database from backup
  async restoreBackup(backupId: string): Promise<RestoreResult> {
    try {
      this.logger.log(`Starting database restore from backup: ${backupId}`);

      // Get backup info
      const backup = await this.prisma.backup.findUnique({
        where: { id: backupId },
      });

      if (!backup) {
        throw new Error('Backup not found');
      }

      if (backup.status !== 'success') {
        throw new Error('Cannot restore from failed backup');
      }

      const filepath = path.join(this.backupDir, backup.filename);

      // Download from cloud if needed
      if (this.config.storage !== 'local' && !fs.existsSync(filepath)) {
        await this.downloadFromCloud(backup.filename, filepath);
      }

      // Decrypt if needed
      let restoreFile = filepath;
      if (this.config.encryption) {
        restoreFile = await this.decryptFile(filepath);
      }

      // Decompress if needed
      if (this.config.compression) {
        restoreFile = await this.decompressFile(restoreFile);
      }

      // Get database URL
      const databaseUrl = this.configService.get<string>('DATABASE_URL');
      if (!databaseUrl) {
        throw new Error('DATABASE_URL not configured');
      }

      const dbInfo = this.parseDatabaseUrl(databaseUrl);
      
      // Create restore command
      const restoreCommand = this.buildRestoreCommand(dbInfo, restoreFile);
      
      // Execute restore
      const { stdout, stderr } = await execAsync(restoreCommand);
      
      if (stderr && !stderr.includes('WARNING')) {
        throw new Error(`Restore failed: ${stderr}`);
      }

      this.logger.log(`Database restore completed successfully`);

      return {
        success: true,
        message: 'Database restored successfully',
        restoredAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Restore failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
        restoredAt: new Date(),
      };
    }
  }

  // Export data to JSON
  async exportData(tables?: string[]): Promise<{ filename: string; size: number }> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `export-${timestamp}.json`;
      const filepath = path.join(this.backupDir, filename);

      this.logger.log(`Starting data export: ${filename}`);

      const exportData: any = {};

      // Get all tables if not specified
      if (!tables) {
        const result = await this.prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `;
        tables = (result as any[]).map(row => row.table_name);
      }

      // Export each table
      for (const table of tables) {
        try {
          const data = await this.prisma.$queryRawUnsafe(`SELECT * FROM "${table}"`);
          exportData[table] = data;
        } catch (error) {
          this.logger.warn(`Failed to export table ${table}: ${error.message}`);
        }
      }

      // Write to file
      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
      const stats = fs.statSync(filepath);

      this.logger.log(`Data export completed: ${filename} (${stats.size} bytes)`);

      return {
        filename,
        size: stats.size,
      };
    } catch (error) {
      this.logger.error(`Data export failed: ${error.message}`);
      throw error;
    }
  }

  // Import data from JSON
  async importData(filename: string): Promise<RestoreResult> {
    try {
      const filepath = path.join(this.backupDir, filename);
      
      if (!fs.existsSync(filepath)) {
        throw new Error('Import file not found');
      }

      this.logger.log(`Starting data import from: ${filename}`);

      const importData = JSON.parse(fs.readFileSync(filepath, 'utf8'));

      // Import each table
      for (const [table, data] of Object.entries(importData)) {
        if (Array.isArray(data) && data.length > 0) {
          try {
            // Clear existing data
            await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
            
            // Insert new data
            for (const row of data as any[]) {
              const columns = Object.keys(row);
              const values = Object.values(row);
              const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
              
              await this.prisma.$executeRawUnsafe(
                `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`,
                ...values
              );
            }
          } catch (error) {
            this.logger.warn(`Failed to import table ${table}: ${error.message}`);
          }
        }
      }

      this.logger.log(`Data import completed successfully`);

      return {
        success: true,
        message: 'Data imported successfully',
        restoredAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Data import failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
        restoredAt: new Date(),
      };
    }
  }

  // Clean up old backups
  async cleanupOldBackups(): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retention);

      const oldBackups = await this.prisma.backup.findMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
          status: 'success',
        },
      });

      let deletedCount = 0;

      for (const backup of oldBackups) {
        try {
          // Delete local file
          const filepath = path.join(this.backupDir, backup.filename);
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }

          // Delete from cloud storage
          if (this.config.storage !== 'local') {
            await this.deleteFromCloud(backup.filename);
          }

          // Delete database record
          await this.prisma.backup.delete({
            where: { id: backup.id },
          });

          deletedCount++;
        } catch (error) {
          this.logger.error(`Failed to delete backup ${backup.id}: ${error.message}`);
        }
      }

      this.logger.log(`Cleaned up ${deletedCount} old backups`);
      return deletedCount;
    } catch (error) {
      this.logger.error(`Backup cleanup failed: ${error.message}`);
      return 0;
    }
  }

  // Get backup statistics
  async getBackupStats(): Promise<{
    totalBackups: number;
    successfulBackups: number;
    failedBackups: number;
    totalSize: number;
    lastBackup?: Date;
    nextBackup?: Date;
  }> {
    try {
      const [total, successful, failed, lastBackup] = await Promise.all([
        this.prisma.backup.count(),
        this.prisma.backup.count({ where: { status: 'success' } }),
        this.prisma.backup.count({ where: { status: 'failed' } }),
        this.prisma.backup.findFirst({
          where: { status: 'success' },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
      ]);

      const totalSize = await this.prisma.backup.aggregate({
        where: { status: 'success' },
        _sum: { size: true },
      });

      return {
        totalBackups: total,
        successfulBackups: successful,
        failedBackups: failed,
        totalSize: totalSize._sum.size || 0,
        lastBackup: lastBackup?.createdAt,
        nextBackup: this.getNextBackupTime(),
      };
    } catch (error) {
      this.logger.error(`Failed to get backup stats: ${error.message}`);
      return {
        totalBackups: 0,
        successfulBackups: 0,
        failedBackups: 0,
        totalSize: 0,
      };
    }
  }

  // Private helper methods
  private parseDatabaseUrl(url: string): {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
  } {
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!match) {
      throw new Error('Invalid DATABASE_URL format');
    }

    return {
      username: match[1],
      password: match[2],
      host: match[3],
      port: match[4],
      database: match[5],
    };
  }

  private buildDumpCommand(dbInfo: any, filepath: string): string {
    return `PGPASSWORD="${dbInfo.password}" pg_dump -h ${dbInfo.host} -p ${dbInfo.port} -U ${dbInfo.username} -d ${dbInfo.database} -f "${filepath}" --no-password`;
  }

  private buildRestoreCommand(dbInfo: any, filepath: string): string {
    return `PGPASSWORD="${dbInfo.password}" psql -h ${dbInfo.host} -p ${dbInfo.port} -U ${dbInfo.username} -d ${dbInfo.database} -f "${filepath}" --no-password`;
  }

  private async compressFile(filepath: string): Promise<string> {
    const compressedPath = filepath + '.gz';
    const output = fs.createWriteStream(compressedPath);
    const archive = archiver('gzip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        fs.unlinkSync(filepath); // Remove original file
        resolve(path.basename(compressedPath));
      });

      archive.on('error', reject);
      archive.pipe(output);
      archive.file(filepath, { name: path.basename(filepath) });
      archive.finalize();
    });
  }

  private async decompressFile(filepath: string): Promise<string> {
    // Implementation for decompression
    return filepath.replace('.gz', '');
  }

  private async encryptFile(filepath: string): Promise<string> {
    // Implementation for encryption
    return filepath + '.enc';
  }

  private async decryptFile(filepath: string): Promise<string> {
    // Implementation for decryption
    return filepath.replace('.enc', '');
  }

  private async uploadToCloud(filepath: string, filename: string): Promise<void> {
    // Implementation for cloud upload
    this.logger.log(`Uploading ${filename} to cloud storage`);
  }

  private async downloadFromCloud(filename: string, filepath: string): Promise<void> {
    // Implementation for cloud download
    this.logger.log(`Downloading ${filename} from cloud storage`);
  }

  private async deleteFromCloud(filename: string): Promise<void> {
    // Implementation for cloud deletion
    this.logger.log(`Deleting ${filename} from cloud storage`);
  }

  private async logBackup(backup: any): Promise<void> {
    try {
      await this.prisma.backup.create({
        data: backup,
      });
    } catch (error) {
      this.logger.error('Failed to log backup:', error);
    }
  }

  private getNextBackupTime(): Date | undefined {
    // Implementation to calculate next backup time based on schedule
    return undefined;
  }
}
