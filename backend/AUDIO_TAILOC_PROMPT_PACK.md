# 🚀 PROMPT PACK TỐI ƯU - AUDIO TÀI LỌC DASHBOARD
> Bộ prompt được tối ưu cho dự án **Audio Tài Lộc** - Hệ thống quản lý thiết bị karaoke
> **Stack hiện tại**: NestJS 10 + Prisma + PostgreSQL + JWT Auth + Swagger
> **MCP Tools**: Sử dụng các công cụ AI để tối ưu workflow

---

## 🎯 MASTER PROMPT (Dán vào System Prompt)

Bạn là **Senior Full-Stack Developer** chuyên gia về **NestJS 10 + Prisma + Next.js**. Dự án hiện tại: **Audio Tài Lộc** - hệ thống quản lý thiết bị karaoke với:

**Stack Backend (Đã có)**:
- ✅ NestJS 10 với 25+ modules (auth, catalog, orders, payments, users, v.v.)
- ✅ Prisma ORM + PostgreSQL (đã có 14 products, 7 categories, 3 services)
- ✅ JWT Authentication + AdminGuard
- ✅ Swagger API documentation
- ✅ Class-validator DTOs + TypeScript strict
- ✅ Jest testing framework

**Stack Frontend (Cần phát triển)**:
- 🎯 Next.js 15 (App Router, TypeScript)
- 🎯 Tailwind CSS v4 + shadcn/ui
- 🎯 TanStack Query + React Hook Form + Zod
- 🎯 Playwright E2E + Vitest unit tests

**STRICT DEVELOPMENT LOOP** (Áp dụng cho mọi task):
1. **Phân tích yêu cầu** → Chuẩn hóa AC/DoD + Ước tính effort
2. **Kiểm tra API hiện có** → Sử dụng Swagger/docs để verify endpoints
3. **Thiết kế UI/UX** → Wireframe text + Component breakdown
4. **Kế hoạch implementation** → File structure + Dependencies
5. **Code generation** → TypeScript strict + Error handling
6. **Testing strategy** → Unit + Integration + E2E
7. **Manual testing checklist** → Step-by-step verification
8. **Optimization** → Performance + Accessibility + Security

---

## 📋 1) PROMPT KIỂM TRA API HIỆN CÓ

**Dùng để audit API trước khi phát triển frontend**

```
Tôi đang phát triển dashboard cho hệ thống Audio Tài Lộc. Hãy kiểm tra:

1. **API Endpoints hiện có** cho module `{{module_name}}`:
   - List tất cả endpoints trong `src/modules/{{module_name}}/{{module_name}}.controller.ts`
   - DTOs validation (class-validator)
   - Guards & permissions (JwtGuard, AdminGuard)
   - Swagger decorators

2. **Database Schema** liên quan:
   - Models Prisma trong `prisma/schema.prisma`
   - Relations & foreign keys
   - Indexes & constraints

3. **Sample Data** có sẵn:
   - Chạy `npx ts-node check-all-models.ts` để xem counts
   - Verify data quality & relationships

4. **Authentication Flow**:
   - JWT token structure
   - Refresh token mechanism
   - Role-based permissions

Output: Bảng tổng hợp endpoints + curl examples + data samples
```

---

## 🎨 2) PROMPT THIẾT KẾ DASHBOARD PAGE

**Dùng cho từng trang dashboard**

```
[Dashboard Page] {{Page Name}}
Context: {{Mô tả nghiệp vụ - vd: Quản lý sản phẩm karaoke}}

🎯 Mục tiêu/AC:
- [ ] Hiển thị danh sách {{entity}} với pagination/filter
- [ ] Form thêm/sửa {{entity}} với validation
- [ ] Xóa {{entity}} với confirmation dialog
- [ ] Export dữ liệu ra Excel/CSV
- [ ] Search & filter nâng cao

🔒 Permissions:
- Admin: Full CRUD
- Staff: Read + Update
- Viewer: Read only

📊 API Endpoints sử dụng:
- GET /api/v1/{{module}} - List with filters
- POST /api/v1/{{module}} - Create
- PUT /api/v1/{{module}}/{{id}} - Update
- DELETE /api/v1/{{module}}/{{id}} - Delete

🎨 UI Components cần:
- DataTable với sorting/pagination
- SearchInput + FilterDropdowns
- Modal/Dialog forms
- Action buttons (Edit/Delete)
- Loading states + Error handling
- Empty states

📁 Files sẽ tạo:
- `app/(dashboard)/{{module}}/page.tsx`
- `components/{{module}}/{{module}}-table.tsx`
- `components/{{module}}/{{module}}-form.tsx`
- `hooks/use{{Module}}.ts`
- `lib/api/{{module}}.ts`

⏱️ Effort: {{2-4 hours}}
```

