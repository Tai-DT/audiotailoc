# Audio Tài Lộc - Development Environment

## 🚀 Quick Start

### Chạy tất cả services cùng lúc
```bash
npm run dev
# hoặc
./dev-runner.sh start
```

### Các lệnh khác
```bash
# Dừng tất cả services
npm run dev:stop

# Restart tất cả services
npm run dev:restart

# Kiểm tra trạng thái
npm run dev:status

# Xem logs
npm run dev:logs

# Dọn dẹp files tạm thời
npm run dev:clean
```

## 📋 Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend | 3000 | http://localhost:3000 | Next.js website |
| Backend | 4000 | http://localhost:4000 | NestJS API |
| Dashboard | 3001 | http://localhost:3001 | Admin dashboard |

## 🛠️ Manual Commands

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Dashboard
```bash
cd dashboard
npm install
npm run dev
```

## 📁 Project Structure

```
audiotailoc/
├── frontend/          # Next.js website
├── backend/           # NestJS API
├── dashboard/         # Admin dashboard
├── dev-runner.sh      # Development runner script
└── package.json       # Root package.json
```

## 🔧 Requirements

- Node.js >= 20.x
- npm >= 10.x
- Git

## 📝 Development Workflow

1. **Clone repository**
   ```bash
   git clone https://github.com/Tai-DT/audiotailoc.git
   cd audiotailoc
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development environment**
   ```bash
   npm run dev
   ```

4. **Access applications**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000
   - Dashboard: http://localhost:3001

## 🐛 Troubleshooting

### Port conflicts
Nếu port bị conflict, script sẽ thông báo và dừng lại.

### Services không start được
```bash
# Kiểm tra logs
npm run dev:logs

# Restart services
npm run dev:restart

# Dọn dẹp và start lại
npm run dev:clean && npm run dev
```

### Dependencies issues
```bash
# Reinstall tất cả
npm run install:all
```

## 📊 Monitoring

Script tự động:
- ✅ Kiểm tra port availability
- ✅ Chờ services ready
- ✅ Lưu logs vào files
- ✅ Hiển thị status real-time
- ✅ Cleanup khi stop

## 🎯 Features

- **Auto-start**: Chạy tất cả 3 services cùng lúc
- **Health checks**: Kiểm tra services đã ready chưa
- **Colored logs**: Output dễ đọc với màu sắc
- **PID management**: Quản lý process IDs
- **Graceful shutdown**: Dọn dẹp khi stop
- **Cross-platform**: Hoạt động trên macOS, Linux, Windows

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Logs: `npm run dev:logs`
2. Status: `npm run dev:status`
3. Port conflicts: `lsof -i :3000,4000,3001`

---

**Happy coding! 🎵**