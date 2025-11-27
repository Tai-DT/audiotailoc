# Data Flow & System Integration

## 🔄 Complete Data Flows

### 1. E-Commerce Purchase Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

1. BROWSE PRODUCTS
   Frontend (Customer)
   └─> GET /api/products
       └─> Backend (Catalog Service)
           └─> Database (Products table)
               └─> Return product list
                   └─> Frontend displays products

2. ADD TO CART
   Frontend (Customer)
   └─> POST /api/cart/items
       └─> Backend (Cart Service)
           └─> Validate product
           └─> Check inventory
           └─> Add to cart
           └─> Return cart data
               └─> Frontend updates cart UI

3. CHECKOUT
   Frontend (Customer)
   └─> POST /api/checkout/validate
       └─> Backend (Checkout Service)
           └─> Validate shipping address
           └─> Calculate shipping fee
           └─> Apply promotions
           └─> Return checkout summary
               └─> Frontend displays summary

4. PAYMENT
   Frontend (Customer)
   └─> POST /api/payments/process
       └─> Backend (Payments Service)
           └─> Integrate with PayOS
           └─> Process payment
           └─> Return payment status
               └─> Frontend redirects to confirmation

5. CREATE ORDER
   Frontend (Customer)
   └─> POST /api/orders
       └─> Backend (Orders Service)
           └─> Create order record
           └─> Create order items
           └─> Update inventory
           └─> Send confirmation email
           └─> Return order details
               └─> Frontend shows order confirmation

6. ADMIN NOTIFICATION
   Backend (Orders Service)
   └─> Emit WebSocket event: 'order:created'
       └─> Dashboard (Admin)
           └─> Receive real-time notification
           └─> Update orders list
           └─> Show new order alert

7. ORDER MANAGEMENT
   Dashboard (Admin)
   └─> PATCH /api/orders/:id/status/:status
       └─> Backend (Orders Service)
           └─> Update order status
           └─> Send customer notification
           └─> Emit WebSocket event: 'order:updated'
               └─> Frontend (Customer)
                   └─> Show order status update
               └─> Dashboard (Admin)
                   └─> Update order list

8. TRACKING
   Frontend (Customer)
   └─> GET /api/orders/:id
       └─> Backend (Orders Service)
           └─> Return order details
           └─> Return tracking info
               └─> Frontend displays tracking
```

### 2. Product Review Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    REVIEW PROCESS                               │
└─────────────────────────────────────────────────────────────────┘

1. SUBMIT REVIEW
   Frontend (Customer)
   └─> POST /api/reviews
       ├─ productId
       ├─ rating
       ├─ comment
       └─ userId
           └─> Backend (Reviews Service)
               └─> Validate review
               └─> Create review (PENDING status)
               └─> Store in database
               └─> Send admin notification
               └─> Return review data
                   └─> Frontend shows "Review submitted"

2. ADMIN NOTIFICATION
   Backend (Reviews Service)
   └─> Emit WebSocket event: 'review:submitted'
       └─> Dashboard (Admin)
           └─> Show pending review notification
           └─> Add to pending reviews list

3. ADMIN REVIEW
   Dashboard (Admin)
   └─> GET /api/reviews (filter: status=PENDING)
       └─> Backend (Reviews Service)
           └─> Return pending reviews
               └─> Dashboard displays reviews

4. APPROVE/REJECT
   Dashboard (Admin)
   └─> PATCH /api/reviews/:id/status/:status
       ├─ status: APPROVED or REJECTED
           └─> Backend (Reviews Service)
               └─> Update review status
               └─> Send customer notification
               └─> Emit WebSocket event: 'review:updated'
                   └─> Frontend (Customer)
                       └─> Show review status
                   └─> Dashboard (Admin)
                       └─> Update review list

5. DISPLAY REVIEWS
   Frontend (Customer)
   └─> GET /api/reviews?productId=:id&status=APPROVED
       └─> Backend (Reviews Service)
           └─> Return approved reviews
               └─> Frontend displays reviews on product page

6. MARK HELPFUL
   Frontend (Customer)
   └─> PATCH /api/reviews/:id/helpful/true
       └─> Backend (Reviews Service)
           └─> Increment helpful count
           └─> Return updated review
               └─> Frontend updates helpful count

7. STATISTICS
   Dashboard (Admin)
   └─> GET /api/reviews/stats/summary
       └─> Backend (Reviews Service)
           └─> Calculate statistics
           ├─ Total reviews
           ├─ Average rating
           ├─ Pending count
           ├─ Approved count
           └─ Rejected count
               └─> Dashboard displays stats
```

### 3. Real-time Communication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    REAL-TIME UPDATES                            │
└─────────────────────────────────────────────────────────────────┘

1. WEBSOCKET CONNECTION
   Frontend/Dashboard
   └─> Connect to WebSocket
       └─> Backend (Realtime Service)
           └─> Establish connection
           └─> Register client
           └─> Send connection confirmation

