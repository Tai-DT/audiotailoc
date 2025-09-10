# 📐 Audio Tài Lộc - Business Rules & Validation Logic

## 🎯 Core Business Rules

### 1. USER MANAGEMENT RULES

#### Registration Rules
```typescript
RULE_USER_001: Email must be unique in system
RULE_USER_002: Password minimum 8 characters with 1 uppercase, 1 number
RULE_USER_003: Phone number must be Vietnamese format (0xxxxxxxxx)
RULE_USER_004: Age minimum 18 years old
RULE_USER_005: Default role is USER upon registration
RULE_USER_006: Email verification required within 24 hours
```

#### Authentication Rules
```typescript
RULE_AUTH_001: Max 5 login attempts per 15 minutes
RULE_AUTH_002: Access token expires in 15 minutes
RULE_AUTH_003: Refresh token expires in 7 days
RULE_AUTH_004: Password reset link valid for 1 hour
RULE_AUTH_005: 2FA optional for USER, required for ADMIN/STAFF
```

### 2. PRODUCT MANAGEMENT RULES

#### Product Creation Rules
```typescript
RULE_PROD_001: Product name must be unique
RULE_PROD_002: Product slug auto-generated from name
RULE_PROD_003: Price must be > 0 and in VND (stored as cents)
RULE_PROD_004: At least 1 image required
RULE_PROD_005: Max 10 images per product
RULE_PROD_006: Stock quantity >= 0
RULE_PROD_007: SKU must be unique if provided
```

#### Inventory Rules
```typescript
RULE_INV_001: Cannot order more than available stock
RULE_INV_002: Low stock alert when quantity < 10
RULE_INV_003: Out of stock when quantity = 0
RULE_INV_004: Reserved stock for pending orders (15 minutes)
RULE_INV_005: Auto-release reserved stock after timeout
```

#### Pricing Rules
```typescript
RULE_PRICE_001: All prices in VND, stored as cents (x100)
RULE_PRICE_002: Discount cannot exceed 70% of original price
RULE_PRICE_003: Flash sale max duration 24 hours
RULE_PRICE_004: Bundle discount max 30%
RULE_PRICE_005: Member discount 5% for USER role
```

### 3. CART & CHECKOUT RULES

#### Cart Rules
```typescript
RULE_CART_001: Guest cart stored in localStorage (7 days)
RULE_CART_002: User cart synced with database
RULE_CART_003: Max 99 quantity per item
RULE_CART_004: Max 50 different items in cart
RULE_CART_005: Cart merged on login (guest + user)
RULE_CART_006: Price recalculated on checkout
```

#### Checkout Rules
```typescript
RULE_CHECK_001: Require email for guest checkout
RULE_CHECK_002: Require phone number (Vietnamese format)
RULE_CHECK_003: Shipping address required fields:
  - Full name
  - Phone
  - Province/City
  - District
  - Ward
  - Street address
RULE_CHECK_004: Validate stock before order creation
RULE_CHECK_005: Lock price during checkout (15 minutes)
```

### 4. ORDER PROCESSING RULES

#### Order Creation Rules
```typescript
RULE_ORDER_001: Generate unique order number: ORD-YYYYMMDD-XXXXX
RULE_ORDER_002: Minimum order value: 50,000 VND
RULE_ORDER_003: Maximum order value: 500,000,000 VND
RULE_ORDER_004: Cannot modify order after CONFIRMED status
RULE_ORDER_005: Auto-cancel unpaid orders after 24 hours
```

#### Order Status Transitions
```typescript
RULE_STATUS_001: 
  PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
  PENDING → CANCELLED
  CONFIRMED → CANCELLED (within 1 hour)
  SHIPPED → RETURNED (within 7 days)
  
RULE_STATUS_002: Status change triggers notification
RULE_STATUS_003: Only ADMIN/STAFF can change status
RULE_STATUS_004: Customer can cancel within 1 hour of confirmation
```

#### Order Cancellation Rules
```typescript
RULE_CANCEL_001: Free cancellation within 1 hour
RULE_CANCEL_002: 10% fee after 1 hour (if not shipped)
RULE_CANCEL_003: Cannot cancel after SHIPPED
RULE_CANCEL_004: Refund processed within 3-5 business days
RULE_CANCEL_005: PayOS refund automatic, COD refund manual
```

### 5. PAYMENT RULES

#### Payment Method Rules
```typescript
RULE_PAY_001: Available methods: COD, PayOS
RULE_PAY_002: COD available for orders < 50,000,000 VND
RULE_PAY_003: COD requires phone verification
RULE_PAY_004: PayOS for all order values
RULE_PAY_005: Payment timeout 15 minutes for PayOS
```

