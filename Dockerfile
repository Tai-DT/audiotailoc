# Audio Tài Lộc - Multi-Service Dockerfile
# This is a multi-stage build for the entire application

# Build stage for backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install backend dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy backend source
COPY backend/src ./src/
COPY backend/tsconfig*.json ./

# Build backend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# Copy frontend build
COPY frontend/.next ./frontend/.next
COPY frontend/public ./frontend/public
COPY frontend/package*.json ./frontend/
COPY frontend/node_modules ./frontend/node_modules

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose ports
EXPOSE 3000 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start both services
CMD ["dumb-init", "sh", "-c", "cd backend && npm run start:prod & cd ../frontend && npm run start"]