2. ORDER UPDATE
   Backend (Orders Service)
   └─> Update order status
       └─> Emit WebSocket event: 'order:updated'
           ├─> Dashboard (Admin)
           │   └─> Receive update
           │   └─> Update orders list
           │   └─> Show notification
           └─> Frontend (Customer)
               └─> Receive update
               └─> Update order status
               └─> Show notification

3. INVENTORY UPDATE
   Backend (Inventory Service)
   └─> Update stock level
       └─> Emit WebSocket event: 'inventory:updated'
           └─> Dashboard (Admin)
               └─> Receive update
               └─> Update inventory display
               └─> Show low stock alert

4. NEW MESSAGE
   Frontend/Dashboard
   └─> Send message
       └─> Backend (Messages Service)
           └─> Store message
           └─> Emit WebSocket event: 'message:new'
               ├─> Recipient (Frontend/Dashboard)
               │   └─> Receive message
               │   └─> Show notification
               │   └─> Update chat
               └─> Sender
                   └─> Confirm message sent

5. NOTIFICATION
   Backend (Notifications Service)
   └─> Create notification
       └─> Emit WebSocket event: 'notification:new'
           └─> Frontend/Dashboard
               └─> Receive notification
               └─> Show toast/alert
               └─> Update notification count

6. DISCONNECT
   Frontend/Dashboard
   └─> Disconnect from WebSocket
       └─> Backend (Realtime Service)
           └─> Unregister client
           └─> Clean up connection
```

### 4. Service Booking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE BOOKING                              │
└─────────────────────────────────────────────────────────────────┘

1. BROWSE SERVICES
   Frontend (Customer)
   └─> GET /api/services
       └─> Backend (Services Service)
           └─> Return services list
               └─> Frontend displays services

2. SELECT SERVICE
   Frontend (Customer)
   └─> GET /api/services/:id
       └─> Backend (Services Service)
           └─> Return service details
               └─> Frontend displays details

3. BOOK SERVICE
   Frontend (Customer)
   └─> POST /api/booking
       ├─ serviceId
       ├─ date
       ├─ time
       ├─ address
       └─ notes
           └─> Backend (Booking Service)
               └─> Validate availability
               └─> Create booking
               └─> Assign technician
               └─> Send confirmation
               └─> Return booking details
                   └─> Frontend shows confirmation

4. ADMIN NOTIFICATION
   Backend (Booking Service)
   └─> Emit WebSocket event: 'booking:created'
       └─> Dashboard (Admin)
           └─> Show new booking
           └─> Assign technician

5. TECHNICIAN ASSIGNMENT
   Dashboard (Admin)
   └─> PATCH /api/booking/:id/technician/:technicianId
       └─> Backend (Booking Service)
           └─> Assign technician
           └─> Send notification to technician
           └─> Emit WebSocket event: 'booking:assigned'
               └─> Frontend (Customer)
                   └─> Show technician info
               └─> Technician (Dashboard)
                   └─> Show assigned booking

6. UPDATE STATUS
   Dashboard (Admin/Technician)
   └─> PATCH /api/booking/:id/status/:status
       └─> Backend (Booking Service)
           └─> Update booking status
           └─> Send customer notification
           └─> Emit WebSocket event: 'booking:updated'
               └─> Frontend (Customer)
                   └─> Show status update

7. COMPLETION
   Dashboard (Technician)
   └─> PATCH /api/booking/:id/complete
       └─> Backend (Booking Service)
           └─> Mark as completed
           └─> Send customer notification
           └─> Request review
               └─> Frontend (Customer)
                   └─> Show completion
                   └─> Prompt for review
```

### 5. Admin Analytics Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYTICS & REPORTING                        │
└─────────────────────────────────────────────────────────────────┘

1. LOAD DASHBOARD
   Dashboard (Admin)
   └─> GET /api/analytics/sales
       └─> Backend (Analytics Service)
           └─> Query database
           └─> Calculate metrics
           ├─ Total sales
           ├─ Revenue
           ├─ Order count
           └─ Average order value
               └─> Dashboard displays charts

2. REAL-TIME UPDATES
   Backend (Analytics Service)
   └─> Monitor database changes
       └─> Emit WebSocket event: 'analytics:updated'
           └─> Dashboard (Admin)
               └─> Receive update
               └─> Refresh charts
               └─> Update metrics

3. GENERATE REPORT
   Dashboard (Admin)
   └─> GET /api/analytics/report?period=month
       └─> Backend (Analytics Service)
           └─> Query database
           └─> Generate report
           └─> Return report data
               └─> Dashboard displays report

4. EXPORT DATA
   Dashboard (Admin)
   └─> GET /api/analytics/export?format=csv
       └─> Backend (Analytics Service)
           └─> Query database
           └─> Generate CSV/PDF
           └─> Return file
               └─> Dashboard downloads file
