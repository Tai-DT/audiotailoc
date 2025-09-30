#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Logger, ErrorHandler, ProjectUtils, ValidationUtils } from '@audiotailoc/mcp-common';
import { VercelTools } from './tools/vercel-tools';
import { EdgeTools } from './tools/edge-tools';
import { APITools } from './tools/api-tools';

class AudioTailocVercelMCPServer {
  private server: Server;
  private vercelTools: VercelTools;
  private edgeTools: EdgeTools;
  private apiTools: APITools;

  constructor() {
    this.server = new Server(
      {
        name: 'audiotailoc-vercel-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.vercelTools = new VercelTools();
    this.edgeTools = new EdgeTools();
    this.apiTools = new APITools();

    this.setupResourceHandlers();
    this.setupToolHandlers();
  }

  private setupResourceHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'project://vercel/config',
            name: 'Cấu hình Vercel deployment',
            description: 'Cấu hình để deploy dự án lên Vercel',
            mimeType: 'application/json',
          },
          {
            uri: 'project://edge/functions',
            name: 'Edge Functions',
            description: 'Thông tin về Edge Functions trên Vercel',
            mimeType: 'application/json',
          },
          {
            uri: 'deployment://vercel/optimization',
            name: 'Tối ưu hóa Vercel deployment',
            description: 'Các tips tối ưu performance trên Vercel',
            mimeType: 'application/json',
          }
        ],
      };
    });

    // Read specific resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'project://vercel/config':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  framework: 'nextjs',
                  buildCommand: 'npm run build',
                  outputDirectory: '.next',
                  installCommand: 'npm install',
                  regions: ['sin1'],
                  functions: {
                    'src/pages/api/**/*.js': {
                      maxDuration: 30
                    }
                  }
                }, null, 2),
              },
            ],
          };

        case 'project://edge/functions':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  runtime: 'edge',
                  regions: ['global'],
                  maxDuration: 30,
                  languages: ['javascript', 'typescript'],
                  features: [
                    'Global deployment',
                    'Instant cold starts',
                    'Automatic scaling',
                    'DDoS protection'
                  ]
                }, null, 2),
              },
            ],
          };

        case 'deployment://vercel/optimization':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  performance: [
                    'Sử dụng ISR cho content động',
                    'Implement caching strategies',
                    'Optimize images với Next.js Image',
                    'Sử dụng CDN cho static assets',
                    'Minify CSS và JavaScript'
                  ],
                  security: [
                    'Cấu hình security headers',
                    'Sử dụng environment variables',
                    'Implement rate limiting',
                    'Validate user input',
                    'Sử dụng HTTPS everywhere'
                  ],
                  cost: [
                    'Monitor function invocations',
                    'Optimize bundle size',
                    'Use edge functions wisely',
                    'Implement caching',
                    'Clean up unused resources'
                  ]
                }, null, 2),
              },
            ],
          };

        default:
          throw new McpError(
            ErrorCode.InvalidRequest,
            `Unknown resource: ${uri}`
          );
      }
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          ...this.vercelTools.getTools(),
          ...this.edgeTools.getTools(),
          ...this.apiTools.getTools()
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      Logger.info(`Executing tool: ${name}`, args);

      try {
        let result: any;

        // Route to appropriate tool handler
        if (this.vercelTools.hasTool(name)) {
          result = await this.vercelTools.executeTool(name, args);
        } else if (this.edgeTools.hasTool(name)) {
          result = await this.edgeTools.executeTool(name, args);
        } else if (this.apiTools.hasTool(name)) {
          result = await this.apiTools.executeTool(name, args);
        } else {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Tool not found: ${name}`
          );
        }

        return result;
      } catch (error) {
        Logger.error(`Error executing tool ${name}`, error);
        throw new McpError(
          ErrorCode.InternalError,
          ErrorHandler.handle(error)
        );
      }
    });
  }

  async run() {
    // For Vercel deployment, use stdio transport
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    Logger.info('AudioTailoc Vercel MCP Server đang chạy...');
  }
}

// For local development (stdio)
if (require.main === module) {
  const server = new AudioTailocVercelMCPServer();
  server.run().catch((error) => {
    Logger.error('Lỗi khởi động server', error);
    process.exit(1);
  });
}

// For Vercel deployment (serverless function)
export default AudioTailocVercelMCPServer;