#### Payment Processing Rules
```typescript
RULE_PAYMENT_001: Verify amount matches order total
RULE_PAYMENT_002: Create payment intent before redirect
RULE_PAYMENT_003: Webhook signature verification required
RULE_PAYMENT_004: Idempotency key prevents duplicates
RULE_PAYMENT_005: Max 3 payment retry attempts
```

#### Refund Rules
```typescript
RULE_REFUND_001: Full refund if cancelled within 1 hour
RULE_REFUND_002: 90% refund if cancelled within 24 hours
RULE_REFUND_003: No refund after delivery (except defects)
RULE_REFUND_004: Defective product refund within 7 days
RULE_REFUND_005: Refund to original payment method only
```

### 6. SERVICE BOOKING RULES

#### Booking Creation Rules
```typescript
RULE_BOOK_001: Minimum 24 hours advance booking
RULE_BOOK_002: Maximum 30 days advance booking
RULE_BOOK_003: Service hours: 8:00 - 18:00
RULE_BOOK_004: No booking on public holidays
RULE_BOOK_005: 30% deposit required for booking > 1,000,000 VND
```

#### Booking Cancellation Rules
```typescript
RULE_BOOK_CANCEL_001: Free cancellation 24 hours before
RULE_BOOK_CANCEL_002: 50% charge within 24 hours
RULE_BOOK_CANCEL_003: No refund for no-show
RULE_BOOK_CANCEL_004: Rescheduling allowed once free
RULE_BOOK_CANCEL_005: Weather cancellation full refund
```

### 7. SHIPPING RULES

#### Shipping Methods
```typescript
RULE_SHIP_001: Standard shipping (3-5 days): Free > 1,000,000 VND
RULE_SHIP_002: Express shipping (1-2 days): 50,000 VND
RULE_SHIP_003: Same-day (HCM only): 100,000 VND
RULE_SHIP_004: Installation service: Quote on request
```

#### Shipping Restrictions
```typescript
RULE_SHIP_RESTRICT_001: No shipping to islands
RULE_SHIP_RESTRICT_002: Bulky items (>30kg) special handling
RULE_SHIP_RESTRICT_003: Fragile items require insurance
RULE_SHIP_RESTRICT_004: Max order weight: 100kg
```

### 8. REVIEW & RATING RULES

#### Review Submission Rules
```typescript
RULE_REVIEW_001: Only after order DELIVERED status
RULE_REVIEW_002: One review per product per order
RULE_REVIEW_003: Review window: 30 days after delivery
RULE_REVIEW_004: Minimum 10 characters for written review
RULE_REVIEW_005: Rating required (1-5 stars)
```

#### Review Moderation Rules
```typescript
RULE_MOD_001: Auto-flag reviews with prohibited words
RULE_MOD_002: Manual approval for flagged reviews
RULE_MOD_003: Hide reviews with < -5 helpfulness score
RULE_MOD_004: Verified purchase badge for customers
```

### 9. PROMOTION RULES

#### Discount Code Rules
```typescript
RULE_PROMO_001: One discount code per order
RULE_PROMO_002: Cannot combine with member discount
RULE_PROMO_003: Minimum order value for code activation
RULE_PROMO_004: Max discount cap per code
RULE_PROMO_005: First-time customer 10% off (max 500,000 VND)
```

#### Loyalty Program Rules
```typescript
RULE_LOYAL_001: 1 point per 10,000 VND spent
RULE_LOYAL_002: 100 points = 100,000 VND discount
RULE_LOYAL_003: Points expire after 12 months
RULE_LOYAL_004: Birthday month double points
RULE_LOYAL_005: VIP status at 10,000,000 VND annual spend
```

### 10. CUSTOMER SERVICE RULES

#### Support Ticket Rules
```typescript
RULE_SUPPORT_001: Response within 24 hours
RULE_SUPPORT_002: Priority support for VIP customers
RULE_SUPPORT_003: Max 5 attachments per ticket
RULE_SUPPORT_004: Auto-close after 7 days inactivity
```

#### Return/Exchange Rules
```typescript
RULE_RETURN_001: 30-day return policy
RULE_RETURN_002: Original packaging required
RULE_RETURN_003: Return shipping paid by customer
RULE_RETURN_004: Exchange free if defective
RULE_RETURN_005: No return for customized products
```

## 🔧 VALIDATION LOGIC

### Input Validation Patterns

