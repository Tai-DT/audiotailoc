#!/bin/bash

# ==============================================================================
# 🚀 Automated Backup Pipeline to Google Drive
# ==============================================================================
# This script dumps the PostgreSQL database, compresses it, and uploads it to
# a specified Google Drive folder using Rclone.
#
# Requirements:
# - rclone installed and configured
# - pg_dump installed (usually part of postgresql-client)
# - DATABASE_URL environment variable set
# ==============================================================================

# Load environment variables from .env if present
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    export $(grep -v '^#' .env | xargs)
fi

# Configuration
GDRIVE_REMOTE="gdriver" # Name of the rclone remote
GDRIVE_FOLDER_ID="1DXFFkGozTgtj4LRqP_iajWGZrB4qaUnH" # Target Folder ID
BACKUP_DIR="./backups_temp"
TIMESTAMP=$(date +"%Y-%m-%dT%H-%M-%S")
BACKUP_FILENAME="backup_${TIMESTAMP}.sql"
COMPRESSED_FILENAME="${BACKUP_FILENAME}.gz"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Check for required tools
if ! command -v rclone &> /dev/null; then
    echo "❌ Error: rclone is not installed."
    echo "   Please install it or add the heroku-buildpack-apt if running on Heroku."
    exit 1
fi

if ! command -v pg_dump &> /dev/null; then
    echo "❌ Error: pg_dump is not installed."
    echo "   Please install postgresql-client."
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set."
    exit 1
fi

echo "========================================================"
echo "🔄 Starting Backup Process at $TIMESTAMP"
echo "========================================================"

# 1. Dump Database
echo "📦 Dumping database..."
pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILENAME"

if [ $? -ne 0 ]; then
    echo "❌ Error: Database dump failed."
    rm -f "$BACKUP_DIR/$BACKUP_FILENAME"
    exit 1
fi

# 2. Compress Backup
echo "🗜️  Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILENAME"

if [ $? -ne 0 ]; then
    echo "❌ Error: Compression failed."
    rm -f "$BACKUP_DIR/$BACKUP_FILENAME"
    exit 1
fi

# 3. Upload to Google Drive
echo "☁️  Uploading to Google Drive (Folder ID: $GDRIVE_FOLDER_ID)..."

# Using --drive-root-folder-id to target specific folder without mounting
# We use the remote name 'gdrive' which should be configured via ENV vars or config file
rclone copy "$BACKUP_DIR/$COMPRESSED_FILENAME" "$GDRIVE_REMOTE:" --drive-root-folder-id "$GDRIVE_FOLDER_ID"

if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
else
    echo "❌ Error: Upload to Google Drive failed."
    # Don't exit yet, let's try to clean up
fi

# 4. Cleanup
echo "🧹 Cleaning up temporary files..."
rm -f "$BACKUP_DIR/$COMPRESSED_FILENAME"
rm -rf "$BACKUP_DIR"

echo "========================================================"
echo "🎉 Backup Pipeline Completed"
echo "========================================================"