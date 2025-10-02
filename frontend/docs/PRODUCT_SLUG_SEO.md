# Tối ưu SEO: Dùng slug thay vì ID cho trang sản phẩm

Mục tiêu: URL sản phẩm có dạng `/products/<slug>` thay cho `/products/<id>` hoặc `/products/<slug>-<id>` nhằm:

1. Thân thiện SEO (từ khóa nằm trong URL, ngắn gọn)
2. Tránh nội dung trùng lặp (duplicate content) giữa nhiều biến thể URL
3. Cải thiện CTR khi chia sẻ liên kết

## Thay đổi đã thực hiện

| Hạng mục | Trạng thái | Ghi chú |
|----------|-----------|---------|
| Link nội bộ (ProductCard) | ĐÃ CẬP NHẬT | Dùng `product.slug` |
| Sitemap (app + route.xml) | ĐÃ CẬP NHẬT | Trả về `/products/slug` |
| Metadata canonical | ĐÃ CẬP NHẬT | Nếu vào bằng ID vẫn canonical về slug |
| Hook fetch sản phẩm | GIỮ NGUYÊN | Hỗ trợ linh hoạt id hoặc slug |
| Redirect từ `/products/<id>` | CHƯA LÀM | Cần xác nhận backend cung cấp slug nhanh |

## Kế hoạch redirect (đề xuất)

Tạo file `middleware.ts` ở root `frontend/` với logic:

Pseudo-code:

```ts
// Detect pattern /products/<cuid>
// Fetch nhẹ (HEAD hoặc GET cache short) thông tin sản phẩm -> lấy slug
// 308 redirect đến /products/<slug>
```

Lưu ý: Chỉ redirect khi chắc chắn lấy được slug (tránh redirect loop hoặc 404 chậm). Nếu fetch lỗi -> cho phép truy cập tạm để không chặn UX.

## Canonical

Hiện canonical trong `app/products/[id]/metadata.ts` luôn ưu tiên `product.slug`. Như vậy:

- Người dùng vào bằng ID: canonical chỉ ra slug -> tránh duplicate.
- Người dùng vào bằng slug: canonical khớp URL -> tối ưu.

## TODO tương lai (nếu cần)

1. Thêm redirect middleware.
2. Thêm prefetch slug vào HTML (link rel=alternate?) nếu giữ song song một thời gian.
3. Theo dõi Search Console xem có URL biến thể ID nào được index -> sau đó bật redirect.

## Rollback nhanh

Nếu xảy ra lỗi (ví dụ slug chưa unique hoặc backend trả thiếu), chỉ cần revert các commit thay đổi:

1. `product-card.tsx` dùng lại `product.id`.
2. `sitemap.*` trả về `id`.
3. `metadata.ts` thay canonical về ID.

## Ghi chú kỹ thuật

- Interface `Product` trong sitemap được mở rộng thêm trường `slug`.
- Không thêm trang động mới (`[slug]`) để tránh thay đổi lớn; ta vẫn xử lý linh hoạt trong fetch & metadata.
- Khi redirect được kích hoạt, nên gỡ dần mọi internal link còn dùng ID (đã xong ở bước này).

---
Ngày cập nhật: 2025-10-01
Người thực hiện: AI Assistant
Trạng thái: HOÀN THÀNH GIAI ĐOẠN 1 (canonical + link nội bộ + sitemap)
