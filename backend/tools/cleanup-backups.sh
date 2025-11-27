#!/bin/bash

# Cleanup old backup files
# Keep only the last 10 backups

echo "🧹 Cleaning up old backup files..."

# Clean database backups (keep last 10)
cd backups/database
if [ $(ls | wc -l) -gt 10 ]; then
  echo "Cleaning database backups..."
  ls -t | tail -n +11 | xargs -r rm
  echo "✅ Database backups cleaned"
fi

# Clean metadata backups (keep last 10)
cd ../metadata
if [ $(ls | wc -l) -gt 10 ]; then
  echo "Cleaning metadata backups..."
  ls -t | tail -n +11 | xargs -r rm
  echo "✅ Metadata backups cleaned"
fi

echo "🎉 Backup cleanup complete!"
