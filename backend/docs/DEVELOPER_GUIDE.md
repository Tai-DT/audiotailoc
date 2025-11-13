# Audio Tài Lộc Backend - Developer Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Setup & Installation](#setup--installation)
5. [Development Workflow](#development-workflow)
6. [Code Standards & Conventions](#code-standards--conventions)
7. [Database Management](#database-management)
8. [Testing](#testing)
9. [Debugging](#debugging)
10. [Common Tasks](#common-tasks)

---

## Getting Started

### Requirements

- **Node.js:** 20.x or higher
- **npm:** 10.x or higher
- **PostgreSQL:** 13.x or higher (or Aiven hosted)
- **Redis:** For caching and session management
- **Git:** For version control

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/audiotailoc.git
cd audiotailoc/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# Seed database with initial data
npm run seed

# Start development server
npm run dev

# Access API at http://localhost:3010
# Swagger docs at http://localhost:3010/docs
```

---

## Project Structure

```
backend/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root module
│   ├── modules/                         # Feature modules
│   │   ├── auth/                        # Authentication & Authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   ├── guards/                  # JWT, Admin guards
│   │   │   └── dto/                     # Data transfer objects
│   │   ├── users/                       # User management
│   │   ├── catalog/                     # Product catalog
│   │   ├── cart/                        # Shopping cart
│   │   ├── orders/                      # Order management
│   │   ├── payments/                    # Payment processing
│   │   ├── services/                    # Service management
│   │   ├── booking/                     # Service bookings
│   │   ├── inventory/                   # Inventory management
│   │   ├── analytics/                   # Analytics & reporting
│   │   ├── notifications/               # User notifications
│   │   ├── blog/                        # Blog & articles
│   │   ├── site/                        # Site configuration
│   │   ├── admin/                       # Admin operations
│   │   ├── health/                      # Health checks
│   │   ├── shared/                      # Shared utilities
│   │   └── ... (other modules)
│   ├── common/
│   │   ├── filters/                     # HTTP exception filters
│   │   ├── interceptors/                # Request/response interceptors
│   │   ├── guards/                      # Authentication guards
│   │   ├── decorators/                  # Custom decorators
│   │   └── exceptions/                  # Custom exceptions
│   ├── prisma/
│   │   ├── prisma.service.ts            # Prisma service
│   │   └── prisma.module.ts
│   ├── config/                          # Configuration files
│   ├── types/                           # TypeScript types
│   └── middleware/                      # Express middleware
├── dist/                                # Compiled JavaScript
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── migrations/                      # Database migrations
├── scripts/                             # Utility scripts
├── docs/                                # Documentation
├── .env                                 # Environment variables
├── .env.example                         # Example env file
├── package.json
├── tsconfig.json
├── nest-cli.json
└── Dockerfile
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Client Apps                       │
│          (Frontend, Dashboard, Mobile)               │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                   API Gateway                        │
│        (Express + NestJS Framework)                  │
│      - Compression, Security Headers                │
│      - CORS, Rate Limiting                          │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │ Global │    │ Global │    │ Global │
   │ Pipes  │    │ Filters│    │Interceptors
   └────────┘    └────────┘    └────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                Module Layer                         │
│  ┌──────────┬──────────┬──────────┬──────────┐    │
│  │  Auth    │  Catalog │  Orders  │ Payments │    │
│  ├──────────┼──────────┼──────────┼──────────┤    │
│  │  Cart    │  Services│  Bookings│ Inventory│    │
│  └──────────┴──────────┴──────────┴──────────┘    │
│  Each module contains:                             │
│  - Controller (Routes)                             │
│  - Service (Business Logic)                        │
│  - Module (DI Configuration)                       │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │Prisma  │    │ Redis  │    │External│
   │Service │    │ Cache  │    │Services│
   └────────┘    └────────┘    └────────┘
        │              │              │
        ▼              ▼              ▼
   PostgreSQL     Redis Cloud    Payment APIs
   (Aiven)       (Upstash)       (PayOS, VNPay)
```

### Key Architectural Patterns

1. **Modular Architecture** - Feature-based modules with clear separation of concerns
2. **Service Layer Pattern** - Business logic separated from controllers
3. **Dependency Injection** - NestJS built-in IoC container
4. **Data Access Layer** - Prisma ORM for database operations
5. **Guard & Middleware Pattern** - Authentication and authorization
6. **Interceptor Pattern** - Request/response transformation
7. **Exception Handling** - Global exception filters
8. **Caching Strategy** - Redis for session and frequently accessed data

---

## Setup & Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/audiotailoc.git
cd audiotailoc/backend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables

Create `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Database
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
DIRECT_DATABASE_URL="postgres://user:password@host:port/dbname"

# Authentication
JWT_ACCESS_SECRET="your-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-secret-key-min-32-chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3010
NODE_ENV=development
API_VERSION=v1

# Redis (for caching)
REDIS_URL="redis://..."

# Payment Provider (choose one or more)
PAYOS_CLIENT_ID="..."
PAYOS_API_KEY="..."
PAYOS_CHECKSUM_KEY="..."

# File Storage
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Frontend URLs
FRONTEND_URL="http://localhost:3000"
DASHBOARD_URL="http://localhost:3001"
```

### Step 4: Generate Prisma Client

```bash
npm run prisma:generate
```

### Step 5: Run Database Migrations

```bash
# Create and run pending migrations
npm run prisma:migrate:dev

# Or for production
npm run prisma:migrate:prod
```

### Step 6: Seed Database (Optional)

```bash
# Run seed script to populate initial data
npm run seed
```

### Step 7: Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3010` and Swagger docs at `http://localhost:3010/docs`.

---

## Development Workflow

### Daily Development

```bash
# 1. Start the development server with auto-reload
npm run dev

# 2. Run tests in watch mode (in another terminal)
npm run test:watch

# 3. Format code before committing
npm run format

# 4. Fix linting issues
npm run lint:fix
```

### Creating a New Feature

#### 1. Generate a New Module

```bash
# Use NestJS CLI to generate module structure
npx nest g module modules/feature-name
npx nest g controller modules/feature-name
npx nest g service modules/feature-name
```

#### 2. Define the Entity in Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
model FeatureName {
  id        String   @id @default(cuid())
  name      String
  status    String   @default("ACTIVE")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("feature_names")
}
```

#### 3. Create Database Migration

```bash
npm run prisma:migrate:dev -- --name add_feature_name
```

#### 4. Create DTOs

Create `src/modules/feature-name/dto/create-feature-name.dto.ts`:

```typescript
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeatureNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateFeatureNameDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

#### 5. Implement Service

Create `src/modules/feature-name/feature-name.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeatureNameDto, UpdateFeatureNameDto } from './dto';

@Injectable()
export class FeatureNameService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFeatureNameDto) {
    return this.prisma.featureName.create({
      data,
    });
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.featureName.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.featureName.count(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.featureName.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Feature not found');
    }

    return item;
  }

  async update(id: string, data: UpdateFeatureNameDto) {
    await this.findOne(id);

    return this.prisma.featureName.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.featureName.delete({
      where: { id },
    });
  }
}
```

#### 6. Implement Controller

Create `src/modules/feature-name/feature-name.controller.ts`:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FeatureNameService } from './feature-name.service';
import { CreateFeatureNameDto, UpdateFeatureNameDto } from './dto';

@ApiTags('Feature Name')
@Controller('feature-name')
export class FeatureNameController {
  constructor(private featureNameService: FeatureNameService) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Feature created' })
  create(@Body() createDto: CreateFeatureNameDto) {
    return this.featureNameService.create(createDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of features' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.featureNameService.findAll(page, limit);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Feature found' })
  findOne(@Param('id') id: string) {
    return this.featureNameService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Feature updated' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFeatureNameDto,
  ) {
    return this.featureNameService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Feature deleted' })
  remove(@Param('id') id: string) {
    return this.featureNameService.remove(id);
  }
}
```

#### 7. Update Module

Edit `src/modules/feature-name/feature-name.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { FeatureNameService } from './feature-name.service';
import { FeatureNameController } from './feature-name.controller';

@Module({
  controllers: [FeatureNameController],
  providers: [FeatureNameService],
})
export class FeatureNameModule {}
```

#### 8. Register Module in App Module

Edit `src/modules/app.module.ts`:

```typescript
import { FeatureNameModule } from './feature-name/feature-name.module';

// Add to imports array
@Module({
  imports: [
    // ... other imports
    FeatureNameModule,
  ],
})
export class AppModule {}
```

---

## Code Standards & Conventions

### Naming Conventions

- **Files:** `kebab-case` (e.g., `auth.controller.ts`)
- **Classes:** `PascalCase` (e.g., `AuthController`)
- **Methods:** `camelCase` (e.g., `authenticateUser`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PAGE_SIZE`)
- **Interfaces:** `PascalCase` with `I` prefix (e.g., `IAuthStrategy`)
- **Types:** `PascalCase` (e.g., `UserRole`)

### File Organization

```
module-name/
├── module-name.controller.ts
├── module-name.service.ts
├── module-name.service.spec.ts
├── module-name.module.ts
├── dto/
│   ├── create-entity.dto.ts
│   ├── update-entity.dto.ts
│   └── index.ts
├── entities/
│   └── entity.entity.ts
├── guards/
│   └── entity.guard.ts
└── constants.ts
```

### Code Style

Use the configured ESLint and Prettier settings:

```bash
# Format code
npm run format

# Check formatting without changes
npm run format:check

# Fix linting issues
npm run lint:fix

# Check linting without fixes
npm run lint
```

### Documentation Standards

Always document public methods and complex logic:

```typescript
/**
 * Authenticates a user with email and password
 * @param email - User email address
 * @param password - User password
 * @returns Authentication tokens and user data
 * @throws UnauthorizedException if credentials are invalid
 */
async authenticate(email: string, password: string): Promise<AuthResult> {
  // Implementation
}
```

### Error Handling

Use NestJS built-in exceptions:

```typescript
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';

// Instead of throwing raw errors
throw new NotFoundException('User not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Invalid credentials');
```

### Validation

Use class-validator decorators:

```typescript
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}
```

---

## Database Management

### Prisma Operations

```bash
# Generate Prisma client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate:dev -- --name migration_name

# Reset database (⚠️ deletes all data)
npm run prisma:migrate:reset

# View database in UI
npx prisma studio

# Validate schema syntax
npx prisma validate
```

### Writing Migrations

1. Make changes to `prisma/schema.prisma`
2. Run `npm run prisma:migrate:dev`
3. Name the migration (e.g., `add_user_role`)
4. Review generated migration in `prisma/migrations/`
5. Commit to version control

### Common Prisma Patterns

```typescript
// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// Read
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { orders: true },
});

// Read multiple
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

// Update
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Jane Doe' },
});

// Delete
await prisma.user.delete({
  where: { id: userId },
});

// Transaction
await prisma.$transaction(async (tx) => {
  await tx.user.update({ where: { id }, data: { balance: 0 } });
  await tx.order.create({ data: { userId, amount: 100 } });
});
```

---

## Testing

### Test Structure

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:cov
```

### Writing Tests

Example: `auth.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.login('user@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens for valid credentials', async () => {
      const user = {
        id: 'user_1',
        email: 'user@example.com',
        password: 'hashed_password',
        name: 'John Doe',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(jwt, 'sign').mockReturnValue('token');

      const result = await service.login('user@example.com', 'password');

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('token');
    });
  });
});
```

### Testing Best Practices

- Test one thing per test
- Use descriptive test names
- Mock external dependencies
- Test both success and error cases
- Keep tests isolated and independent
- Use fixtures for common test data

---

## Debugging

### Enable Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run dev

# Run with NestJS specific debugging
npm run dev -- --debug
```

### VSCode Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/node_modules/.bin/nest",
      "args": ["start", "--debug", "--watch"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Then press `F5` to start debugging.

### Common Debugging Scenarios

1. **Database Connection Issues**
   ```bash
   # Test database connection
   npx prisma db execute --stdin < check-connection.sql
   ```

2. **Authentication Issues**
   - Check JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
   - Verify token is valid using jwt.io
   - Check token expiration time

3. **Prisma Issues**
   ```bash
   # Validate schema
   npx prisma validate

   # Check migrations
   npx prisma migrate status
   ```

---

## Common Tasks

### Add a New API Endpoint

1. Create DTO for request/response
2. Add method to service
3. Add route to controller with decorators
4. Add endpoint documentation to Swagger
5. Write tests
6. Update API_DOCUMENTATION.md

### Add Database Field

1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate:dev`
3. Update related DTOs
4. Update service methods if needed
5. Update tests

### Add Authentication to Endpoint

```typescript
@Get('protected')
@UseGuards(JwtGuard)
@ApiBearerAuth()
getProtected(@Req() req: Request) {
  return { userId: req.user.id };
}

@Delete('admin-only')
@UseGuards(JwtGuard, AdminGuard)
@ApiBearerAuth()
adminAction() {
  return { message: 'Admin action' };
}
```

### Working with Environment Variables

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {}

// In methods
const jwtSecret = this.configService.get('JWT_ACCESS_SECRET');
const port = this.configService.get('PORT', 3010);
```

### Enable/Disable Features

Features can be controlled via environment variables:

```typescript
const featureEnabled = process.env.FEATURE_NAME === 'true';

if (featureEnabled) {
  // Enable feature
}
```

---

## Performance Optimization

### Caching

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async getProduct(id: string) {
    const cached = await this.cache.get(`product:${id}`);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    await this.cache.set(`product:${id}`, product, 3600000); // 1 hour
    return product;
  }
}
```

### Database Query Optimization

```typescript
// ✓ Good - Only fetch needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true,
    orders: {
      select: {
        id: true,
        totalCents: true,
      },
    },
  },
});

// ✗ Avoid - N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
  user.orders = await prisma.order.findMany({
    where: { userId: user.id },
  });
}

// ✓ Better - Use relations
const users = await prisma.user.findMany({
  include: {
    orders: true,
  },
});
```

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Testing Guide](https://docs.nestjs.com/fundamentals/testing)
- [Security Best Practices](https://docs.nestjs.com/security/authentication)

---

## Getting Help

- Check existing documentation in `/docs`
- Search GitHub issues for similar problems
- Ask in project Slack channel
- Create an issue with detailed reproduction steps
