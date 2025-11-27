#!/bin/bash

# ==============================================================================
# 🔄 Automated Restore from Google Drive
# ==============================================================================
# This script lists backups from Google Drive, allows you to select one,
# downloads it, and restores it to the local PostgreSQL database.

# Load environment variables from .env if present
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    export $(grep -v '^#' .env | xargs)
fi

# Configuration
GDRIVE_REMOTE="gdriver" # Name of the rclone remote
GDRIVE_FOLDER_ID="1DXFFkGozTgtj4LRqP_iajWGZrB4qaUnH"
RESTORE_DIR="./restore_temp"

# Ensure restore directory exists
mkdir -p "$RESTORE_DIR"

# Check for required tools
if ! command -v rclone &> /dev/null; then
    echo "❌ Error: rclone is not installed."
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql (postgresql-client) is not installed."
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set."
    exit 1
fi

echo "========================================================"
echo "📂 Listing available backups on Google Drive..."
echo "========================================================"

# List files and store in array
# Format: size time path
FILES=$(rclone lsl "$GDRIVE_REMOTE:" --drive-root-folder-id "$GDRIVE_FOLDER_ID" | sort -k2,3)

if [ -z "$FILES" ]; then
    echo "❌ No backups found in Google Drive folder."
    exit 1
fi

# Display files with index
echo "$FILES" | awk '{print NR ") " $0}'

echo "========================================================"
read -p "Enter the number of the backup to restore: " FILE_NUM

# Get the selected filename
# We need to extract the filename which is the last column, handling spaces if any
# rclone lsl output: size date time filename
SELECTED_FILE=$(echo "$FILES" | sed -n "${FILE_NUM}p" | awk '{$1=$2=$3=""; print $0}' | sed 's/^[ \t]*//')

if [ -z "$SELECTED_FILE" ]; then
    echo "❌ Invalid selection."
    exit 1
fi

echo "========================================================"
echo "⬇️  Downloading $SELECTED_FILE..."
echo "========================================================"

rclone copy "$GDRIVE_REMOTE:$SELECTED_FILE" "$RESTORE_DIR" --drive-root-folder-id "$GDRIVE_FOLDER_ID"

if [ $? -ne 0 ]; then
    echo "❌ Download failed."
    exit 1
fi

LOCAL_FILE="$RESTORE_DIR/$(basename "$SELECTED_FILE")"

echo "========================================================"
echo "♻️  Restoring database from $LOCAL_FILE..."
echo "========================================================"
echo "⚠️  WARNING: This will overwrite the current database!"
read -p "Are you sure you want to proceed? (y/N): " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "❌ Restore cancelled."
    rm -rf "$RESTORE_DIR"
    exit 0
fi

# Check if file is gzipped
if [[ "$LOCAL_FILE" == *.gz ]]; then
    gunzip -c "$LOCAL_FILE" | psql "$DATABASE_URL"
else
    psql "$DATABASE_URL" < "$LOCAL_FILE"
fi

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully!"
else
    echo "❌ Database restore failed."
fi

# Cleanup
echo "🧹 Cleaning up..."
rm -rf "$RESTORE_DIR"