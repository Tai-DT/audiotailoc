#!/bin/bash
set -e

echo "🚀 Starting Heroku deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🗃️ Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗃️ Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Deployment preparation complete!"