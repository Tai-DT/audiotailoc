# 🧪 Frontend & Dashboard Integration Test Plan

**Ngày test:** 30/11/2025  
**Tester:** AI Assistant với MCP Tools

---

## 📋 Tổng Quan

### Mục tiêu
Kiểm tra toàn bộ tính năng frontend và đảm bảo kết nối hoạt động tốt với dashboard và backend.

### Services Status
- ✅ **Frontend:** http://localhost:3000 (Running)
- ✅ **Dashboard:** http://localhost:3001 (Running)
- ✅ **Backend:** http://localhost:3010 (Running)

---

## 🎯 Test Cases

### 1. ✅ Trang Home và Navigation

#### 1.1 Home Page
- [x] **URL:** http://localhost:3000/
- [x] **Status:** ✅ Loaded successfully
- [x] **Features:**
  - Banner carousel
  - Featured products section
  - New products section
  - Best selling products
  - Knowledge & Guides section
  - Newsletter subscription
  - Footer with links

#### 1.2 Navigation
- [x] **Products Link:** `/products` ✅
- [x] **Services Link:** `/services` ✅
- [x] **Projects Link:** `/du-an` ✅
- [x] **About Link:** `/about` ✅
- [x] **Contact Link:** `/contact` ✅

---

### 2. 📦 Products Features

#### 2.1 Products List Page
- [x] **URL:** http://localhost:3000/products
- [x] **Status:** ✅ Loaded successfully
- [ ] **Features to test:**
  - [ ] Product grid display
  - [ ] Search functionality
  - [ ] Filter by category
  - [ ] Sort options (price, date, popularity)
  - [ ] Pagination

#### 2.2 Product Detail Page
- [ ] **URL Pattern:** `/products/[slug]`
- [ ] **Features to test:**
  - [ ] Product images gallery
  - [ ] Product information
  - [ ] Add to cart button
  - [ ] Add to wishlist
  - [ ] Related products
  - [ ] Reviews section

#### 2.3 Search Functionality
- [ ] **Test Cases:**
  - [ ] Search by product name
  - [ ] Search by category
  - [ ] Search by brand
  - [ ] Empty search results handling
  - [ ] Search suggestions

---

### 3. 🔐 Authentication

#### 3.1 Login Page
- [x] **URL:** http://localhost:3000/login
- [ ] **Test Cases:**
  - [ ] Login form display
  - [ ] Email validation
  - [ ] Password validation
  - [ ] Successful login
  - [ ] Error handling
  - [ ] Redirect after login

#### 3.2 Register Page
- [x] **URL:** http://localhost:3000/register
- [ ] **Test Cases:**
  - [ ] Registration form
  - [ ] Field validation
  - [ ] Password confirmation
  - [ ] Email verification
  - [ ] Success message
  - [ ] Auto-login after registration

#### 3.3 Profile Management
- [ ] **URL:** `/profile`
- [ ] **Test Cases:**
  - [ ] View profile
  - [ ] Edit profile
  - [ ] Change password
  - [ ] Address management
  - [ ] Order history link

---

### 4. 🛒 Cart & Checkout

#### 4.1 Cart Page
- [x] **URL:** http://localhost:3000/cart
- [ ] **Test Cases:**
  - [ ] View cart items
  - [ ] Update quantity
  - [ ] Remove item
  - [ ] Calculate total
  - [ ] Apply discount code
  - [ ] Empty cart state

#### 4.2 Checkout Flow
- [ ] **URL:** `/checkout`
- [ ] **Test Cases:**
  - [ ] Shipping address form
  - [ ] Payment method selection
  - [ ] Order summary
  - [ ] Place order
  - [ ] Order confirmation
  - [ ] Redirect to payment

#### 4.3 Order Success
- [ ] **URL:** `/order-success`
- [ ] **Test Cases:**
  - [ ] Display order details
  - [ ] Order tracking info
  - [ ] Continue shopping button

---

### 5. 📋 Orders & History

#### 5.1 Orders List
- [ ] **URL:** `/orders`
- [ ] **Test Cases:**
  - [ ] List all orders
  - [ ] Filter by status
  - [ ] Sort by date
  - [ ] Order details link

#### 5.2 Order Detail
- [ ] **URL Pattern:** `/orders/[id]`
- [ ] **Test Cases:**
  - [ ] Order information
  - [ ] Product list
  - [ ] Shipping status
  - [ ] Invoice download
  - [ ] Cancel order (if allowed)

---

### 6. ❤️ Wishlist & Favorites

#### 6.1 Wishlist Page
- [ ] **URL:** `/wishlist`
- [ ] **Test Cases:**
  - [ ] View wishlist items
  - [ ] Add to cart from wishlist
  - [ ] Remove from wishlist
  - [ ] Empty wishlist state

#### 6.2 Wishlist Features
- [ ] Add to wishlist from product page
- [ ] Wishlist counter in header
- [ ] Sync wishlist across devices

---

### 7. 📰 Blog & Knowledge Base

