# Check Flow Script - Hướng Dẫn Sử Dụng

## Tổng quan

Script `check-flow.sh` là công cụ tự động kiểm tra toàn bộ flow của dự án Audio Tài Lộc, bao gồm:
- ✅ Kiểm tra TypeScript và build Backend
- ✅ Kiểm tra build Dashboard
- ✅ Kiểm tra lint và format (tùy chọn)
- ✅ Kiểm tra trạng thái services
- ✅ Kiểm tra integration giữa Backend và Dashboard

## Cài đặt

```bash
chmod +x check-flow.sh
```

## Cách sử dụng

### 1. Chạy kiểm tra đầy đủ (mặc định)

```bash
./check-flow.sh
```

Kiểm tra tất cả: Backend, Dashboard, Integration, Services

### 2. Chạy kiểm tra nhanh (bỏ qua lint, format)

```bash
./check-flow.sh --quick
```

Chỉ kiểm tra TypeScript, build và services

### 3. Chỉ kiểm tra Backend

```bash
./check-flow.sh --backend-only
```

### 4. Chỉ kiểm tra Dashboard

```bash
./check-flow.sh --dashboard-only
```

### 5. Chỉ kiểm tra Integration

```bash
./check-flow.sh --integration
```

### 6. Hiển thị chi tiết lỗi

```bash
./check-flow.sh --verbose
```

### 7. Xuất kết quả dạng JSON

```bash
./check-flow.sh --json
```

Kết quả JSON sẽ được lưu tại: `/tmp/audiotailoc-check/report_TIMESTAMP.json`

### 8. Kết hợp các tùy chọn

```bash
./check-flow.sh --quick --verbose --json
```

## Các tùy chọn

| Tùy chọn | Mô tả |
|----------|-------|
| `--backend-only` | Chỉ kiểm tra Backend |
| `--dashboard-only` | Chỉ kiểm tra Dashboard |
| `--integration` | Chỉ kiểm tra Integration |
| `--quick` | Bỏ qua lint và format check |
| `--verbose` | Hiển thị chi tiết lỗi |
| `--json` | Xuất kết quả dạng JSON |

## Kết quả

### Output trên màn hình

Script sẽ hiển thị:
- ✅ Các check đã pass
- ❌ Các check đã fail
- ⚠️  Các cảnh báo

### Log files

Tất cả log được lưu tại: `/tmp/audiotailoc-check/`

- `backend-typecheck.log` - TypeScript errors
- `backend-build.log` - Build output
- `backend-lint.log` - Lint results
- `backend-format.log` - Format check results
- `dashboard-build.log` - Dashboard build output
- `dashboard-lint.log` - Dashboard lint results
- `report_TIMESTAMP.txt` - Full report
- `report_TIMESTAMP.json` - JSON report (nếu dùng --json)

### Xem log chi tiết

```bash
# Xem TypeScript errors
cat /tmp/audiotailoc-check/backend-typecheck.log

# Xem build log
cat /tmp/audiotailoc-check/backend-build.log

# Xem full report
cat /tmp/audiotailoc-check/report_*.txt
```

## Ví dụ Output

```
╔════════════════════════════════════════════════════════════╗
║  🔍 Audio Tài Lộc - Enhanced Flow Check Script         ║
║  Timestamp: 2025-12-02 16:05:04                      ║
╚════════════════════════════════════════════════════════════╝

📋 Checking prerequisites...
  ✅ Node.js: v24.8.0
  ✅ npm: 11.6.0
  ✅ curl: curl 8.7.1

📦 Checking Backend...
  - TypeScript type checking...
    ✅ TypeScript: No errors (0 errors)
  - Building...
    ✅ Build: Success

🎨 Checking Dashboard...
  - Building...
    ✅ Build: Success

🚀 Checking Services...
  ✅ Backend: Running on http://localhost:3010
  ✅ Dashboard: Running on http://localhost:3001

🔗 Checking Integration...
  ✅ Integration report found

╔════════════════════════════════════════════════════════════╗
║  📊 Summary                                                ║
╚════════════════════════════════════════════════════════════╝

Backend:
  TypeScript: ✅
  Build:      ✅
  Lint:       ✅
  Format:     ✅

Dashboard:
  Build:      ✅
  Lint:       ✅

Integration:
  Status:     ✅

Services:
  Status:     ✅

✅ All checks passed!
```

## Tích hợp vào CI/CD

### GitHub Actions

```yaml
- name: Check Flow
  run: ./check-flow.sh --quick --json
```

### Git Hooks

Thêm vào `.git/hooks/pre-commit`:

```bash
#!/bin/bash
./check-flow.sh --quick
if [ $? -ne 0 ]; then
    echo "Flow check failed. Please fix errors before committing."
    exit 1
fi
```

## Troubleshooting

### Script không chạy được

```bash
# Kiểm tra quyền thực thi
ls -l check-flow.sh

# Cấp quyền nếu cần
chmod +x check-flow.sh
```

### Lỗi "command not found"

Đảm bảo các công cụ sau đã được cài đặt:
- Node.js (>= 20.x)
- npm (>= 10.x)
- curl (cho API checks)

### Build fails

Xem log chi tiết:
```bash
cat /tmp/audiotailoc-check/backend-build.log
cat /tmp/audiotailoc-check/dashboard-build.log
```

### Services không chạy

Script sẽ cảnh báo nếu services không chạy. Để khởi động:

```bash
# Backend
cd backend && npm run dev

# Dashboard
cd dashboard && npm run dev
```

## Tùy chỉnh

### Thay đổi log directory

Sửa biến `LOG_DIR` trong script:

```bash
LOG_DIR="/path/to/your/logs"
```

### Thay đổi ports

Sửa các biến trong hàm `check_services()`:

```bash
# Backend port
lsof -ti:3010

# Dashboard port
lsof -ti:3001
```

## Lưu ý

- Script sẽ tự động cài đặt dependencies nếu `node_modules` không tồn tại
- Script sẽ xóa `.next` directory trước khi build Dashboard để tránh lock issues
- Log files được lưu tại `/tmp/audiotailoc-check/` và có thể bị xóa khi restart

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Log files tại `/tmp/audiotailoc-check/`
2. Chạy với `--verbose` để xem chi tiết
3. Đảm bảo các prerequisites đã được cài đặt

