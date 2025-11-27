# 📱 Telegram Notification Integration

Hệ thống thông báo tự động qua Telegram Bot cho Audio Tài Lộc.

## ✨ Features

- ✅ Thông báo đơn hàng mới
- ✅ Cập nhật trạng thái đơn hàng  
- ✅ Thông báo thanh toán
- ✅ Cảnh báo tồn kho thấp
- ✅ System alerts

## 🚀 Setup Instructions

### Bước 1: Tạo Telegram Bot

1. Mở Telegram và tìm **@BotFather**
2. Gửi lệnh `/newbot`
3. Làm theo hướng dẫn để đặt tên bot
4. Copy **Bot Token** (dạng: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### Bước 2: Lấy Chat ID

**Cách 1: Qua Bot**
1. Start chat với bot bạn vừa tạo
2. Gửi bất kỳ tin nhắn nào
3. Truy cập URL: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Tìm `"chat":{"id":123456}` trong response

**Cách 2: Dùng @userinfobot**
1. Tìm **@userinfobot** trên Telegram
2. Start chat
3. Bot sẽ trả về User ID của bạn

**Chat ID của Group:**
- Tạo group và thêm bot vào
- Gửi tin nhắn trong group
- Dùng `/getUpdates` để lấy ID (Group ID thường là số âm, ví dụ: `-987654321`)

### Bước 3: Cấu hình .env

```bash
# Copy .env.example nếu chưa có .env
cp .env.example .env

# Thêm cấu hình Telegram
TELEGRAM_BOT_TOKEN="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
TELEGRAM_CHAT_IDS="123456789,-987654321"  # Có thể nhiều IDs cách nhau bởi dấu phẩy
DASHBOARD_URL="http://localhost:3001"
```

### Bước 4: Test Integration

```bash
# Test Telegram connection
node test-telegram.js
```

Nếu thành công, bạn sẽ nhận được tin nhắn test trên Telegram! 🎉

## 📝 Notification Types

### 1. Đơn hàng mới
Khi có đơn hàng mới được tạo:
```
🆕 ĐƠN HÀNG MỚI #ORD12345

👤 Khách hàng: Nguyễn Văn A
📧 Email: customer@example.com
📱 SĐT: 0123456789

💰 Tổng tiền: 1,500,000 VNĐ
📦 Sản phẩm: 3 sản phẩm

📍 Địa chỉ: 123 Nguyễn Huệ, Q1, HCM
⏰ Thời gian: 23/11/2025 10:30

🔗 Xem chi tiết: http://localhost:3001/dashboard/orders
```

### 2. Cập nhật trạng thái
Khi trạng thái đơn hàng thay đổi:
```
📦 CẬP NHẬT ĐƠN HÀNG #ORD12345

Trạng thái: Chờ xử lý → Đang xử lý

👤 Khách hàng: Nguyễn Văn A
💰 Tổng tiền: 1,500,000 VNĐ

🔗 Xem chi tiết: http://localhost:3001/dashboard/orders
```

### 3. Cảnh báo tồn kho
```
⚠️ CẢNH BÁO TỒN KHO

📦 Sản phẩm: Loa JBL Go 3
🏷️ SKU: JBL-GO3-BLK
📊 Tồn kho: 5 (Thấp!)

🔗 Xem chi tiết: http://localhost:3001/dashboard/inventory
```

## 🔧 Customization

### Thêm loại notification mới

```typescript
// Trong TelegramService
async sendCustomNotification(data: any) {
  const message = `
🔔 CUSTOM NOTIFICATION

${data.message}

⏰ ${new Date().toLocaleString('vi-VN')}
  `.trim();

  await this.sendMessage(message);
}
```

### Gửi đến chat cụ thể

```typescript
// Gửi đến một chat ID cụ thể
await telegramService.sendMessage(message, 'specific_chat_id');
```

## 🐛 Troubleshooting

### Lỗi "401 Unauthorized"
- Kiểm tra lại `TELEGRAM_BOT_TOKEN`
- Đảm bảo token được copy đúng từ @BotFather

### Lỗi "400 Bad Request: chat not found"
- Chat ID không đúng
- Bot chưa được start (gửi `/start` cho bot trước)
- Nếu là group, đảm bảo bot đã được add vào group

### Không nhận được notification
- Kiểm tra bot có bị block không
- Kiểm tra chat ID đúng chưa
- Xem logs trong console: `Failed to send Telegram message`

### Notification bị delay
- Kiểm tra network connection
- Telegram API có thể rate limit (max 30 messages/second)

## 📚 API Reference

### TelegramService Methods

```typescript
// Send text message
await telegramService.sendMessage(message: string, chatId?: string);

// Send order notification
await telegramService.sendOrderNotification(order: OrderData);

// Send status update
await telegramService.sendOrderStatusUpdate(order, oldStatus, newStatus);

// Send payment notification
await telegramService.sendPaymentNotification(payment);

// Send low stock alert
await telegramService.sendLowStockAlert(product);

// Send system alert
await telegramService.sendSystemAlert(title, message);

// Test connection
await telegramService.testConnection();
```

## 🔒 Security Notes

- **KHÔNG** commit `.env` file vào git
- Bot token phải được giữ bí mật
- Nên sử dụng environment variables trong production
- Có thể whitelist chat IDs để chỉ admin nhận được notifications

## 📊 Monitoring

Xem logs để track notifications:
```bash
# Development
npm run start:dev

# Production
pm2 logs backend
```

## 🎯 Next Steps

- [ ] Add notification templates
- [ ] Implement notification preferences (admin có thể tắt/bật từng loại)
- [ ] Add inline keyboards để quick actions
- [ ] Support sending images/photos
- [ ] Implement webhook mode (thay vì polling)
- [ ] Add notification queue với Bull/Redis

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Logs trong console
2. File `test-telegram.js` để test connection
3. Telegram Bot API docs: https://core.telegram.org/bots/api

---

**Happy coding! 🚀**
