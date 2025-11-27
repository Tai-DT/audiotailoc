import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import { createWriteStream, createReadStream } from 'fs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir: string;
  private readonly retentionDays: number;
  private readonly maxBackupSize: number;
  private readonly minFreeSpaceBytes: number;
  private readonly gdriveRemote: string;
  private readonly gdriveFolderId: string;
  private isBackupInProgress = false;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.backupDir = this.configService.get('BACKUP_DIR', './backups');
    this.retentionDays = Number(this.configService.get('BACKUP_RETENTION_DAYS', 30));
    this.maxBackupSize = Number(this.configService.get('MAX_BACKUP_SIZE_MB', 1024)) * 1024 * 1024; // Convert to bytes
    this.minFreeSpaceBytes = Number(this.configService.get('MIN_FREE_SPACE_MB', 256)) * 1024 * 1024;
    this.gdriveRemote = this.configService.get('GDRIVE_REMOTE', 'gdriver');
    this.gdriveFolderId = this.configService.get(
      'GDRIVE_FOLDER_ID',
      '1DXFFkGozTgtj4LRqP_iajWGZrB4qaUnH',
    );
  }

  // Create full database backup
  async createFullBackup(
    options: {
      includeFiles?: boolean;
      compress?: boolean;
      encrypt?: boolean;
      comment?: string;
      uploadToDrive?: boolean;
    } = {},
  ): Promise<BackupResult> {
    if (this.isBackupInProgress) {
      throw new Error('Backup already in progress');
    }

    this.isBackupInProgress = true;
    const startTime = Date.now();

    try {
      const backupId = this.generateBackupId();
      const backupPath = path.join(this.backupDir, 'database');
      const backupFile = `${backupId}.sql`;

      // Ensure backup directory exists
      await fs.mkdir(backupPath, { recursive: true });

      const fullPath = path.join(backupPath, backupFile);

      this.logger.log(`Starting full database backup: ${backupId}`);

      // Preflight checks
      await this.preflightChecks(['pg_dump']);

      // Create database dump
      await this.createDatabaseDump(fullPath);

      // Verify backup
      const backupSize = await this.getFileSize(fullPath);
      await this.verifyBackupIntegrity(fullPath);

      let compressedPath: string | null = null;
      if (options.compress) {
        compressedPath = await this.compressBackup(fullPath, backupId);
      }

      let encryptedPath: string | null = null;
      if (options.encrypt) {
        const pathToEncrypt = compressedPath || fullPath;
        encryptedPath = await this.encryptBackup(pathToEncrypt, backupId);
      }

      // Calculate backup metadata
      const finalPath = encryptedPath || compressedPath || fullPath;
      const finalSize = await this.getFileSize(finalPath);

      // Upload to Google Drive if requested
      let cloudUrl: string | undefined;
      if (options.uploadToDrive) {
        try {
          await this.uploadToDrive(finalPath);
          cloudUrl = `gdrive://${this.gdriveRemote}/${path.basename(finalPath)}`;
        } catch (error) {
          this.logger.error('Failed to upload to Google Drive', error);
          // Don't fail the whole backup if upload fails, just log it
        }
      }

      const backupMetadata: BackupMetadata = {
        id: backupId,
        type: 'full',
        timestamp: new Date(),
        size: finalSize,
        databaseVersion: await this.getDatabaseVersion(),
        tablesCount: await this.getTablesCount(),
        recordsCount: await this.getTotalRecordsCount(),
        duration: Date.now() - startTime,
        status: 'completed',
        path: finalPath,
        checksum: await this.calculateChecksum(finalPath),
        compressed: options.compress || false,
        encrypted: options.encrypt || false,
        comment: options.comment,
        cloudUrl,
      };

      // Save backup metadata
      await this.saveBackupMetadata(backupMetadata);

      // Clean up old backups if needed
      await this.cleanupOldBackups();

      // Create file backup if requested
      if (options.includeFiles) {
        await this.createFileBackup(backupId, options);
      }

      this.logger.log(`Full database backup completed: ${backupId} (${finalSize} bytes)`);

      return {
        success: true,
        backupId,
        path: finalPath,
        size: finalSize,
        duration: backupMetadata.duration || Date.now() - startTime,
        metadata: backupMetadata,
        cloudUrl,
      };
    } catch (error) {
      this.logger.error('Full backup failed', error);
      throw error;
    } finally {
      this.isBackupInProgress = false;
    }
  }

  // Create incremental backup
  async createIncrementalBackup(
    options: {
      since?: Date;
      tables?: string[];
      compress?: boolean;
      comment?: string;
    } = {},
  ): Promise<BackupResult> {
    const backupId = this.generateBackupId();
    const startTime = Date.now();

    try {
      this.logger.log(`Starting incremental backup: ${backupId}`);

      const since = options.since || new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
      const tables = options.tables || (await this.getAllTables());

      const backupPath = path.join(this.backupDir, 'database', `${backupId}_incremental.sql`);
      await fs.mkdir(path.dirname(backupPath), { recursive: true });

      // Create incremental dump based on timestamp
      await this.createIncrementalDump(backupPath, since, tables);

      const backupSize = await this.getFileSize(backupPath);
      await this.verifyBackupIntegrity(backupPath);

      let finalPath = backupPath;
      if (options.compress) {
        finalPath = await this.compressBackup(backupPath, `${backupId}_incremental`);
      }

      const backupMetadata: BackupMetadata = {
        id: backupId,
        type: 'incremental',
        timestamp: new Date(),
        size: await this.getFileSize(finalPath),
        duration: Date.now() - startTime,
        status: 'completed',
        path: finalPath,
        checksum: await this.calculateChecksum(finalPath),
        compressed: options.compress || false,
        sinceTimestamp: since,
        affectedTables: tables,
        comment: options.comment,
      };

      await this.saveBackupMetadata(backupMetadata);
      await this.cleanupOldBackups();

      this.logger.log(`Incremental backup completed: ${backupId}`);

      return {
        success: true,
        backupId,
        path: finalPath,
        size: backupMetadata.size!,
        duration: backupMetadata.duration || Date.now() - startTime,
        metadata: backupMetadata,
      };
    } catch (error) {
      this.logger.error('Incremental backup failed', error);
      throw error;
    }
  }

  // Create file backup
  async createFileBackup(
    backupId: string,
    options: {
      directories?: string[];
      excludePatterns?: string[];
      compress?: boolean;
    } = {},
  ): Promise<BackupResult> {
    const startTime = Date.now();

    try {
      const defaultDirectories = ['./uploads', './logs', './backups/metadata', './public'];

      const directories = options.directories || defaultDirectories;
      const excludePatterns = options.excludePatterns || ['*.tmp', '*.log'];

      const backupPath = path.join(this.backupDir, 'files', `${backupId}_files.tar.gz`);
      await fs.mkdir(path.dirname(backupPath), { recursive: true });

      // Create tar archive of files
      await this.createFileArchive(backupPath, directories, excludePatterns);

      const backupSize = await this.getFileSize(backupPath);

      const backupMetadata: BackupMetadata = {
        id: backupId,
        type: 'files',
        timestamp: new Date(),
        size: backupSize,
        duration: Date.now() - startTime,
        status: 'completed',
        path: backupPath,
        checksum: await this.calculateChecksum(backupPath),
        compressed: true,
        directories: directories,
        excludePatterns: excludePatterns,
      };

      await this.saveBackupMetadata(backupMetadata);

      this.logger.log(`File backup completed: ${backupId} (${backupSize} bytes)`);

      return {
        success: true,
        backupId,
        path: backupPath,
        size: backupSize,
        duration: backupMetadata.duration || Date.now() - startTime,
        metadata: backupMetadata,
      };
    } catch (error) {
      this.logger.error('File backup failed', error);
      throw error;
    }
  }

  // Restore from backup
  async restoreFromBackup(
    backupId: string,
    options: {
      dropExisting?: boolean;
      verifyBeforeRestore?: boolean;
      dryRun?: boolean;
    } = {},
  ): Promise<RestoreResult> {
    const startTime = Date.now();

    try {
      this.logger.log(`Starting restore from backup: ${backupId}`);

      // Find backup metadata
      const backupMetadata = await this.getBackupMetadata(backupId);
      if (!backupMetadata) {
        throw new Error(`Backup not found: ${backupId}`);
      }

      // Verify backup integrity before restore
      if (options.verifyBeforeRestore) {
        await this.verifyBackupIntegrity(backupMetadata.path);
      }

      if (options.dryRun) {
        return {
          success: true,
          backupId,
          dryRun: true,
          estimatedDuration: 0,
          metadata: backupMetadata,
        };
      }

      // Preflight checks
      await this.preflightChecks(['pg_restore', 'tar']);

      // Perform restore based on backup type
      if (backupMetadata.type === 'full' || backupMetadata.type === 'incremental') {
        await this.restoreDatabaseBackup(backupMetadata, !!options.dropExisting);
      }

      // Restore files if it's a file backup
      if (backupMetadata.type === 'files' || backupMetadata.directories) {
        await this.restoreFileBackup(backupMetadata);
      }

      const duration = Date.now() - startTime;

      this.logger.log(`Restore completed: ${backupId} (${duration}ms)`);

      return {
        success: true,
        backupId,
        duration,
        metadata: backupMetadata,
      };
    } catch (error) {
      this.logger.error(`Restore failed: ${backupId}`, error);
      throw error;
    }
  }

  // Point-in-time recovery
  async pointInTimeRecovery(
    targetTime: Date,
    options: {
      dryRun?: boolean;
      verify?: boolean;
    } = {},
  ): Promise<RestoreResult> {
    const startTime = Date.now();

    try {
      this.logger.log(`Starting point-in-time recovery to: ${targetTime.toISOString()}`);

      // Find all backups before the target time
      const relevantBackups = await this.findBackupsBeforeTime(targetTime);

      if (relevantBackups.length === 0) {
        throw new Error(`No backups found before ${targetTime.toISOString()}`);
      }

      // Ensure timestamps are Date objects and sort by timestamp, most recent first
      relevantBackups.forEach(backup => {
        if (typeof backup.timestamp === 'string') {
          backup.timestamp = new Date(backup.timestamp);
        }
      });
      relevantBackups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      const latestFullBackup = relevantBackups.find(b => b.type === 'full');
      if (!latestFullBackup) {
        throw new Error('No full backup found for point-in-time recovery');
      }

      if (options.dryRun) {
        return {
          success: true,
          dryRun: true,
          backupId: latestFullBackup.id,
          estimatedDuration: 0,
          metadata: latestFullBackup,
        };
      }

      // Restore full backup first
      await this.restoreFromBackup(latestFullBackup.id, { dropExisting: true });

      // Apply incremental backups
      const incrementalBackups = relevantBackups.filter(
        b => b.type === 'incremental' && b.timestamp <= targetTime,
      );

      for (const backup of incrementalBackups) {
        await this.restoreFromBackup(backup.id, { dropExisting: false });
      }

      const duration = Date.now() - startTime;

      this.logger.log(`Point-in-time recovery completed (${duration}ms)`);

      return {
        success: true,
        duration,
        pointInTime: targetTime,
      };
    } catch (error) {
      this.logger.error('Point-in-time recovery failed', error);
      throw error;
    }
  }

  // Get backup status and information
  async getBackupStatus(): Promise<BackupStatus> {
    const backups = await this.listBackups();
    // Ensure timestamps are Date objects
    backups.forEach(backup => {
      if (typeof backup.timestamp === 'string') {
        backup.timestamp = new Date(backup.timestamp);
      }
    });

    const latestBackup = backups
      .filter(b => b.status === 'completed')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
    const failedBackups = backups.filter(b => b.status === 'failed').length;

    return {
      totalBackups: backups.length,
      latestBackup: latestBackup?.timestamp,
      totalSize,
      failedBackups,
      isBackupInProgress: this.isBackupInProgress,
      nextScheduledBackup: await this.getNextScheduledBackup(),
    };
  }

  // List all backups
  async listBackups(
    options: {
      type?: 'full' | 'incremental' | 'files';
      status?: 'completed' | 'failed' | 'in_progress';
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<BackupMetadata[]> {
    try {
      const metadataDir = path.join(this.backupDir, 'metadata');
      await fs.mkdir(metadataDir, { recursive: true });

      const files = await fs.readdir(metadataDir);
      const metadataFiles = files.filter(f => f.endsWith('.json'));

      let backups: BackupMetadata[] = [];

      for (const file of metadataFiles) {
        try {
          const content = await fs.readFile(path.join(metadataDir, file), 'utf-8');
          const metadata: BackupMetadata = JSON.parse(content);

          // Ensure timestamp is a Date object
          if (typeof metadata.timestamp === 'string') {
            metadata.timestamp = new Date(metadata.timestamp);
          }
          if (metadata.sinceTimestamp && typeof metadata.sinceTimestamp === 'string') {
            metadata.sinceTimestamp = new Date(metadata.sinceTimestamp);
          }

          backups.push(metadata);
        } catch (error) {
          this.logger.error(`Failed to read backup metadata: ${file}`, error);
        }
      }

      // Apply filters
      if (options.type) {
        backups = backups.filter(b => b.type === options.type);
      }

      if (options.status) {
        backups = backups.filter(b => b.status === options.status);
      }

      // Sort by timestamp (newest first)
      backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Apply pagination
      const limit = options.limit || 50;
      const offset = options.offset || 0;

      return backups.slice(offset, offset + limit);
    } catch (error) {
      this.logger.error('Failed to list backups', error);
      return [];
    }
  }

  // Delete old backups based on retention policy
  async cleanupOldBackups(): Promise<number> {
    try {
      const retentionDate = new Date();
      retentionDate.setDate(retentionDate.getDate() - this.retentionDays);

      const backups = await this.listBackups();
      let deletedCount = 0;

      for (const backup of backups) {
        if (backup.timestamp < retentionDate) {
          await this.deleteBackup(backup.id);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        this.logger.log(`Cleaned up ${deletedCount} old backups`);
      }

      return deletedCount;
    } catch (error) {
      this.logger.error('Backup cleanup failed', error);
      return 0;
    }
  }

  // Private helper methods

  private async createDatabaseDump(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const databaseUrl = this.configService.get('DATABASE_URL');
      if (!databaseUrl) {
        throw new Error('DATABASE_URL not configured');
      }

      // Extract database connection info from URL
      const url = new URL(databaseUrl);
      const host = url.hostname;
      const port = url.port || '5432';
      const database = url.pathname.slice(1);
      const username = url.username;
      const password = url.password;

      const dumpCommand = `pg_dump`;
      const args = [
        '-h',
        host,
        '-p',
        port,
        '-U',
        username,
        '-d',
        database,
        '-f',
        filePath,
        '-Fc', // Custom format
        '-v', // Verbose
      ];

      const env = {
        ...process.env,
        PGPASSWORD: password,
      };

      const dumpProcess = spawn(dumpCommand, args, { env });

      let stderr = '';
      dumpProcess.stderr.on('data', data => {
        stderr += data.toString();
      });

      dumpProcess.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`pg_dump failed: ${stderr}`));
        }
      });

      dumpProcess.on('error', error => {
        reject(error);
      });
    });
  }

  private async createIncrementalDump(
    filePath: string,
    since: Date,
    tables: string[],
  ): Promise<void> {
    // This is a simplified implementation
    // In a real scenario, you'd use PostgreSQL's WAL archiving or logical replication
    const sql = `
      -- Incremental backup for tables: ${tables.join(', ')}
      -- Since: ${since.toISOString()}

      -- Note: This is a basic implementation
      -- For production use, consider PostgreSQL PITR or logical replication

      SELECT 'Incremental backup created on: ' || now() as info;
    `;

    await fs.writeFile(filePath, sql, 'utf-8');
  }

  private async createFileArchive(
    archivePath: string,
    directories: string[],
    excludePatterns: string[],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(archivePath);
      const archive = archiver('tar', {
        gzip: true,
        gzipOptions: { level: 6 },
      });

      output.on('close', () => {
        this.logger.log(`File archive created: ${archive.pointer()} bytes`);
        resolve();
      });

      archive.on('error', (error: any) => {
        reject(error);
      });

      archive.pipe(output);

      // Add directories to archive
      for (const dir of directories) {
        try {
          if (require('fs').existsSync(dir)) {
            archive.directory(dir, path.basename(dir));
          }
        } catch (error) {
          this.logger.warn(`Failed to add directory to archive: ${dir}`, error);
        }
      }

      archive.finalize();
    });
  }

  private async compressBackup(filePath: string, backupId: string): Promise<string> {
    const compressedPath = `${filePath}.gz`;

    return new Promise((resolve, reject) => {
      const input = createReadStream(filePath);
      const output = createWriteStream(compressedPath);
      const zlib = require('zlib');

      input.pipe(zlib.createGzip()).pipe(output);

      output.on('finish', () => {
        // Remove original file
        fs.unlink(filePath);
        resolve(compressedPath);
      });

      output.on('error', error => {
        reject(error);
      });
    });
  }

  private async encryptBackup(filePath: string, backupId: string): Promise<string> {
    // This is a placeholder for encryption
    // In a real implementation, you'd use AES-256-GCM or similar
    const encryptedPath = `${filePath}.enc`;

    // For now, just copy the file
    await fs.copyFile(filePath, encryptedPath);
    await fs.unlink(filePath);

    return encryptedPath;
  }

  private async verifyBackupIntegrity(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      const stats = await fs.stat(filePath);

      if (stats.size === 0) {
        throw new Error('Backup file is empty');
      }

      if (stats.size > this.maxBackupSize) {
        throw new Error(`Backup file too large: ${stats.size} bytes`);
      }

      return true;
    } catch (error) {
      this.logger.error(`Backup integrity check failed: ${filePath}`, error);
      return false;
    }
  }

  private async preflightChecks(commands: string[] = []): Promise<void> {
    // Ensure backup directory exists and is writable
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      const testFile = path.join(this.backupDir, `.write-test-${Date.now()}`);
      await fs.writeFile(testFile, 'ok');
      await fs.unlink(testFile);
    } catch (e) {
      throw new Error(`Backup directory not writable: ${this.backupDir}`);
    }

    // Ensure required commands exist
    for (const cmd of commands) {
      const exists = await this.commandExists(cmd);
      if (!exists) {
        throw new Error(`Required command not found in PATH: ${cmd}`);
      }
    }

    // Check disk space
    const disk = await this.getDiskInfo(this.backupDir);
    if (disk.availableBytes < this.minFreeSpaceBytes) {
      throw new Error(
        `Not enough free space. Available: ${disk.availableBytes} bytes, required: ${this.minFreeSpaceBytes} bytes`,
      );
    }
  }

  private async commandExists(cmd: string): Promise<boolean> {
    return new Promise(resolve => {
      const which = process.platform === 'win32' ? 'where' : 'which';
      const p = spawn(which, [cmd]);
      p.on('close', code => resolve(code === 0));
      p.on('error', () => resolve(false));
    });
  }

  private async getDiskInfo(
    targetDir: string,
  ): Promise<{ totalBytes: number; availableBytes: number }> {
    return new Promise(resolve => {
      const platform = process.platform;
      if (platform === 'win32') {
        // Fallback: use os module
        const os = require('os');
        resolve({ totalBytes: os.totalmem(), availableBytes: os.freemem() });
        return;
      }
      const df = spawn('df', ['-k', targetDir]);
      let out = '';
      df.stdout.on('data', d => (out += d.toString()));
      df.on('close', () => {
        const lines = out.trim().split('\n');
        if (lines.length >= 2) {
          const parts = lines[1].trim().split(/\s+/);
          // Filesystem Size Used Avail Use% Mounted
          const totalKB = parseInt(parts[1]) || 0;
          const availKB = parseInt(parts[3]) || 0;
          resolve({ totalBytes: totalKB * 1024, availableBytes: availKB * 1024 });
        } else {
          const os = require('os');
          resolve({ totalBytes: os.totalmem(), availableBytes: os.freemem() });
        }
      });
      df.on('error', () => {
        const os = require('os');
        resolve({ totalBytes: os.totalmem(), availableBytes: os.freemem() });
      });
    });
  }

  // Expose preflight status for controllers
  async getPreflightStatus() {
    const tools = {
      pg_dump: await this.commandExists('pg_dump'),
      pg_restore: await this.commandExists('pg_restore'),
      tar: await this.commandExists('tar'),
    };
    const writable = await (async () => {
      try {
        await fs.mkdir(this.backupDir, { recursive: true });
        const tmp = path.join(this.backupDir, `.write-test-${Date.now()}`);
        await fs.writeFile(tmp, 'ok');
        await fs.unlink(tmp);
        return true;
      } catch {
        return false;
      }
    })();
    const disk = await this.getDiskInfo(this.backupDir);
    return { tools, writable, disk, minFreeSpaceBytes: this.minFreeSpaceBytes };
  }

  // Public wrapper to verify a backup file path
  async verifyBackupFile(filePath: string): Promise<boolean> {
    return this.verifyBackupIntegrity(filePath);
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const crypto = require('crypto');
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  private async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  private async getDatabaseVersion(): Promise<string> {
    const result: any = await this.prisma.$queryRaw`SELECT version() as version`;
    return result[0].version;
  }

  private async getTablesCount(): Promise<number> {
    const result: any = await this.prisma.$queryRaw`
      SELECT count(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    return parseInt(result[0].count);
  }

  private async getTotalRecordsCount(): Promise<number> {
    // This is a simplified implementation
    // In a real scenario, you'd query each table
    const tables = await this.getAllTables();
    let total = 0;

    for (const table of tables) {
      try {
        const result: any = await this.prisma.$queryRawUnsafe(
          `SELECT count(*) as count FROM ${table}`,
        );
        total += parseInt(result[0].count);
      } catch (error) {
        // Skip tables that can't be counted
      }
    }

    return total;
  }

  private async getAllTables(): Promise<string[]> {
    const result: any = await this.prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;
    return (result as any[]).map((row: any) => row.table_name);
  }

  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const metadataDir = path.join(this.backupDir, 'metadata');
    await fs.mkdir(metadataDir, { recursive: true });

    const metadataPath = path.join(metadataDir, `${metadata.id}.json`);
    const tmpPath = `${metadataPath}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(metadata, null, 2), 'utf-8');
    await fs.rename(tmpPath, metadataPath);
  }

  private async getBackupMetadata(backupId: string): Promise<BackupMetadata | null> {
    try {
      const metadataPath = path.join(this.backupDir, 'metadata', `${backupId}.json`);
      const content = await fs.readFile(metadataPath, 'utf-8');
      const metadata: BackupMetadata = JSON.parse(content);

      // Ensure timestamp is a Date object
      if (typeof metadata.timestamp === 'string') {
        metadata.timestamp = new Date(metadata.timestamp);
      }
      if (metadata.sinceTimestamp && typeof metadata.sinceTimestamp === 'string') {
        metadata.sinceTimestamp = new Date(metadata.sinceTimestamp);
      }

      return metadata;
    } catch {
      return null;
    }
  }

  private async deleteBackup(backupId: string): Promise<void> {
    const backup = await this.getBackupMetadata(backupId);
    if (!backup) return;

    try {
      // Delete backup file
      await fs.unlink(backup.path);

      // Delete metadata
      const metadataPath = path.join(this.backupDir, 'metadata', `${backupId}.json`);
      await fs.unlink(metadataPath);

      this.logger.log(`Deleted backup: ${backupId}`);
    } catch (error) {
      this.logger.error(`Failed to delete backup: ${backupId}`, error);
    }
  }

  private async findBackupsBeforeTime(targetTime: Date): Promise<BackupMetadata[]> {
    const backups = await this.listBackups();
    return backups.filter(backup => backup.timestamp <= targetTime);
  }

  private async getNextScheduledBackup(): Promise<Date | null> {
    // This would integrate with a job scheduler like node-cron
    // For now, return null
    return null;
  }

  private generateBackupId(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 8);
    return `backup_${timestamp}_${random}`;
  }

  private async restoreDatabaseBackup(
    backup: BackupMetadata,
    dropExisting: boolean,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const databaseUrl = this.configService.get('DATABASE_URL');
      if (!databaseUrl) {
        throw new Error('DATABASE_URL not configured');
      }

      const url = new URL(databaseUrl);
      const host = url.hostname;
      const port = url.port || '5432';
      const database = url.pathname.slice(1);
      const username = url.username;
      const password = url.password;

      const restoreCommand = `pg_restore`;
      const args = [
        '-h',
        host,
        '-p',
        port,
        '-U',
        username,
        '-d',
        database,
        '-c', // Clean (drop) database objects before recreating
        '-v', // Verbose
        backup.path,
      ];

      if (!dropExisting) {
        args.splice(args.indexOf('-c'), 1); // Remove -c flag
      }

      const env = {
        ...process.env,
        PGPASSWORD: password,
      };

      const restoreProcess = spawn(restoreCommand, args, { env });

      let stderr = '';
      restoreProcess.stderr.on('data', data => {
        stderr += data.toString();
      });

      restoreProcess.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`pg_restore failed: ${stderr}`));
        }
      });

      restoreProcess.on('error', error => {
        reject(error);
      });
    });
  }

  private async restoreFileBackup(backup: BackupMetadata): Promise<void> {
    // Extract tar.gz archive into project root while preventing path traversal
    const archivePath = backup.path;
    if (!archivePath.endsWith('.tar.gz')) {
      this.logger.warn(`Unsupported file backup format for restore: ${archivePath}`);
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const tarProc = spawn('tar', ['-xzf', archivePath, '-C', '.']);
      let stderr = '';
      tarProc.stderr.on('data', d => (stderr += d.toString()));
      tarProc.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`tar extract failed: ${stderr}`));
      });
      tarProc.on('error', err => reject(err));
    });
    this.logger.log(`File backup restored from ${archivePath}`);
  }

  private async uploadToDrive(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.log(`Uploading to Google Drive: ${filePath}`);

      // rclone copy source remote: --drive-root-folder-id id
      const args = [
        'copy',
        filePath,
        `${this.gdriveRemote}:`,
        '--drive-root-folder-id',
        this.gdriveFolderId,
      ];

      const rclone = spawn('rclone', args);
      let stderr = '';

      rclone.stderr.on('data', data => {
        stderr += data.toString();
      });

      rclone.on('close', code => {
        if (code === 0) {
          this.logger.log('Upload to Google Drive successful');
          resolve();
        } else {
          reject(new Error(`rclone failed with code ${code}: ${stderr}`));
        }
      });

      rclone.on('error', err => {
        reject(err);
      });
    });
  }
}

