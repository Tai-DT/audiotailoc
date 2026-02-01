---
name: Audit Frontend-Backend Integration
description: Comprehensive skill for auditing and verifying all frontend-backend API connections and identifying missing integrations.
---

# Audit Frontend-Backend Integration Skill

This skill provides a systematic approach to audit all frontend components, verify their backend API connections, and identify any missing integrations needed to complete the application.

## 1. Quick Health Check Commands

Run these commands first to ensure both services are functional:

```bash
# Frontend health
cd frontend && npm run lint && npm run typecheck

# Backend health  
cd backend && npm run lint:fix && npm run typecheck

# Check if backend is running
curl -s http://localhost:3010/health | head -20
```

## 2. API Endpoints Inventory

### 2.1 Backend Available Endpoints

Locate all controllers to map available endpoints:

```bash
# List all backend controllers
find backend/src/modules -name "*.controller.ts" -type f

# For each controller, check its routes
grep -n "@Controller\|@Get\|@Post\|@Put\|@Patch\|@Delete" backend/src/modules/**/*.controller.ts
```

### 2.2 Frontend API Client Definitions

Check what endpoints the frontend expects:

```bash
# Main API client with endpoints
cat frontend/lib/api.ts | grep -A 2 "ENDPOINTS"

# Custom hooks for data fetching
find frontend/lib/hooks -name "*.ts" -type f

# SSR data fetching functions
cat frontend/lib/api/home.ts
```

## 3. Integration Audit Checklist

### 3.1 Core E-Commerce Features

| Feature | Frontend Location | Backend Endpoint | Status |
|---------|------------------|------------------|--------|
| **Products** | | | |
| Product listing | `app/products/page.tsx` | `GET /catalog/products` | ⬜ |
| Product detail | `app/products/[slug]/page.tsx` | `GET /catalog/products/slug/:slug` | ⬜ |
| Product search | `components/search/` | `GET /catalog/products/search` | ⬜ |
| New arrivals | `components/home/` | `GET /catalog/products/recent` | ⬜ |
| Best sellers | `components/home/` | `GET /catalog/products/top-viewed` | ⬜ |
| **Categories** | | | |
| Category listing | `app/categories/page.tsx` | `GET /catalog/categories` | ⬜ |
| Category products | `app/categories/[slug]/page.tsx` | `GET /catalog/categories/slug/:slug` | ⬜ |
| **Cart** | | | |
| View cart | `components/cart/` | `GET /cart` | ⬜ |
| Add to cart | `components/products/` | `POST /cart/items` | ⬜ |
| Update quantity | `components/cart/` | `PATCH /cart/items/:id` | ⬜ |
| Remove item | `components/cart/` | `DELETE /cart/items/:id` | ⬜ |
| **Orders** | | | |
| Create order | `app/checkout/page.tsx` | `POST /orders` | ⬜ |
| Order history | `app/account/orders/` | `GET /orders` | ⬜ |
| Order detail | `app/account/orders/[id]/` | `GET /orders/:id` | ⬜ |
| **Authentication** | | | |
| Login | `app/auth/login/` | `POST /auth/login` | ⬜ |
| Register | `app/auth/register/` | `POST /auth/register` | ⬜ |
| Profile | `app/account/profile/` | `GET /auth/profile` | ⬜ |
| Logout | Header component | Token clearing | ⬜ |

### 3.2 Content & CMS Features

| Feature | Frontend Location | Backend Endpoint | Status |
|---------|------------------|------------------|--------|
| Banners | `components/home/hero-carousel.tsx` | `GET /content/banners` | ⬜ |
| Policies (Warranty) | `app/warranty/page.tsx` | `GET /policies/warranty` | ⬜ |
| Policies (Shipping) | `app/shipping/page.tsx` | `GET /policies/shipping` | ⬜ |
| FAQs | `app/faq/page.tsx` | `GET /support/faq` | ⬜ |
| Projects/Portfolio | `app/projects/page.tsx` | `GET /projects` | ⬜ |

### 3.3 Services & Bookings

| Feature | Frontend Location | Backend Endpoint | Status |
|---------|------------------|------------------|--------|
| Service listing | `app/services/page.tsx` | `GET /services` | ⬜ |
| Service detail | `app/services/[slug]/page.tsx` | `GET /services/slug/:slug` | ⬜ |
| Create booking | Booking form | `POST /bookings` | ⬜ |
| My bookings | `app/account/bookings/` | `GET /users/bookings` | ⬜ |

### 3.4 Support Features

| Feature | Frontend Location | Backend Endpoint | Status |
|---------|------------------|------------------|--------|
| Contact form | `app/contact/page.tsx` | `POST /support/tickets` | ⬜ |
| Support tickets | `app/account/support/` | `GET /support/tickets` | ⬜ |

### 3.5 Wishlist & User Features

| Feature | Frontend Location | Backend Endpoint | Status |
|---------|------------------|------------------|--------|
| Add to wishlist | Product card | `POST /wishlist` | ⬜ |
| View wishlist | `app/wishlist/page.tsx` | `GET /wishlist` | ⬜ |
| Remove from wishlist | Wishlist page | `DELETE /wishlist/:productId` | ⬜ |

