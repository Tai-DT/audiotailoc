#!/usr/bin/env node

/**
 * Audio Tài Lộc - Frontend Project Setup Script
 * Thiết lập cấu trúc Next.js dashboard
 */

const fs = require('fs');
const path = require('path');

class FrontendSetup {
  constructor() {
    this.rootDir = path.join(__dirname, '..', 'frontend');
    this.templates = {
      'package.json': {
        name: "audiotailoc-dashboard",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
          test: "vitest",
          "test:ui": "vitest --ui",
          "test:e2e": "playwright test",
          "test:e2e:ui": "playwright test --ui",
          typecheck: "tsc --noEmit"
        },
        dependencies: {
          "next": "15.0.0",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "@tanstack/react-query": "^5.45.0",
          "react-hook-form": "^7.52.0",
          "@hookform/resolvers": "^3.9.0",
          "zod": "^3.23.8",
          "tailwindcss": "^3.4.10",
          "lucide-react": "^0.439.0",
          "clsx": "^2.1.1",
          "tailwind-merge": "^2.5.2"
        },
        devDependencies: {
          "@types/node": "^22.7.4",
          "@types/react": "^18.3.8",
          "@types/react-dom": "^18.3.0",
          "typescript": "^5.6.2",
          "vitest": "^2.1.1",
          "@vitest/ui": "^2.1.1",
          "jsdom": "^25.0.1",
          "playwright": "^1.48.0",
          "@playwright/test": "^1.48.0",
          "msw": "^2.4.9",
          "eslint": "^9.11.1",
          "eslint-config-next": "15.0.0"
        }
      },

      'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`,

      'app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/query-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Audio Tài Lộc - Dashboard',
  description: 'Hệ thống quản lý thiết bị karaoke',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}`,

      'app/(dashboard)/layout.tsx': `import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}`,

      'app/(dashboard)/page.tsx': `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Overview } from '@/components/dashboard/overview'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { StatsCards } from '@/components/dashboard/stats-cards'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan hệ thống Audio Tài Lộc
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tổng quan</CardTitle>
            <CardDescription>
              Thống kê doanh thu và đơn hàng
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              5 đơn hàng mới nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`,

      'lib/api/client.ts': `import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 3
      },
    },
  },
})

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = \`\${API_BASE_URL}/api/v1\${endpoint}\`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: \`Bearer \${token}\`,
    }
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        errorData.message || \`HTTP \${response.status}\`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, 'Network error')
  }
}`,

      'lib/zod/api-schemas.ts': `import { z } from 'zod'

// Product schemas
export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  priceCents: z.number(),
  categoryId: z.string().nullable(),
  featured: z.boolean(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  priceCents: z.number().min(0, 'Giá phải lớn hơn 0'),
  categoryId: z.string().optional(),
  featured: z.boolean().default(false),
  imageUrl: z.string().optional(),
})

export const UpdateProductSchema = CreateProductSchema.partial()

// Category schemas
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Order schemas
export const OrderSchema = z.object({
  id: z.string(),
  orderNo: z.string(),
  userId: z.string(),
  totalCents: z.number(),
  status: z.string(),
  shippingAddress: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// API Response schemas
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      page: z.number(),
      pageSize: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  })

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
  })

// Export types
export type Product = z.infer<typeof ProductSchema>
export type CreateProduct = z.infer<typeof CreateProductSchema>
export type UpdateProduct = z.infer<typeof UpdateProductSchema>
export type Category = z.infer<typeof CategorySchema>
export type Order = z.infer<typeof OrderSchema>
export type User = z.infer<typeof UserSchema>`,
    };
  }

  ensureFrontendDir() {
    if (!fs.existsSync(this.rootDir)) {
      fs.mkdirSync(this.rootDir, { recursive: true });
    }
  }

  createDirectories() {
    const dirs = [
      'app/(dashboard)',
      'app/(auth)',
      'components/ui',
      'components/layout',
      'components/dashboard',
      'components/products',
      'components/orders',
      'components/users',
      'lib',
      'lib/api',
      'lib/zod',
      'hooks',
      'providers',
      'types',
      'public/images',
      'styles',
      'tests',
      'e2e'
    ];

    dirs.forEach(dir => {
      const fullPath = path.join(this.rootDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  createFiles() {
    Object.entries(this.templates).forEach(([filePath, content]) => {
      const fullPath = path.join(this.rootDir, filePath);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (typeof content === 'string') {
        fs.writeFileSync(fullPath, content);
      } else {
        fs.writeFileSync(fullPath, JSON.stringify(content, null, 2));
      }
    });
  }

  createAdditionalFiles() {
    // Create .env.local
    const envContent = `# Audio Tài Lộc Dashboard Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3010
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: For production
# NEXT_PUBLIC_API_URL=https://api.audiotailoc.com
# NEXT_PUBLIC_APP_URL=https://dashboard.audiotailoc.com
`;

    fs.writeFileSync(path.join(this.rootDir, '.env.local'), envContent);

    // Create README
    const readmeContent = `# Audio Tài Lộc Dashboard

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
   \`\`\`bash
   npm install
   \`\`\`

2. Copy environment variables:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

3. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
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
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run test\` - Run Vitest
- \`npm run test:e2e\` - Run Playwright tests
- \`npm run typecheck\` - Run TypeScript type checking

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
`;

    fs.writeFileSync(path.join(this.rootDir, 'README.md'), readmeContent);
  }

  setup() {
    console.log('🚀 Setting up Audio Tài Lộc Frontend Dashboard...\n');

    this.ensureFrontendDir();
    console.log('✅ Created frontend directory');

    this.createDirectories();
    console.log('✅ Created project directories');

    this.createFiles();
    console.log('✅ Created template files');

    this.createAdditionalFiles();
    console.log('✅ Created additional files');

    console.log('\n🎉 Frontend setup complete!');
    console.log('\n📁 Project structure created at:', this.rootDir);
    console.log('\n🚀 Next steps:');
    console.log('1. cd frontend');
    console.log('2. npm install');
    console.log('3. npm run dev');
    console.log('4. Open http://localhost:3000');
  }
}

// Run if called directly
if (require.main === module) {
  const setup = new FrontendSetup();
  setup.setup();
}

module.exports = FrontendSetup;
