import { registerAs } from '@nestjs/config';

export default registerAs('backup', () => ({
  // General backup settings
  enabled: process.env.BACKUP_ENABLED === 'true' || true,
  directory: process.env.BACKUP_DIR || './backups',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
  
  // Compression settings
  compression: {
    enabled: process.env.BACKUP_COMPRESSION === 'true' || true,
    algorithm: process.env.BACKUP_COMPRESSION_ALGORITHM || 'gzip',
    level: parseInt(process.env.BACKUP_COMPRESSION_LEVEL || '6', 10),
  },

  // Encryption settings
  encryption: {
    enabled: process.env.BACKUP_ENCRYPTION === 'true' || true,
    algorithm: process.env.BACKUP_ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    key: process.env.BACKUP_ENCRYPTION_KEY || 'default-backup-key-change-in-production',
  },

  // Schedule settings
  schedule: {
    enabled: process.env.BACKUP_SCHEDULER_ENABLED === 'true' || true,
    fullBackup: process.env.BACKUP_FULL_SCHEDULE || '0 2 * * *', // Daily at 2 AM
    incrementalBackup: process.env.BACKUP_INCREMENTAL_SCHEDULE || '0 8-20 * * *', // Hourly during business hours
    verification: process.env.BACKUP_VERIFICATION_SCHEDULE || '0 3 * * 0', // Weekly on Sunday at 3 AM
    cleanup: process.env.BACKUP_CLEANUP_SCHEDULE || '0 4 1 * *', // Monthly on 1st at 4 AM
    healthCheck: process.env.BACKUP_HEALTH_CHECK_SCHEDULE || '0 */6 * * *', // Every 6 hours
  },

  // Remote storage settings
  remoteStorage: {
    enabled: process.env.BACKUP_REMOTE_ENABLED === 'true' || false,
    provider: process.env.BACKUP_REMOTE_PROVIDER || 'aws', // aws, gcp, azure
    
    // AWS S3 settings
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.BACKUP_S3_BUCKET || '',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      endpoint: process.env.AWS_S3_ENDPOINT || undefined,
      forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true' || false,
    },

    // Google Cloud Storage settings
    gcp: {
      projectId: process.env.GCP_PROJECT_ID || '',
      bucket: process.env.BACKUP_GCS_BUCKET || '',
      keyFilename: process.env.GCP_KEY_FILENAME || '',
      credentials: process.env.GCP_CREDENTIALS ? JSON.parse(process.env.GCP_CREDENTIALS) : undefined,
    },

    // Azure Blob Storage settings
    azure: {
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY || '',
      containerName: process.env.BACKUP_AZURE_CONTAINER || '',
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
    },
  },

  // Database settings
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'audiotailoc',
    
    // Backup-specific settings
    maxConnections: parseInt(process.env.BACKUP_DB_MAX_CONNECTIONS || '5', 10),
    timeout: parseInt(process.env.BACKUP_DB_TIMEOUT || '300000', 10), // 5 minutes
    
    // Tables to exclude from backup
    excludeTables: (process.env.BACKUP_EXCLUDE_TABLES || '').split(',').filter(Boolean),
    
    // Tables to include in backup (if specified, only these will be backed up)
    includeTables: (process.env.BACKUP_INCLUDE_TABLES || '').split(',').filter(Boolean),
  },

  // Notification settings
  notifications: {
    enabled: process.env.BACKUP_NOTIFICATIONS_ENABLED === 'true' || true,
    
    // Email notifications
    email: {
      enabled: process.env.BACKUP_EMAIL_NOTIFICATIONS === 'true' || false,
      recipients: (process.env.BACKUP_EMAIL_RECIPIENTS || '').split(',').filter(Boolean),
      onSuccess: process.env.BACKUP_EMAIL_ON_SUCCESS === 'true' || false,
      onFailure: process.env.BACKUP_EMAIL_ON_FAILURE === 'true' || true,
      onWarning: process.env.BACKUP_EMAIL_ON_WARNING === 'true' || true,
    },

    // Slack notifications
    slack: {
      enabled: process.env.BACKUP_SLACK_NOTIFICATIONS === 'true' || false,
      webhookUrl: process.env.BACKUP_SLACK_WEBHOOK_URL || '',
      channel: process.env.BACKUP_SLACK_CHANNEL || '#alerts',
      onSuccess: process.env.BACKUP_SLACK_ON_SUCCESS === 'true' || false,
      onFailure: process.env.BACKUP_SLACK_ON_FAILURE === 'true' || true,
      onWarning: process.env.BACKUP_SLACK_ON_WARNING === 'true' || true,
    },

    // Discord notifications
    discord: {
      enabled: process.env.BACKUP_DISCORD_NOTIFICATIONS === 'true' || false,
      webhookUrl: process.env.BACKUP_DISCORD_WEBHOOK_URL || '',
      onSuccess: process.env.BACKUP_DISCORD_ON_SUCCESS === 'true' || false,
      onFailure: process.env.BACKUP_DISCORD_ON_FAILURE === 'true' || true,
      onWarning: process.env.BACKUP_DISCORD_ON_WARNING === 'true' || true,
    },
  },

  // Performance settings
  performance: {
    maxConcurrentBackups: parseInt(process.env.BACKUP_MAX_CONCURRENT || '1', 10),
    chunkSize: parseInt(process.env.BACKUP_CHUNK_SIZE || '1048576', 10), // 1MB
    bufferSize: parseInt(process.env.BACKUP_BUFFER_SIZE || '65536', 10), // 64KB
    
    // Rate limiting for remote uploads
    uploadRateLimit: {
      enabled: process.env.BACKUP_UPLOAD_RATE_LIMIT === 'true' || false,
      maxBytesPerSecond: parseInt(process.env.BACKUP_UPLOAD_MAX_BPS || '10485760', 10), // 10MB/s
    },
  },

  // Monitoring settings
  monitoring: {
    enabled: process.env.BACKUP_MONITORING_ENABLED === 'true' || true,
    
    // Health check settings
    healthCheck: {
      maxBackupAge: parseInt(process.env.BACKUP_MAX_AGE_HOURS || '25', 10), // 25 hours
      minSuccessRate: parseInt(process.env.BACKUP_MIN_SUCCESS_RATE || '90', 10), // 90%
      maxFailedAttempts: parseInt(process.env.BACKUP_MAX_FAILED_ATTEMPTS || '3', 10),
    },

    // Metrics collection
    metrics: {
      enabled: process.env.BACKUP_METRICS_ENABLED === 'true' || true,
      endpoint: process.env.BACKUP_METRICS_ENDPOINT || '/metrics',
      interval: parseInt(process.env.BACKUP_METRICS_INTERVAL || '60000', 10), // 1 minute
    },
  },

  // Security settings
  security: {
    // Access control
    accessControl: {
      enabled: process.env.BACKUP_ACCESS_CONTROL === 'true' || true,
      allowedIPs: (process.env.BACKUP_ALLOWED_IPS || '').split(',').filter(Boolean),
      requireAuth: process.env.BACKUP_REQUIRE_AUTH === 'true' || true,
    },

    // Audit logging
    auditLog: {
      enabled: process.env.BACKUP_AUDIT_LOG === 'true' || true,
      logFile: process.env.BACKUP_AUDIT_LOG_FILE || './logs/backup-audit.log',
      maxSize: parseInt(process.env.BACKUP_AUDIT_LOG_MAX_SIZE || '10485760', 10), // 10MB
      maxFiles: parseInt(process.env.BACKUP_AUDIT_LOG_MAX_FILES || '5', 10),
    },

    // Integrity verification
    integrity: {
      enabled: process.env.BACKUP_INTEGRITY_CHECK === 'true' || true,
      algorithm: process.env.BACKUP_INTEGRITY_ALGORITHM || 'sha256',
      verifyOnRestore: process.env.BACKUP_VERIFY_ON_RESTORE === 'true' || true,
    },
  },

  // Recovery settings
  recovery: {
    // Point-in-time recovery
    pointInTimeRecovery: {
      enabled: process.env.BACKUP_PITR_ENABLED === 'true' || true,
      retentionDays: parseInt(process.env.BACKUP_PITR_RETENTION_DAYS || '7', 10),
      intervalMinutes: parseInt(process.env.BACKUP_PITR_INTERVAL_MINUTES || '15', 10),
    },

    // Recovery testing
    testing: {
      enabled: process.env.BACKUP_RECOVERY_TESTING === 'true' || false,
      schedule: process.env.BACKUP_RECOVERY_TEST_SCHEDULE || '0 5 * * 0', // Weekly on Sunday at 5 AM
      testDatabase: process.env.BACKUP_TEST_DATABASE || 'audiotailoc_test_restore',
    },

    // Recovery options
    options: {
      allowPartialRestore: process.env.BACKUP_ALLOW_PARTIAL_RESTORE === 'true' || true,
      maxRestoreTime: parseInt(process.env.BACKUP_MAX_RESTORE_TIME || '3600000', 10), // 1 hour
      verifyAfterRestore: process.env.BACKUP_VERIFY_AFTER_RESTORE === 'true' || true,
    },
  },

  // Advanced settings
  advanced: {
    // Parallel processing
    parallelProcessing: {
      enabled: process.env.BACKUP_PARALLEL_PROCESSING === 'true' || false,
      maxWorkers: parseInt(process.env.BACKUP_MAX_WORKERS || '2', 10),
      workerTimeout: parseInt(process.env.BACKUP_WORKER_TIMEOUT || '1800000', 10), // 30 minutes
    },

    // Custom scripts
    customScripts: {
      preBackup: process.env.BACKUP_PRE_SCRIPT || '',
      postBackup: process.env.BACKUP_POST_SCRIPT || '',
      preRestore: process.env.BACKUP_PRE_RESTORE_SCRIPT || '',
      postRestore: process.env.BACKUP_POST_RESTORE_SCRIPT || '',
    },

    // Backup validation
    validation: {
      enabled: process.env.BACKUP_VALIDATION_ENABLED === 'true' || true,
      checksumValidation: process.env.BACKUP_CHECKSUM_VALIDATION === 'true' || true,
      structureValidation: process.env.BACKUP_STRUCTURE_VALIDATION === 'true' || true,
      dataValidation: process.env.BACKUP_DATA_VALIDATION === 'true' || false,
    },
  },
}));