```typescript
// Email Validation
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Vietnamese Phone
const VN_PHONE_PATTERN = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

// Order Number
const ORDER_NUMBER_PATTERN = /^ORD-\d{8}-[A-Z0-9]{5}$/;

// Slug Format
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Vietnamese Name
const VN_NAME_PATTERN = /^[a-zA-ZÀ-ỹĐđ\s]+$/;
```

### Price Calculation Logic

```typescript
function calculateOrderTotal(items, shipping, discount) {
  const subtotal = items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  
  const shippingFee = subtotal >= 1000000 ? 0 : shipping;
  const discountAmount = Math.min(discount, subtotal * 0.3);
  const tax = (subtotal - discountAmount) * 0.1; // 10% VAT
  
  return {
    subtotal,
    shippingFee,
    discountAmount,
    tax,
    total: subtotal + shippingFee - discountAmount + tax
  };
}
```

### Stock Validation Logic

```typescript
function validateStock(product, requestedQty) {
  const rules = {
    canOrder: product.stock >= requestedQty,
    isLowStock: product.stock < 10,
    isOutOfStock: product.stock === 0,
    maxOrderQty: Math.min(product.stock, 99),
    message: ''
  };
  
  if (rules.isOutOfStock) {
    rules.message = 'Sản phẩm đã hết hàng';
  } else if (!rules.canOrder) {
    rules.message = `Chỉ còn ${product.stock} sản phẩm`;
  } else if (rules.isLowStock) {
    rules.message = 'Sắp hết hàng';
  }
  
  return rules;
}
```

### Date/Time Validation Logic

```typescript
function validateBookingDate(date, service) {
  const rules = {
    isValid: true,
    message: ''
  };
  
  const now = new Date();
  const bookingDate = new Date(date);
  const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
  
  // Min 24 hours advance
  if (hoursDiff < 24) {
    rules.isValid = false;
    rules.message = 'Đặt trước ít nhất 24 giờ';
  }
  
  // Max 30 days advance
  if (hoursDiff > 24 * 30) {
    rules.isValid = false;
    rules.message = 'Chỉ đặt trước tối đa 30 ngày';
  }
  
  // Check working hours (8-18)
  const hour = bookingDate.getHours();
  if (hour < 8 || hour >= 18) {
    rules.isValid = false;
    rules.message = 'Giờ làm việc 8:00 - 18:00';
  }
  
  // Check holidays
  if (isPublicHoliday(bookingDate)) {
    rules.isValid = false;
    rules.message = 'Không làm việc ngày lễ';
  }
  
  return rules;
}
```

## 🚫 ERROR CODES & MESSAGES

### System Error Codes
```typescript
ERR_AUTH_001: "Email hoặc mật khẩu không đúng"
ERR_AUTH_002: "Phiên đăng nhập hết hạn"
ERR_AUTH_003: "Không có quyền truy cập"
ERR_AUTH_004: "Tài khoản bị khóa"
ERR_AUTH_005: "Quá nhiều lần thử đăng nhập"

ERR_PROD_001: "Sản phẩm không tồn tại"
ERR_PROD_002: "Sản phẩm đã hết hàng"
ERR_PROD_003: "Số lượng vượt quá tồn kho"

ERR_ORDER_001: "Đơn hàng không tồn tại"
ERR_ORDER_002: "Không thể hủy đơn hàng"
ERR_ORDER_003: "Giá trị đơn hàng không hợp lệ"

ERR_PAY_001: "Thanh toán thất bại"
ERR_PAY_002: "Phương thức thanh toán không hỗ trợ"
ERR_PAY_003: "Hết thời gian thanh toán"
```

## 📊 METRICS & KPIs

### Business Metrics to Track
```typescript
METRIC_001: Average Order Value (AOV)
METRIC_002: Cart Abandonment Rate < 70%
METRIC_003: Payment Success Rate > 95%
METRIC_004: Order Fulfillment Time < 3 days
METRIC_005: Customer Satisfaction Score > 4.5/5
METRIC_006: Return Rate < 5%
METRIC_007: Service Booking Completion > 90%
METRIC_008: Response Time < 24 hours
```

## ✅ COMPLIANCE & LEGAL

### Data Protection Rules
```typescript
COMPLY_001: GDPR compliance for EU customers
COMPLY_002: Personal data encryption at rest
COMPLY_003: PCI DSS for payment processing
COMPLY_004: Data retention 5 years for tax
COMPLY_005: Customer consent for marketing
```

### Tax & Invoice Rules
```typescript
TAX_001: VAT 10% on all products
TAX_002: VAT 5% on essential items
TAX_003: Invoice required for B2B
TAX_004: E-invoice integration
TAX_005: Monthly tax reporting
```
