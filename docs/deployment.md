# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 15+ (for production)
- Docker (optional)

## Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment files
4. Run database migrations: `npm run db:push`
5. Start development servers: `npm run dev`

## Production Deployment
1. Build the application: `npm run build`
2. Set up environment variables
3. Run database migrations
4. Start production servers: `npm run start:prod`

## Docker Deployment
1. Build images: `docker-compose build`
2. Start services: `docker-compose up -d`
3. Check logs: `docker-compose logs -f`

## Environment Variables
See `backend/env-template.txt` for required environment variables.
