# Audio Tài Lộc - Development Makefile
# Use 'make help' to see available commands

.PHONY: help install dev build test clean docker-up docker-down db-setup db-migrate db-seed lint format

# Default target
help: ## Show this help message
	@echo "Audio Tài Lộc Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

# Installation
install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	cd backend && npm install
	cd frontend && npm install

install-backend: ## Install backend dependencies only
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install

install-frontend: ## Install frontend dependencies only
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install

# Development
dev: ## Start development servers
	@echo "🚀 Starting development servers..."
	./scripts/setup-dev.sh

dev-backend: ## Start backend development server only
	@echo "🚀 Starting backend server..."
	cd backend && npm run start:dev

dev-frontend: ## Start frontend development server only
	@echo "🚀 Starting frontend server..."
	cd frontend && npm run dev

# Building
build: ## Build all services
	@echo "🔨 Building all services..."
	cd backend && npm run build
	cd frontend && npm run build

build-backend: ## Build backend only
	@echo "🔨 Building backend..."
	cd backend && npm run build

build-frontend: ## Build frontend only
	@echo "🔨 Building frontend..."
	cd frontend && npm run build

# Testing
test: ## Run all tests
	@echo "🧪 Running all tests..."
	cd backend && npm test
	cd frontend && npm test

test-backend: ## Run backend tests only
	@echo "🧪 Running backend tests..."
	cd backend && npm test

test-frontend: ## Run frontend tests only
	@echo "🧪 Running frontend tests..."
	cd frontend && npm test

# Code Quality
lint: ## Run linting on all services
	@echo "🔍 Running linters..."
	cd backend && npm run lint
	cd frontend && npm run lint

format: ## Format code in all services
	@echo "💅 Formatting code..."
	cd backend && npx prettier --write "src/**/*.ts"
	cd frontend && npx prettier --write "**/*.{js,jsx,ts,tsx}"

# Database
db-setup: ## Setup database for development
	@echo "🗄️ Setting up database..."
	./scripts/setup-database.sh development

db-migrate: ## Run database migrations
	@echo "🗄️ Running database migrations..."
	cd backend && npm run db:migrate

db-push: ## Push database schema
	@echo "🗄️ Pushing database schema..."
	cd backend && npm run db:push

db-seed: ## Seed database with sample data
	@echo "🌱 Seeding database..."
	cd backend && npm run db:seed

db-test: ## Test database connection
	@echo "🧪 Testing database connection..."
	cd backend && npm run db:test

# Docker
docker-up: ## Start all services with Docker Compose
	@echo "🐳 Starting services with Docker..."
	docker-compose up -d

docker-down: ## Stop all Docker services
	@echo "🐳 Stopping Docker services..."
	docker-compose down

docker-build: ## Build Docker images
	@echo "🐳 Building Docker images..."
	docker-compose build

docker-logs: ## Show Docker logs
	@echo "🐳 Showing Docker logs..."
	docker-compose logs -f

# Cleanup
clean: ## Clean up generated files
	@echo "🧹 Cleaning up..."
	rm -rf backend/dist
	rm -rf frontend/.next
	rm -rf frontend/out
	rm -rf node_modules
	find . -name "*.log" -delete
	find . -name ".DS_Store" -delete

clean-backend: ## Clean backend build files
	@echo "🧹 Cleaning backend..."
	rm -rf backend/dist
	rm -rf backend/node_modules

clean-frontend: ## Clean frontend build files
	@echo "🧹 Cleaning frontend..."
	rm -rf frontend/.next
	rm -rf frontend/out
	rm -rf frontend/node_modules

# Deployment
deploy-staging: ## Deploy to staging environment
	@echo "🚀 Deploying to staging..."
	./scripts/deploy.sh staging

deploy-production: ## Deploy to production environment
	@echo "🚀 Deploying to production..."
	./scripts/deploy.sh production

# Monitoring
monitor: ## Start monitoring stack
	@echo "📊 Starting monitoring..."
	docker-compose -f docker-compose.yml -f monitoring/docker-compose.yml up -d

# Quick setup for new developers
setup: ## Complete setup for new developers
	@echo "🎯 Setting up Audio Tài Lộc for development..."
	make install
	make db-setup
	make dev

# CI/CD
ci: ## Run CI pipeline locally
	@echo "🔄 Running CI pipeline..."
	make lint
	make test
	make build

# Development shortcuts
backend-logs: ## Show backend logs
	@echo "📋 Backend logs:"
	docker-compose logs -f backend

frontend-logs: ## Show frontend logs
	@echo "📋 Frontend logs:"
	docker-compose logs -f frontend

db-logs: ## Show database logs
	@echo "📋 Database logs:"
	docker-compose logs -f postgres