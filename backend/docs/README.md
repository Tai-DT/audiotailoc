# Audio Tài Lộc Backend - Documentation

Complete documentation for the Audio Tài Lộc backend application.

## Quick Links

| Document | Purpose | Audience |
|----------|---------|----------|
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API endpoint reference with examples | Developers, API Consumers |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Setup, development workflow, conventions | Backend Developers |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, modules, data flow | Architects, Senior Developers |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Production deployment and scaling | DevOps, Release Engineers |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues and solutions | All Developers |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines and workflow | Contributors |
| [CHANGELOG.md](./CHANGELOG.md) | Version history and changes | Project Managers, Developers |

---

## Getting Started

### New to the Project?
1. Start with [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Complete setup instructions
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand system design
3. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Learn available endpoints

### Deploying to Production?
1. Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review security checklist
3. Plan database migrations
4. Prepare monitoring and backups

### Contributing Code?
1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Follow code style guidelines
3. Run tests before submitting PR
4. Update documentation as needed

### Having Issues?
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Search GitHub issues
3. Review API documentation
4. Ask in team channels

---

## Documentation Structure

### API Reference
- **API_DOCUMENTATION.md**
  - Complete endpoint reference
  - Request/response examples
  - Error codes and handling
  - Authentication details
  - Rate limiting information
  - Pagination guidelines
  - Code examples
  - Payment provider integration

### Developer Resources
- **DEVELOPER_GUIDE.md**
  - Project setup
  - Environment configuration
  - Development workflow
  - Code standards
  - Database management
  - Testing guidelines
  - Debugging techniques
  - Performance optimization

### Architecture & Design
- **ARCHITECTURE.md**
  - System architecture overview
  - Technology stack
  - Module structure
  - Data flow diagrams
  - Database schema
  - Authentication & authorization
  - Security architecture
  - Caching strategy
  - Performance considerations

### Operations & Deployment
- **DEPLOYMENT_GUIDE.md**
  - Pre-deployment checklist
  - Production environment setup
  - Docker deployment
  - Database migrations
  - Cloud deployments (Vercel, AWS)
  - Scaling strategies
  - Monitoring & logging
  - Backup & recovery
  - Troubleshooting deployment issues

### Community
- **CONTRIBUTING.md**
  - Code of conduct
  - Development setup
  - Git workflow
  - Commit standards
  - Pull request process
  - Code style guide
  - Testing requirements
  - Documentation standards

### Project Management
- **CHANGELOG.md**
  - Version history
  - Features by release
  - Breaking changes
  - Migration guides
  - Security advisories
  - Performance metrics

---

## How to Use This Documentation

### For Developers
```
1. Read DEVELOPER_GUIDE.md → Setup your environment
2. Read ARCHITECTURE.md → Understand the system
3. Read API_DOCUMENTATION.md → Learn the API
4. Refer to TROUBLESHOOTING.md → When issues arise
5. Follow CONTRIBUTING.md → When submitting PRs
```

### For DevOps/SRE
```
1. Read DEPLOYMENT_GUIDE.md → Deployment process
2. Read ARCHITECTURE.md → System design for ops
3. Read TROUBLESHOOTING.md → Common operational issues
4. Monitor the health endpoints from API_DOCUMENTATION.md
```

### For Project Managers
```
1. Read CHANGELOG.md → Track features and versions
2. Read ARCHITECTURE.md → Understand capabilities
3. Review API_DOCUMENTATION.md → Track completeness
4. Reference DEPLOYMENT_GUIDE.md → Plan releases
```

### For New Contributors
```
1. Read DEVELOPER_GUIDE.md → Get started
2. Read CONTRIBUTING.md → Learn process
3. Read ARCHITECTURE.md → Understand system
4. Start with good-first-issue labels
5. Ask questions in PR/discussions
```

---

## Key Concepts

### Architecture Overview
The backend is built on NestJS with these principles:
- **Modular Design:** Feature-based modules with clear separation
- **Service Layer:** Business logic in services, HTTP in controllers
- **Dependency Injection:** NestJS IoC container for loose coupling
- **Type Safety:** TypeScript for compile-time checking
- **Database:** Prisma ORM with PostgreSQL
- **Caching:** Redis for performance
- **Security:** JWT authentication, role-based access control
- **Documentation:** Swagger/OpenAPI for API docs

### Module Organization
```
Core Modules
├── Auth - Authentication & Authorization
├── Users - User Management
└── Shared - Common utilities

E-Commerce
├── Catalog - Products & Categories
├── Cart - Shopping Cart
├── Orders - Order Management
├── Payments - Payment Processing
└── Inventory - Stock Management

Services
├── Services - Service Catalog
├── Booking - Service Bookings
└── Technicians - Staff Management

Content
├── Blog - Articles & Comments
├── Site - Pages & Banners
└── Projects - Portfolio

Analytics & Marketing
├── Analytics - Metrics & Reporting
└── Marketing - Campaigns & Email
```

---

## Common Tasks

### Setting Up Development Environment
See [DEVELOPER_GUIDE.md - Setup & Installation](./DEVELOPER_GUIDE.md#setup--installation)

### Creating a New Feature
See [DEVELOPER_GUIDE.md - Creating a New Feature](./DEVELOPER_GUIDE.md#creating-a-new-feature)

### Deploying to Production
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Finding an API Endpoint
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Fixing a Bug
See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Contributing Changes
See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Important Conventions

### Code Style
- **Naming:** kebab-case for files, PascalCase for classes, camelCase for methods
- **Format:** Use Prettier for consistent formatting
- **Linting:** Follow ESLint rules
- **Types:** Always specify types explicitly

See [CONTRIBUTING.md - Code Style Guide](./CONTRIBUTING.md#code-style-guide)

### Database
- **Schema:** Edit `prisma/schema.prisma`
- **Migrations:** Run `npm run prisma:migrate:dev`
- **Validation:** Use `npx prisma validate`

See [DEVELOPER_GUIDE.md - Database Management](./DEVELOPER_GUIDE.md#database-management)

### Testing
- **Coverage:** Minimum 80% for public methods
- **Critical:** 100% for auth and payments
- **Run:** `npm run test`

See [DEVELOPER_GUIDE.md - Testing](./DEVELOPER_GUIDE.md#testing)

### API Design
- **RESTful:** Standard HTTP methods and status codes
- **Responses:** Standardized JSON format
- **Documentation:** Swagger decorators required
- **Versioning:** All endpoints under /api/v1

See [ARCHITECTURE.md - API Design](./ARCHITECTURE.md#api-design)

---

## Useful Commands

### Development
```bash
npm run dev              # Start development server with hot reload
npm run typecheck        # Check TypeScript types
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage
```

### Database
```bash
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate:dev     # Create and run migration
npx prisma studio             # Open Prisma Studio
npx prisma validate           # Validate schema
npm run seed                   # Seed database with initial data
```

### Deployment
```bash
npm run build            # Build for production
npm run start            # Start production server
docker build -t backend .    # Build Docker image
docker-compose up            # Start with Docker Compose
```

### API Documentation
```
http://localhost:3010/docs      # Swagger UI (development)
http://localhost:3010/api/v1/docs   # API Docs
```

---

## Environment Variables

### Required
```
DATABASE_URL
DIRECT_DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
```

### Optional
```
REDIS_URL
CLOUDINARY_CLOUD_NAME
PAYOS_CLIENT_ID
PAYOS_API_KEY
SMTP_HOST
SMTP_PORT
```

See [DEPLOYMENT_GUIDE.md - Production Environment Setup](./DEPLOYMENT_GUIDE.md#production-environment-setup)

---

## Project Structure

```
backend/
├── src/
│   ├── main.ts                    # Application entry
│   ├── modules/                   # Feature modules
│   │   ├── auth/                  # Authentication
│   │   ├── users/                 # User management
│   │   ├── catalog/               # Products
│   │   ├── cart/                  # Shopping cart
│   │   ├── orders/                # Orders
│   │   ├── payments/              # Payments
│   │   ├── services/              # Services
│   │   ├── booking/               # Bookings
│   │   └── ...more modules
│   ├── common/                    # Shared code
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── guards/
│   │   └── decorators/
│   └── prisma/                    # Database service
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration files
├── dist/                          # Compiled JavaScript
├── docs/                          # Documentation (this folder)
├── package.json
└── tsconfig.json
```

---

## Support & Resources

### Documentation
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [REST API Best Practices](https://restfulapi.net)

### Community
- **GitHub Issues:** Report bugs and features
- **Discussions:** Ask questions
- **Slack:** Team communication
- **Email:** support@audiotailoc.vn

### Monitoring
- Swagger/OpenAPI docs: `/docs`
- Health check: `/api/v1/health`
- API documentation: `http://localhost:3010/docs`

---

## Version & Status

- **Current Version:** 0.1.0
- **Status:** Stable
- **Last Updated:** November 12, 2024
- **Node Version Required:** 20.x or higher
- **npm Version Required:** 10.x or higher

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## Quick Troubleshooting

### Cannot Connect to Database
See [TROUBLESHOOTING.md - Issue: Cannot Connect to Database](./TROUBLESHOOTING.md#issue-cannot-connect-to-database)

### JWT Token Not Working
See [TROUBLESHOOTING.md - Issue: JWT Token Not Working](./TROUBLESHOOTING.md#issue-jwt-token-not-working)

### API Returns 404
See [TROUBLESHOOTING.md - Issue: 404 Not Found](./TROUBLESHOOTING.md#issue-404-not-found)

### Deployment Fails
See [TROUBLESHOOTING.md - Issue: Deployment Fails](./TROUBLESHOOTING.md#issue-deployment-fails)

---

## Documentation Roadmap

### Completed
- ✅ API Documentation
- ✅ Developer Guide
- ✅ Architecture Documentation
- ✅ Deployment Guide
- ✅ Troubleshooting Guide
- ✅ Contributing Guidelines
- ✅ Changelog

### Planned
- 🔄 Video tutorials (coming soon)
- 🔄 Interactive API playground (coming soon)
- 🔄 Case studies (coming soon)
- 🔄 Performance optimization guide (coming soon)
- 🔄 Security hardening guide (coming soon)

---

## How to Update This Documentation

1. Locate relevant document in `/docs`
2. Make your changes
3. Ensure markdown is properly formatted
4. Update table of contents if structure changes
5. Reference in relevant sections
6. Update CHANGELOG.md with documentation updates
7. Submit PR with changes

See [CONTRIBUTING.md - Documentation](./CONTRIBUTING.md#documentation)

---

## FAQ

**Q: Where do I find the API documentation?**
A: Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) or visit `/docs` in your browser.

**Q: How do I set up my development environment?**
A: Follow [DEVELOPER_GUIDE.md - Setup & Installation](./DEVELOPER_GUIDE.md#setup--installation)

**Q: What's the project architecture?**
A: Read [ARCHITECTURE.md](./ARCHITECTURE.md) for complete overview.

**Q: How do I deploy to production?**
A: Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Q: How do I contribute code?**
A: Read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Q: Where can I report bugs?**
A: Open an issue on GitHub or contact support@audiotailoc.vn

---

## Contact & Support

- **Documentation Issues:** Create GitHub issue
- **API Questions:** Check API_DOCUMENTATION.md or GitHub discussions
- **Setup Help:** See DEVELOPER_GUIDE.md or open GitHub issue
- **Deployment Help:** See DEPLOYMENT_GUIDE.md or contact DevOps
- **General Support:** support@audiotailoc.vn

---

## License

Audio Tài Lộc Backend documentation and code are licensed under the MIT License.

---

**Last Updated:** November 12, 2024
**Maintained By:** Development Team
**Status:** Actively Maintained
