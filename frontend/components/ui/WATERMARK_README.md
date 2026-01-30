# WatermarkedImage Component

Component React tự động thêm watermark logo Audio Tài Lộc vào ảnh sản phẩm trên frontend.

## Tính năng

- ✅ Tự động thêm logo watermark vào ảnh
- ✅ Hỗ trợ dark/light theme (tự động chọn logo phù hợp)
- ✅ Tùy chỉnh kích thước logo (sm, md, lg)
- ✅ Tùy chỉnh vị trí logo (4 góc)
- ✅ Tương thích hoàn toàn với Next.js Image
- ✅ Hiệu ứng hover mượt mà

## Cách sử dụng

### Import component

```typescript
import { WatermarkedImage } from '@/components/ui/watermarked-image';
```

### Sử dụng cơ bản

```tsx
<WatermarkedImage
  src="/path/to/product-image.png"
  alt="Tên sản phẩm"
  width={400}
  height={400}
/>
```

### Với fill mode (responsive)

```tsx
<div className="relative aspect-square">
  <WatermarkedImage
    src="/path/to/product-image.png"
    alt="Tên sản phẩm"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

### Tùy chỉnh logo

```tsx
<WatermarkedImage
  src="/path/to/product-image.png"
  alt="Tên sản phẩm"
  fill
  logoSize="lg"                    // sm | md | lg
  logoPosition="bottom-left"       // bottom-right | bottom-left | top-right | top-left
/>
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `src` | string | required | Đường dẫn ảnh sản phẩm |
| `alt` | string | required | Alt text cho ảnh |
| `width` | number | - | Chiều rộng ảnh (không dùng với fill) |
| `height` | number | - | Chiều cao ảnh (không dùng với fill) |
| `fill` | boolean | false | Chế độ fill container |
| `className` | string | - | Custom CSS classes |
| `priority` | boolean | false | Ưu tiên tải ảnh |
| `sizes` | string | - | Responsive sizes |
| `quality` | number | 90 | Chất lượng ảnh (1-100) |
| `logoSize` | 'sm' \| 'md' \| 'lg' | 'md' | Kích thước logo |
| `logoPosition` | string | 'bottom-right' | Vị trí logo |

## Kích thước logo

- **sm**: 48x24px - Phù hợp cho thumbnail nhỏ
- **md**: 64x32px - Phù hợp cho card sản phẩm
- **lg**: 80x40px - Phù hợp cho ảnh lớn

## Vị trí logo

- `bottom-right`: Góc dưới bên phải (mặc định)
- `bottom-left`: Góc dưới bên trái
- `top-right`: Góc trên bên phải
- `top-left`: Góc trên bên trái

## Đã áp dụng ở

- ✅ `ProductCard` component (danh sách sản phẩm)
- ✅ `ProductGallery` component (trang chi tiết sản phẩm)

## Lưu ý

- Logo sẽ tự động chuyển đổi giữa dark/light dựa trên theme hiện tại
- Watermark có opacity 70% và tăng lên 90% khi hover
- Logo có drop-shadow để nổi bật trên mọi nền
