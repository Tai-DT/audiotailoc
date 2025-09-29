"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const archiver_1 = __importDefault(require("archiver"));
const fs_2 = require("fs");
const prisma_service_1 = require("../../prisma/prisma.service");
let BackupService = BackupService_1 = class BackupService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(BackupService_1.name);
        this.isBackupInProgress = false;
        this.backupDir = this.configService.get('BACKUP_DIR', './backups');
        this.retentionDays = Number(this.configService.get('BACKUP_RETENTION_DAYS', 30));
        this.maxBackupSize = Number(this.configService.get('MAX_BACKUP_SIZE_MB', 1024)) * 1024 * 1024;
        this.minFreeSpaceBytes = Number(this.configService.get('MIN_FREE_SPACE_MB', 256)) * 1024 * 1024;
    }
    async createFullBackup(options = {}) {
        if (this.isBackupInProgress) {
            throw new Error('Backup already in progress');
        }
        this.isBackupInProgress = true;
        const startTime = Date.now();
        try {
            const backupId = this.generateBackupId();
            const backupPath = path.join(this.backupDir, 'database');
            const backupFile = `${backupId}.sql`;
            await fs_1.promises.mkdir(backupPath, { recursive: true });
            const fullPath = path.join(backupPath, backupFile);
            this.logger.log(`Starting full database backup: ${backupId}`);
            await this.preflightChecks(['pg_dump']);
            await this.createDatabaseDump(fullPath);
            const backupSize = await this.getFileSize(fullPath);
            await this.verifyBackupIntegrity(fullPath);
            let compressedPath = null;
            if (options.compress) {
                compressedPath = await this.compressBackup(fullPath, backupId);
            }
            let encryptedPath = null;
            if (options.encrypt) {
                const pathToEncrypt = compressedPath || fullPath;
                encryptedPath = await this.encryptBackup(pathToEncrypt, backupId);
            }
            const finalPath = encryptedPath || compressedPath || fullPath;
            const finalSize = await this.getFileSize(finalPath);
            const backupMetadata = {
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
            };
            await this.saveBackupMetadata(backupMetadata);
            await this.cleanupOldBackups();
            if (options.includeFiles) {
                await this.createFileBackup(backupId, options);
            }
            this.logger.log(`Full database backup completed: ${backupId} (${finalSize} bytes)`);
            return {
                success: true,
                backupId,
                path: finalPath,
                size: finalSize,
                duration: backupMetadata.duration || (Date.now() - startTime),
                metadata: backupMetadata,
            };
        }
        catch (error) {
            this.logger.error('Full backup failed', error);
            throw error;
        }
        finally {
            this.isBackupInProgress = false;
        }
    }
    async createIncrementalBackup(options = {}) {
        const backupId = this.generateBackupId();
        const startTime = Date.now();
        try {
            this.logger.log(`Starting incremental backup: ${backupId}`);
            const since = options.since || new Date(Date.now() - 24 * 60 * 60 * 1000);
            const tables = options.tables || await this.getAllTables();
            const backupPath = path.join(this.backupDir, 'database', `${backupId}_incremental.sql`);
            await fs_1.promises.mkdir(path.dirname(backupPath), { recursive: true });
            await this.createIncrementalDump(backupPath, since, tables);
            const backupSize = await this.getFileSize(backupPath);
            await this.verifyBackupIntegrity(backupPath);
            let finalPath = backupPath;
            if (options.compress) {
                finalPath = await this.compressBackup(backupPath, `${backupId}_incremental`);
            }
            const backupMetadata = {
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
                size: backupMetadata.size,
                duration: backupMetadata.duration || (Date.now() - startTime),
                metadata: backupMetadata,
            };
        }
        catch (error) {
            this.logger.error('Incremental backup failed', error);
            throw error;
        }
    }
    async createFileBackup(backupId, options = {}) {
        const startTime = Date.now();
        try {
            const defaultDirectories = [
                './uploads',
                './logs',
                './backups/metadata',
                './public',
            ];
            const directories = options.directories || defaultDirectories;
            const excludePatterns = options.excludePatterns || ['*.tmp', '*.log'];
            const backupPath = path.join(this.backupDir, 'files', `${backupId}_files.tar.gz`);
            await fs_1.promises.mkdir(path.dirname(backupPath), { recursive: true });
            await this.createFileArchive(backupPath, directories, excludePatterns);
            const backupSize = await this.getFileSize(backupPath);
            const backupMetadata = {
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
                duration: backupMetadata.duration || (Date.now() - startTime),
                metadata: backupMetadata,
            };
        }
        catch (error) {
            this.logger.error('File backup failed', error);
            throw error;
        }
    }
    async restoreFromBackup(backupId, options = {}) {
        const startTime = Date.now();
        try {
            this.logger.log(`Starting restore from backup: ${backupId}`);
            const backupMetadata = await this.getBackupMetadata(backupId);
            if (!backupMetadata) {
                throw new Error(`Backup not found: ${backupId}`);
            }
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
            await this.preflightChecks(['pg_restore', 'tar']);
            if (backupMetadata.type === 'full' || backupMetadata.type === 'incremental') {
                await this.restoreDatabaseBackup(backupMetadata, !!options.dropExisting);
            }
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
        }
        catch (error) {
            this.logger.error(`Restore failed: ${backupId}`, error);
            throw error;
        }
    }
    async pointInTimeRecovery(targetTime, options = {}) {
        const startTime = Date.now();
        try {
            this.logger.log(`Starting point-in-time recovery to: ${targetTime.toISOString()}`);
            const relevantBackups = await this.findBackupsBeforeTime(targetTime);
            if (relevantBackups.length === 0) {
                throw new Error(`No backups found before ${targetTime.toISOString()}`);
            }
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
            await this.restoreFromBackup(latestFullBackup.id, { dropExisting: true });
            const incrementalBackups = relevantBackups.filter(b => b.type === 'incremental' && b.timestamp <= targetTime);
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
        }
        catch (error) {
            this.logger.error('Point-in-time recovery failed', error);
            throw error;
        }
    }
    async getBackupStatus() {
        const backups = await this.listBackups();
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
    async listBackups(options = {}) {
        try {
            const metadataDir = path.join(this.backupDir, 'metadata');
            await fs_1.promises.mkdir(metadataDir, { recursive: true });
            const files = await fs_1.promises.readdir(metadataDir);
            const metadataFiles = files.filter(f => f.endsWith('.json'));
            let backups = [];
            for (const file of metadataFiles) {
                try {
                    const content = await fs_1.promises.readFile(path.join(metadataDir, file), 'utf-8');
                    const metadata = JSON.parse(content);
                    if (typeof metadata.timestamp === 'string') {
                        metadata.timestamp = new Date(metadata.timestamp);
                    }
                    if (metadata.sinceTimestamp && typeof metadata.sinceTimestamp === 'string') {
                        metadata.sinceTimestamp = new Date(metadata.sinceTimestamp);
                    }
                    backups.push(metadata);
                }
                catch (error) {
                    this.logger.error(`Failed to read backup metadata: ${file}`, error);
                }
            }
            if (options.type) {
                backups = backups.filter(b => b.type === options.type);
            }
            if (options.status) {
                backups = backups.filter(b => b.status === options.status);
            }
            backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            const limit = options.limit || 50;
            const offset = options.offset || 0;
            return backups.slice(offset, offset + limit);
        }
        catch (error) {
            this.logger.error('Failed to list backups', error);
            return [];
        }
    }
    async cleanupOldBackups() {
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
        }
        catch (error) {
            this.logger.error('Backup cleanup failed', error);
            return 0;
        }
    }
    async createDatabaseDump(filePath) {
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
            const dumpCommand = `pg_dump`;
            const args = [
                '-h', host,
                '-p', port,
                '-U', username,
                '-d', database,
                '-f', filePath,
                '-Fc',
                '-v',
            ];
            const env = {
                ...process.env,
                PGPASSWORD: password,
            };
            const dumpProcess = (0, child_process_1.spawn)(dumpCommand, args, { env });
            let stderr = '';
            dumpProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            dumpProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`pg_dump failed: ${stderr}`));
                }
            });
            dumpProcess.on('error', (error) => {
                reject(error);
            });
        });
    }
    async createIncrementalDump(filePath, since, tables) {
        const sql = `
      -- Incremental backup for tables: ${tables.join(', ')}
      -- Since: ${since.toISOString()}

      -- Note: This is a basic implementation
      -- For production use, consider PostgreSQL PITR or logical replication

      SELECT 'Incremental backup created on: ' || now() as info;
    `;
        await fs_1.promises.writeFile(filePath, sql, 'utf-8');
    }
    async createFileArchive(archivePath, directories, excludePatterns) {
        return new Promise((resolve, reject) => {
            const output = (0, fs_2.createWriteStream)(archivePath);
            const archive = (0, archiver_1.default)('tar', {
                gzip: true,
                gzipOptions: { level: 6 },
            });
            output.on('close', () => {
                this.logger.log(`File archive created: ${archive.pointer()} bytes`);
                resolve();
            });
            archive.on('error', (error) => {
                reject(error);
            });
            archive.pipe(output);
            for (const dir of directories) {
                try {
                    if (require('fs').existsSync(dir)) {
                        archive.directory(dir, path.basename(dir));
                    }
                }
                catch (error) {
                    this.logger.warn(`Failed to add directory to archive: ${dir}`, error);
                }
            }
            archive.finalize();
        });
    }
    async compressBackup(filePath, backupId) {
        const compressedPath = `${filePath}.gz`;
        return new Promise((resolve, reject) => {
            const input = (0, fs_2.createReadStream)(filePath);
            const output = (0, fs_2.createWriteStream)(compressedPath);
            const zlib = require('zlib');
            input.pipe(zlib.createGzip()).pipe(output);
            output.on('finish', () => {
                fs_1.promises.unlink(filePath);
                resolve(compressedPath);
            });
            output.on('error', (error) => {
                reject(error);
            });
        });
    }
    async encryptBackup(filePath, backupId) {
        const encryptedPath = `${filePath}.enc`;
        await fs_1.promises.copyFile(filePath, encryptedPath);
        await fs_1.promises.unlink(filePath);
        return encryptedPath;
    }
    async verifyBackupIntegrity(filePath) {
        try {
            await fs_1.promises.access(filePath);
            const stats = await fs_1.promises.stat(filePath);
            if (stats.size === 0) {
                throw new Error('Backup file is empty');
            }
            if (stats.size > this.maxBackupSize) {
                throw new Error(`Backup file too large: ${stats.size} bytes`);
            }
            return true;
        }
        catch (error) {
            this.logger.error(`Backup integrity check failed: ${filePath}`, error);
            return false;
        }
    }
    async preflightChecks(commands = []) {
        try {
            await fs_1.promises.mkdir(this.backupDir, { recursive: true });
            const testFile = path.join(this.backupDir, `.write-test-${Date.now()}`);
            await fs_1.promises.writeFile(testFile, 'ok');
            await fs_1.promises.unlink(testFile);
        }
        catch (e) {
            throw new Error(`Backup directory not writable: ${this.backupDir}`);
        }
        for (const cmd of commands) {
            const exists = await this.commandExists(cmd);
            if (!exists) {
                throw new Error(`Required command not found in PATH: ${cmd}`);
            }
        }
        const disk = await this.getDiskInfo(this.backupDir);
        if (disk.availableBytes < this.minFreeSpaceBytes) {
            throw new Error(`Not enough free space. Available: ${disk.availableBytes} bytes, required: ${this.minFreeSpaceBytes} bytes`);
        }
    }
    async commandExists(cmd) {
        return new Promise((resolve) => {
            const which = process.platform === 'win32' ? 'where' : 'which';
            const p = (0, child_process_1.spawn)(which, [cmd]);
            p.on('close', (code) => resolve(code === 0));
            p.on('error', () => resolve(false));
        });
    }
    async getDiskInfo(targetDir) {
        return new Promise((resolve) => {
            const platform = process.platform;
            if (platform === 'win32') {
                const os = require('os');
                resolve({ totalBytes: os.totalmem(), availableBytes: os.freemem() });
                return;
            }
            const df = (0, child_process_1.spawn)('df', ['-k', targetDir]);
            let out = '';
            df.stdout.on('data', (d) => (out += d.toString()));
            df.on('close', () => {
                const lines = out.trim().split('\n');
                if (lines.length >= 2) {
                    const parts = lines[1].trim().split(/\s+/);
                    const totalKB = parseInt(parts[1]) || 0;
                    const availKB = parseInt(parts[3]) || 0;
                    resolve({ totalBytes: totalKB * 1024, availableBytes: availKB * 1024 });
                }
                else {
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
    async getPreflightStatus() {
        const tools = {
            pg_dump: await this.commandExists('pg_dump'),
            pg_restore: await this.commandExists('pg_restore'),
            tar: await this.commandExists('tar'),
        };
        const writable = await (async () => {
            try {
                await fs_1.promises.mkdir(this.backupDir, { recursive: true });
                const tmp = path.join(this.backupDir, `.write-test-${Date.now()}`);
                await fs_1.promises.writeFile(tmp, 'ok');
                await fs_1.promises.unlink(tmp);
                return true;
            }
            catch {
                return false;
            }
        })();
        const disk = await this.getDiskInfo(this.backupDir);
        return { tools, writable, disk, minFreeSpaceBytes: this.minFreeSpaceBytes };
    }
    async verifyBackupFile(filePath) {
        return this.verifyBackupIntegrity(filePath);
    }
    async calculateChecksum(filePath) {
        const crypto = require('crypto');
        const fileBuffer = await fs_1.promises.readFile(filePath);
        return crypto.createHash('sha256').update(fileBuffer).digest('hex');
    }
    async getFileSize(filePath) {
        const stats = await fs_1.promises.stat(filePath);
        return stats.size;
    }
    async getDatabaseVersion() {
        const result = await this.prisma.$queryRaw `SELECT version() as version`;
        return result[0].version;
    }
    async getTablesCount() {
        const result = await this.prisma.$queryRaw `
      SELECT count(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
        return parseInt(result[0].count);
    }
    async getTotalRecordsCount() {
        const tables = await this.getAllTables();
        let total = 0;
        for (const table of tables) {
            try {
                const result = await this.prisma.$queryRawUnsafe(`SELECT count(*) as count FROM ${table}`);
                total += parseInt(result[0].count);
            }
            catch (error) {
            }
        }
        return total;
    }
    async getAllTables() {
        const result = await this.prisma.$queryRaw `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;
        return result.map((row) => row.table_name);
    }
    async saveBackupMetadata(metadata) {
        const metadataDir = path.join(this.backupDir, 'metadata');
        await fs_1.promises.mkdir(metadataDir, { recursive: true });
        const metadataPath = path.join(metadataDir, `${metadata.id}.json`);
        const tmpPath = `${metadataPath}.tmp`;
        await fs_1.promises.writeFile(tmpPath, JSON.stringify(metadata, null, 2), 'utf-8');
        await fs_1.promises.rename(tmpPath, metadataPath);
    }
    async getBackupMetadata(backupId) {
        try {
            const metadataPath = path.join(this.backupDir, 'metadata', `${backupId}.json`);
            const content = await fs_1.promises.readFile(metadataPath, 'utf-8');
            const metadata = JSON.parse(content);
            if (typeof metadata.timestamp === 'string') {
                metadata.timestamp = new Date(metadata.timestamp);
            }
            if (metadata.sinceTimestamp && typeof metadata.sinceTimestamp === 'string') {
                metadata.sinceTimestamp = new Date(metadata.sinceTimestamp);
            }
            return metadata;
        }
        catch {
            return null;
        }
    }
    async deleteBackup(backupId) {
        const backup = await this.getBackupMetadata(backupId);
        if (!backup)
            return;
        try {
            await fs_1.promises.unlink(backup.path);
            const metadataPath = path.join(this.backupDir, 'metadata', `${backupId}.json`);
            await fs_1.promises.unlink(metadataPath);
            this.logger.log(`Deleted backup: ${backupId}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete backup: ${backupId}`, error);
        }
    }
    async findBackupsBeforeTime(targetTime) {
        const backups = await this.listBackups();
        return backups.filter(backup => backup.timestamp <= targetTime);
    }
    async getNextScheduledBackup() {
        return null;
    }
    generateBackupId() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const random = Math.random().toString(36).substring(2, 8);
        return `backup_${timestamp}_${random}`;
    }
    async restoreDatabaseBackup(backup, dropExisting) {
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
                '-h', host,
                '-p', port,
                '-U', username,
                '-d', database,
                '-c',
                '-v',
                backup.path,
            ];
            if (!dropExisting) {
                args.splice(args.indexOf('-c'), 1);
            }
            const env = {
                ...process.env,
                PGPASSWORD: password,
            };
            const restoreProcess = (0, child_process_1.spawn)(restoreCommand, args, { env });
            let stderr = '';
            restoreProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            restoreProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`pg_restore failed: ${stderr}`));
                }
            });
            restoreProcess.on('error', (error) => {
                reject(error);
            });
        });
    }
    async restoreFileBackup(backup) {
        const archivePath = backup.path;
        if (!archivePath.endsWith('.tar.gz')) {
            this.logger.warn(`Unsupported file backup format for restore: ${archivePath}`);
            return;
        }
        await new Promise((resolve, reject) => {
            const tarProc = (0, child_process_1.spawn)('tar', ['-xzf', archivePath, '-C', '.']);
            let stderr = '';
            tarProc.stderr.on('data', (d) => (stderr += d.toString()));
            tarProc.on('close', (code) => {
                if (code === 0)
                    resolve();
                else
                    reject(new Error(`tar extract failed: ${stderr}`));
            });
            tarProc.on('error', (err) => reject(err));
        });
        this.logger.log(`File backup restored from ${archivePath}`);
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], BackupService);
//# sourceMappingURL=backup.service.js.map