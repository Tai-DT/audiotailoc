# Contributing to Audio Tài Lộc

Thank you for your interest in contributing to Audio Tài Lộc! We welcome contributions from everyone. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### 1. Fork the Repository

Start by forking the repository on GitHub.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/audio-tail-loc.git
cd audio-tail-loc
```

### 3. Set Up Development Environment

```bash
# Install all dependencies
make install

# Setup database
make db-setup

# Start development servers
make dev
```

### 4. Create a Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number
```

### 5. Make Your Changes

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 6. Test Your Changes

```bash
# Run all tests
make test

# Run linting
make lint

# Format code
make format
```

### 7. Submit a Pull Request

1. Push your changes to your fork
2. Create a Pull Request on GitHub
3. Provide a clear description of your changes
4. Reference any related issues

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Backend**: Clean architecture with NestJS
- **Styling**: Tailwind CSS with consistent naming
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint with Airbnb config

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

### Branch Naming

- `feature/feature-name`: New features
- `fix/issue-number`: Bug fixes
- `docs/update-docs`: Documentation updates
- `refactor/component-name`: Code refactoring

### Pull Request Process

1. **Title**: Clear, descriptive title
2. **Description**: Detailed explanation of changes
3. **Testing**: How to test the changes
4. **Screenshots**: UI changes screenshots
5. **Breaking Changes**: Note any breaking changes

### Code Review Process

- At least 1 reviewer approval required
- All CI checks must pass
- No merge conflicts
- Up-to-date with main branch

## Project Structure

```
audio-tail-loc/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # Configuration files
│   │   └── prisma/         # Database schema
│   └── prisma/
│       └── schema.prisma   # Database schema
├── frontend/                # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utility functions
│   └── store/              # Zustand stores
├── scripts/                 # Development scripts
├── monitoring/              # Monitoring setup
└── docker-compose.yml       # Docker services
```

## Setting Up Database

For database development:

```bash
# Setup database
make db-setup

# Run migrations
make db-migrate

# Seed data
make db-seed

# Test connection
make db-test
```

## Testing

### Running Tests

```bash
# All tests
make test

# Backend only
make test-backend

# Frontend only
make test-frontend

# With coverage
npm run test:cov
```

### Writing Tests

- **Backend**: Unit tests with Jest
- **Frontend**: Component tests with React Testing Library
- **Integration**: API and database tests
- **E2E**: Playwright for critical user journeys

## Documentation

### Updating Documentation

- Keep README files up to date
- Add JSDoc comments for functions
- Update API documentation
- Add inline comments for complex logic

### Documentation Files

- `README.md`: Main project documentation
- `README-DATABASE.md`: Database setup guide
- `README-WORKFLOW.md`: Development workflow
- `API Documentation`: Auto-generated with Swagger

## Issue Tracking

### Bug Reports

When reporting bugs, please include:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

### Feature Requests

For feature requests, please include:

- Clear description of the feature
- Use case and benefits
- Mockups or examples if applicable
- Implementation suggestions

## Getting Help

- **Documentation**: Check our [README files](README.md)
- **Issues**: Search existing issues on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Slack**: Join our development Slack (if available)

## Recognition

Contributors will be recognized in:
- Repository contributors list
- Release notes
- Project documentation

Thank you for contributing to Audio Tài Lộc! 🎵✨