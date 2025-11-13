# Contributing to Audio Tài Lộc Backend

Thank you for your interest in contributing to the Audio Tài Lộc backend! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Commit Standards](#commit-standards)
5. [Pull Request Process](#pull-request-process)
6. [Code Style Guide](#code-style-guide)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)
9. [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We expect all contributors to:

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Report inappropriate behavior
- Support fellow contributors

### Unacceptable Behavior

- Harassment, discrimination, or bullying
- Unwelcome sexual attention
- Deliberate intimidation
- Stalking or threatening language
- Publishing private information without consent

**Violation Report:** Contact maintainers at support@audiotailoc.vn

---

## Getting Started

### 1. Fork and Clone Repository

```bash
# Fork on GitHub
# https://github.com/audiotailoc/backend/fork

# Clone your fork
git clone https://github.com/yourusername/backend.git
cd backend

# Add upstream remote
git remote add upstream https://github.com/audiotailoc/backend.git
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit with your local values
nano .env.local

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# Start development server
npm run dev
```

### 3. Keep Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your work on latest main
git rebase upstream/master
```

---

## Development Workflow

### Creating a Feature Branch

```bash
# Create feature branch from master
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/documentation-update
```

### Branch Naming Convention

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `perf/` - Performance improvements
- `chore/` - Maintenance tasks

### Working on Your Feature

```bash
# Create feature directory
mkdir src/modules/your-feature
cd src/modules/your-feature

# Generate files using NestJS CLI
npx nest g controller your-feature
npx nest g service your-feature
npx nest g module your-feature

# Edit the files
nano your-feature.service.ts
nano your-feature.controller.ts

# Test your code
npm run test -- your-feature.service

# Before committing
npm run format
npm run lint:fix
npm run typecheck
```

---

## Commit Standards

### Commit Message Format

Follow conventional commits:

```
type(scope): subject

body

footer
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, missing semicolons, etc.)
- **refactor:** Code refactoring without feature changes
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Maintenance tasks, dependencies
- **ci:** CI/CD configuration changes

### Examples

```bash
# Good examples
git commit -m "feat(auth): add two-factor authentication"
git commit -m "fix(cart): resolve quantity update bug"
git commit -m "docs(api): update authentication endpoints"
git commit -m "refactor(services): extract common logic"
git commit -m "test(orders): add order creation tests"
git commit -m "perf(catalog): optimize product search"

# Detailed example
git commit -m "feat(payment): add PayOS integration

- Implement PayOS payment gateway
- Add webhook handlers for payment confirmation
- Create payment intent service
- Add payment status tracking

Closes #123"
```

### Commit Best Practices

- Make atomic commits (one logical change per commit)
- Use imperative mood ("add feature" not "added feature")
- Limit subject line to 50 characters
- Reference issues/PRs in footer (Closes #123)
- Sign commits: `git commit -S -m "message"`

---

## Pull Request Process

### 1. Before Submitting PR

```bash
# Update from upstream
git fetch upstream
git rebase upstream/master

# Run all checks
npm run typecheck:full
npm run lint
npm run format:check
npm run test
npm run test:cov

# Fix any issues
npm run lint:fix
npm run format
```

### 2. Push Your Changes

```bash
# Push to your fork
git push origin feature/your-feature-name

# If force pushing needed (after rebase)
git push origin feature/your-feature-name --force-with-lease
```

### 3. Create Pull Request

Go to GitHub and create a PR with:

**Title:** Use same format as commits
```
feat(auth): add password reset functionality
```

**Description:** Follow template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Changed X to Y
- Added feature A
- Updated endpoint B

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing done

## Screenshots (if UI changes)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests pass locally
- [ ] No new warnings
```

### 4. Review Process

- At least 1 reviewer required
- Discuss and resolve feedback
- Rebase on latest master if conflicts
- Maintain clean commit history

### 5. Merge to Master

- Squash commits if many small changes
- Delete branch after merge
- Celebrate contribution!

---

## Code Style Guide

### TypeScript Standards

```typescript
// ✓ Use interface for object structures
interface User {
  id: string;
  email: string;
  name?: string;
}

// ✓ Use type for unions and primitives
type UserRole = 'ADMIN' | 'USER' | 'GUEST';

// ✓ Explicit return types for functions
function getUser(id: string): Promise<User> {
  // ...
}

// ✓ Private fields with # or private keyword
class UserService {
  #prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#prisma = prisma;
  }
}

// ✗ Avoid
any, unknown without proper handling
implicit any types
```

### NestJS Conventions

```typescript
// Controllers
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @ApiResponse({ status: 200, type: UserDto })
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}

// Services
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}

// DTOs
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// Modules
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### File Organization

```
module-name/
├── module-name.controller.ts
├── module-name.service.ts
├── module-name.module.ts
├── module-name.service.spec.ts
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

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| File | kebab-case | auth.service.ts |
| Class | PascalCase | AuthService |
| Method | camelCase | authenticateUser |
| Constant | UPPER_SNAKE_CASE | MAX_PAGE_SIZE |
| Interface | I-Prefix (optional) | IAuthStrategy |
| Enum | PascalCase | UserRole |
| Boolean | is/has prefix | isActive, hasPermission |

---

## Testing Requirements

### Test Coverage

- **Minimum Coverage:** 80% for public methods
- **Critical Path:** 100% for authentication, payments
- **Utils:** 100% for utility functions

### Writing Tests

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: '1', email: 'user@test.com' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Running Tests

```bash
# All tests
npm run test

# Specific file
npm run test -- auth.service

# With coverage
npm run test:cov

# Watch mode
npm run test:watch

# Specific test suites
npm run test:unit
npm run test:integration
```

---

## Documentation

### Code Documentation

Document complex logic:

```typescript
/**
 * Validates JWT token and extracts user information
 * @param token - JWT token string
 * @returns Decoded token payload with user data
 * @throws UnauthorizedException if token is invalid
 *
 * @example
 * const payload = validateToken(authToken);
 * console.log(payload.userId);
 */
function validateToken(token: string): TokenPayload {
  // Implementation
}
```

### Updating Documentation

When making changes:

1. **Update README if needed**
   - New dependencies
   - Setup instructions changes
   - Major feature additions

2. **Update API_DOCUMENTATION.md**
   - New endpoints
   - Changed response formats
   - New parameters

3. **Update ARCHITECTURE.md**
   - New modules
   - Architecture changes
   - Data flow changes

4. **Update DEVELOPER_GUIDE.md**
   - New conventions
   - Setup changes
   - Development process changes

5. **Update CHANGELOG.md**
   - List all changes
   - Version number
   - Release date

---

## Issue Reporting

### Before Creating an Issue

- Search existing issues
- Check documentation
- Try to reproduce consistently
- Note down error messages

### Issue Template

```markdown
## Description
Clear description of the issue

## Environment
- Node version:
- npm version:
- Package version:
- OS:

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Message/Logs
[Include full error message and stack trace]

## Screenshots
[If applicable]

## Additional Context
[Any other relevant information]
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - Feature request
- `documentation` - Documentation updates
- `good first issue` - For new contributors
- `help wanted` - Need assistance
- `question` - Questions/discussions
- `priority-high` - Important/urgent
- `priority-low` - Can wait

---

## Development Tips

### Useful Commands

```bash
# Check what would be committed
git diff --cached

# See commit history
git log --oneline -10

# Revert last commit (not pushed)
git reset --soft HEAD~1

# Abort ongoing rebase
git rebase --abort

# Clean up local branches
git branch -d branch-name

# Check for security vulnerabilities
npm audit

# Update dependencies safely
npm update

# Check latest versions available
npm outdated
```

### IDE Setup

**VS Code Extensions:**
- ESLint
- Prettier
- Thunder Client (API testing)
- Prisma
- NestJS Snippets

**Settings (.vscode/settings.json):**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Local Database

For development, you can use:

1. **Local PostgreSQL**
   ```bash
   # Mac with Homebrew
   brew install postgresql
   brew services start postgresql
   createdb audiotailoc
   ```

2. **Docker**
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

3. **Aiven Cloud**
   - Free tier available
   - Managed backups
   - No setup needed

---

## Performance Considerations

### Before Optimization

- Profile first (don't guess)
- Measure improvements
- Check database query plans
- Monitor in production

### Code Review Checklist

- [ ] All tests passing
- [ ] No console.log in final code
- [ ] Error handling complete
- [ ] Types properly defined
- [ ] No hardcoded values
- [ ] Comments for complex logic
- [ ] Documentation updated
- [ ] Performance acceptable

---

## Recognized Contributors

Contributors are recognized in:
- README.md
- CHANGELOG.md
- GitHub contributors page

---

## Questions?

- **Documentation:** See `/docs` folder
- **GitHub Issues:** Ask via issues
- **Discussions:** Use GitHub discussions
- **Email:** support@audiotailoc.vn

---

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

## Changelog Template

When significant changes are made, update CHANGELOG.md:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description
- API endpoint details

### Changed
- What was modified
- Breaking changes with migration guide

### Fixed
- Bug fix description

### Deprecated
- Features being phased out
- Migration path provided

### Security
- Security fixes and improvements
```

---

Thank you for contributing to Audio Tài Lộc! Your efforts help make this project better for everyone.

**Happy coding!**
