# Comprehensive Backup & Disaster Recovery System

Enterprise-grade backup and disaster recovery system with automated scheduling, point-in-time recovery, and comprehensive monitoring.

## Features

### ✅ **Implemented:**
- **Automated Backup Scheduling** - Cron-based backup scheduling with multiple types
- **Full Database Backups** - Complete PostgreSQL database dumps with compression
- **Incremental Backups** - Efficient incremental backups based on timestamps
- **File System Backups** - Archive and backup uploaded files and configurations
- **Point-in-Time Recovery** - Restore to specific timestamps
- **Backup Verification** - Integrity checks and checksum validation
- **Compression & Encryption** - Optional compression and encryption support
- **Monitoring & Analytics** - Backup status monitoring and analytics

### 📋 **Backup Types Supported:**

1. **Full Database Backup** - Complete database dump with all data
2. **Incremental Backup** - Changes since last backup (timestamp-based)
3. **File System Backup** - Uploads, logs, and configuration files
4. **Point-in-Time Recovery** - Restore to specific moment in time
5. **Automated Scheduling** - Cron-based automated backups

## Quick Start

### 1. **Manual Backup Creation**

```typescript
import { BackupService } from './backup.service';

// Create full backup
const fullBackup = await backupService.createFullBackup({
  includeFiles: true,
  compress: true,
  encrypt: false,
  comment: 'Manual full backup'
});

// Create incremental backup
const incrementalBackup = await backupService.createIncrementalBackup({
  since: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
  compress: true,
  comment: 'Hourly incremental backup'
});

// Create file backup
const fileBackup = await backupService.createFileBackup('files_backup_001', {
  directories: ['./uploads', './logs'],
  excludePatterns: ['*.tmp', '*.log'],
  compress: true,
});
```

### 2. **Backup Scheduling**

```typescript
import { BackupSchedulerService } from './backup-scheduler.service';

// Create automated schedule
const schedule = await backupScheduler.createSchedule({
  id: 'daily_full_backup',
  name: 'Daily Full Backup',
  type: 'full',
  cronExpression: '0 2 * * *', // Daily at 2 AM
  enabled: true,
  options: {
    includeFiles: true,
    compress: true,
    retentionDays: 30,
  },
});

// Update existing schedule
await backupScheduler.updateSchedule('daily_full_backup', {
  cronExpression: '0 3 * * *', // Change to 3 AM
});

// Disable schedule
await backupScheduler.disableSchedule('daily_full_backup');
```

### 3. **Backup Restoration**

```typescript
// Restore from specific backup
const restoreResult = await backupService.restoreFromBackup('backup_123', {
  dropExisting: true,
  verifyBeforeRestore: true,
  dryRun: false,
});

// Point-in-time recovery
const pitResult = await backupService.pointInTimeRecovery(
  new Date('2024-01-15T10:30:00Z'),
  {
    dryRun: true,
    verify: true,
  }
);
```

## Backup Configuration

### Environment Variables

```env
# Backup Configuration
BACKUP_DIR=./backups                    # Backup storage directory
BACKUP_RETENTION_DAYS=30                # Days to keep backups
MAX_BACKUP_SIZE_MB=1024                 # Maximum backup size

# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Scheduling Configuration
BACKUP_SCHEDULES=[{
  "id": "daily_backup",
  "name": "Daily Full Backup",
  "type": "full",
  "cronExpression": "0 2 * * *",
  "enabled": true,
  "options": {
    "includeFiles": true,
    "compress": true
  }
}]

# Encryption (Optional)
BACKUP_ENCRYPTION_KEY=your-encryption-key
BACKUP_ENCRYPTION_ENABLED=false
```

### Directory Structure

```
backups/
├── database/                    # Database backup files
│   ├── backup_123.sql
│   ├── backup_123.sql.gz
│   └── incremental_456.sql
├── files/                      # File backup archives
│   ├── files_backup_789.tar.gz
│   └── config_backup_101.tar.gz
└── metadata/                   # Backup metadata JSON files
    ├── backup_123.json
    ├── backup_456.json
    └── files_backup_789.json
```

## API Endpoints

### Backup Management
```bash
GET    /api/v1/backup/status                    # Get backup status
GET    /api/v1/backup/list                      # List all backups
GET    /api/v1/backup/:backupId                 # Get backup details
POST   /api/v1/backup/full                      # Create full backup
POST   /api/v1/backup/incremental               # Create incremental backup
POST   /api/v1/backup/files                     # Create file backup
POST   /api/v1/backup/restore/:backupId         # Restore from backup
POST   /api/v1/backup/restore/point-in-time     # Point-in-time recovery
GET    /api/v1/backup/:backupId/download        # Download backup file
DELETE /api/v1/backup/:backupId                 # Delete backup
POST   /api/v1/backup/cleanup                   # Cleanup old backups
GET    /api/v1/backup/analytics/overview        # Backup analytics
```

