# 🚀 Hướng Dẫn Thiết Lập MCP (Model Context Protocol) cho Audio Tài Lộc

## 📋 Tổng Quan

Model Context Protocol (MCP) cho phép Copilot và các AI assistant tương tác với các công cụ và dữ liệu bên ngoài một cách an toàn và có cấu trúc.

## 🔧 Cài Đặt MCP Servers

### 1. Cài Đặt MCP CLI
```bash
npm install -g @modelcontextprotocol/cli
```

### 2. Khởi Tạo MCP Configuration
Tạo file `mcp.json` trong thư mục gốc của dự án:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/Users/macbook/Desktop/Code/audiotailoc"]
    },
    "git": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-git", "--repository", "/Users/macbook/Desktop/Code/audiotailoc"]
    },
    "sqlite": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sqlite", "--db-path", "/Users/macbook/Desktop/Code/audiotailoc/backend/dev.db"]
    }
  }
}
```

### 3. Cấu Hình VS Code Settings

Thêm vào `.vscode/settings.json`:

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.autoApprove": true,
  "github.copilot.chat.mcp.servers": ["filesystem", "git", "sqlite"]
}
```

## 🎯 Cách Sử Dụng MCP với Copilot

### Commands Cơ Bản
- **File Operations**: "read the file package.json"
- **Git Operations**: "show me the git status"
- **Database Queries**: "query the users table"
- **Run Tasks**: "run the dev:backend task"

### Advanced Usage
- **Multi-step Tasks**: "build the backend and run tests"
- **Code Analysis**: "analyze the authentication module"
- **Database Operations**: "create a new user in the database"

## 🔄 Workflow Tối Ưu với MCP

### 1. Development Workflow
```
1. "check git status" → Xem trạng thái code
2. "run tests" → Chạy test tự động
3. "build backend" → Build và check errors
4. "deploy to staging" → Deploy tự động
```

### 2. Code Review Workflow
```
1. "analyze code quality" → Phân tích chất lượng code
2. "check for security issues" → Kiểm tra lỗ hổng bảo mật
3. "review pull request" → Review PR tự động
```

### 3. Database Workflow
```
1. "check database schema" → Xem cấu trúc DB
2. "run migrations" → Chạy migration
3. "seed test data" → Tạo dữ liệu test
```

## ⚙️ Cấu Hình Nâng Cao

### Custom MCP Servers

Tạo MCP server tùy chỉnh cho dự án:

```javascript
// mcp-server.js
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

class AudioTailocServer {
  constructor() {
    this.server = new Server(
      {
        name: 'audio-tailoc-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // Thêm các tool tùy chỉnh
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'get_project_status':
          return this.getProjectStatus();
        case 'run_all_tests':
          return this.runAllTests();
        case 'deploy_application':
          return this.deployApplication();
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async getProjectStatus() {
    // Logic để lấy trạng thái dự án
    return {
      backend: 'running',
      frontend: 'running',
      database: 'connected',
      tests: 'passing'
    };
  }

  async runAllTests() {
    // Logic để chạy tất cả tests
    return {
      status: 'completed',
      passed: 150,
      failed: 0,
      coverage: '95%'
    };
  }

  async deployApplication() {
    // Logic để deploy ứng dụng
    return {
      status: 'deployed',
      version: '1.2.3',
      environment: 'production'
    };
  }
}

const server = new AudioTailocServer();
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
```

### Integration với CI/CD

```yaml
# .github/workflows/mcp-ci.yml
name: MCP CI/CD

on:
  push:
    branches: [main, develop]

jobs:
  mcp-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup MCP
        run: npm install -g @modelcontextprotocol/cli
      - name: Run MCP Analysis
        run: mcp analyze --project . --output results.json
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: mcp-results
          path: results.json
```

## 🔒 Bảo Mật và Quyền Hạn

### MCP Security Best Practices

1. **Principle of Least Privilege**: Chỉ cấp quyền cần thiết
2. **Environment Isolation**: Tách biệt môi trường dev/staging/prod
3. **Access Control**: Kiểm soát quyền truy cập MCP servers
4. **Audit Logging**: Ghi log tất cả hoạt động MCP

### Configuration Examples

```json
{
  "mcpServers": {
    "production-db": {
      "command": "mcp-sqlite",
      "args": ["--db-path", "/var/data/prod.db"],
      "env": {
        "READ_ONLY": "true"
      }
    },
    "development-tools": {
      "command": "mcp-dev-tools",
      "args": ["--project", "/workspace"],
      "env": {
        "ALLOW_WRITE": "true"
      }
    }
  }
}
```

## 📊 Monitoring và Analytics

### MCP Metrics

- **Usage Statistics**: Theo dõi tần suất sử dụng MCP
- **Performance Metrics**: Đo thời gian phản hồi
- **Error Rates**: Theo dõi tỷ lệ lỗi
- **Security Events**: Ghi nhận sự kiện bảo mật