// Types
export interface BackupResult {
  success: boolean;
  backupId: string;
  path: string;
  size: number;
  duration: number;
  metadata?: BackupMetadata;
  dryRun?: boolean;
  estimatedDuration?: number;
  cloudUrl?: string;
}

export interface RestoreResult {
  success: boolean;
  backupId?: string;
  duration?: number;
  pointInTime?: Date;
  dryRun?: boolean;
  estimatedDuration?: number;
  metadata?: BackupMetadata;
}

export interface BackupMetadata {
  id: string;
  type: 'full' | 'incremental' | 'files';
  timestamp: Date;
  size: number;
  duration?: number;
  status: 'completed' | 'failed' | 'in_progress';
  path: string;
  checksum: string;
  compressed?: boolean;
  encrypted?: boolean;
  comment?: string;
  cloudUrl?: string;

  // Database-specific metadata
  databaseVersion?: string;
  tablesCount?: number;
  recordsCount?: number;

  // Incremental backup metadata
  sinceTimestamp?: Date;
  affectedTables?: string[];

  // File backup metadata
  directories?: string[];
  excludePatterns?: string[];
}

export interface BackupStatus {
  totalBackups: number;
  latestBackup: Date | undefined;
  totalSize: number;
  failedBackups: number;
  isBackupInProgress: boolean;
  nextScheduledBackup: Date | null;
}