## 4. Audit Procedure

### Step 1: Scan Frontend Pages

```bash
# List all pages in the app directory
find frontend/app -name "page.tsx" -type f | sort
```

### Step 2: Check Data Fetching in Each Page

For each page, verify:
1. Does it use `useQuery` or `useEffect` for data fetching?
2. Does it call the correct API endpoint?
3. Does it handle loading/error states?
4. Does it map backend response fields correctly?

```bash
# Example: Check a specific page
grep -n "useQuery\|useEffect\|apiClient\|fetch" frontend/app/products/page.tsx
```

### Step 3: Check React Query Hooks

```bash
# List all custom hooks
ls -la frontend/lib/hooks/

# Check each hook's implementation
cat frontend/lib/hooks/use-products.ts
cat frontend/lib/hooks/use-categories.ts
cat frontend/lib/hooks/use-policies.ts
# ... etc
```

### Step 4: Verify API Response Mapping

Common issues to check:
- Backend returns `contentHtml` but frontend expects `content`
- Backend returns `priceCents` (BigInt) but frontend expects `price` (number)
- Backend wraps response in `{ success: true, data: {...} }` but frontend reads directly
- Date fields need parsing (`new Date(response.createdAt)`)

### Step 5: Test Each Integration

```bash
# Start backend
cd backend && npm run start:dev

# In another terminal, start frontend
cd frontend && npm run dev

# Test API endpoints directly
curl http://localhost:3010/api/v1/catalog/products | jq '.data | length'
curl http://localhost:3010/api/v1/policies/shipping | jq '.data.title'
```

## 5. Common Integration Issues & Fixes

### Issue 1: Response Wrapper Mismatch

**Problem:** Backend returns `{ success: true, data: {...} }` but hook reads `response.data` directly.

**Fix:**
```typescript
// In hook
const response = await apiClient.get('/endpoint');
const rawData = response.data?.data || response.data; // Handle wrapper
```

### Issue 2: Field Name Mismatch

**Problem:** Backend uses `contentHtml`, frontend expects `content`.

**Fix:**
```typescript
return {
    ...rawData,
    content: rawData.contentHtml || rawData.content || '',
};
```

### Issue 3: BigInt Serialization

**Problem:** `priceCents` is BigInt, causes JSON serialization error.

**Fix:** Backend should have `BigIntSerializeInterceptor` to convert BigInt to Number.

### Issue 4: Missing CORS Headers

**Problem:** Frontend gets CORS error when calling API.

**Fix:** Check backend CORS config in `main.ts`, ensure frontend origin is allowed.

### Issue 5: Authentication Token Not Sent

**Problem:** Protected endpoints return 401.

**Fix:** Check `apiClient` interceptor adds `Authorization: Bearer <token>` header.

## 6. Integration Verification Script

Create a verification script to automate checks:

```typescript
// scripts/verify-integration.ts
const endpoints = [
    { path: '/catalog/products', name: 'Products' },
    { path: '/catalog/categories', name: 'Categories' },
    { path: '/content/banners', name: 'Banners' },
    { path: '/policies/warranty', name: 'Warranty Policy' },
    { path: '/policies/shipping', name: 'Shipping Policy' },
    { path: '/services', name: 'Services' },
    { path: '/projects', name: 'Projects' },
    { path: '/support/faq', name: 'FAQs' },
];

async function verify() {
    const baseUrl = process.env.API_URL || 'http://localhost:3010/api/v1';
    
    for (const endpoint of endpoints) {
        try {
            const res = await fetch(`${baseUrl}${endpoint.path}`);
            const data = await res.json();
            const hasData = data.success && (Array.isArray(data.data) ? data.data.length > 0 : !!data.data);
            console.log(`${hasData ? '✅' : '⚠️'} ${endpoint.name}: ${res.status}`);
        } catch (err) {
            console.log(`❌ ${endpoint.name}: ${err.message}`);
        }
    }
}

verify();
```

## 7. Missing Features Identification

After completing the audit, create a prioritized list:

### Priority 1 - Critical (Must Have)
- [ ] Product browsing and detail pages
- [ ] Category filtering
- [ ] Cart functionality
- [ ] Checkout flow
- [ ] User authentication

### Priority 2 - Important (Should Have)
- [ ] Order history
- [ ] Wishlist
- [ ] Service bookings
- [ ] Contact/Support forms

### Priority 3 - Nice to Have
- [ ] Reviews and ratings
- [ ] Advanced search filters
- [ ] Real-time notifications
- [ ] Chat support

## 8. Post-Audit Actions

After identifying gaps:

1. **Create tasks** for each missing integration
2. **Prioritize** based on user journey importance
3. **Implement** using patterns from existing integrations
4. **Test** each integration manually and with automated tests
5. **Document** any new API contracts or data mappings

## 9. Environment Variables Checklist

Ensure these are set in `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Add any other required env vars
```

## 10. Final Verification

Run the full build to ensure everything compiles:

```bash
cd frontend && npm run build
cd backend && npm run build
```

If both builds pass without errors, the integration is complete! 🎉
