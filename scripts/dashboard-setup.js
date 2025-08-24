#!/usr/bin/env node

/**
 * Dashboard Setup Script
 * Tự động tạo cấu trúc và components cơ bản cho Dashboard AudioTailoc
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DashboardSetup {
  constructor() {
    this.dashboardPath = path.join(__dirname, '../dashboard');
    this.templatesPath = path.join(__dirname, 'templates');
  }

  async setup() {
    console.log('🚀 Bắt đầu setup Dashboard AudioTailoc...\n');
    
    try {
      await this.createDirectoryStructure();
      await this.createPackageJson();
      await this.createConfigurationFiles();
      await this.createBasicComponents();
      await this.createBasicPages();
      await this.createHooks();
      await this.createStore();
      await this.createUtils();
      await this.installDependencies();
      
      console.log('✅ Setup hoàn thành!');
      console.log('📝 Chạy lệnh sau để khởi động dashboard:');
      console.log('   cd dashboard && npm run dev');
      
    } catch (error) {
      console.error('❌ Lỗi trong quá trình setup:', error.message);
    }
  }

  async createDirectoryStructure() {
    console.log('📁 Tạo cấu trúc thư mục...');
    
    const directories = [
      'app',
      'components/ui',
      'components/layout',
      'components/charts',
      'components/forms',
      'hooks',
      'lib',
      'store',
      'utils',
      'public',
      'styles',
      '__tests__/components',
      '__tests__/pages',
      '__tests__/utils'
    ];

    for (const dir of directories) {
      const dirPath = path.join(this.dashboardPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Tạo thư mục: ${dir}`);
      }
    }
  }

  async createPackageJson() {
    console.log('📦 Tạo package.json...');
    
    const packageJson = {
      name: "audiotailoc-dashboard",
      version: "0.1.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
      },
      dependencies: {
        "next": "^14.0.0",
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "typescript": "^5.0.0",
        "@types/node": "^20.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "tailwindcss": "^3.3.0",
        "autoprefixer": "^10.4.0",
        "postcss": "^8.4.0",
        "@headlessui/react": "^1.7.0",
        "@heroicons/react": "^2.0.0",
        "zustand": "^4.4.0",
        "axios": "^1.6.0",
        "@tanstack/react-query": "^5.0.0",
        "framer-motion": "^10.16.0",
        "recharts": "^2.8.0",
        "date-fns": "^2.30.0",
        "clsx": "^2.0.0",
        "class-variance-authority": "^0.7.0",
        "lucide-react": "^0.294.0"
      },
      devDependencies: {
        "eslint": "^8.0.0",
        "eslint-config-next": "^14.0.0",
        "@types/jest": "^29.0.0",
        "jest": "^29.0.0",
        "jest-environment-jsdom": "^29.0.0",
        "@testing-library/react": "^13.0.0",
        "@testing-library/jest-dom": "^6.0.0",
        "@testing-library/user-event": "^14.0.0"
      }
    };

    const packageJsonPath = path.join(this.dashboardPath, 'package.json');
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Tạo package.json');
  }

  async createConfigurationFiles() {
    console.log('⚙️ Tạo configuration files...');
    
    // TypeScript config
    const tsconfig = {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "es6"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        paths: {
          "@/*": ["./*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    };

    fs.writeFileSync(
      path.join(this.dashboardPath, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );

    // Tailwind config
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'tailwind.config.js'),
      tailwindConfig
    );

    // Next.js config
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'next.config.js'),
      nextConfig
    );

    // PostCSS config
    const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'postcss.config.js'),
      postcssConfig
    );

    // Jest config
    const jestConfig = `const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'jest.config.js'),
      jestConfig
    );

    // Jest setup
    const jestSetup = `import '@testing-library/jest-dom'`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'jest.setup.js'),
      jestSetup
    );

    console.log('✅ Tạo configuration files');
  }

  async createBasicComponents() {
    console.log('🧩 Tạo basic components...');
    
    // Button component
    const buttonComponent = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'components/ui/button.tsx'),
      buttonComponent
    );

    // Input component
    const inputComponent = `import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'components/ui/input.tsx'),
      inputComponent
    );

    // Card component
    const cardComponent = `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'components/ui/card.tsx'),
      cardComponent
    );

    // Header component
    const headerComponent = `import { Button } from "@/components/ui/button"
import { UserCircle, Bell, Settings } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'components/layout/header.tsx'),
      headerComponent
    );

    // Sidebar component
    const sidebarComponent = `import { Home, Users, BarChart3, Settings, Music } from "lucide-react"
import Link from "next/link"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Karaoke', href: '/karaoke', icon: Music },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold text-white">AudioTailoc</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'components/layout/sidebar.tsx'),
      sidebarComponent
    );

    console.log('✅ Tạo basic components');
  }

  async createBasicPages() {
    console.log('📄 Tạo basic pages...');
    
    // Root layout
    const rootLayout = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AudioTailoc Dashboard',
  description: 'Dashboard quản lý hệ thống AudioTailoc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'app/layout.tsx'),
      rootLayout
    );

    // Global CSS
    const globalCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'app/globals.css'),
      globalCSS
    );

    // Main page
    const mainPage = `import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'app/page.tsx'),
      mainPage
    );

    // Dashboard page
    const dashboardPage = `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Music, TrendingUp, DollarSign } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Karaoke Rooms</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +180.1% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tăng trưởng</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'app/dashboard/page.tsx'),
      dashboardPage
    );

    console.log('✅ Tạo basic pages');
  }

  async createHooks() {
    console.log('🎣 Tạo custom hooks...');
    
    // useApi hook
    const useApiHook = `import { useState, useEffect } from 'react'
import axios from 'axios'

interface UseApiOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  headers?: Record<string, string>
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
}

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: any
  execute: () => Promise<void>
}

export function useApi<T>(options: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const execute = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios({
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        headers: options.headers,
      })
      
      setData(response.data)
      options.onSuccess?.(response.data)
    } catch (err) {
      setError(err)
      options.onError?.(err)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, execute }
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'hooks/useApi.ts'),
      useApiHook
    );

    console.log('✅ Tạo custom hooks');
  }

  async createStore() {
    console.log('🏪 Tạo store...');
    
    // Auth store
    const authStore = `import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'store/auth.ts'),
      authStore
    );

    console.log('✅ Tạo store');
  }

  async createUtils() {
    console.log('🔧 Tạo utils...');
    
    // Utils
    const utils = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}`;

    fs.writeFileSync(
      path.join(this.dashboardPath, 'lib/utils.ts'),
      utils
    );

    console.log('✅ Tạo utils');
  }

  async installDependencies() {
    console.log('📦 Cài đặt dependencies...');
    
    try {
      process.chdir(this.dashboardPath);
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Cài đặt dependencies thành công');
    } catch (error) {
      console.error('❌ Lỗi cài đặt dependencies:', error.message);
    }
  }
}

// Chạy setup
if (require.main === module) {
  const setup = new DashboardSetup();
  setup.setup();
}

module.exports = DashboardSetup;
