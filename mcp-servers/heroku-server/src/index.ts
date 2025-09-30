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
import { HerokuTools } from './tools/heroku-tools';
import { ProjectTools } from './tools/project-tools';
import { DeploymentTools } from './tools/deployment-tools';

class AudioTailocHerokuMCPServer {
  private server: Server;
  private herokuTools: HerokuTools;
  private projectTools: ProjectTools;
  private deploymentTools: DeploymentTools;

  constructor() {
    this.server = new Server(
      {
        name: 'audiotailoc-heroku-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.herokuTools = new HerokuTools();
    this.projectTools = new ProjectTools();
    this.deploymentTools = new DeploymentTools();

    this.setupResourceHandlers();
    this.setupToolHandlers();
  }

  private setupResourceHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'project://info',
            name: 'Thông tin dự án AudioTailoc',
            description: 'Thông tin tổng quan về dự án',
            mimeType: 'application/json',
          },
          {
            uri: 'project://services',
            name: 'Danh sách dịch vụ',
            description: 'Thông tin các dịch vụ trong dự án',
            mimeType: 'application/json',
          },
          {
            uri: 'deployment://heroku/config',
            name: 'Cấu hình Heroku deployment',
            description: 'Cấu hình để deploy dự án lên Heroku',
            mimeType: 'application/json',
          }
        ],
      };
    });

    // Read specific resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'project://info':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(ProjectUtils.getProjectInfo(), null, 2),
              },
            ],
          };

        case 'project://services':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(ProjectUtils.getServiceInfo(), null, 2),
              },
            ],
          };

        case 'deployment://heroku/config':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  buildpacks: [
                    'heroku/nodejs',
                    'heroku/python'
                  ],
                  environment: {
                    NODE_ENV: 'production',
                    DATABASE_URL: 'postgresql://...',
                    JWT_SECRET: 'your-secret-key'
                  },
                  addons: [
                    'heroku-postgresql:hobby-dev',
                    'heroku-redis:hobby-dev'
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
          ...this.herokuTools.getTools(),
          ...this.projectTools.getTools(),
          ...this.deploymentTools.getTools()
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
        if (this.herokuTools.hasTool(name)) {
          result = await this.herokuTools.executeTool(name, args);
        } else if (this.projectTools.hasTool(name)) {
          result = await this.projectTools.executeTool(name, args);
        } else if (this.deploymentTools.hasTool(name)) {
          result = await this.deploymentTools.executeTool(name, args);
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
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    Logger.info('AudioTailoc Heroku MCP Server đang chạy...');
  }
}

// Start server
const server = new AudioTailocHerokuMCPServer();
server.run().catch((error) => {
  Logger.error('Lỗi khởi động server', error);
  process.exit(1);
});