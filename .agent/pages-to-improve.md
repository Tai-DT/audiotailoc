# 📋 Pages cần cải thiện Accessibility

**Ngày tạo:** 2026-01-03
**Tổng số pages:** 52
**Đã cải thiện:** ~15 pages
**Cần cải thiện:** ~37 pages

---

## ✅ Đã hoàn thành (có accessibility proper)

| Page | Accessibility Features |
|------|----------------------|
| `/` (Homepage) | SectionErrorBoundary, aria-label cho sections |
| `/cart` | aria-labelledby, role="status", button labels |
| `/checkout` | Stepper aria-current, form aria-required |
| `/profile` | Loading state, switch labels, aria-describedby |
| `/wishlist` | Loading/error states, semantic header |
| `/orders` | role="article", aria-labelledby |
| `/search` | role="search", aria-live, input labels |
| `/contact` | Form aria-required, autocomplete, title ID |

---

## 🔴 Ưu tiên cao - Pages có form

| Page | Vấn đề cần sửa |
|------|---------------|
| `/auth/login` | Thêm aria-required, autocomplete |
| `/auth/forgot-password` | Thêm aria-required, form label |
| `/auth/reset-password` | Thêm aria-required, form label |
| `/register` | Thêm aria-required, autocomplete, validation |
| `/checkout` | ✅ Đã sửa |
| `/service-booking` | Thêm form accessibility |

### Cách sửa form:
```tsx
<Label htmlFor="email">
  Email <span className="text-destructive" aria-hidden="true">*</span>
</Label>
<Input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  aria-required="true"
  aria-describedby="email-error"
/>
```

---

## 🟡 Ưu tiên trung bình - Pages danh sách

| Page | Vấn đề cần sửa |
|------|---------------|
| `/products` | Thêm aria-labelledby, loading state |
| `/products/[slug]` | Thêm region roles, gallery accessibility |
| `/services` | Thêm aria-labelledby cho grid |
| `/services/[slug]` | Thêm region roles |
| `/blog` | Thêm aria-labelledby, article roles |
| `/blog/[slug]` | Thêm article semantics |
| `/du-an` (projects) | Thêm aria-labelledby |
| `/du-an/[slug]` | Thêm region roles |
| `/danh-muc` | Thêm aria-labelledby |
| `/danh-muc/[slug]` | Thêm category accessibility |

### Cách sửa danh sách:
```tsx
<main aria-labelledby="page-title">
  <h1 id="page-title">Sản phẩm</h1>
  
  <section aria-label="Danh sách sản phẩm" role="region">
    <div role="status" aria-live="polite">
      Hiển thị {count} sản phẩm
    </div>
    {/* Grid */}
  </section>
</main>
```

---

## 🟢 Ưu tiên thấp - Pages tĩnh

| Page | Vấn đề |
|------|--------|
| `/privacy` | Thêm heading structure |
| `/terms` | Thêm heading structure |
| `/return-policy` | Thêm heading structure |
| `/shipping-policy` | Thêm heading structure |
| `/warranty` | Thêm heading structure |
| `/policies/*` | Thêm heading structure |

### Cách sửa pages tĩnh:
```tsx
<main aria-labelledby="policy-title">
  <h1 id="policy-title">Chính sách bảo mật</h1>
  <article>
    {/* Content */}
  </article>
</main>
```

---

## ⚪ Demo/Dev pages (không cần sửa)

- `/payment-demo`
- `/chat`
- `/prose-demo`
- `/admin`
- `/customer-admin`

---

## 📦 Bundle Optimization Recommendations

### 1. Framer Motion (220KB chunk)

Hiện tại `framer-motion` được import trực tiếp ở nhiều components. Khuyến nghị:

```tsx
// Thay vì:
import { motion } from 'framer-motion';

// Sử dụng:
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);
```

### 2. Magic UI Components

Các components như `MagicCard`, `BorderBeam`, `ShimmerButton` nặng và nên lazy load:

```tsx
const MagicCard = dynamic(() => import('@/components/ui/magic-card'), { ssr: false });
```

### 3. optimizePackageImports

Đã có trong `next.config.js` - kiểm tra các package được optimize:
- `lucide-react` ✅
- `@radix-ui/*` ✅
- `framer-motion` - nên thêm

---

## 🔧 Quick Wins (5 phút mỗi file)

1. **Thêm page title IDs:**
   ```tsx
   <h1 id="page-title">Title</h1>
   <main aria-labelledby="page-title">
   ```

2. **Thêm loading states:**
   ```tsx
   if (isLoading) {
     return <div role="status" aria-label="Đang tải...">...</div>;
   }
   ```

3. **Thêm error states:**
   ```tsx
   if (error) {
     return <div role="alert">Lỗi</div>;
   }
   ```

---

## 📊 Estimated Effort

| Category | Pages | Time per page | Total |
|----------|-------|---------------|-------|
| High Priority (forms) | 5 | 15 min | 1.25 hours |
| Medium Priority (lists) | 10 | 10 min | 1.67 hours |
| Low Priority (static) | 8 | 5 min | 0.67 hours |
| **Total** | **23** | - | **~3.5 hours** |

---

## 🚀 Action Items

1. [ ] Chạy accessibility test với `npx playwright test tests/accessibility.spec.ts`
2. [ ] Fix high priority forms (auth pages)
3. [ ] Add page title IDs to all pages
4. [ ] Add loading/error states with proper roles
5. [ ] Configure framer-motion lazy loading
6. [ ] Run Lighthouse CI for final audit
