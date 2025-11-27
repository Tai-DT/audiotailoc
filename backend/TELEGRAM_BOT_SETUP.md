# Hướng dẫn Cấu hình Telegram Bot & Webhook

Tính năng Telegram Bot đã được tích hợp hoàn tất vào Backend. Để Bot có thể nhận tin nhắn từ người dùng (Chat 2 chiều, Lệnh điều khiển), bạn cần thiết lập **Webhook**.

## 1. Yêu cầu

Telegram Bot API cần một đường dẫn **HTTPS Public** (không thể dùng `localhost`).

Nếu bạn đang chạy local, hãy sử dụng **ngrok** hoặc **Cloudflare Tunnel** để public port backend (mặc định 3010).

Ví dụ dùng ngrok:
```bash
ngrok http 3010
```
Sau đó copy đường dẫn HTTPS (ví dụ: `https://abc-123.ngrok-free.app`).

## 2. Cài đặt Webhook

Chạy script sau để đăng ký Webhook với Telegram:

```bash
# Thay thế URL bằng domain thực tế của bạn
npx ts-node scripts/setup-telegram-webhook.ts https://your-domain.com/api/v1/notifications/telegram/webhook
```

Nếu thành công, bạn sẽ thấy thông báo: `Webhook set successfully!`

## 3. Các lệnh hỗ trợ

Sau khi setup, bạn có thể chat với Bot:

- `/start`: Xem menu chính.
- `/stats`: Xem thống kê doanh thu & đơn hàng.
- `/backup`: Tạo bản sao lưu database ngay lập tức.
- `/chat [id] [nội dung]`: Chat với khách hàng theo ID hội thoại.
- **Reply tin nhắn**: Trả lời trực tiếp tin nhắn thông báo từ khách hàng để chat lại.

## 4. Kiểm tra

- Gửi tin nhắn từ Dashboard/App Khách hàng.
- Bot sẽ thông báo về Telegram Admin.
- Admin Reply tin nhắn đó -> Khách hàng nhận được socket realtime.