### Scheduling Management
```bash
POST   /api/v1/backup/schedules                 # Create backup schedule
GET    /api/v1/backup/schedules                 # List all schedules
GET    /api/v1/backup/schedules/:scheduleId     # Get schedule details
PUT    /api/v1/backup/schedules/:scheduleId     # Update schedule
DELETE /api/v1/backup/schedules/:scheduleId     # Delete schedule
POST   /api/v1/backup/schedules/:scheduleId/enable   # Enable schedule
POST   /api/v1/backup/schedules/:scheduleId/disable  # Disable schedule
POST   /api/v1/backup/schedules/:scheduleId/run      # Force run schedule
```

## Backup Strategies

### 1. **Full Backup Strategy**
- Complete database dump
- Includes all tables and data
- Can include file backups
- Best for disaster recovery
- Higher storage usage

```typescript
const fullBackup = await backupService.createFullBackup({
  includeFiles: true,
  compress: true,
  encrypt: true,
  comment: 'Weekly full backup'
});
```

### 2. **Incremental Backup Strategy**
- Only changes since last backup
- Timestamp-based change detection
- Lower storage usage
- Faster backup creation
- Requires full backup for restore

```typescript
const incrementalBackup = await backupService.createIncrementalBackup({
  since: new Date(Date.now() - 24 * 60 * 60 * 1000),
  tables: ['orders', 'products', 'users'],
  compress: true,
  comment: 'Daily incremental backup'
});
```

### 3. **File Backup Strategy**
- Backup uploaded files and configurations
- Exclude temporary and log files
- Supports multiple directories
- Archive format with compression

```typescript
const fileBackup = await backupService.createFileBackup('files_backup', {
  directories: [
    './uploads',
    './public',
    './config'
  ],
  excludePatterns: [
    '*.tmp',
    '*.log',
    'node_modules/**',
    '.git/**'
  ],
  compress: true
});
```

## Scheduling Examples

### Daily Full Backup
```typescript
{
  id: 'daily_full_backup',
  name: 'Daily Full Backup',
  type: 'full',
  cronExpression: '0 2 * * *',        // 2 AM daily
  enabled: true,
  options: {
    includeFiles: true,
    compress: true,
    encrypt: false,
    retentionDays: 30,
    comment: 'Automated daily full backup'
  }
}
```

### Hourly Incremental Backup
```typescript
{
  id: 'hourly_incremental_backup',
  name: 'Hourly Incremental Backup',
  type: 'incremental',
  cronExpression: '0 * * * *',        // Every hour
  enabled: true,
  options: {
    compress: true,
    comment: 'Automated hourly incremental backup'
  }
}
```

### Weekly File Backup
```typescript
{
  id: 'weekly_file_backup',
  name: 'Weekly File Backup',
  type: 'files',
  cronExpression: '0 3 * * 0',        // Sunday 3 AM
  enabled: true,
  options: {
    compress: true,
    comment: 'Automated weekly file backup'
  }
}
```

## Disaster Recovery Procedures

### 1. **Complete System Recovery**
```typescript
// Step 1: Identify latest full backup
const backups = await backupService.listBackups({ type: 'full' });
const latestFullBackup = backups[0];

// Step 2: Restore full backup
await backupService.restoreFromBackup(latestFullBackup.id, {
  dropExisting: true,
  verifyBeforeRestore: true
});

// Step 3: Apply incremental backups (if any)
const incrementalBackups = await backupService.listBackups({
  type: 'incremental'
});

for (const backup of incrementalBackups) {
  await backupService.restoreFromBackup(backup.id, {
    dropExisting: false
  });
}

// Step 4: Restore files
const fileBackups = await backupService.listBackups({ type: 'files' });
if (fileBackups.length > 0) {
  await backupService.restoreFromBackup(fileBackups[0].id);
}
```

### 2. **Point-in-Time Recovery**
```typescript
// Restore to specific timestamp
const targetTime = new Date('2024-01-15T14:30:00Z');

const result = await backupService.pointInTimeRecovery(targetTime, {
  dryRun: false,
  verify: true
});

console.log(`Recovery completed in ${result.duration}ms`);
```

### 3. **Partial Recovery**
```typescript
// Restore specific tables only
const incrementalBackup = await backupService.createIncrementalBackup({
  since: targetTime,
  tables: ['orders', 'payments'], // Only specific tables
  comment: 'Partial recovery backup'
});

// Restore only the incremental backup
await backupService.restoreFromBackup(incrementalBackup.backupId, {
  dropExisting: false
});
```

## Monitoring & Alerting

### Backup Status Monitoring
```typescript
// Get current backup status
const status = await backupService.getBackupStatus();
console.log(`Latest backup: ${status.latestBackup}`);
console.log(`Total backups: ${status.totalBackups}`);
console.log(`Backup in progress: ${status.isBackupInProgress}`);

// Get scheduler status
const schedulerStats = backupScheduler.getSchedulerStats();
console.log(`Active schedules: ${schedulerStats.activeSchedules}`);
console.log(`Next backup: ${schedulerStats.nextScheduledBackup}`);
```

