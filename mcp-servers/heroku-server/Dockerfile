# Multi-stage build for MCP Heroku Server
FROM node:18-alpine AS builder

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../common/package*.json ../common/

# Install dependencies
RUN npm ci --only=production

# Copy common package source
COPY ../common/src ../common/src
COPY ../common/tsconfig.json ../common/

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build the application
RUN npm run build

FROM node:18-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcpuser -u 1001

# Copy package files
COPY package*.json ./

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Change ownership to nodejs user
RUN chown -R mcpuser:nodejs /app
USER mcpuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]