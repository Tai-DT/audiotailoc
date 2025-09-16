# Backup & Recovery Documentation

## Overview

The Audio Tài Lộc platform includes a comprehensive backup and recovery system designed to protect against data loss and ensure business continuity. This document outlines the backup strategies, recovery procedures, and best practices implemented in the system.

## Backup Strategy

### Backup Types

1. **Full Backups**
   - Complete database backup including all tables and data
   - Scheduled daily at 2:00 AM Vietnam time
   - Includes schema, data, indexes, and stored procedures
   - Compressed and encrypted for security

2. **Incremental Backups**
   - Captures only changes since the last backup
   - Scheduled hourly during business hours (8 AM - 8 PM)
   - Faster backup process with minimal system impact
   - Enables point-in-time recovery

3. **Transaction Log Backups**
   - Continuous backup of transaction logs
   - Enables recovery to specific point in time
   - Minimal data loss in case of failure

### Backup Schedule

```
Full Backup:        Daily at 2:00 AM (0 2 * * *)
Incremental:        Hourly 8 AM - 8 PM (0 8-20 * * *)
Verification:       Weekly Sunday 3:00 AM (0 3 * * 0)
Cleanup:           Monthly 1st at 4:00 AM (0 4 1 * *)
Health Check:      Every 6 hours (0 */6 * * *)
```

### Retention Policy

- **Full Backups**: 30 days retention
- **Incremental Backups**: 7 days retention
- **Transaction Logs**: 7 days retention
- **Archive Backups**: 1 year retention (monthly)

## Storage Locations

### Local Storage
- Primary backup location: `./backups/`
- Fast recovery for recent backups
- Limited retention due to storage constraints

### Remote Storage
- **AWS S3**: Long-term storage and disaster recovery
- **Google Cloud Storage**: Secondary remote backup
- **Azure Blob Storage**: Tertiary backup option
- Encrypted in transit and at rest

## Backup Components

### Database Backup
- PostgreSQL database with all application data
- User accounts, orders, products, inventory
- Configuration and system settings
- Audit logs and transaction history

### File System Backup
- Uploaded images and documents
- Configuration files
- Application logs
- SSL certificates

### Application State
- Redis cache snapshots
- Session data
- Temporary files

## Recovery Procedures

### Point-in-Time Recovery

1. **Identify Recovery Point**
   ```bash
   # List available backups
   npm run backup:list
   
   # Find backup closest to desired time
   npm run backup:find --date="2024-01-15 14:30:00"
   ```

2. **Restore Database**
   ```bash
   # Restore from specific backup
   npm run backup:restore --backup-id="backup_20240115_143000"
   
   # Restore to specific timestamp
   npm run backup:restore --timestamp="2024-01-15 14:30:00"
   ```

3. **Verify Recovery**
   ```bash
   # Run integrity checks
   npm run backup:verify --backup-id="backup_20240115_143000"
   
   # Test application functionality
   npm run test:recovery
   ```

### Disaster Recovery

1. **Complete System Failure**
   - Deploy new infrastructure
   - Restore from latest full backup
   - Apply incremental backups
   - Restore file system data
   - Update DNS and configurations

2. **Database Corruption**
   - Stop application services
   - Restore from latest verified backup
   - Apply transaction logs if available
   - Verify data integrity
   - Restart services

3. **Partial Data Loss**
   - Identify affected data
   - Restore specific tables or records
   - Merge with current data if needed
   - Validate business logic

## Backup Verification

### Automated Verification
- **Integrity Checks**: SHA-256 checksums for all backup files
- **Structure Validation**: Database schema verification
- **Data Validation**: Sample data consistency checks
- **Restore Testing**: Weekly automated restore tests

### Manual Verification
- Monthly manual restore to test environment
- Business logic validation
- Performance testing after restore
- Documentation updates

## Monitoring and Alerting

### Health Monitoring
- Backup success/failure rates
- Backup file sizes and growth trends
- Storage utilization
- Recovery time objectives (RTO)
- Recovery point objectives (RPO)

### Alert Conditions
- Backup failure
- Missing scheduled backups
- Storage space warnings
- Verification failures
- Performance degradation

### Notification Channels
- Email alerts to administrators
- Slack notifications for critical issues
- SMS alerts for emergency situations
- Dashboard status indicators

## Security Measures

