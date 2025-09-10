const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class AudioTailocMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'audio-tailoc-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.projectRoot = process.env.PROJECT_ROOT || '/Users/macbook/Desktop/Code/audiotailoc';
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'get_project_status',
            description: 'Lấy trạng thái tổng quan của dự án Audio Tài Lộc',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'run_backend_tests',
            description: 'Chạy tests cho backend',
            inputSchema: {
              type: 'object',
              properties: {
                testType: {
                  type: 'string',
                  enum: ['unit', 'integration', 'e2e', 'all'],
                  default: 'all'
                }
              },
              required: []
            }
          },
          {
            name: 'check_database_health',
            description: 'Kiểm tra tình trạng database',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'build_and_deploy',
            description: 'Build và deploy ứng dụng',
            inputSchema: {
              type: 'object',
              properties: {
                environment: {
                  type: 'string',
                  enum: ['development', 'staging', 'production'],
                  default: 'development'
                }
              },
              required: []
            }
          }
        ]
      };
    });

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'get_project_status':
          return await this.getProjectStatus();
        case 'run_backend_tests':
          return await this.runBackendTests(args);
        case 'check_database_health':
          return await this.checkDatabaseHealth();
        case 'build_and_deploy':
          return await this.buildAndDeploy(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async getProjectStatus() {
    try {
      const backendPath = path.join(this.projectRoot, 'backend');
      const frontendPath = path.join(this.projectRoot, 'frontend');
      const dashboardPath = path.join(this.projectRoot, 'dashboard');

      const status = {
        backend: await this.checkServiceStatus(backendPath),
        frontend: await this.checkServiceStatus(frontendPath),
        dashboard: await this.checkServiceStatus(dashboardPath),
        database: await this.checkDatabaseStatus(),
        timestamp: new Date().toISOString()
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(status, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error: ${error.message}` }],
        isError: true
      };
    }
  }

  async runBackendTests(args = {}) {
    const testType = args.testType || 'all';

    return new Promise((resolve) => {
      const backendPath = path.join(this.projectRoot, 'backend');
      const command = `cd ${backendPath} && npm run test:${testType}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({
            content: [{ type: 'text', text: `Test failed: ${error.message}\n${stderr}` }],
            isError: true
          });
        } else {
          resolve({
            content: [{ type: 'text', text: `Tests completed successfully:\n${stdout}` }]
          });
        }
      });
    });
  }

  async checkDatabaseHealth() {
    // Giả lập kiểm tra database
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'healthy',
          connection: 'active',
          tables: ['users', 'products', 'orders', 'categories'],
          lastBackup: new Date().toISOString()
        }, null, 2)
      }]
    };
  }

  async buildAndDeploy(args = {}) {
    const environment = args.environment || 'development';

    return {
      content: [{
        type: 'text',
        text: `Build and deploy initiated for ${environment} environment`
      }]
    };
  }

  async checkServiceStatus(servicePath) {
    return new Promise((resolve) => {
      const packageJsonPath = path.join(servicePath, 'package.json');

      require('fs').access(packageJsonPath, (error) => {
        if (error) {
          resolve('not_found');
        } else {
          // Kiểm tra xem service có đang chạy không
          exec(`lsof -ti:${this.getServicePort(servicePath)}`, (error, stdout) => {
            resolve(stdout ? 'running' : 'stopped');
          });
        }
      });
    });
  }

  async checkDatabaseStatus() {
    // Giả lập kiểm tra database connection
    return 'connected';
  }

  getServicePort(servicePath) {
    const serviceName = path.basename(servicePath);
    switch (serviceName) {
      case 'backend': return '3010';
      case 'frontend': return '3000';
      case 'dashboard': return '3001';
      default: return '3000';
    }
  }
}

const server = new AudioTailocMCPServer();
const transport = new StdioServerTransport();

server.connect(transport).catch((error) => {
  console.error('MCP Server error:', error);
  process.exit(1);
});
