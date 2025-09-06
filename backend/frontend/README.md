# Audio Tài Lộc Dashboard

Hệ thống quản lý thiết bị karaoke - Frontend Dashboard

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Playwright
- **Backend**: NestJS API (http://localhost:3010)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── (auth)/          # Authentication pages
├── (dashboard)/     # Dashboard pages
├── layout.tsx       # Root layout
└── page.tsx         # Home page

components/
├── ui/              # Reusable UI components
├── layout/          # Layout components
├── dashboard/       # Dashboard-specific components
└── products/        # Product-related components

lib/
├── api/             # API client & hooks
└── zod/             # Validation schemas
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest
- `npm run test:e2e` - Run Playwright tests
- `npm run typecheck` - Run TypeScript type checking

## API Integration

Backend API: http://localhost:3010/api/v1

Key endpoints:
- GET /api/v1/catalog/products - List products
- GET /api/v1/catalog/categories - List categories
- GET /api/v1/orders - List orders
- GET /api/v1/users - List users

## Development Guidelines

1. **Type Safety**: Use TypeScript strictly
2. **API Integration**: Use TanStack Query for server state
3. **Forms**: Use React Hook Form + Zod validation
4. **Styling**: Use Tailwind CSS classes
5. **Testing**: Write tests for components and API calls
6. **Performance**: Implement proper loading states and error handling

## Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commits for PRs
