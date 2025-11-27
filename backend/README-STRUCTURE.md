# Backend Directory Structure

This document describes the organized structure of the Audio Tài Lộc backend.

## 📁 Directory Organization

### Root Level
- `package.json` - Dependencies and scripts
- `README.md` - Main documentation
- `.env*` - Environment configuration files
- `docker-compose*.yml` - Docker configurations
- `Procfile` - Heroku process file

### `/config/`
Configuration files:
- `tsconfig*.json` - TypeScript configuration
- `nest-cli.json` - NestJS CLI configuration
- `.eslintrc.js` - ESLint configuration
- `jest.config.js` - Jest testing configuration
- `commitlint.config.js` - Commit linting configuration

### `/src/`
Source code (clean and organized):
- `app.module.ts` - Main application module
- `main.ts` - Application entry point
- `modules/` - Feature modules
- `common/` - Shared utilities
- `config/` - Application configuration
- `services/` - Business logic services
- `types/` - TypeScript type definitions

### `/scripts/`
Utility scripts organized by purpose:
- `archive/` - Old/archived scripts
- `utils/` - Active utility scripts
- `dev/` - Development tools
- `setup/` - Setup scripts

### `/tools/`
Development and deployment tools:
- `cleanup-backups.sh` - Backup cleanup utility
- `artillery-performance-test.yml` - Performance testing
- `prometheus.yml` - Monitoring configuration

### `/deployment/`
Deployment scripts:
- `start-with-aiven.sh`
- `update_env.sh`

### `/temp/`
Temporary files and test scripts:
- `test-login.js` - Test script
- `check-models-data.ts` - Data verification
- `seed-scripts/` - Archived seed and migration scripts (15 files)

### `/tests/`
Test files (currently empty, prepared for future use)

### `/backups/`
Database and metadata backups (auto-cleaned to keep last 10)

### `/docs/`
Documentation files

### `/prisma/`
Database schema and migrations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Cleanup old backups
./tools/cleanup-backups.sh
```

## 📝 Notes

- Configuration files are centralized in `/config/`
- Temporary files should be placed in `/temp/`
- Use organized script directories in `/scripts/`
- Backups are automatically cleaned to maintain storage
- All shell scripts are executable
