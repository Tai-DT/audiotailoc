Tiêu đề: Thiết kế idempotency & inventory locking

Mục tiêu
- Ngăn duplicate orders khi client retry hoặc webhook replay
- Bảo vệ stock consistency khi nhiều checkout đồng thời trên cùng SKU

Các thay đổi chính
1. Idempotency
  - Sử dụng Redis (CacheService) để lưu mapping idempotencyKey -> orderId (TTL 24h).
  - Thêm cột `idempotencyKey` nullable trong bảng `orders` để có thể tra cứu lâu dài nếu cần.
  - Hậu quả: request có cùng idempotencyKey trả về cùng một order (idempotent). Không thay đổi trạng thái order đã hoàn thành.

2. Inventory locking
  - Khi điều chỉnh tồn kho trong transaction, chèn `SELECT ... FOR UPDATE` vào transaction để lấy lock trên hàng inventory tương ứng nếu DB hỗ trợ.
  - Nếu cần scale cao hơn, sử dụng Redis distributed lock (Redlock) để giảm contention.

3. Webhook verification
  - Kiểm tra signature cả trên header (nếu provider hỗ trợ) và payload.
  - Log security event nếu có replay hoặc signature fail.

4. Migration & chỉ mục
  - Thêm cột `idempotencyKey` và index `idx_orders_idempotency` (nullable) cho orders.

Kịch bản lỗi đã giải quyết
- Duplicate order: Khách retry với cùng idempotencyKey -> server trả về Order cũ
- Race condition stock: `FOR UPDATE` lock tránh oversell trong transaction

Kiểm thử
- Integration test: gửi 2 yêu cầu checkout song song với cùng idempotencyKey phải trả về cùng order
- Load test: 1000 concurrent checkouts trên cùng SKU, stock không được < 0
- Webhook replay: gửi lại webhook đã xử lý -> không tạo payment/order mới

Ghi chú triển khai
- Sử dụng feature flag để bật idempotency trong giao diện hoặc qua cấu hình
- Triển khai migration trên staging trước, sau đó production trong window thấp tải