```

---

## 🗄️ Database Schema Relationships

```
User (1) ──────────────────────────── (N) Order
  │                                      │
  │                                      ├─ (1) ──────────── (N) OrderItem
  │                                      │                      │
  │                                      │                      └─ (N) ──────────── (1) Product
  │                                      │
  │                                      └─ (1) ──────────── (N) Payment
  │
  ├─ (1) ──────────── (N) Review
  │                      │
  │                      └─ (N) ──────────── (1) Product
  │
  ├─ (1) ──────────── (N) Message
  │
  ├─ (1) ──────────── (N) Booking
  │                      │
  │                      └─ (N) ──────────── (1) Service
  │                      │
  │                      └─ (N) ──────────── (1) Technician
  │
  ├─ (1) ──────────── (N) Wishlist
  │                      │
  │                      └─ (N) ──────────── (1) Product
  │
  └─ (1) ──────────── (N) SupportTicket

Product (1) ──────────────────────── (1) Inventory
  │
  ├─ (N) ──────────── (N) Category
  │
  ├─ (N) ──────────── (N) Promotion
  │
  ├─ (1) ──────────── (N) Review
  │
  └─ (1) ──────────── (N) OrderItem

Promotion (N) ──────────────────────── (N) Product
  │
  └─ (N) ──────────── (N) Order

Service (1) ──────────────────────── (N) Booking
  │
  └─ (1) ──────────── (N) ServiceType

Technician (1) ──────────────────────── (N) Booking
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTH FLOW                                    │
└─────────────────────────────────────────────────────────────────┘

1. LOGIN
   Frontend (Customer/Admin)
   └─> POST /api/auth/login
       ├─ email
       └─ password
           └─> Backend (Auth Service)
               └─> Validate credentials
               └─> Generate JWT token
               └─> Return token + user data
                   └─> Frontend stores token
                   └─> Redirect to dashboard/home

2. AUTHENTICATED REQUEST
   Frontend/Dashboard
   └─> GET /api/protected-endpoint
       ├─ Header: Authorization: Bearer <token>
           └─> Backend (Auth Guard)
               └─> Validate token
               └─> Extract user info
               └─> Check permissions
               └─> Allow/Deny request
                   └─> Return response/error

3. ADMIN ONLY ENDPOINT
   Dashboard (Admin)
   └─> PATCH /api/orders/:id/status/:status
       ├─ Header: Authorization: Bearer <token>
           └─> Backend (AdminOrKeyGuard)
               └─> Validate token
               └─> Check user role
               └─> Verify admin role
               └─> Allow/Deny request
                   └─> Return response/error

4. REFRESH TOKEN
   Frontend/Dashboard
   └─> POST /api/auth/refresh
       ├─ refreshToken
           └─> Backend (Auth Service)
               └─> Validate refresh token
               └─> Generate new access token
               └─> Return new token
                   └─> Frontend updates token

5. LOGOUT
   Frontend/Dashboard
   └─> POST /api/auth/logout
       └─> Backend (Auth Service)
           └─> Invalidate token
           └─> Clear session
               └─> Frontend clears token
               └─> Redirect to login
```

---

## 📡 API Communication Patterns

### Request/Response Pattern

```typescript
// Frontend Request
fetch('/api/products', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  }
})

// Backend Response
{
  success: true,
  data: [...],
  message: 'Products retrieved successfully',
  pagination: {
    page: 1,
    pageSize: 20,
    total: 100
  }
}
```

### Error Handling Pattern

```typescript
// Backend Error Response
{
  success: false,
  error: 'INVALID_REQUEST',
  message: 'Product not found',
  statusCode: 404,
  details: {
    productId: 'invalid-id'
  }
}

// Frontend Error Handling
try {
  const response = await fetch('/api/products/:id')
  const data = await response.json()
  
  if (!data.success) {
    showError(data.message)
  } else {
    displayProduct(data.data)
  }
} catch (error) {
  showError('Network error')
}
```

---

## 🔄 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING LAYERS                               │
└─────────────────────────────────────────────────────────────────┘

Frontend (React Query)
├─ Cache API responses
├─ Automatic refetch
├─ Stale-while-revalidate
└─ Manual invalidation

Backend (Redis)
├─ Cache product data
├─ Cache category data
├─ Cache user sessions
├─ Cache search results
└─ TTL-based expiration

Database (PostgreSQL)
└─ Persistent storage
```

---

## 📊 Data Synchronization

### Real-time Sync
```
Database Change
  └─> Trigger/Event
      └─> Backend Service
          └─> Emit WebSocket event
              ├─> Dashboard (Admin)
              │   └─> Update UI
              └─> Frontend (Customer)
                  └─> Update UI
```

### Batch Sync
```
Frontend
  └─> Queue changes
      └─> Batch request
          └─> Backend
              └─> Process batch
              └─> Update database
              └─> Return results
                  └─> Frontend sync
```

---

## 🚀 Performance Optimization

### Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- CSS optimization
- React Query caching

### Backend Optimization
- Database indexing
- Query optimization
- Redis caching
- Pagination
- Compression

### Network Optimization
- CDN for static assets
- Gzip compression
- HTTP/2
- Caching headers
- Request batching

---

## 🔒 Security Measures

### Data Protection
- JWT authentication
- API key validation
- HTTPS encryption
- CORS configuration
- Rate limiting

### Input Validation
- Request validation
- SQL injection prevention
- XSS prevention
- CSRF protection
- File upload validation

### Authorization
- Role-based access control
- Permission checking
- Admin guard
- User isolation
- Audit logging