### Backup Analytics
```typescript
// Get backup analytics
const analytics = await backupService.getBackupAnalytics();
console.log(`Success rate: ${analytics.successRate}%`);
console.log(`Average backup size: ${analytics.averageBackupSize} bytes`);
console.log(`Total storage used: ${analytics.totalSize} bytes`);
```

### Prometheus Metrics
```typescript
# Backup metrics
backup_total_backups{service="audiotailoc"} <number>
backup_success_rate{service="audiotailoc"} <percentage>
backup_storage_used{service="audiotailoc"} <bytes>
backup_last_success_time{service="audiotailoc"} <timestamp>
backup_duration_seconds{service="audiotailoc",type="full"} <seconds>
```

## Security Best Practices

### 1. **Encryption**
```typescript
// Enable backup encryption
const encryptedBackup = await backupService.createFullBackup({
  encrypt: true,
  compression: true
});
```

### 2. **Access Control**
```typescript
// Restrict backup access
// - Store backups in secure location
// - Use IAM roles for cloud storage
// - Encrypt sensitive data before backup
```

### 3. **Secure Storage**
```typescript
// Use secure storage for backups
// - AWS S3 with encryption
// - Google Cloud Storage
// - Azure Blob Storage
// - Encrypted local storage
```

## Performance Optimization

### 1. **Backup Performance**
```typescript
// Use compression to reduce size
const compressedBackup = await backupService.createFullBackup({
  compress: true,  // Reduces storage and transfer time
  encrypt: false
});

// Parallel processing for large datasets
const parallelBackups = await Promise.all([
  backupService.createIncrementalBackup({ tables: ['users', 'profiles'] }),
  backupService.createIncrementalBackup({ tables: ['orders', 'payments'] })
]);
```

### 2. **Storage Optimization**
```typescript
// Automatic cleanup of old backups
await backupService.cleanupOldBackups();

// Set appropriate retention periods
const schedule = await backupScheduler.createSchedule({
  type: 'full',
  retentionDays: 30,  // Keep 30 days of full backups
  options: {
    compress: true,
    includeFiles: false
  }
});
```

## Troubleshooting

### Common Issues

1. **Backup Creation Fails**
   ```bash
   # Check database connectivity
   pg_isready -h localhost -p 5432

   # Check disk space
   df -h

   # Check backup directory permissions
   ls -la /path/to/backups
   ```

2. **Restore Fails**
   ```bash
   # Verify backup integrity
   pg_restore --verify backup.sql

   # Check database permissions
   psql -U postgres -c "SELECT current_user;"

   # Ensure no active connections during restore
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'your_db';
   ```

3. **Schedule Not Running**
   ```typescript
   // Check schedule status
   const status = backupScheduler.getDetailedStatus();
   console.log('Scheduler healthy:', status.isHealthy);

   // Force run a schedule
   await backupScheduler.forceRunSchedule('schedule_id');
   ```

4. **Storage Full**
   ```bash
   # Check disk usage
   du -sh /path/to/backups

   # Clean old backups
   curl -X POST http://localhost:3000/api/v1/backup/cleanup

   # Increase retention period
   export BACKUP_RETENTION_DAYS=60
   ```

## Production Deployment

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

# Install PostgreSQL client for backups
RUN apk add --no-cache postgresql-client

# Create backup directory
RUN mkdir -p /app/backups && chown node:node /app/backups

# Set environment variables
ENV BACKUP_DIR=/app/backups
ENV BACKUP_RETENTION_DAYS=30
ENV MAX_BACKUP_SIZE_MB=2048

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js
```

### Kubernetes Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backup-config
data:
  BACKUP_RETENTION_DAYS: "30"
  BACKUP_DIR: "/backups"
  BACKUP_SCHEDULES: |
    [
      {
        "id": "daily_backup",
        "name": "Daily Full Backup",
        "type": "full",
        "cronExpression": "0 2 * * *",
        "enabled": true,
        "options": {
          "compress": true,
          "includeFiles": true
        }
      }
    ]

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: backup-storage
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi

---
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: audiotaloc/backup:latest
            envFrom:
            - configMapRef:
                name: backup-config
            volumeMounts:
            - name: backup-storage
              mountPath: /backups
            command: ["npm", "run", "backup:create-full"]
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-storage
          restartPolicy: OnFailure
```

### Cloud Storage Integration
```typescript
// AWS S3 Integration
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload backup to S3
const uploadToS3 = async (backupPath: string, key: string) => {
  const fileContent = await fs.readFile(backupPath);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `backups/${key}`,
    Body: fileContent,
    ServerSideEncryption: 'AES256',
  });

  await s3Client.send(command);
};
```

This comprehensive backup and disaster recovery system ensures your Audio Tài Lộc backend data is always safe and recoverable, with automated scheduling, monitoring, and enterprise-grade features.
