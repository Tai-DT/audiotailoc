# Audio Tài Lộc - Automation Scripts

Bộ công cụ tự động hóa hoàn chỉnh cho dự án Audio Tài Lộc, giúp bạn không cần hỏi lại liên tục và tăng năng suất phát triển.

## 📋 Tổng quan

Hệ thống bao gồm các script tự động:

- **🔄 Auto-Test**: Test toàn bộ API endpoints tự động
- **🔁 Auto-Restart**: Tự động restart server khi crash
- **🚀 Auto-Deploy**: Tự động deploy và update project
- **📊 Monitor**: Giám sát health và alert khi có vấn đề
- **⚡ Aliases**: Các lệnh tắt tiện lợi
- **🔧 CI/CD**: GitHub Actions workflow

## 🚀 Cài đặt nhanh

### 1. Cấp quyền thực thi cho scripts

```bash
cd /Users/macbook/Desktop/Code/audiotailoc
chmod +x auto-test.sh auto-restart.sh auto-deploy.sh monitor.sh
```

### 2. Thêm aliases vào shell

```bash
# Thêm dòng này vào ~/.zshrc hoặc ~/.bashrc
source /Users/macbook/Desktop/Code/audiotailoc/.audiotailoc-aliases

# Hoặc chạy trực tiếp
source .audiotailoc-aliases
```

### 3. Khởi động monitoring

```bash
# Chạy trong background
./monitor.sh &
```

## 📖 Hướng dẫn sử dụng

### Auto-Test Script (`auto-test.sh`)

Test toàn bộ API endpoints tự động với báo cáo chi tiết.

```bash
# Chạy full test suite
./auto-test.sh

# Hoặc dùng alias
at-auto-test
```

**Các test bao gồm:**
- ✅ Health check
- 🔐 Authentication
- 📂 Categories CRUD
- 📁 File upload
- 💳 Payments
- 📦 Orders

### Auto-Restart Script (`auto-restart.sh`)

Tự động restart server khi crash với monitoring liên tục.

```bash
# Khởi động auto-restart
./auto-restart.sh

# Hoặc dùng alias
at-auto-restart
```

**Tính năng:**
- 🔍 Health check mỗi 30 giây
- 🔄 Tự động restart khi crash
- 📊 Logging chi tiết
- 🛑 Graceful shutdown

### Auto-Deploy Script (`auto-deploy.sh`)

Tự động deploy và update toàn bộ hệ thống.

```bash
# Deploy đầy đủ
./auto-deploy.sh

# Deploy bỏ qua tests
./auto-deploy.sh --skip-tests

# Deploy bỏ qua build
./auto-deploy.sh --skip-build

# Rollback về backup trước
./auto-deploy.sh rollback

# Hoặc dùng aliases
at-auto-deploy
at-auto-deploy-skip-tests
```

**Quy trình deploy:**

1. 📦 Update dependencies
2. 🔨 Build tất cả services
3. 🗄️ Run database migrations
4. 🚀 Start services
5. ✅ Health check
6. 📋 Backup tự động

### Monitor Script (`monitor.sh`)

Giám sát health và alert khi có vấn đề.

```bash
# Khởi động monitoring
./monitor.sh

# Xem status hiện tại
./monitor.sh status

# Tạo báo cáo health
./monitor.sh report

# Restart service cụ thể
./monitor.sh restart backend

# Hoặc dùng aliases
at-monitor
```

**Monitoring:**
- 🌐 Service health checks
- 💻 System resources (CPU, Memory, Disk)
- 🗄️ Database connectivity
- 📧 Email/Slack notifications
- 🔄 Auto-restart failed services

## ⚡ Aliases tiện lợi

### Navigation

```bash
at              # Vào thư mục project
at-backend      # Vào backend
at-frontend     # Vào frontend
at-dashboard    # Vào dashboard
```

### Development

```bash
at-dev          # Chạy npm run dev
at-start        # Chạy toàn bộ hệ thống
at-backend-dev  # Chạy backend dev server
at-frontend-dev # Chạy frontend dev server
at-dashboard-dev# Chạy dashboard dev server
```

### Testing

```bash
at-test         # Chạy tất cả tests
at-test-unit    # Chạy unit tests
at-test-integration # Chạy integration tests
at-auto-test    # Chạy auto-test script
```

### Database

```bash
at-db-generate  # Generate Prisma client
at-db-migrate   # Run migrations
at-db-studio    # Open Prisma Studio
at-db-reset     # Reset database
```

### Health Checks

```bash
at-health       # Health check tất cả services
at-health-backend   # Health check backend
at-health-frontend  # Health check frontend
at-health-dashboard # Health check dashboard
```

### Quick API Tests

```bash
at-login        # Login và lấy token
at-test-categories  # Test categories API
at-test-products    # Test products API
at-test-orders      # Test orders API
at-test-payments    # Test payments API
```

