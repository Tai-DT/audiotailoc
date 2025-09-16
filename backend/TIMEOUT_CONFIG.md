# Timeout Configuration Guide

## Tổng quan

Dự án đã được cấu hình timeout toàn diện cho các tác vụ khác nhau để đảm bảo hiệu suất và tránh các vấn đề về thời gian chờ.

## Cấu hình Timeout

### 1. VS Code Terminal Settings

- **Shell Integration Timeout**: 10 giây
- **Environment Reporting**: Tắt để tăng tốc
- **Persistent Sessions**: Bật để duy trì terminal sessions
- **Auto Replies**: Tự động xử lý các prompt thông thường

### 2. Jest Test Timeouts

```javascript
// Global timeout configurations
const TEST_TIMEOUTS = {
  UNIT: 5000,        // 5 giây cho unit tests
  INTEGRATION: 15000, // 15 giây cho integration tests
  E2E: 30000,        // 30 giây cho e2e tests
  PERFORMANCE: 60000, // 60 giây cho performance tests
  SECURITY: 45000,   // 45 giây cho security tests
  AUTH: 20000,       // 20 giây cho auth tests
  DEFAULT: 10000,    // 10 giây mặc định
};
```

### 3. NPM Scripts với Timeout

Tất cả các script quan trọng đã được wrap với timeout script:

| Script | Timeout | Mục đích |
|--------|---------|----------|
| `start:dev` | 60s | Khởi động development server |
| `build` | 120s | Build production |
| `test` | 300s | Chạy tất cả tests |
| `test:unit` | 120s | Unit tests |
| `test:integration` | 180s | Integration tests |
| `test:e2e` | 300s | End-to-end tests |
| `prisma:generate` | 30s | Generate Prisma client |
| `prisma:migrate:dev` | 60s | Database migration |
| `lint` | 60s | Code linting |
| `typecheck` | 90s | TypeScript type checking |

### 4. VS Code Tasks

Đã cấu hình tasks.json với các timeout phù hợp cho từng tác vụ build và test.

## Cách sử dụng

### Chạy với Timeout

```bash
# Sử dụng npm scripts (đã có timeout)
npm run start:dev
npm run build
npm run test

# Hoặc sử dụng trực tiếp timeout script
./scripts/run-with-timeout.sh start:dev
./scripts/run-with-timeout.sh build
```

### Kiểm tra Timeout

```bash
# Xem danh sách timeout cho từng script
./scripts/run-with-timeout.sh
```

### Tùy chỉnh Timeout

Để thay đổi timeout cho một script cụ thể, chỉnh sửa file `scripts/run-with-timeout.sh`:

```bash
# Trong file scripts/run-with-timeout.sh
declare -A TIMEOUTS=(
  ["start:dev"]="120"  # Thay đổi từ 60s thành 120s
  # ... các script khác
)
```

## Lợi ích

1. **Tránh bị treo**: Các tác vụ không bao giờ chạy vô thời hạn
2. **Tự động kill**: Process sẽ được kill nếu vượt quá thời gian cho phép
3. **Thông báo rõ ràng**: Log chi tiết về timeout và lý do kill
4. **Tối ưu hiệu suất**: Timeout phù hợp với từng loại tác vụ
5. **Dễ bảo trì**: Tập trung quản lý timeout trong một file

## Troubleshooting

### Process bị kill do timeout

- Kiểm tra log để xem script nào bị timeout
- Tăng timeout nếu cần thiết trong file `run-with-timeout.sh`
- Kiểm tra xem có vấn đề về hiệu suất không

### Server không khởi động được

- Đảm bảo port 3010 không bị chiếm
- Kiểm tra database connection
- Xem log chi tiết trong terminal

### Tests chạy quá lâu

- Kiểm tra test setup và teardown
- Tối ưu database queries
- Chia nhỏ test suites nếu cần

## Best Practices

1. **Monitor thường xuyên**: Theo dõi thời gian chạy của các tác vụ
2. **Điều chỉnh phù hợp**: Tăng timeout cho tác vụ phức tạp, giảm cho tác vụ đơn giản
3. **Log chi tiết**: Sử dụng logging để debug vấn đề timeout
4. **CI/CD Integration**: Đảm bảo timeout phù hợp với pipeline CI/CD
5. **Resource Management**: Theo dõi CPU/Memory usage để tối ưu timeout

## Liên hệ

Nếu gặp vấn đề với timeout configuration, hãy kiểm tra:

- File `scripts/run-with-timeout.sh` cho timeout values
- File `jest.setup.js` cho test timeouts
- File `.vscode/settings.json` cho VS Code settings
- File `.vscode/tasks.json` cho VS Code tasks