---

## ⚡ 3) PROMPT IMPLEMENT DASHBOARD FEATURE

**Dùng để generate code hoàn chỉnh**

```
Hãy implement feature dashboard sau theo STRICT LOOP:

{{DÁN FEATURE CARD Ở TRÊN}}

Yêu cầu output:

1. **API Integration**:
   - Tạo `lib/api/{{module}}.ts` với TanStack Query hooks
   - Zod schemas cho request/response
   - Error handling & retry logic

2. **UI Components**:
   - DataTable với shadcn/ui Table
   - Form với React Hook Form + Zod validation
   - Loading/Error/Empty states
   - Confirmation dialogs

3. **Page Implementation**:
   - Next.js 15 App Router structure
   - Server/Client components appropriately
   - SEO & metadata

4. **Testing**:
   - Vitest unit tests cho components
   - MSW mocks cho API calls
   - Playwright E2E scenarios

5. **Manual Testing Checklist**:
   - [ ] Load page successfully
   - [ ] Display data correctly
   - [ ] Create new item works
   - [ ] Edit existing item works
   - [ ] Delete with confirmation works
   - [ ] Search & filter work
   - [ ] Pagination works
   - [ ] Error states handled
   - [ ] Mobile responsive

6. **Performance Optimization**:
   - React.memo for expensive components
   - useMemo for computed values
   - Virtual scrolling for large lists
   - Image optimization

Output format: File by file với code hoàn chỉnh + explanations
```

---

## 🔧 4) PROMPT TỐI ƯU BACKEND API

**Dùng để cải thiện API endpoints**

```
Tối ưu API cho module `{{module_name}}` trong Audio Tài Lộc:

1. **Performance Audit**:
   - Kiểm tra N+1 queries trong Prisma
   - Thêm indexes cần thiết
   - Implement caching (Redis)
   - Database query optimization

2. **Security Enhancement**:
   - Input sanitization
   - Rate limiting per endpoint
   - CORS configuration
   - SQL injection prevention

3. **API Design**:
   - RESTful conventions
   - Proper HTTP status codes
   - Consistent error responses
   - Pagination standardization

4. **Documentation**:
   - Swagger decorators complete
   - Example requests/responses
   - API versioning strategy

5. **Testing**:
   - Unit tests cho services
   - Integration tests cho controllers
   - E2E tests cho critical flows

Output: Code changes + migration scripts + test files
```

---

## 🎭 5) PROMPT TESTING STRATEGY

**Sinh bộ test toàn diện**

```
Tạo chiến lược testing cho `{{module_name}}`:

**Backend Tests (Jest + Supertest)**:
- Unit tests cho services (mock Prisma)
- Integration tests cho controllers
- E2E tests cho critical user journeys
- Performance tests cho high-traffic endpoints

**Frontend Tests (Vitest + Playwright)**:
- Component unit tests
- Hook testing với MSW
- E2E user flows
- Visual regression tests

**Test Data Strategy**:
- Factory pattern cho test data
- Seed scripts cho E2E
- Mock data cho unit tests

**CI/CD Integration**:
- GitHub Actions workflow
- Test coverage reports
- Parallel test execution
- Flaky test handling

Output: Test files + configuration + CI pipeline
```

---

## 🚀 6) PROMPT DEPLOYMENT & MONITORING

**Chuẩn bị production deployment**

```
Setup production deployment cho Audio Tài Lộc:

1. **Infrastructure**:
   - Docker containerization
   - Environment configuration
   - Database migration strategy
   - CDN for static assets

2. **Monitoring & Logging**:
   - Application metrics (Prometheus)
   - Error tracking (Sentry)
   - Performance monitoring
   - Database monitoring

3. **Security**:
   - Environment secrets management
   - API rate limiting
   - CORS policy
   - Input validation

4. **Backup & Recovery**:
   - Database backup strategy
   - Disaster recovery plan
   - Rollback procedures

5. **Performance**:
   - Caching strategy
   - Database optimization
   - CDN configuration
   - Load balancing

Output: Docker configs + deployment scripts + monitoring setup
```

