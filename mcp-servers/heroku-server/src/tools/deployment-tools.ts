import { MCPTool } from '@audiotailoc/mcp-common';

export class DeploymentTools {
  private tools: MCPTool[] = [
    {
      name: 'deployment_create_heroku_config',
      description: 'Tạo cấu hình deployment cho Heroku',
      inputSchema: {
        type: 'object',
        properties: {
          appName: {
            type: 'string',
            description: 'Tên ứng dụng trên Heroku'
          },
          environment: {
            type: 'string',
            description: 'Môi trường (production, staging)',
            default: 'production'
          }
        },
        required: ['appName']
      }
    },
    {
      name: 'deployment_generate_dockerfile',
      description: 'Tạo Dockerfile cho deployment',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Loại ứng dụng',
            enum: ['backend', 'frontend', 'dashboard'],
            default: 'backend'
          }
        }
      }
    },
    {
      name: 'deployment_get_checklist',
      description: 'Lấy checklist trước khi deployment',
      inputSchema: {
        type: 'object',
        properties: {
          environment: {
            type: 'string',
            description: 'Môi trường deployment',
            enum: ['production', 'staging'],
            default: 'production'
          }
        }
      }
    },
    {
      name: 'deployment_rollback_guide',
      description: 'Hướng dẫn rollback deployment nếu có lỗi',
      inputSchema: {
        type: 'object',
        properties: {
          appName: {
            type: 'string',
            description: 'Tên ứng dụng cần rollback'
          },
          targetVersion: {
            type: 'string',
            description: 'Phiên bản muốn rollback tới'
          }
        },
        required: ['appName']
      }
    },
    {
      name: 'deployment_monitoring_setup',
      description: 'Cấu hình monitoring cho ứng dụng',
      inputSchema: {
        type: 'object',
        properties: {
          appName: {
            type: 'string',
            description: 'Tên ứng dụng'
          },
          tools: {
            type: 'array',
            description: 'Các công cụ monitoring cần thiết',
            items: {
              type: 'string',
              enum: ['health-check', 'metrics', 'logging', 'alerting']
            },
            default: ['health-check', 'logging']
          }
        },
        required: ['appName']
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
      case 'deployment_create_heroku_config':
        return await this.createHerokuConfig(args);
      case 'deployment_generate_dockerfile':
        return await this.generateDockerfile(args);
      case 'deployment_get_checklist':
        return await this.getChecklist(args);
      case 'deployment_rollback_guide':
        return await this.rollbackGuide(args);
      case 'deployment_monitoring_setup':
        return await this.monitoringSetup(args);
      default:
        throw new Error(`Công cụ không tìm thấy: ${name}`);
    }
  }

  private async createHerokuConfig(args: { appName: string; environment?: string }) {
    const env = args.environment || 'production';

    const config = {
      appName: args.appName,
      environment: env,
      buildpacks: [
        'heroku/nodejs',
        'heroku/python' // for compatibility
      ],
      addons: [
        {
          name: 'heroku-postgresql',
          plan: env === 'production' ? 'hobby-dev' : 'hobby-dev'
        },
        {
          name: 'heroku-redis',
          plan: env === 'production' ? 'hobby-dev' : 'hobby-dev'
        }
      ],
      environmentVariables: {
        NODE_ENV: env,
        NPM_CONFIG_PRODUCTION: 'true',
        DATABASE_URL: '${DATABASE_URL}',
        REDIS_URL: '${REDIS_URL}',
        JWT_SECRET: 'change-this-in-production',
        APP_URL: `https://${args.appName}.herokuapp.com`
      },
      domains: [
        `${args.appName}.herokuapp.com`
      ]
    };

    return {
      content: [
        {
          type: 'text',
          text: `Cấu hình Heroku deployment cho ứng dụng: ${args.appName}\n\n${JSON.stringify(config, null, 2)}\n\nCác bước tiếp theo:\n1. Tạo ứng dụng: heroku apps:create ${args.appName}\n2. Thêm addons: heroku addons:create heroku-postgresql:hobby-dev --app ${args.appName}\n3. Set environment variables: heroku config:set NODE_ENV=${env} --app ${args.appName}\n4. Deploy: git push heroku main`
        }
      ]
    };
  }

  private async generateDockerfile(args: { type?: string }) {
    const type = args.type || 'backend';

    const dockerfiles = {
      backend: `# Multi-stage build for NestJS backend
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npm ci --only=production
RUN npx prisma generate

EXPOSE 3001
CMD ["npm", "run", "start:prod"]`,

      frontend: `# Multi-stage build for Next.js frontend
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]`,

      dashboard: `# Multi-stage build for Next.js dashboard
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3002
CMD ["npm", "start"]`
    };

    return {
      content: [
        {
          type: 'text',
          text: `Dockerfile cho ${type}:\n\n${dockerfiles[type as keyof typeof dockerfiles]}\n\nLưu ý:\n- Sử dụng multi-stage build để tối ưu size image\n- Chỉ copy production dependencies\n- Expose đúng port cho từng service\n- Sử dụng alpine image để giảm size`
        }
      ]
    };
  }

  private async getChecklist(args: { environment?: string }) {
    const env = args.environment || 'production';

    const checklist = {
      code: [
        '✅ Đã test tất cả unit tests',
        '✅ Đã chạy integration tests',
        '✅ Code đã được review',
        '✅ Không có linting errors',
        '✅ Dependencies đã được cập nhật',
        '✅ Environment variables đã được cấu hình'
      ],
      database: [
        '✅ Database migrations đã được tạo',
        '✅ Seed data đã được chuẩn bị',
        '✅ Database backup đã được thực hiện',
        '✅ Connection string đã được verify'
      ],
      deployment: [
        '✅ Dockerfile đã được tạo/cập nhật',
        '✅ .dockerignore đã được cấu hình',
        '✅ Heroku app đã được tạo',
        '✅ Environment variables đã được set trên Heroku',
        '✅ Buildpacks đã được cấu hình đúng',
        '✅ Domain đã được trỏ tới Heroku app'
      ],
      monitoring: [
        '✅ Health check endpoint đã hoạt động',
        '✅ Logging đã được cấu hình',
        '✅ Error tracking đã được thiết lập',
        '✅ Performance monitoring đã được bật'
      ],
      security: [
        '✅ Secrets đã được cấu hình đúng',
        '✅ Database credentials đã được bảo mật',
        '✅ API keys đã được rotate nếu cần',
        '✅ Security headers đã được thiết lập'
      ]
    };

    const formatChecklist = (items: string[]) => {
      return items.map(item => `  ${item}`).join('\n');
    };

    const result = Object.entries(checklist).map(([category, items]) => {
      return `${category.toUpperCase()}:\n${formatChecklist(items)}\n`;
    }).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Checklist trước khi deployment (${env}):\n\n${result}\n\n⚠️  Quan trọng: Chỉ deploy khi tất cả items đều được check!`
        }
      ]
    };
  }

  private async rollbackGuide(args: { appName: string; targetVersion?: string }) {
    const version = args.targetVersion || 'previous';

    const guide = `# Hướng dẫn Rollback Deployment

## Nếu gặp lỗi sau deployment:

### 1. Kiểm tra tình trạng ứng dụng:
heroku apps:info --app ${args.appName}
heroku ps --app ${args.appName}

### 2. Xem logs để xác định lỗi:
heroku logs -t --app ${args.appName}

### 3. Rollback về version trước:
heroku rollback --app ${args.appName}

### 4. Nếu cần rollback về version cụ thể:
heroku releases --app ${args.appName}
heroku rollback v123 --app ${args.appName}

### 5. Verify rollback thành công:
heroku open --app ${args.appName}
heroku logs -t --app ${args.appName}

## Các bước phòng ngừa:
- Luôn test kỹ trên staging environment trước
- Có database backup trước khi deploy
- Monitor metrics sau khi deploy
- Có rollback plan sẵn sàng`;

    return {
      content: [
        {
          type: 'text',
          text: `Hướng dẫn rollback cho ứng dụng: ${args.appName}\n\n${guide}`
        }
      ]
    };
  }

  private async monitoringSetup(args: { appName: string; tools?: string[] }) {
    const tools = args.tools || ['health-check', 'logging'];
    const appName = args.appName;

    const setupGuide = `# Cấu hình Monitoring cho ${appName}

## 1. Health Check Setup
### Tạo health check endpoint:
GET /api/health

### Cấu hình Heroku health check:
heroku apps:info --app ${appName}
# Trong dashboard, set health check URL

## 2. Logging Setup
### Cấu hình structured logging:
- Sử dụng Winston hoặc Pino
- Log levels: error, warn, info, debug
- Include request ID trong mỗi log

### Xem logs real-time:
heroku logs -t --app ${appName}

## 3. Performance Monitoring
### Sử dụng Heroku Metrics:
heroku addons:create heroku-metrics --app ${appName}

### Monitor dyno performance:
heroku ps --app ${appName}

## 4. Error Tracking
### Tích hợp Sentry hoặc Rollbar:
npm install @sentry/node

### Cấu hình error tracking:
SENTRY_DSN=your-dsn-here

## 5. Alerting Setup
### Cấu hình alerts trong Heroku:
- Dyno memory usage > 80%
- Response time > 5s
- Error rate > 1%

## Công cụ được chọn: ${tools.join(', ')}`;

    return {
      content: [
        {
          type: 'text',
          text: `Cấu hình monitoring cho ứng dụng: ${appName}\n\n${setupGuide}`
        }
      ]
    };
  }
}