#### 7.1 Blog List
- [x] **URL:** http://localhost:3000/blog
- [ ] **Test Cases:**
  - [ ] Blog posts list
  - [ ] Category filter
  - [ ] Search blog posts
  - [ ] Pagination

#### 7.2 Blog Detail
- [ ] **URL Pattern:** `/blog/[slug]`
- [ ] **Test Cases:**
  - [ ] Blog content display
  - [ ] Author information
  - [ ] Related posts
  - [ ] Share buttons

#### 7.3 Knowledge Base
- [ ] **URL:** `/knowledge-base`
- [ ] **Test Cases:**
  - [ ] Knowledge articles list
  - [ ] Category navigation
  - [ ] Search articles
  - [ ] Article detail view

---

### 8. 🛠️ Services & Projects

#### 8.1 Services Page
- [x] **URL:** http://localhost:3000/services
- [ ] **Test Cases:**
  - [ ] Services list
  - [ ] Service categories
  - [ ] Service booking form
  - [ ] Service detail page

#### 8.2 Projects Page
- [x] **URL:** http://localhost:3000/du-an
- [ ] **Test Cases:**
  - [ ] Projects gallery
  - [ ] Filter by category
  - [ ] Project detail page
  - [ ] Image gallery

---

### 9. 💬 Support & Contact

#### 9.1 Contact Page
- [x] **URL:** http://localhost:3000/contact
- [ ] **Test Cases:**
  - [ ] Contact form
  - [ ] Form validation
  - [ ] Submit contact request
  - [ ] Success message

#### 9.2 Support Page
- [ ] **URL:** `/support`
- [ ] **Test Cases:**
  - [ ] Support ticket creation
  - [ ] View tickets
  - [ ] Ticket status

#### 9.3 Chat Feature
- [ ] **URL:** `/chat`
- [ ] **Test Cases:**
  - [ ] Chat interface
  - [ ] Send messages
  - [ ] Receive messages
  - [ ] Chat history

---

### 10. 🔗 Frontend-Dashboard-Backend Integration

#### 10.1 API Connections
- [x] **Frontend → Backend:** ✅
  - Base URL: `http://localhost:3010/api/v1`
  - Health check: ✅ Working
  - Products API: To test
  - Orders API: To test

- [ ] **Dashboard → Backend:** To test
  - Base URL: `http://localhost:3010/api/v1`
  - Admin endpoints: To test

#### 10.2 Data Flow Tests
- [ ] **Product Data:**
  - [ ] Frontend loads products from backend
  - [ ] Dashboard can manage products
  - [ ] Changes reflect in frontend

- [ ] **Order Data:**
  - [ ] Frontend creates orders
  - [ ] Dashboard receives orders
  - [ ] Order status updates

- [ ] **User Data:**
  - [ ] User registration in frontend
  - [ ] Dashboard sees new users
  - [ ] Profile updates sync

#### 10.3 Real-time Features
- [ ] **WebSocket Connection:**
  - [ ] Chat notifications
  - [ ] Order updates
  - [ ] Inventory changes

---

## 🧪 Test Execution

### Automated Tests (MCP Tools)

#### Playwright Browser Tests
```bash
# Test home page
- Navigate to http://localhost:3000
- Check page load
- Verify navigation links

# Test products page
- Navigate to /products
- Test search functionality
- Test filters

# Test authentication
- Navigate to /login
- Fill login form
- Submit and verify
```

#### Postman API Tests
```bash
# Test backend endpoints
GET /api/v1/health
GET /api/v1/catalog/products
GET /api/v1/catalog/categories

# Test frontend API routes
GET /api/products
GET /api/projects/featured
```

### Manual Tests Checklist

- [ ] Visual inspection of all pages
- [ ] Form validation
- [ ] Error messages
- [ ] Loading states
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Performance (page load times)

---

## 📊 Test Results Summary

### ✅ Passed Tests
1. ✅ Frontend Home Page - Loaded successfully
2. ✅ Products Page - Loaded successfully
3. ✅ Services Page - Loaded successfully
4. ✅ About Page - Loaded successfully
5. ✅ Contact Page - Loaded successfully
6. ✅ Blog Page - Loaded successfully
7. ✅ Login Page - Loaded successfully
8. ✅ Register Page - Loaded successfully
9. ✅ Cart Page - Loaded successfully
10. ✅ Backend Health Check - Working

### ⏳ Pending Tests
- All interactive features (forms, buttons, API calls)
- Authentication flow
- Cart & checkout flow
- Order management
- Wishlist functionality
- Real-time features

### ❌ Failed Tests
- None yet

---

## 🔍 Issues & Findings

### Current Issues
1. Products page shows filters but products list needs verification
2. Some pages may require authentication to test fully
3. API endpoints need to be tested with actual data

### Recommendations
1. Create test user accounts for authentication testing
2. Seed database with test products
3. Set up test payment gateway
4. Configure WebSocket for real-time features

---

## 📝 Notes

- Frontend is using Next.js 16.0.3
- API client configured to connect to backend on port 3010
- Dashboard connects to same backend API
- All three services are running and accessible

---

**Last Updated:** 30/11/2025