### Dashboard Integration

Tích hợp MCP metrics vào dashboard:

```typescript
// dashboard/pages/mcp-analytics.tsx
export default function MCPAnalytics() {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    fetch('/api/mcp/metrics')
      .then(res => res.json())
      .then(setMetrics);
  }, []);

  return (
    <div>
      <h1>MCP Analytics</h1>
      <MetricCard title="Total Requests" value={metrics.totalRequests} />
      <MetricCard title="Success Rate" value={`${metrics.successRate}%`} />
      <MetricCard title="Average Response Time" value={`${metrics.avgResponseTime}ms`} />
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Consistent Naming
- Sử dụng naming convention rõ ràng cho MCP servers
- Đặt tên tool theo pattern: `action_resource`

### 2. Error Handling
- Implement comprehensive error handling
- Provide meaningful error messages
- Log errors for debugging

### 3. Performance Optimization
- Cache frequently accessed data
- Use connection pooling
- Implement rate limiting

### 4. Documentation
- Document all MCP servers and tools
- Provide usage examples
- Keep documentation up-to-date

## 🚀 Future Enhancements

### Planned Features
- **AI-Powered Code Review**: Tự động review code sử dụng MCP
- **Intelligent Testing**: Test tự động dựa trên code changes
- **Performance Monitoring**: Real-time performance tracking
- **Security Scanning**: Tự động scan security vulnerabilities

### Integration Opportunities
- **Slack Integration**: Nhận thông báo qua Slack
- **Jira Integration**: Tự động tạo tickets
- **GitHub Integration**: Enhanced PR management
- **Docker Integration**: Container management

---

## 📞 Support

Nếu bạn gặp vấn đề khi thiết lập MCP:

1. Kiểm tra logs: `tail -f ~/.mcp/logs/server.log`
2. Verify configuration: `mcp validate --config mcp.json`
3. Check network connectivity
4. Update MCP CLI: `npm update -g @modelcontextprotocol/cli`

## 🎯 VS Code Tasks cho MCP

### Tasks Đã Được Cấu Hình

Chúng tôi đã tạo các VS Code tasks để quản lý MCP servers dễ dàng:

#### 1. `mcp:start` - Khởi Động MCP Servers

- **Mô tả**: Khởi động tất cả MCP servers (Playwright, Memory, Browser)
- **Cách sử dụng**:
  - Mở Command Palette (Cmd+Shift+P)
  - Gõ "Tasks: Run Task"
  - Chọn "mcp:start"
- **Hoặc**: Nhấn F1 → "Run Task" → "mcp:start"

#### 2. `mcp:stop` - Dừng MCP Servers

- **Mô tả**: Dừng tất cả MCP servers đang chạy
- **Cách sử dụng**: F1 → "Run Task" → "mcp:stop"

#### 3. `mcp:status` - Kiểm Tra Trạng Thái

- **Mô tả**: Hiển thị trạng thái của tất cả MCP servers
- **Cách sử dụng**: F1 → "Run Task" → "mcp:status"

#### 4. `mcp:auto-start` - Tự Động Khởi Động

- **Mô tả**: Khởi động MCP servers và giữ chúng chạy trong background
- **Cách sử dụng**: F1 → "Run Task" → "mcp:auto-start"

### Tự Động Khởi Động MCP

Để tự động khởi động MCP khi mở workspace:

1. **Sử dụng Task Auto-Start**:

   ```bash
   # Chạy task từ terminal
   ./start-mcp-auto.sh
   ```

2. **Hoặc sử dụng VS Code Task**:
   - F1 → "Run Task" → "mcp:auto-start"

### Quản Lý MCP Từ Terminal

Ngoài VS Code tasks, bạn có thể quản lý MCP trực tiếp từ terminal:

```bash
# Khởi động tất cả servers
./auto-mcp.sh start

# Dừng tất cả servers
./auto-mcp.sh stop

# Kiểm tra trạng thái
./auto-mcp.sh status

# Xem logs
./auto-mcp.sh logs

# Test kết nối
./auto-mcp.sh test

# Setup lại cấu hình
./auto-mcp.sh setup
```

### Tích Hợp Với Copilot

Sau khi MCP servers đang chạy, bạn có thể sử dụng Copilot với:

- **Playwright**: Automation testing và web scraping
- **Memory**: Lưu trữ và truy xuất thông tin persistent
- **GitHub**: Tương tác với GitHub repositories
- **Browser**: Duyệt web và tương tác với các trang web

**Ví dụ sử dụng với Copilot:**

```bash
@playwright Tạo test case cho trang đăng nhập
@memory Lưu thông tin về user preferences
@github Tạo pull request cho feature mới
@browser Mở trang documentation của Next.js
```

## 🎉 Kết Luận

Happy coding with MCP! 🚀