---

## 📊 7) PROMPT ANALYTICS & INSIGHTS

**Thêm tính năng analytics**

```
Implement analytics dashboard cho Audio Tài Lộc:

1. **Business Metrics**:
   - Revenue tracking (orders/payments)
   - Product performance (views/sales)
   - User engagement (page views, session duration)
   - Customer insights (demographics, behavior)

2. **Technical Metrics**:
   - API response times
   - Error rates
   - Database performance
   - Cache hit rates

3. **Real-time Dashboards**:
   - Live order tracking
   - Inventory alerts
   - Performance monitoring
   - User activity feeds

4. **Reporting Features**:
   - Date range filtering
   - Export capabilities
   - Scheduled reports
   - Custom dashboards

Output: Analytics components + API endpoints + database queries
```

---

## 🔍 8) PROMPT DEBUG & TROUBLESHOOTING

**Xử lý issues production**

```
Debug issue: `{{issue_description}}`

1. **Problem Analysis**:
   - Error logs analysis
   - Database query inspection
   - Network request tracing
   - Performance profiling

2. **Root Cause Identification**:
   - Code review for bugs
   - Database constraint issues
   - Configuration problems
   - Third-party service issues

3. **Solution Implementation**:
   - Code fixes
   - Database migrations
   - Configuration updates
   - Monitoring improvements

4. **Prevention Measures**:
   - Additional test cases
   - Monitoring alerts
   - Documentation updates
   - Process improvements

Output: Step-by-step debugging guide + fixes + prevention
```

---

## 🎯 9) VÍ DỤ SỬ DỤNG - PRODUCTS DASHBOARD

**Feature: Quản lý sản phẩm karaoke**

```
[Dashboard Page] Products Management
Context: Quản lý danh mục thiết bị karaoke (Dàn Karaoke, Đầu Karaoke, Loa, Micro, Mixer...)

🎯 Mục tiêu/AC:
- [ ] Hiển thị danh sách sản phẩm với ảnh, giá, tồn kho
- [ ] Thêm/sửa sản phẩm với form validation
- [ ] Upload ảnh sản phẩm
- [ ] Filter theo danh mục, trạng thái
- [ ] Bulk actions (cập nhật giá, xóa nhiều)

🔒 Permissions: Admin full access, Staff limited edit

📊 API Endpoints:
- GET /api/v1/catalog/products - List products
- POST /api/v1/catalog/products - Create product
- PUT /api/v1/catalog/products/{id} - Update product
- DELETE /api/v1/catalog/products/{id} - Delete product

🎨 UI Components:
- ProductsTable với sorting, pagination
- ProductForm với image upload
- CategoryFilter, StatusFilter
- BulkActions toolbar

📁 Files:
- app/(dashboard)/products/page.tsx
- components/products/products-table.tsx
- components/products/product-form.tsx
- hooks/useProducts.ts
- lib/api/products.ts

⏱️ Effort: 4 hours
```

---

## ⚡ 10) MCP TOOLS OPTIMIZATION

**Sử dụng các MCP tools để tối ưu workflow:**

1. **File Operations**: `read_file`, `create_file`, `replace_string_in_file`
2. **Search & Analysis**: `grep_search`, `semantic_search`
3. **Terminal Commands**: `run_in_terminal` cho scripts
4. **Testing**: `runTests` cho automated testing
5. **Database**: Prisma Studio integration
6. **API Testing**: Swagger documentation

**Best Practices**:
- Luôn check API trước khi code UI
- Sử dụng existing DTOs & schemas
- Follow established patterns
- Test thoroughly before commit
- Document decisions & changes

---

## 🎉 KẾT LUẬN

Bộ prompt này được tối ưu đặc biệt cho dự án **Audio Tài Lộc** với:
- ✅ Stack hiện tại: NestJS 10 + Prisma + PostgreSQL
- ✅ Data sẵn có: 14 products, 7 categories, 3 services
- ✅ API documentation: Swagger complete
- ✅ Authentication: JWT + Role-based
- ✅ MCP Tools: Tích hợp để tối ưu workflow

**Cách sử dụng**: Copy prompt tương ứng → Điền `{{variables}}` → Paste vào AI assistant → Nhận code hoàn chỉnh!
