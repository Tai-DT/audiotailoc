# Use Node.js 18 LTS
FROM node:18-alpine

# Install curl for health check
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./
COPY backend/yarn.lock ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy Prisma schema from backend directory
COPY backend/prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code from backend directory
COPY backend/ .

# Build the application
RUN npm run build

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3010/health || exit 1

# Start the application
CMD ["npm", "start"]