### Encryption
- **At Rest**: AES-256 encryption for all backup files
- **In Transit**: TLS 1.3 for data transfer
- **Key Management**: Secure key rotation and storage

### Access Control
- Role-based access to backup systems
- Multi-factor authentication required
- Audit logging for all backup operations
- IP whitelisting for backup access

### Compliance
- GDPR compliance for customer data
- SOC 2 Type II controls
- Regular security audits
- Data retention policies

## Performance Optimization

### Backup Performance
- Parallel backup processing
- Compression to reduce storage
- Incremental backups to minimize time
- Off-peak scheduling

### Recovery Performance
- Fast local recovery options
- Parallel restore processes
- Pre-staged recovery environments
- Automated failover capabilities

## Troubleshooting

### Common Issues

1. **Backup Failures**
   ```bash
   # Check backup logs
   tail -f logs/backup.log
   
   # Verify disk space
   df -h /backup
   
   # Test database connectivity
   npm run backup:test-connection
   ```

2. **Slow Backups**
   ```bash
   # Check system resources
   top
   iostat -x 1
   
   # Optimize backup settings
   npm run backup:optimize
   ```

3. **Restore Issues**
   ```bash
   # Verify backup integrity
   npm run backup:verify --backup-id="backup_id"
   
   # Check restore logs
   tail -f logs/restore.log
   ```

### Recovery Scenarios

1. **Database Server Failure**
   - Estimated Recovery Time: 2-4 hours
   - Steps: Deploy new server, restore from backup, update configurations

2. **Data Corruption**
   - Estimated Recovery Time: 1-2 hours
   - Steps: Identify corruption scope, restore affected data, verify integrity

3. **Complete Site Failure**
   - Estimated Recovery Time: 4-8 hours
   - Steps: Deploy infrastructure, restore all components, update DNS

## Best Practices

### Backup Management
- Regular testing of backup and restore procedures
- Documentation of all recovery scenarios
- Training for operations team
- Regular review and updates of procedures

### Data Protection
- Implement backup verification
- Use multiple storage locations
- Regular security audits
- Compliance with data protection regulations

### Business Continuity
- Define RTO and RPO objectives
- Maintain updated disaster recovery plans
- Regular business continuity testing
- Communication plans for incidents

## Configuration

### Environment Variables
```bash
# Backup settings
BACKUP_ENABLED=true
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=30
BACKUP_COMPRESSION=true
BACKUP_ENCRYPTION=true

# Remote storage
BACKUP_REMOTE_ENABLED=true
BACKUP_REMOTE_PROVIDER=aws
AWS_S3_BUCKET=audiotailoc-backups
AWS_REGION=ap-southeast-1

# Scheduling
BACKUP_SCHEDULER_ENABLED=true
BACKUP_FULL_SCHEDULE="0 2 * * *"
BACKUP_INCREMENTAL_SCHEDULE="0 8-20 * * *"

# Notifications
BACKUP_NOTIFICATIONS_ENABLED=true
BACKUP_EMAIL_RECIPIENTS=admin@audiotailoc.com
BACKUP_SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### Database Configuration
```sql
-- Enable point-in-time recovery
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /backup/wal/%f';
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET wal_keep_segments = 32;
```

## API Reference

### Backup Operations
```typescript
// Create backup
POST /api/admin/backup/full
POST /api/admin/backup/incremental

// List backups
GET /api/admin/backup

// Get backup details
GET /api/admin/backup/:id

// Verify backup
POST /api/admin/backup/:id/verify

// Restore backup
POST /api/admin/backup/:id/restore

// Delete backup
DELETE /api/admin/backup/:id
```

### Monitoring Endpoints
```typescript
// Backup statistics
GET /api/admin/backup/stats

// Health check
GET /api/admin/backup/health

// Scheduler status
GET /api/admin/backup/scheduler
```

## Support and Maintenance

### Regular Maintenance
- Weekly backup verification
- Monthly disaster recovery testing
- Quarterly security reviews
- Annual procedure updates

### Support Contacts
- **Primary**: DevOps Team (devops@audiotailoc.com)
- **Secondary**: System Administrator (admin@audiotailoc.com)
- **Emergency**: On-call Engineer (+84-xxx-xxx-xxx)

### Documentation Updates
This document should be reviewed and updated:
- After any system changes
- Following disaster recovery events
- During quarterly reviews
- When procedures are modified

---

**Last Updated**: January 2024
**Version**: 1.0
**Next Review**: April 2024
