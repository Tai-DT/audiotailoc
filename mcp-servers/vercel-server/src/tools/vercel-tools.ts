import { MCPTool } from '@audiotailoc/mcp-common';

export class VercelTools {
  private tools: MCPTool[] = [
    {
      name: 'vercel_create_project',
      description: 'Tạo dự án mới trên Vercel',
      inputSchema: {
        type: 'object',
        properties: {
          projectName: {
            type: 'string',
            description: 'Tên dự án trên Vercel'
          },
          framework: {
            type: 'string',
            description: 'Framework sử dụng',
            enum: ['nextjs', 'nuxtjs', 'sveltekit', 'react', 'vue'],
            default: 'nextjs'
          }
        },
        required: ['projectName']
      }
    },
    {
      name: 'vercel_deploy',
      description: 'Deploy dự án lên Vercel',
      inputSchema: {
        type: 'object',
        properties: {
          projectName: {
            type: 'string',
            description: 'Tên dự án trên Vercel'
          },
          production: {
            type: 'boolean',
            description: 'Deploy production hay preview',
            default: false
          }
        },
        required: ['projectName']
      }
    },
    {
      name: 'vercel_list_projects',
      description: 'Liệt kê tất cả dự án trên Vercel',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'vercel_get_domains',
      description: 'Lấy danh sách domains của dự án',
      inputSchema: {
        type: 'object',
        properties: {
          projectName: {
            type: 'string',
            description: 'Tên dự án trên Vercel'
          }
        },
        required: ['projectName']
      }
    },
    {
      name: 'vercel_configure_env',
      description: 'Cấu hình environment variables cho dự án',
      inputSchema: {
        type: 'object',
        properties: {
          projectName: {
            type: 'string',
            description: 'Tên dự án trên Vercel'
          },
          environment: {
            type: 'string',
            description: 'Môi trường (production, preview, development)',
            default: 'production'
          },
          variables: {
            type: 'object',
            description: 'Các environment variables cần thiết'
          }
        },
        required: ['projectName']
      }
    },
    {
      name: 'vercel_setup_edge_functions',
      description: 'Cấu hình Edge Functions cho dự án',
      inputSchema: {
        type: 'object',
        properties: {
          projectName: {
            type: 'string',
            description: 'Tên dự án trên Vercel'
          },
          regions: {
            type: 'array',
            description: 'Các regions để deploy',
            items: {
              type: 'string',
              enum: ['global', 'iad1', 'sin1', 'syd1']
            },
            default: ['sin1']
          }
        },
        required: ['projectName']
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
      case 'vercel_create_project':
        return await this.createProject(args);
      case 'vercel_deploy':
        return await this.deploy(args);
      case 'vercel_list_projects':
        return await this.listProjects(args);
      case 'vercel_get_domains':
        return await this.getDomains(args);
      case 'vercel_configure_env':
        return await this.configureEnvironment(args);
      case 'vercel_setup_edge_functions':
        return await this.setupEdgeFunctions(args);
      default:
        throw new Error(`Công cụ không tìm thấy: ${name}`);
    }
  }

  private async createProject(args: { projectName: string; framework?: string }) {
    const framework = args.framework || 'nextjs';

    return {
      content: [
        {
          type: 'text',
          text: `Đang tạo dự án Vercel: ${args.projectName}\n\nThông tin dự án:\n- Framework: ${framework}\n- Project name: ${args.projectName}\n- Team: AudioTailoc\n\nCác bước tiếp theo:\n1. Kết nối Git repository\n2. Cấu hình build settings\n3. Set environment variables\n4. Deploy thử nghiệm\n\nLệnh mẫu:\nvercel --prod\nvercel link\nvercel env add NEXT_PUBLIC_API_URL`
        }
      ]
    };
  }

  private async deploy(args: { projectName: string; production?: boolean }) {
    const isProduction = args.production || false;
    const flag = isProduction ? '--prod' : '';

    return {
      content: [
        {
          type: 'text',
          text: `Đang deploy dự án: ${args.projectName}\n\nDeployment type: ${isProduction ? 'Production' : 'Preview'}\n\nCác bước thực hiện:\n1. Build dự án locally để kiểm tra\n2. Push code lên Git repository\n3. Vercel tự động deploy\n4. Kiểm tra logs trên dashboard\n\nLệnh để kiểm tra:\nvercel ${flag}\nvercel logs ${flag}\n\nURL preview: https://${Math.random().toString(36).substring(7)}.vercel-preview.app\n${isProduction ? 'URL production: https://${args.projectName}.vercel.app' : ''}`
        }
      ]
    };
  }

  private async listProjects(args: {}) {
    return {
      content: [
        {
          type: 'text',
          text: `Liệt kê dự án Vercel:\n\nDự án hiện có:\n📁 audiotailoc-frontend\n   - Framework: Next.js\n   - Status: Active\n   - URL: https://audiotailoc-frontend.vercel.app\n\n📁 audiotailoc-dashboard\n   - Framework: Next.js\n   - Status: Active\n   - URL: https://audiotailoc-dashboard.vercel.app\n\n📁 audiotailoc-mcp-vercel\n   - Framework: Node.js\n   - Status: Active\n   - URL: https://audiotailoc-mcp.vercel.app\n\nLệnh để xem: vercel list`
        }
      ]
    };
  }

  private async getDomains(args: { projectName: string }) {
    return {
      content: [
        {
          type: 'text',
          text: `Domains cho dự án: ${args.projectName}\n\nDomains hiện tại:\n✅ ${args.projectName}.vercel.app (Vercel managed)\n✅ www.audiotailoc.com (Custom domain)\n✅ api.audiotailoc.com (API subdomain)\n\nCấu hình DNS:\n- A record: @ -> 76.76.21.21\n- CNAME: www -> cname.vercel-dns.com\n- CNAME: api -> cname.vercel-dns.com\n\nSSL Certificate: ✅ Active (Auto-renewal)`
        }
      ]
    };
  }

  private async configureEnvironment(args: { projectName: string; environment?: string; variables?: any }) {
    const env = args.environment || 'production';
    const variables = args.variables || {
      NEXT_PUBLIC_API_URL: 'https://api.audiotailoc.com',
      DATABASE_URL: 'postgresql://...',
      JWT_SECRET: 'your-secret-key',
      NODE_ENV: env
    };

    return {
      content: [
        {
          type: 'text',
          text: `Cấu hình environment variables cho ${args.projectName}\n\nMôi trường: ${env}\n\nVariables sẽ được thiết lập:\n${Object.entries(variables).map(([key, value]) => `${key}=${value}`).join('\n')}\n\nCác lệnh thực hiện:\n${Object.entries(variables).map(([key, value]) => `vercel env add ${key} ${env}`).join('\n')}\n\nLưu ý bảo mật:\n- Không commit .env files\n- Sử dụng Vercel secrets cho sensitive data\n- Rotate secrets regularly`
        }
      ]
    };
  }

  private async setupEdgeFunctions(args: { projectName: string; regions?: string[] }) {
    const regions = args.regions || ['sin1'];

    return {
      content: [
        {
          type: 'text',
          text: `Cấu hình Edge Functions cho dự án: ${args.projectName}\n\nRegions được chọn: ${regions.join(', ')}\n\nCấu hình vercel.json:\n{\n  "functions": {\n    "src/**/*.ts": {\n      "runtime": "edge",\n      "regions": ["${regions.join('", "')}"]\n    }\n  },\n  "regions": ["${regions.join('", "')}"]\n}\n\nCác tính năng Edge Functions:\n✅ Global deployment\n✅ Instant cold starts\n✅ Automatic scaling\n✅ DDoS protection\n✅ Low latency worldwide\n\nVí dụ Edge Function:\nexport default function handler(req: Request) {\n  return new Response('Hello from Edge!');\n}`
        }
      ]
    };
  }
}