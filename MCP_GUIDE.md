# MCP (Model Context Protocol) Setup Guide

## Tổng quan

Hệ thống MCP đã được cấu hình với các servers sau:

### 🔧 **Stdio Servers** (Local)
- **Playwright**: Browser automation và testing
- **Memory**: Lưu trữ persistent data
- **shadcn**: UI components và design system
- **Filesystem**: Truy cập và quản lý file system
- **Git**: Git operations và version control
- **SQLite**: SQLite database operations
- **Postgres**: PostgreSQL database operations
- **Redis**: Redis cache và session management
- **Slack**: Slack integration và messaging
- **Notion**: Notion workspace và knowledge base
- **Figma**: Figma design collaboration
- **Linear**: Linear issue tracking và project management
- **Weather**: Weather data và forecasts
- **Spotify**: Spotify music integration
- **YouTube**: YouTube video content và API
- **Gmail**: Gmail email integration
- **Everything**: System commands và utilities
- **imagesorcery**: Xử lý hình ảnh
- **markitdown**: Chuyển đổi documents

### 🌐 **HTTP Servers** (Remote)

- **Microsoft Docs**: Documentation và API reference
- **DeepWiki**: Knowledge base và search
- **Sentry**: Error monitoring và alerting
- **Prisma Postgres**: Database management
- **GitHub Copilot**: AI assistance và code completion

## Cài đặt

### 1. Chạy script setup tự động

```bash
cd /Users/macbook/Desktop/Code/audiotailoc
chmod +x setup-mcp.sh
./setup-mcp.sh
```

### 2. Restart VS Code

Sau khi setup, restart VS Code để load MCP settings.

### 3. Test các MCP servers

```bash
./test-mcp.sh
```

## Sử dụng MCP Servers

### Playwright MCP

```javascript
// Browser automation
await page.goto('https://example.com');
await page.click('button');
await page.fill('input', 'text');
```

### Memory MCP

```json
{
  "conversations": [
    {
      "id": "conv_1",
      "messages": ["Hello", "Hi there!"],
      "timestamp": "2025-01-13T10:00:00Z"
    }
  ],
  "documents": [
    {
      "id": "doc_1",
      "content": "Project documentation...",
      "tags": ["important", "reference"]
    }
  ]
}
```

### shadcn MCP

```bash
# Generate components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

### Imagesorcery MCP

```python
# Image processing
from imagesorcery import Image

img = Image.open('input.jpg')
img.resize(800, 600)
img.save('output.jpg')
```

### Markitdown MCP

```python
# Document conversion
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert('document.pdf')
print(result.text_content)
```

## Cấu hình nâng cao

### Memory Storage

MCP Memory server sử dụng file JSON để lưu trữ data:

```bash
# Cấu hình memory file path
export MEMORY_FILE_PATH="/Users/macbook/Desktop/Code/audiotailoc/mcp-memory/default.json"
```

### VS Code Settings

MCP settings được lưu trong VS Code settings.json:

```json
{
  "mcpServers": {
    "memory": {
      "env": {
        "MEMORY_FILE_PATH": "/path/to/memory.json"
      }
    }
  }
}
```

### Environment Variables

```bash
# MCP related environment variables
export MCP_DEBUG=true                    # Enable debug logging
export MCP_TIMEOUT=30000                 # Request timeout (ms)
export MCP_MAX_RETRIES=3                 # Max retry attempts
```

## Troubleshooting

### MCP Server không hoạt động

1. **Kiểm tra installation:**
   ```bash
   ./test-mcp.sh
   ```

2. **Check logs:**

   ```bash
   tail -f ~/.vscode/logs/mcp.log
   ```

3. **Restart VS Code:**

   ```bash
   # Command + Shift + P → Developer: Reload Window
   ```

### Network issues với HTTP servers

```bash
# Test connectivity
curl -I https://learn.microsoft.com/api/mcp
curl -I https://mcp.deepwiki.com/sse
```

### Memory file permissions

```bash
# Fix permissions
chmod 644 /path/to/memory.json
chown $USER /path/to/memory.json
```

## Best Practices

### 1. **Memory Management**

- Sử dụng memory file riêng cho từng project
- Backup memory files regularly
- Limit memory file size (< 100MB)

### 2. **Performance**

- Enable caching cho HTTP servers
- Use connection pooling
- Monitor memory usage

### 3. **Security**

- Không lưu sensitive data trong memory files
- Use HTTPS cho HTTP servers
- Regular security updates

### 4. **Backup & Recovery**

```bash
# Backup memory files
cp mcp-memory/default.json mcp-memory/backup-$(date +%Y%m%d).json

# Recovery
cp mcp-memory/backup-20250113.json mcp-memory/default.json
```

## Integration với Audio Tài Lộc

### Frontend Development

```javascript
// Sử dụng shadcn components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Browser testing với Playwright
// playwright.config.ts
export default {
  use: {
    baseURL: 'http://localhost:3000',
  },
}
```

### Backend Development

```typescript
// Database operations với Prisma
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Error monitoring với Sentry
import * as Sentry from "@sentry/node"
Sentry.init({ dsn: process.env.SENTRY_DSN })
```

### Documentation

```markdown
<!-- Sử dụng Microsoft Docs MCP để tra cứu -->
[Node.js Documentation](https://nodejs.org/api/)

<!-- DeepWiki cho internal docs -->
[Project Wiki](../../wiki/Home)
```

## Monitoring & Maintenance

### Health Checks

```bash
# Check all MCP servers
./test-mcp.sh

# Monitor memory usage
du -sh mcp-memory/
```

### Updates

```bash
# Update MCP packages
npm update -g @playwright/mcp @modelcontextprotocol/server-memory shadcn

# Update uvx packages
uvx --upgrade imagesorcery-mcp markitdown-mcp
```

### Logs

```bash
# MCP logs location
~/.vscode/logs/mcp.log
~/Library/Logs/vscode-mcp.log

# Monitor logs
tail -f ~/.vscode/logs/mcp.log
```

## Support

Nếu gặp vấn đề với MCP:

1. 📋 Check `./test-mcp.sh` output
2. 🔍 Review VS Code logs
3. 📧 Contact maintainer với error details
4. 📖 Reference [MCP Documentation](https://modelcontextprotocol.io/)

---

**🎉 MCP setup hoàn tất! Bạn có thể sử dụng tất cả các MCP servers trong VS Code.**