### Logs

```bash
at-logs         # Xem tất cả logs
at-logs-backend # Xem backend logs
at-logs-error   # Xem error logs
```

### Utilities

```bash
at-status-all   # Xem status tổng quan
at-setup        # Setup project từ đầu
at-stop-all     # Dừng tất cả services
at-clean        # Dọn dẹp node_modules, builds
```

## 🔧 Cấu hình nâng cao

### Environment Variables

Tạo file `.env` trong thư mục project:

```bash
# Monitoring
NOTIFICATION_EMAIL=your-email@example.com
SLACK_WEBHOOK=https://hooks.slack.com/...

# Auto-deploy
BACKUP_RETENTION_DAYS=7
AUTO_UPDATE_DEPENDENCIES=true

# Auto-restart
MAX_RESTART_ATTEMPTS=5
HEALTH_CHECK_TIMEOUT=30
```

### Cron Jobs

Thêm vào crontab để chạy tự động:

```bash
# Mở crontab
crontab -e

# Thêm các dòng sau
# Health check mỗi 5 phút
*/5 * * * * /Users/macbook/Desktop/Code/audiotailoc/monitor.sh status >> /Users/macbook/Desktop/Code/audiotailoc/logs/cron.log 2>&1

# Auto-deploy mỗi ngày lúc 2:00 AM
0 2 * * * /Users/macbook/Desktop/Code/audiotailoc/auto-deploy.sh >> /Users/macbook/Desktop/Code/audiotailoc/logs/cron-deploy.log 2>&1

# Backup database hàng tuần
0 3 * * 0 /Users/macbook/Desktop/Code/audiotailoc/auto-deploy.sh backup >> /Users/macbook/Desktop/Code/audiotailoc/logs/cron-backup.log 2>&1
```

## 📊 GitHub Actions CI/CD

Workflow tự động bao gồm:

- 🔍 **Linting & Type checking**
- 🧪 **Unit & Integration tests**
- 🔨 **Build verification**
- 📦 **Security scanning**
- 🚀 **Auto-deployment**
- 📊 **Performance testing**
- 📧 **Notifications**

### Manual Trigger

```bash
# Trigger workflow từ GitHub UI hoặc
gh workflow run ci-cd.yml -f environment=staging
```

## 📁 Cấu trúc thư mục

```
audiotailoc/
├── auto-test.sh          # Comprehensive API testing
├── auto-restart.sh       # Auto-restart on crash
├── auto-deploy.sh        # Auto-deployment
├── monitor.sh           # Health monitoring
├── .audiotailoc-aliases # Shell aliases
├── .github/
│   └── workflows/
│       └── ci-cd.yml    # GitHub Actions
└── logs/                # Log files
    ├── auto-restart.log
    ├── auto-deploy.log
    ├── monitor.log
    └── alerts.log
```

## 🚨 Troubleshooting

### Script không chạy được

```bash
# Kiểm tra quyền
ls -la *.sh

# Cấp quyền nếu cần
chmod +x *.sh
```

### Dependencies missing

```bash
# Cài đặt dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../dashboard && npm install
```

### Services không start được

```bash
# Kiểm tra ports
lsof -i :3010  # Backend
lsof -i :3000  # Frontend
lsof -i :3001  # Dashboard

# Kill processes nếu cần
pkill -f "npm run"
pkill -f "node"
```

### Database connection issues

```bash
# Kiểm tra PostgreSQL
pg_isready -h localhost -p 5432

# Reset database
at-db-reset
```

## 📈 Best Practices

### 1. **Regular Backups**

```bash
# Tự động backup hàng ngày
0 2 * * * /path/to/auto-deploy.sh backup
```

### 2. **Monitor Resources**

```bash
# Theo dõi usage
at-status-all

# Set up alerts
export NOTIFICATION_EMAIL=admin@audiotailoc.com
```

### 3. **Log Rotation**

```bash
# Dọn logs cũ
find logs/ -name "*.log" -mtime +7 -delete
```

### 4. **Security**

```bash
# Không commit sensitive data
echo ".env" >> .gitignore

# Use secrets cho CI/CD
# Tham khảo GitHub Secrets documentation
```

## 🎯 Quick Start Commands

```bash
# 1. Setup
source .audiotailoc-aliases

# 2. Start monitoring
at-monitor &

# 3. Run tests
at-auto-test

# 4. Deploy
at-auto-deploy

# 5. Check status
at-status-all
```

## 📞 Support

Nếu gặp vấn đề:

1. 📋 Kiểm tra logs: `at-logs`
2. 🔍 Xem status: `at-status-all`
3. 🐛 Report issue với log files
4. 📧 Contact maintainer

---

**🎉 Chúc mừng! Bạn đã setup thành công hệ thống tự động hóa cho Audio Tài Lộc!**
