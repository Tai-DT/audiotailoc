# User Pages Setup & Demo Account

## Tài khoản Demo

### Thông tin đăng nhập
- **Email:** `demo@audiotailoc.com`
- **Password:** `demo123`
- **Role:** USER
- **Status:** Active

### Tạo tài khoản demo

Script đã được tạo tại `backend/prisma/seed-demo-user.ts`:

```bash
cd backend
npx tsx prisma/seed-demo-user.ts
```

Script sẽ:
- Kiểm tra xem demo user đã tồn tại chưa
- Tạo mới nếu chưa có
- Cập nhật password nếu đã tồn tại

## Các trang User đã được xây dựng

### 1. Profile Page (`/profile`)

**File:** `frontend/app/profile/page.tsx`

**Tính năng:**
- ✅ Hiển thị thông tin cá nhân (tên, email, phone, avatar)
- ✅ Chỉnh sửa thông tin profile
- ✅ Tabs:
  - **Thông tin:** Xem và chỉnh sửa thông tin cá nhân
  - **Đơn hàng:** Hiển thị 5 đơn hàng gần nhất với link đến trang đầy đủ
  - **Yêu thích:** Hiển thị 5 sản phẩm yêu thích với link đến trang đầy đủ
  - **Cài đặt:** Cài đặt bảo mật và thông báo

**Tích hợp:**
- ✅ `useAuth()` - Lấy thông tin user
- ✅ `useUpdateProfile()` - Cập nhật profile
- ✅ `useOrders()` - Lấy danh sách đơn hàng
- ✅ `useWishlist()` - Lấy danh sách yêu thích

### 2. Orders Page (`/orders`)

**File:** `frontend/app/orders/page.tsx`

**Tính năng:**
- ✅ Hiển thị tất cả đơn hàng của user
- ✅ Filter theo status (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- ✅ Chi tiết đơn hàng với:
  - Mã đơn hàng
  - Ngày đặt
  - Trạng thái với badge màu
  - Tổng tiền
  - Danh sách sản phẩm
  - Địa chỉ giao hàng
- ✅ Statistics: Tổng đơn hàng, Đã giao, Đang xử lý, Đã hủy
- ✅ Actions: Xem chi tiết, Hủy đơn (nếu có thể)

**Tích hợp:**
- ✅ `useAuth()` - Kiểm tra authentication
- ✅ `useOrders()` - Lấy danh sách đơn hàng

### 3. Order Detail Page (`/orders/[id]`)

**File:** `frontend/app/orders/[id]/page.tsx`

**Tính năng:**
- ✅ Hiển thị chi tiết đơn hàng
- ✅ Timeline trạng thái đơn hàng
- ✅ Danh sách sản phẩm với hình ảnh
- ✅ Thông tin thanh toán và giao hàng
- ✅ Actions: Hủy đơn, Đánh giá sản phẩm

### 4. Wishlist Page (`/wishlist`)

**File:** `frontend/app/wishlist/page.tsx`

**Tính năng:**
- ✅ Hiển thị danh sách sản phẩm yêu thích
- ✅ Grid layout với hình ảnh sản phẩm
- ✅ Thông tin sản phẩm: tên, giá, rating, stock status
- ✅ Actions:
  - Xóa khỏi wishlist
  - Thêm vào giỏ hàng
  - Xem chi tiết sản phẩm
- ✅ Empty state với CTA

**Tích hợp:**
- ✅ `useAuth()` - Kiểm tra authentication
- ✅ `useWishlist()` - Lấy danh sách yêu thích
- ✅ `useRemoveFromWishlist()` - Xóa sản phẩm
- ✅ `useAddToCart()` - Thêm vào giỏ hàng

## API Endpoints được sử dụng

### Authentication
- `GET /api/v1/auth/profile` - Lấy thông tin user
- `PUT /api/v1/auth/profile` - Cập nhật profile

### Orders
- `GET /api/v1/orders` - Lấy danh sách đơn hàng
- `GET /api/v1/orders/:id` - Lấy chi tiết đơn hàng

### Wishlist
- `GET /api/v1/wishlist` - Lấy danh sách yêu thích
- `POST /api/v1/wishlist` - Thêm vào wishlist
- `DELETE /api/v1/wishlist/:productId` - Xóa khỏi wishlist
- `GET /api/v1/wishlist/check/:productId` - Kiểm tra sản phẩm có trong wishlist

## Cải thiện đã thực hiện

### Profile Page
1. ✅ Tích hợp `useOrders()` để hiển thị đơn hàng thực tế
2. ✅ Tích hợp `useWishlist()` để hiển thị sản phẩm yêu thích
3. ✅ Hiển thị 5 items gần nhất với link đến trang đầy đủ
4. ✅ Loading states cho orders và wishlist
5. ✅ Empty states với CTA buttons

### Navigation
- ✅ Tất cả các trang đều có link đến nhau
- ✅ Breadcrumbs và navigation buttons
- ✅ Consistent UI/UX

## Testing

### Test đăng nhập với demo account

1. Navigate đến `http://localhost:3000/login`
2. Click "Tài khoản demo" hoặc nhập:
   - Email: `demo@audiotailoc.com`
   - Password: `demo123`
3. Sau khi đăng nhập, bạn sẽ được redirect về homepage
4. Click vào avatar/user menu để vào Profile

### Test các trang User

1. **Profile Page:**
   - Navigate đến `/profile`
   - Kiểm tra các tabs: Thông tin, Đơn hàng, Yêu thích, Cài đặt
   - Test chỉnh sửa profile

2. **Orders Page:**
   - Navigate đến `/orders`
   - Kiểm tra hiển thị đơn hàng (nếu có)
   - Test empty state

3. **Wishlist Page:**
   - Navigate đến `/wishlist`
   - Kiểm tra hiển thị sản phẩm yêu thích (nếu có)
   - Test empty state
   - Test thêm/xóa sản phẩm

## Lưu ý

1. **Authentication Required:** Tất cả các trang user đều yêu cầu đăng nhập
2. **Redirect:** Nếu chưa đăng nhập, sẽ redirect về `/login`
3. **Loading States:** Tất cả các trang đều có loading states
4. **Error Handling:** Tất cả các API calls đều có error handling
5. **Empty States:** Tất cả các trang đều có empty states với CTA

## Next Steps

1. ✅ Tạo demo user account
2. ✅ Kiểm tra và cải thiện Profile page
3. ✅ Kiểm tra Orders page
4. ✅ Kiểm tra Wishlist page
5. ⏳ Test đăng nhập với demo account
6. ⏳ Test các tính năng CRUD (thêm/xóa wishlist, xem orders, etc.)

Tất cả các trang user đã được xây dựng và sẵn sàng để test!

