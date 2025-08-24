# Backend Flow Diagram - Audio Tài Lộc

## 📋 Mục lục
1. [Authentication Flow](#authentication-flow)
2. [E-commerce Flow](#e-commerce-flow)
3. [Chat System Flow](#chat-system-flow)
4. [Search System Flow](#search-system-flow)
5. [Notification System Flow](#notification-system-flow)
6. [Payment Processing Flow](#payment-processing-flow)
7. [Inventory Management Flow](#inventory-management-flow)
8. [AI Integration Flow](#ai-integration-flow)

---

## 🔐 Authentication Flow

```mermaid
graph TD
    A[User Request] --> B{Method?}
    
    B -->|Register| C[Validate Input]
    B -->|Login| D[Check Account Lock]
    B -->|Refresh| E[Validate Refresh Token]
    
    C --> F[Check Email Exists]
    F -->|No| G[Hash Password]
    F -->|Yes| H[Return Error]
    
    G --> I[Create User]
    I --> J[Send Welcome Email]
    J --> K[Return User Data]
    
    D --> L{Account Locked?}
    L -->|Yes| M[Return Lock Error]
    L -->|No| N[Verify Credentials]
    
    N --> O{Valid?}
    O -->|Yes| P[Record Success]
    O -->|No| Q[Record Failure]
    
    P --> R[Generate Tokens]
    Q --> S[Check Lockout]
    
    R --> T[Return Tokens]
    S --> U{Should Lock?}
    U -->|Yes| V[Lock Account]
    U -->|No| W[Return Error]
    
    E --> X{Valid Token?}
    X -->|Yes| Y[Generate New Tokens]
    X -->|No| Z[Return Error]
    
    Y --> T
```

### Chi tiết Authentication:

1. **Registration Process**
   - Validate email format và password strength
   - Check email uniqueness
   - Hash password với bcrypt (salt rounds: 12)
   - Create user record
   - Send welcome email

2. **Login Process**
   - Check account lockout status
   - Verify credentials
   - Track login attempts
   - Generate JWT tokens (access + refresh)
   - Update last login time

3. **Security Features**
   - Account lockout sau 5 lần thất bại
   - Rate limiting: 3 requests/minute cho register, 5 cho login
   - JWT token expiration: 15 phút (access), 7 ngày (refresh)

---

## 🛒 E-commerce Flow

```mermaid
graph TD
    A[Customer Browse] --> B[Search Products]
    B --> C[View Product Details]
    C --> D[Add to Cart]
    
    D --> E{User Logged In?}
    E -->|Yes| F[User Cart]
    E -->|No| G[Guest Cart]
    
    F --> H[Check Stock]
    G --> H
    
    H --> I{Stock Available?}
    I -->|Yes| J[Reserve Stock]
    I -->|No| K[Return Error]
    
    J --> L[Add to Cart]
    L --> M[Update Cart Total]
    
    M --> N[Proceed to Checkout]
    N --> O[Validate Cart Items]
    
    O --> P{Valid?}
    P -->|Yes| Q[Calculate Totals]
    P -->|No| R[Return Error]
    
    Q --> S[Apply Promotions]
    S --> T[Select Payment Method]
    
    T --> U[Create Order]
    U --> V[Process Payment]
    
    V --> W{Payment Success?}
    W -->|Yes| X[Update Inventory]
    W -->|No| Y[Release Reserved Stock]
    
    X --> Z[Send Confirmation]
    Y --> AA[Return Error]
    
    Z --> BB[Order Fulfillment]
```

### Chi tiết E-commerce:

1. **Product Browsing**
   - Search với AI enhancement
   - Filter by category, price, availability
   - Pagination và sorting
   - Cache product listings

2. **Cart Management**
   - Guest cart với session storage
   - User cart với database persistence
   - Stock reservation khi add to cart
   - Real-time price updates

3. **Checkout Process**
   - Address validation
   - Payment method selection
   - Order creation với atomic transaction
   - Inventory update sau payment success

---

## 💬 Chat System Flow

```mermaid
graph TD
    A[User Opens Chat] --> B[Create/Join Session]
    B --> C[WebSocket Connection]
    
    C --> D[Authenticate User]
    D --> E{Valid Token?}
    E -->|Yes| F[Join Chat Room]
    E -->|No| G[Guest Session]
    
    F --> H[Load Chat History]
    G --> H
    
    H --> I[User Sends Message]
    I --> J[Save to Database]
    
    J --> K[Broadcast to Room]
    K --> L[AI Processing]
    
    L --> M{AI Available?}
    M -->|Yes| N[Generate AI Response]
    M -->|No| O[Fallback Response]
    
    N --> P[Save AI Response]
    O --> P
    
    P --> Q[Broadcast AI Response]
    Q --> R[Update Session Status]
    
    R --> S{Need Escalation?}
    S -->|Yes| T[Escalate to Staff]
    S -->|No| U[Continue Chat]
    
    T --> V[Notify Staff]
    U --> W[Continue Session]
```

### Chi tiết Chat System:

1. **Session Management**
   - Auto-create session cho guest users
   - Persistent sessions cho logged-in users
   - Session status: OPEN, ESCALATED, CLOSED
   - Session analytics và metrics

2. **AI Integration**
   - Automatic response generation
   - Context awareness từ chat history
   - Product recommendations
   - Fallback khi AI unavailable

3. **Real-time Features**
   - WebSocket connection
   - Typing indicators
   - Message delivery status
   - File sharing support

---

## 🔍 Search System Flow

```mermaid
graph TD
    A[User Search Query] --> B[Check Cache]
    B --> C{Cache Hit?}
    
    C -->|Yes| D[Return Cached Results]
    C -->|No| E[Process Query]
    
    E --> F{Query Length > 10?}
    F -->|Yes| G[AI Enhancement]
    F -->|No| H[Direct Search]
    
    G --> I[Generate Keywords]
    I --> J[Semantic Search]
    H --> K[Text Search]
    
    J --> L[Merge Results]
    K --> L
    
    L --> M[Apply Filters]
    M --> N[Sort Results]
    
    N --> O[Paginate Results]
    O --> P[Cache Results]
    
    P --> Q[Return Results]
    D --> Q
    
    Q --> R[Log Search]
    R --> S[Update Analytics]
```

### Chi tiết Search System:

1. **Query Processing**
   - Input validation và sanitization
   - AI keyword expansion cho queries dài
   - Semantic search với embeddings
   - Multi-language support

2. **Result Optimization**
   - Relevance scoring
   - Filtering by category, price, availability
   - Sorting options: relevance, price, date
   - Pagination với configurable page size

3. **Performance Features**
   - Redis caching với TTL
   - Database query optimization
   - Search analytics tracking
   - Result ranking improvements

---

## 🔔 Notification System Flow

```mermaid
graph TD
    A[Event Triggered] --> B[Determine Notification Type]
    B --> C[Create Notification]
    
    C --> D[Save to Database]
    D --> E[Check User Online]
    
    E --> F{User Online?}
    F -->|Yes| G[Send WebSocket]
    F -->|No| H[Queue for Later]
    
    G --> I[Deliver Real-time]
    H --> J[Email/SMS Fallback]
    
    I --> K[Mark as Delivered]
    J --> L[Update Status]
    
    K --> M[User Reads]
    L --> M
    
    M --> N[Mark as Read]
    N --> O[Update Analytics]
    
    O --> P[Cleanup Old Notifications]
```

### Chi tiết Notification System:

1. **Notification Types**
   - Order updates (confirmation, status changes)
   - Payment confirmations
   - Chat messages
   - System alerts
   - Promotional notifications

2. **Delivery Channels**
   - WebSocket (real-time)
   - Email (fallback)
   - SMS (optional)
   - Push notifications (future)

3. **Management Features**
   - Read/unread tracking
   - Notification preferences
   - Bulk operations
   - Analytics và reporting

---

## 💳 Payment Processing Flow

```mermaid
graph TD
    A[Payment Request] --> B[Validate Order]
    B --> C[Create Payment Intent]
    
    C --> D[Select Payment Method]
    D --> E{Method?}
    
    E -->|MOMO| F[MOMO Payment]
    E -->|PayOS| G[PayOS Payment]
    E -->|VNPay| H[VNPay Payment]
    
    F --> I[Redirect to MOMO]
    G --> J[Redirect to PayOS]
    H --> K[Redirect to VNPay]
    
    I --> L[User Payment]
    J --> L
    K --> L
    
    L --> M[Payment Gateway Response]
    M --> N[Webhook Processing]
    
    N --> O[Validate Signature]
    O --> P{Valid?}
    
    P -->|Yes| Q[Update Order Status]
    P -->|No| R[Log Error]
    
    Q --> S[Update Inventory]
    S --> T[Send Confirmation]
    
    T --> U[Notification]
    R --> V[Manual Review]
```

### Chi tiết Payment Processing:

1. **Payment Methods**
   - MOMO (mobile money)
   - PayOS (bank transfer)
   - VNPay (credit card)
   - Cash on delivery

2. **Security Features**
   - Webhook signature validation
   - Payment intent tracking
   - Duplicate payment prevention
   - Fraud detection

3. **Error Handling**
   - Payment failure recovery
   - Order status rollback
   - Manual review process
   - Customer notification

---

## 📦 Inventory Management Flow

```mermaid
graph TD
    A[Product Action] --> B{Action Type?}
    
    B -->|Add to Cart| C[Check Available Stock]
    B -->|Purchase| D[Check Reserved Stock]
    B -->|Restock| E[Update Stock]
    
    C --> F{Stock > 0?}
    F -->|Yes| G[Reserve Stock]
    F -->|No| H[Return Out of Stock]
    
    G --> I[Update Reserved Count]
    I --> J[Continue Process]
    
    D --> K{Reserved >= Quantity?}
    K -->|Yes| L[Decrement Stock & Reserved]
    K -->|No| M[Return Error]
    
    L --> N[Update Inventory]
    N --> O[Log Transaction]
    
    E --> P[Add Stock]
    P --> Q[Update Available]
    Q --> R[Notify Low Stock]
```

### Chi tiết Inventory Management:

1. **Stock Tracking**
   - Available stock (actual inventory)
   - Reserved stock (in carts)
   - Low stock alerts
   - Stock movement history

2. **Reservation System**
   - Auto-reserve khi add to cart
   - Release reservation khi remove
   - Timeout reservations
   - Prevent overselling

3. **Monitoring**
   - Real-time stock updates
   - Low stock notifications
   - Stock movement analytics
   - Inventory value tracking

---

## 🤖 AI Integration Flow

```mermaid
graph TD
    A[AI Request] --> B{Request Type?}
    
    B -->|Chat| C[Process Chat Message]
    B -->|Search| D[Enhance Search Query]
    B -->|Recommendations| E[Generate Recommendations]
    
    C --> F[Load Context]
    F --> G[Generate Response]
    G --> H[Save Response]
    
    D --> I[Extract Keywords]
    I --> J[Expand Query]
    J --> K[Return Enhanced Query]
    
    E --> L[Analyze User Behavior]
    L --> M[Find Similar Products]
    M --> N[Rank Recommendations]
    
    H --> O[Return to User]
    K --> P[Use in Search]
    N --> Q[Display to User]
    
    O --> R[Log Interaction]
    P --> R
    Q --> R
    
    R --> S[Update AI Model]
```

### Chi tiết AI Integration:

1. **Chat AI**
   - Context-aware responses
   - Product knowledge integration
   - Multi-language support
   - Sentiment analysis

2. **Search Enhancement**
   - Query expansion
   - Semantic understanding
   - Related terms generation
   - Search result ranking

3. **Recommendations**
   - Collaborative filtering
   - Content-based filtering
   - Real-time personalization
   - A/B testing support

---

## 🔄 System Integration Flow

```mermaid
graph TD
    A[User Action] --> B[API Gateway]
    B --> C[Authentication]
    
    C --> D{Authenticated?}
    D -->|Yes| E[Route to Service]
    D -->|No| F[Return 401]
    
    E --> G[Service Processing]
    G --> H[Database Operations]
    
    H --> I[Cache Updates]
    I --> J[Event Emission]
    
    J --> K[Notification Service]
    K --> L[Real-time Updates]
    
    L --> M[WebSocket Broadcasting]
    M --> N[Client Updates]
    
    H --> O[Analytics Logging]
    O --> P[Performance Monitoring]
    
    P --> Q[Health Checks]
    Q --> R[System Alerts]
```

### Chi tiết System Integration:

1. **Request Flow**
   - API Gateway routing
   - Rate limiting
   - Request validation
   - Response transformation

2. **Data Flow**
   - Database transactions
   - Cache synchronization
   - Event-driven architecture
   - Real-time updates

3. **Monitoring**
   - Health checks
   - Performance metrics
   - Error tracking
   - System alerts

---

## 📊 Performance Metrics

### Response Times
- **API Endpoints**: < 200ms
- **Database Queries**: < 100ms
- **Cache Hits**: < 10ms
- **WebSocket Messages**: < 50ms

### Throughput
- **Concurrent Users**: 1000+
- **Requests/Second**: 500+
- **WebSocket Connections**: 500+
- **Database Connections**: 50+

### Availability
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%
- **Recovery Time**: < 5 minutes
- **Backup Frequency**: Daily

---

## 🛡️ Security Measures

### Authentication
- JWT tokens với expiration
- Refresh token rotation
- Account lockout protection
- Rate limiting

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

### Infrastructure
- HTTPS enforcement
- CORS configuration
- Security headers
- Environment isolation

---

*Flow diagrams generated for Audio Tài Lộc Backend System*
*Last updated: ${new Date().toISOString()}*
