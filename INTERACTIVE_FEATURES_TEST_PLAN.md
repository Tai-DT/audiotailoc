# 🧪 Interactive Features Test Plan

**Ngày test:** 30/11/2025  
**Tester:** AI Assistant với Playwright Browser MCP

---

## 🎯 Test Credentials

### Demo Account
- **Email:** `demo@audiotailoc.com`
- **Password:** `demo123`

### Test Accounts
- **Admin:** `admin@audiotailoc.com` / `Admin1234` (nếu có)

---

## 📋 Test Cases

### 1. Authentication Flow

#### 1.1 Login
- [ ] Navigate to login page
- [ ] Fill email field
- [ ] Fill password field
- [ ] Toggle password visibility
- [ ] Check "Remember me"
- [ ] Submit login form
- [ ] Verify successful login
- [ ] Check redirect to home page
- [ ] Verify user is authenticated

#### 1.2 Demo Login
- [ ] Click "Tài khoản demo" button
- [ ] Verify auto-fill credentials
- [ ] Verify successful login
- [ ] Check redirect

#### 1.3 Register
- [ ] Navigate to register page
- [ ] Fill registration form
- [ ] Validate form fields
- [ ] Submit registration
- [ ] Verify success message
- [ ] Check auto-login after registration

#### 1.4 Logout
- [ ] Click logout button
- [ ] Verify user is logged out
- [ ] Check redirect to home or login

---

### 2. Add to Cart & Checkout

#### 2.1 Browse Products
- [ ] Navigate to products page
- [ ] View product list
- [ ] Click on a product
- [ ] View product details

#### 2.2 Add to Cart
- [ ] Click "Add to Cart" button
- [ ] Verify product added to cart
- [ ] Check cart icon shows count
- [ ] Navigate to cart page
- [ ] Verify product in cart
- [ ] Check product details in cart

#### 2.3 Update Cart
- [ ] Change quantity
- [ ] Remove item from cart
- [ ] Verify total updates
- [ ] Clear cart

#### 2.4 Checkout Flow
- [ ] Navigate to checkout
- [ ] Fill shipping address
- [ ] Select payment method
- [ ] Review order summary
- [ ] Apply discount code (if applicable)
- [ ] Place order
- [ ] Verify order confirmation

---

### 3. Orders Management

#### 3.1 View Orders
- [ ] Navigate to orders page
- [ ] View order list
- [ ] Verify order information
- [ ] Check order status

#### 3.2 Order Details
- [ ] Click on an order
- [ ] View order details
- [ ] Check products in order
- [ ] View shipping information
- [ ] Check order status tracking

#### 3.3 Order Actions
- [ ] Cancel order (if allowed)
- [ ] Re-order
- [ ] Download invoice
- [ ] Contact support for order

---

### 4. Wishlist Management

#### 4.1 Add to Wishlist
- [ ] View product detail
- [ ] Click "Add to Wishlist"
- [ ] Verify item added
- [ ] Check wishlist count

#### 4.2 View Wishlist
- [ ] Navigate to wishlist page
- [ ] View wishlist items
- [ ] Verify product information

#### 4.3 Manage Wishlist
- [ ] Remove from wishlist
- [ ] Move to cart from wishlist
- [ ] Clear wishlist

---

### 5. Profile Editing

#### 5.1 View Profile
- [ ] Navigate to profile page
- [ ] View profile information
- [ ] Check user details

#### 5.2 Edit Profile
- [ ] Click edit button
- [ ] Update name
- [ ] Update email
- [ ] Update phone
- [ ] Save changes
- [ ] Verify updates

#### 5.3 Change Password
- [ ] Navigate to change password
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Submit
- [ ] Verify password changed

#### 5.4 Address Management
- [ ] View addresses
- [ ] Add new address
- [ ] Edit address
- [ ] Delete address
- [ ] Set default address

---

## 🧪 Test Execution Order

1. ✅ Authentication (Login/Register)
2. ⏳ Browse Products & Add to Cart
3. ⏳ Checkout Flow
4. ⏳ Orders Management
5. ⏳ Wishlist Management
6. ⏳ Profile Editing

---

## 📊 Expected Results

### Success Criteria
- All forms submit successfully
- Data persists correctly
- UI updates immediately
- Navigation works smoothly
- Error handling works properly
- Loading states display correctly

---

**Status:** Ready to execute tests
