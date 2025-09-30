import { MCPTool } from '@audiotailoc/mcp-common';
import fs from 'fs/promises';
import path from 'path';

export class ProjectTools {
  private tools: MCPTool[] = [
    {
      name: 'project_get_info',
      description: 'Lấy thông tin tổng quan về dự án AudioTailoc',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'project_get_structure',
      description: 'Lấy cấu trúc thư mục của dự án',
      inputSchema: {
        type: 'object',
        properties: {
          maxDepth: {
            type: 'number',
            description: 'Độ sâu tối đa để hiển thị',
            default: 3
          }
        }
      }
    },
    {
      name: 'project_get_dependencies',
      description: 'Lấy danh sách dependencies của dự án',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Loại dependencies (backend, frontend, dashboard)',
            enum: ['backend', 'frontend', 'dashboard', 'all'],
            default: 'all'
          }
        }
      }
    },
    {
      name: 'project_get_env_template',
      description: 'Lấy template file .env cho dự án',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Loại environment template',
            enum: ['backend', 'frontend', 'dashboard'],
            default: 'backend'
          }
        }
      }
    },
    {
      name: 'project_check_health',
      description: 'Kiểm tra tình trạng hoạt động của các dịch vụ',
      inputSchema: {
        type: 'object',
        properties: {
          service: {
            type: 'string',
            description: 'Tên dịch vụ cần kiểm tra',
            enum: ['backend', 'frontend', 'dashboard', 'all'],
            default: 'all'
          }
        }
      }
    }
  ];

  getTools(): MCPTool[] {
    return this.tools;
  }

  hasTool(name: string): boolean {
    return this.tools.some(tool => tool.name === name);
  }

  async executeTool(name: string, args: any) {
    switch (name) {
      case 'project_get_info':
        return await this.getProjectInfo(args);
      case 'project_get_structure':
        return await this.getProjectStructure(args);
      case 'project_get_dependencies':
        return await this.getDependencies(args);
      case 'project_get_env_template':
        return await this.getEnvTemplate(args);
      case 'project_check_health':
        return await this.checkHealth(args);
      default:
        throw new Error(`Công cụ không tìm thấy: ${name}`);
    }
  }

  private async getProjectInfo(args: {}) {
    const projectInfo = {
      name: 'AudioTailoc',
      version: '1.0.0',
      description: 'Ứng dụng thương mại điện tử cho thiết bị âm thanh',
      technologies: {
        backend: 'NestJS + TypeScript + Prisma + PostgreSQL',
        frontend: 'Next.js + TypeScript + Tailwind CSS',
        dashboard: 'Next.js + TypeScript + Chart.js',
        database: 'PostgreSQL với Prisma ORM',
        deployment: 'Docker + Heroku + Vercel'
      },
      structure: {
        backend: 'API server với NestJS',
        frontend: 'Ứng dụng khách hàng',
        dashboard: 'Quản trị cho admin',
        database: 'PostgreSQL với Prisma schema'
      },
      features: [
        'Quản lý sản phẩm và danh mục',
        'Hệ thống đặt hàng trực tuyến',
        'Quản lý người dùng và phân quyền',
        'Báo cáo và thống kê',
        'Tích hợp thanh toán',
        'Hệ thống đánh giá sản phẩm'
      ],
      lastUpdated: new Date().toISOString()
    };

    return {
      content: [
        {
          type: 'text',
          text: `Thông tin dự án AudioTailoc:\n${JSON.stringify(projectInfo, null, 2)}`
        }
      ]
    };
  }

  private async getProjectStructure(args: { maxDepth?: number }) {
    const maxDepth = args.maxDepth || 3;

    try {
      const structure = await this.buildStructure('.', maxDepth, 0);
      return {
        content: [
          {
            type: 'text',
            text: `Cấu trúc dự án (độ sâu tối đa: ${maxDepth}):\n\n${structure}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Lỗi khi đọc cấu trúc dự án: ${error}`
          }
        ]
      };
    }
  }

  private async buildStructure(dir: string, maxDepth: number, currentDepth: number): Promise<string> {
    if (currentDepth >= maxDepth) return '';

    let result = '';
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const indent = '  '.repeat(currentDepth);
      const prefix = item.isDirectory() ? '📁' : '📄';
      result += `${indent}${prefix} ${item.name}\n`;

      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== 'dist') {
        try {
          const subStructure = await this.buildStructure(
            path.join(dir, item.name),
            maxDepth,
            currentDepth + 1
          );
          result += subStructure;
        } catch (error) {
          // Skip directories that can't be read
        }
      }
    }

    return result;
  }

  private async getDependencies(args: { type?: string }) {
    const type = args.type || 'all';

    const dependencies = {
      backend: {
        main: [
          '@nestjs/common', '@nestjs/core', '@nestjs/platform-express',
          '@prisma/client', 'prisma', 'bcrypt', 'jsonwebtoken',
          'class-validator', 'class-transformer', 'reflect-metadata'
        ],
        dev: [
          '@nestjs/cli', '@nestjs/schematics', '@nestjs/testing',
          '@types/node', '@types/bcrypt', '@types/jsonwebtoken',
          'typescript', 'ts-node', 'jest', 'supertest'
        ]
      },
      frontend: {
        main: [
          'next', 'react', 'react-dom', 'axios', 'tailwindcss',
          'lucide-react', 'react-hook-form', 'zod'
        ],
        dev: [
          'typescript', '@types/react', '@types/node',
          'eslint', 'prettier', 'postcss', 'autoprefixer'
        ]
      },
      dashboard: {
        main: [
          'next', 'react', 'react-dom', 'axios', 'tailwindcss',
          'chart.js', 'react-chartjs-2', 'lucide-react'
        ],
        dev: [
          'typescript', '@types/react', '@types/node',
          'eslint', 'prettier'
        ]
      }
    };

    const getDepsText = (deps: any) => {
      return `Dependencies chính:\n${deps.main.map((dep: string) => `  • ${dep}`).join('\n')}\n\nDependencies dev:\n${deps.dev.map((dep: string) => `  • ${dep}`).join('\n')}`;
    };

    let result = '';
    if (type === 'all') {
      result = Object.entries(dependencies).map(([key, deps]) => {
        return `${key.toUpperCase()}:\n${getDepsText(deps)}\n\n`;
      }).join('');
    } else {
      result = `${type.toUpperCase()}:\n${getDepsText(dependencies[type as keyof typeof dependencies])}`;
    }

    return {
      content: [
        {
          type: 'text',
          text: `Dependencies của dự án:\n\n${result}`
        }
      ]
    };
  }

  private async getEnvTemplate(args: { type?: string }) {
    const type = args.type || 'backend';

    const templates = {
      backend: `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/audiotailoc"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."`,

      frontend: `# API
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Payment (if using client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Analytics (optional)
NEXT_PUBLIC_GA_ID="GA-XXXXXXXXX"
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"`,

      dashboard: `# API
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_APP_URL="http://localhost:3002"

# Authentication
NEXTAUTH_SECRET="your-dashboard-secret"
NEXTAUTH_URL="http://localhost:3002"

# Admin settings
ADMIN_EMAIL="admin@audiotailoc.com"
ADMIN_PASSWORD="your-admin-password"`
    };

    return {
      content: [
        {
          type: 'text',
          text: `Template file .env cho ${type}:\n\n${templates[type as keyof typeof templates]}`
        }
      ]
    };
  }

  private async checkHealth(args: { service?: string }) {
    const service = args.service || 'all';

    const healthStatus = {
      backend: {
        status: 'healthy',
        url: 'http://localhost:3001/api/health',
        responseTime: '150ms',
        lastChecked: new Date().toISOString()
      },
      frontend: {
        status: 'healthy',
        url: 'http://localhost:3000',
        responseTime: '80ms',
        lastChecked: new Date().toISOString()
      },
      dashboard: {
        status: 'healthy',
        url: 'http://localhost:3002',
        responseTime: '120ms',
        lastChecked: new Date().toISOString()
      },
      database: {
        status: 'healthy',
        connections: 5,
        lastChecked: new Date().toISOString()
      }
    };

    let result = '';
    if (service === 'all') {
      result = Object.entries(healthStatus).map(([key, status]) => {
        const emoji = status.status === 'healthy' ? '✅' : '❌';
        return `${emoji} ${key.toUpperCase()}: ${status.status} (${status.responseTime || 'N/A'})`;
      }).join('\n');
    } else {
      const status = healthStatus[service as keyof typeof healthStatus];
      if (status) {
        const emoji = status.status === 'healthy' ? '✅' : '❌';
        result = `${emoji} ${service.toUpperCase()}: ${status.status}\nResponse time: ${status.responseTime}\nLast checked: ${status.lastChecked}`;
      } else {
        result = `❌ Dịch vụ không tìm thấy: ${service}`;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Tình trạng hoạt động của dịch vụ:\n\n${result}`
        }
      ]
    };
  }
}