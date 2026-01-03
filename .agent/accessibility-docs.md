# Hướng dẫn Accessibility & UI Improvements

## Tổng quan các cải thiện đã thực hiện

### 1. 📁 Cấu trúc Config

#### `lib/site-config.ts`
File config tập trung chứa tất cả thông tin doanh nghiệp, SEO defaults, và feature flags.

```typescript
import { SITE_CONFIG, BUSINESS_INFO, CONTACT_CONFIG, NAVIGATION } from '@/lib/site-config';

// Sử dụng
<p>{BUSINESS_INFO.name}</p>
<a href={`tel:${CONTACT_CONFIG.phone.hotlineNumber}`}>
  {CONTACT_CONFIG.phone.display}
</a>
```

### 2. ♿ Accessibility Improvements

#### Focus Visible Styles (globals.css)
```css
/* Các interactive elements có focus-visible ring */
button:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent);
}
```

#### Screen Reader Utilities
```css
/* Ẩn khỏi view nhưng vẫn accessible cho screen readers */
.sr-only { ... }

/* Hiển thị lại khi cần */
.not-sr-only { ... }
```

#### Skip to Content Link
Được thêm vào `layout.tsx` để cho phép keyboard users skip navigation.

```html
<a href="#main-content" class="skip-to-content">
  Bỏ qua đến nội dung chính
</a>
<main id="main-content">...</main>
```

#### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. 🔄 Loading Skeletons

File mới: `components/ui/loading-skeletons.tsx`

```typescript
import { 
  SectionSkeleton, 
  ProductCardSkeleton, 
  ProductGridSkeleton,
  BannerSkeleton,
  ServiceCardSkeleton,
  TableSkeleton 
} from '@/components/ui/loading-skeletons';

// Sử dụng
<SectionSkeleton columns={4} showHeader />
<ProductGridSkeleton count={8} />
<BannerSkeleton />
```

### 4. 🏷️ ARIA Labels đã thêm

#### Header
- `role="banner"` cho header
- `aria-label` cho navigation sections
- `role="search"` cho search form
- Proper labels cho tất cả icons

#### Footer  
- `role="contentinfo"` cho footer
- `aria-label` cho social links
- Proper address element với `<address>`

### 5. 📋 Checklist Accessibility

#### Đã hoàn thành ✅
- [x] Focus visible states cho tất cả interactive elements
- [x] Skip to main content link
- [x] Proper ARIA roles và labels
- [x] Reduced motion support
- [x] High contrast mode support
- [x] Screen reader utilities (sr-only)
- [x] Semantic HTML (nav, main, footer, address)
- [x] Touch target sizes (44x44px minimum)

#### Cần kiểm tra thêm 🔍
- [ ] Color contrast ratios (recommend using axe DevTools)
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (VoiceOver, NVDA)

### 6. 📦 Files đã tạo/chỉnh sửa

| File | Thay đổi |
|------|----------|
| `lib/site-config.ts` | **MỚI** - Centralized config |
| `components/ui/loading-skeletons.tsx` | **MỚI** - Reusable skeletons |
| `components/error-boundary.tsx` | **CẢI TIẾN** - ARIA labels, SectionErrorBoundary |
| `app/globals.css` | Thêm accessibility styles |
| `app/layout.tsx` | Skip link, main wrapper |
| `components/layout/header.tsx` | ARIA labels, semantic nav |
| `components/layout/Footer.tsx` | Config integration, ARIA |
| `components/products/product-card.tsx` | Semantic article, ARIA labels |
| `components/products/product-grid.tsx` | ARIA labels, status |
| `app/cart/page.tsx` | ARIA labels cho buttons |
| `app/checkout/page.tsx` | Stepper a11y, form labels |

### 7. 💡 Best Practices khi phát triển tiếp

#### Sử dụng Config
```typescript
// ❌ Không nên hardcode
<p>Hotline: 0768 426 262</p>

// ✅ Nên dùng config
<p>Hotline: {CONTACT_CONFIG.phone.display}</p>
```

#### Accessibility cho Interactive Elements
```tsx
// ❌ Thiếu accessibility
<button onClick={handleClick}>
  <Icon />
</button>

// ✅ Đầy đủ accessibility  
<button 
  onClick={handleClick}
  aria-label="Mô tả hành động"
>
  <Icon aria-hidden="true" />
</button>
```

#### Loading States
```tsx
// ❌ Loading không accessible
{isLoading && <div>Loading...</div>}

// ✅ Loading accessible
{isLoading && (
  <div role="status" aria-label="Đang tải">
    <Skeleton />
    <span className="sr-only">Đang tải...</span>
  </div>
)}
```

### 8. 🧪 Testing

#### Keyboard Navigation Test
1. Nhấn `Tab` để di chuyển qua các elements
2. Kiểm tra focus ring hiển thị rõ ràng
3. Nhấn `Enter` hoặc `Space` để activate buttons
4. Test skip link bằng cách Tab từ đầu trang

#### Screen Reader Test (macOS)
1. Bật VoiceOver: `Cmd + F5`
2. Navigate qua trang bằng `VO + Right Arrow`
3. Kiểm tra announcements có ý nghĩa

### 9. 🔗 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe DevTools](https://www.deque.com/axe/browser-extensions/)
