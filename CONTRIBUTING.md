# Contributing to Audio Tài Lộc

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Audio Tài Lộc! 🎵

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Questions & Discussions](#questions--discussions)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.7.0+
- Git

### Fork & Clone

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/audiotailoc.git
cd audiotailoc
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original-owner/audiotailoc.git
```

## 🛠️ Development Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Setup environment**:
```bash
# Copy environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/dashboard/.env.example apps/dashboard/.env.local
cp apps/frontend/.env.example apps/frontend/.env.local
```

3. **Setup database**:
```bash
# Migrate database
pnpm --filter @audiotailoc/backend prisma:migrate:dev

# Generate Prisma client
pnpm --filter @audiotailoc/backend prisma:generate

# Seed data
pnpm --filter @audiotailoc/backend seed
```

4. **Start development servers**:
```bash
# All services
pnpm dev

# Or individually
pnpm backend:dev      # Backend API (port 3010)
pnpm dashboard:dev    # Admin Dashboard (port 3001)
pnpm frontend:dev     # Storefront (port 3000)
```

## 📝 Code Style

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### NestJS (Backend)

- Follow NestJS naming conventions
- Use DTOs for all input validation
- Implement proper error handling
- Add Swagger documentation

### Next.js (Frontend)

- Use App Router patterns
- Implement proper loading and error states
- Use TypeScript for all components
- Follow React best practices

### General

- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Use kebab-case for file names
- Keep functions small and focused
- Add meaningful comments

## 🔧 Development Workflow

### Branch Naming

Use conventional branch naming:

```
feature/feature-name
bugfix/bug-description
hotfix/critical-fix
docs/documentation-update
refactor/refactoring-description
```

### Creating a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add refresh token rotation
fix(products): resolve image upload issue
docs(readme): update installation instructions
style(backend): format code with prettier
refactor(api): extract common validation logic
test(auth): add unit tests for login service
chore(deps): update dependencies
```

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the code style
3. **Write/update tests** for new functionality
4. **Update documentation** if needed
5. **Run tests** locally:
   ```bash
   pnpm test
   pnpm lint
   pnpm typecheck
   ```
6. **Commit your changes** using conventional commits
7. **Push to your fork** and create a Pull Request
8. **Fill out the PR template** completely
9. **Request review** from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing issues
2. Try to reproduce the bug
3. Check if it's a known issue

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

## Additional Context
Screenshots, logs, etc.
```

## 💡 Feature Requests

### Before Submitting

1. Check if the feature already exists
2. Consider if it aligns with project goals
3. Think about implementation complexity

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives Considered
Other approaches you've considered

## Additional Context
Screenshots, mockups, etc.
```

## ❓ Questions & Discussions

- **GitHub Discussions**: For general questions and discussions
- **GitHub Issues**: For bugs and feature requests
- **Email**: support@audiotailoc.com for private matters

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing to Audio Tài Lộc, you agree that your contributions will be licensed under the MIT License.

## 🆘 Need Help?

If you need help with anything:

1. Check the [documentation](README.md)
2. Search existing [issues](https://github.com/your-username/audiotailoc/issues)
3. Start a [discussion](https://github.com/your-username/audiotailoc/discussions)
4. Contact the maintainers

---

Thank you for contributing to Audio Tài Lộc! 🎵✨
