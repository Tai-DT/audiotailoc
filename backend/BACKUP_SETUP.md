# ☁️ Hướng Dẫn Cấu Hình Tự Động Backup lên Google Drive

Tài liệu này hướng dẫn cách thiết lập quy trình sao lưu tự động database PostgreSQL và upload lên Google Drive sử dụng `rclone`. Giải pháp này hoạt động cả trên môi trường **Local** và **Heroku**.

## 📁 Thông Tin Chung

- **Thư mục đích trên Google Drive (ID):** `1DXFFkGozTgtj4LRqP_iajWGZrB4qaUnH`
- **Script backup:** `backend/tools/backup-to-drive.sh`
- **Công cụ sử dụng:** `pg_dump`, `gzip`, `rclone`

---

## 🛠️ 1. Cài Đặt & Cấu Hình (Local Development)

Để chạy script trên máy local, bạn cần cài đặt `rclone` và cấu hình kết nối với Google Drive.

### Bước 1: Cài đặt rclone

- **macOS:** `brew install rclone`
- **Linux:** `curl https://rclone.org/install.sh | sudo bash`
- **Windows:** Tải từ [rclone.org](https://rclone.org/downloads/)

### Bước 2: Cấu hình kết nối Google Drive

1. Chạy lệnh:
   ```bash
   rclone config
   ```
2. Chọn `n` (New remote).
3. Đặt tên là `gdrive`.
4. Chọn loại storage là `drive` (Google Drive).
5. `client_id` và `client_secret`: Để trống (hoặc nhập nếu bạn có tạo riêng).
6. `scope`: Chọn `1` (Full access).
7. Các tùy chọn nâng cao: Nhấn Enter để bỏ qua (default).
8. `Use auto config?`: Chọn `y` (nếu có trình duyệt) hoặc `n` (nếu trên server không có giao diện).
9. Làm theo hướng dẫn trên trình duyệt để xác thực tài khoản Google.
10. Xác nhận cấu hình: Chọn `y`.
11. Thoát: Chọn `q`.

### Bước 3: Kiểm tra kết nối

Chạy lệnh sau để liệt kê file trong thư mục đích:

```bash
rclone lsd gdrive: --drive-root-folder-id 1DXFFkGozTgtj4LRqP_iajWGZrB4qaUnH
```

---

## 🚀 2. Cấu Hình Trên Heroku

Vì Heroku có file system tạm thời (ephemeral), chúng ta cần cài đặt `rclone` mỗi khi deploy và cấu hình thông qua biến môi trường.

### Bước 1: Thêm Buildpack

Thêm `heroku-buildpack-apt` để cài đặt các gói hệ thống (như rclone).

```bash
heroku buildpacks:add --index 1 heroku-community/apt
```

Tạo file `Aptfile` ở thư mục gốc (nếu chưa có) và thêm `rclone`:

```bash
echo "rclone" >> Aptfile
```

### Bước 2: Cấu Hình Rclone qua Biến Môi Trường (Config Vars)

Thay vì copy file `rclone.conf` lên Heroku (không an toàn), chúng ta sẽ dùng biến môi trường để cấu hình rclone.

Bạn cần lấy nội dung file config local (`~/.config/rclone/rclone.conf`) và chuyển thành các biến môi trường trên Heroku theo định dạng `RCLONE_CONFIG_<REMOTE_NAME>_<PARAM_NAME>`.

Ví dụ, nếu file config của bạn như sau:

```ini
[gdrive]
type = drive
scope = drive
token = {"access_token":"...","token_type":"Bearer",...}
```

Bạn cần set các biến môi trường trên Heroku:

```bash
heroku config:set RCLONE_CONFIG_GDRIVE_TYPE=drive
heroku config:set RCLONE_CONFIG_GDRIVE_SCOPE=drive
heroku config:set RCLONE_CONFIG_GDRIVE_TOKEN='{"access_token":"...","token_type":"Bearer",...}'
```

**Lưu ý:** Giá trị `token` là chuỗi JSON, hãy đảm bảo copy chính xác và bao quanh bởi dấu nháy đơn `'`.

### Bước 3: Lên Lịch Backup (Heroku Scheduler)

1. Thêm add-on Heroku Scheduler:
   ```bash
   heroku addons:create scheduler:standard
   ```
2. Mở dashboard Scheduler:
   ```bash
   heroku addons:open scheduler
   ```
3. Thêm job mới:
   - **Command:** `backend/tools/backup-to-drive.sh`
   - **Frequency:** Daily (hoặc tùy chọn).

---

## 🧪 3. Kiểm Tra & Khôi Phục (Restore)

### Kiểm tra Backup

Chạy script thủ công để kiểm tra:

```bash
./backend/tools/backup-to-drive.sh
```

Nếu thành công, bạn sẽ thấy thông báo `✅ Upload successful!` và file mới xuất hiện trên Google Drive.

### Khôi Phục Dữ Liệu (Restore)

Bạn có thể sử dụng script tự động để khôi phục dữ liệu từ Google Drive một cách dễ dàng.

**Cách sử dụng:**

1. Chạy lệnh restore:
   ```bash
   cd backend
   npm run restore:drive
   ```

2. Script sẽ liệt kê danh sách các bản backup có trên Google Drive.
3. Nhập số thứ tự của bản backup bạn muốn khôi phục.
4. Xác nhận `y` để tiến hành download và khôi phục vào database.

---

#### Khôi phục thủ công (Manual Restore)

Nếu bạn muốn thực hiện thủ công:

1. **Download file backup:**
   ```bash
   rclone copy gdriver:backup_YYYY-MM-DDTHH-MM-SS.sql.gz ./ --drive-root-folder-id 1DXFFkGozTgtj4LRqP_iajWGZrB4qaUnH
   ```

2. **Giải nén:**
   ```bash
   gunzip backup_YYYY-MM-DDTHH-MM-SS.sql.gz
   ```

3. **Khôi phục vào Database:**
   ```bash
   psql "$DATABASE_URL" < backup_YYYY-MM-DDTHH-MM-SS.sql
   ```

⚠️ **Cảnh báo:** Việc khôi phục sẽ ghi đè dữ liệu hiện tại. Hãy cẩn thận!