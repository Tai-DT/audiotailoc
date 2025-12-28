# Audio Tài Lộc - Visual Flow Diagrams

## 1. Tổng quan hệ thống (System Overview)

```mermaid
graph TB
    subgraph "Clients"
        FE[🖥️ Frontend<br/>Port 3000<br/>Khách hàng]
        DASH[📊 Dashboard<br/>Port 3001<br/>Admin]
    end

    subgraph "Backend Services"
        API[🔧 NestJS API<br/>Port 3010]
        subgraph "Modules"
            PROD[Products]
            SERV[Services]
            ORD[Orders]
            BOOK[Bookings]
            AUTH[Auth]
        end
    end

    subgraph "Database"
        DB[(PostgreSQL)]
    end

    subgraph "External Services"
        CLOUD[☁️ Cloudinary<br/>Images]
        EMAIL[📧 Email Service]
    end

    FE -->|REST API| API
    DASH -->|REST API + API Key| API
    API --> DB
    FE -->|Upload| CLOUD
    DASH -->|Upload| CLOUD
    API -->|Notifications| EMAIL
```

## 2. Luồng tạo sản phẩm (Product Creation Flow)

```mermaid
sequenceDiagram
    participant Admin as 👤 Admin
    participant Dash as 📊 Dashboard
    participant Cloud as ☁️ Cloudinary
    participant API as 🔧 Backend
    participant DB as 💾 Database

    Admin->>Dash: 1. Mở form tạo sản phẩm
    Admin->>Dash: 2. Chọn ảnh sản phẩm
    Dash->>Cloud: 3. Upload ảnh
    Cloud-->>Dash: 4. Return image URLs
    
    Admin->>Dash: 5. Điền thông tin & Submit
    Dash->>API: 6. POST /products
    Note over API: Validate data<br/>Transform images[] → JSON
    API->>DB: 7. INSERT INTO products
    DB-->>API: 8. Product created
    API-->>Dash: 9. Success response
    Dash-->>Admin: 10. Hiển thị thông báo thành công
```

## 3. Luồng đặt hàng (Order Flow)

```mermaid
sequenceDiagram
    participant User as 👤 Khách hàng
    participant FE as 🖥️ Frontend
    participant API as 🔧 Backend
    participant DB as 💾 Database

    User->>FE: 1. Thêm vào giỏ hàng
    Note over FE: Lưu vào localStorage
    
    User->>FE: 2. Nhấn Thanh toán
    FE->>API: 3. POST /orders
    Note over API: Validate items<br/>Check stock<br/>Calculate total
    
    API->>DB: 4. BEGIN TRANSACTION
    API->>DB: INSERT orders
    API->>DB: INSERT order_items
    API->>DB: UPDATE products (stock)
    API->>DB: COMMIT
    
    DB-->>API: 5. Order created
    API-->>FE: 6. Return order details
    FE-->>User: 7. Hiển thị xác nhận đơn hàng
```

## 4. Luồng đặt lịch dịch vụ (Service Booking Flow)

```mermaid
flowchart TD
    A[👤 Khách hàng] --> B{Đã đăng nhập?}
    
    B -->|Có| C[POST /bookings]
    B -->|Không| D[POST /bookings/guest]
    
    C --> E[Body: serviceId, userId, scheduledDate]
    D --> F[Body: serviceId, customerName,<br/>customerPhone, customerEmail,<br/>scheduledDate]
    
    E --> G[🔧 Backend validates]
    F --> G
    
    G --> H[💾 INSERT INTO service_bookings]
    H --> I[✅ Booking confirmed]
    I --> J[📧 Send confirmation email]
```

## 5. Luồng xác thực (Authentication Flow)

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant FE as 🖥️ Frontend
    participant API as 🔧 Backend
    participant DB as 💾 Database

    User->>FE: 1. Nhập email & password
    FE->>API: 2. POST /auth/login
    
    API->>DB: 3. SELECT user WHERE email
    DB-->>API: 4. Return user
    
    Note over API: 5. Verify password (bcrypt)<br/>6. Generate JWT
    
    API-->>FE: 7. { accessToken, user }
    
    Note over FE: 8. Store token<br/>Set Authorization header
    
    FE-->>User: 9. Redirect to dashboard
```

## 6. Luồng upload ảnh (Image Upload Flow)

```mermaid
flowchart LR
    A[📁 Select File] --> B{Validate}
    B -->|Invalid| C[❌ Show Error]
    B -->|Valid| D[🔧 Dashboard API]
    
    D --> E[Generate Signature]
    E --> F[☁️ Upload to Cloudinary]
    F --> G[Return URL]
    G --> H[✅ Display Preview]
    H --> I[Use URL in Form]
```

## 7. Dashboard Admin Flow

```mermaid
flowchart TB
    subgraph "Dashboard Pages"
        HOME[🏠 Dashboard Home]
        PROD[📦 Quản lý Sản phẩm]
        SERV[🔧 Quản lý Dịch vụ]
        ORD[📋 Quản lý Đơn hàng]
        BOOK[📅 Quản lý Đặt lịch]
        REVIEW[⭐ Quản lý Reviews]
        USER[👥 Quản lý Users]
    end

    subgraph "API Calls"
        API_KEY[x-api-key: admin-key]
    end

    HOME --> PROD
    HOME --> SERV
    HOME --> ORD
    HOME --> BOOK
    HOME --> REVIEW
    HOME --> USER

    PROD -->|GET/POST/PUT/DELETE| API_KEY
    SERV -->|GET/POST/PUT/DELETE| API_KEY
    ORD -->|GET/PATCH| API_KEY
    BOOK -->|GET/PATCH| API_KEY
    REVIEW -->|GET/PATCH| API_KEY
    USER -->|GET/PATCH| API_KEY
```

## 8. Data Transformation Flow

```mermaid
flowchart LR
    subgraph "Frontend/Dashboard"
        A1[images: Array]
        A2[features: Array]
        A3[tags: Array]
    end

    subgraph "Backend Transform"
        B1[JSON.stringify]
    end

    subgraph "Database Storage"
        C1["images: 'JSON String'"]
        C2["features: 'JSON String'"]
        C3["tags: 'JSON String'"]
    end

    subgraph "Backend Parse"
        D1[JSON.parse]
    end

    subgraph "Response to Client"
        E1[images: Array]
        E2[features: Array]
        E3[tags: Array]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B1
    B1 --> C1
    B1 --> C2
    B1 --> C3
    C1 --> D1
    C2 --> D1
    C3 --> D1
    D1 --> E1
    D1 --> E2
    D1 --> E3
```

## 9. Error Handling Flow

```mermaid
flowchart TD
    A[Client Request] --> B[Backend API]
    B --> C{Validate Request}
    
    C -->|Invalid| D[400 Bad Request]
    C -->|Valid| E{Auth Check}
    
    E -->|Unauthorized| F[401 Unauthorized]
    E -->|Authorized| G{Process Request}
    
    G -->|Not Found| H[404 Not Found]
    G -->|Server Error| I[500 Internal Error]
    G -->|Success| J[200 OK / 201 Created]
    
    D --> K[Return Error Response]
    F --> K
    H --> K
    I --> K
    J --> L[Return Success Response]
```

## 10. Real-time Updates (Future Enhancement)

```mermaid
sequenceDiagram
    participant Admin as 📊 Dashboard
    participant WS as 🔌 WebSocket
    participant API as 🔧 Backend
    participant FE as 🖥️ Frontend

    Admin->>API: Update order status
    API->>WS: Emit: order_updated
    WS->>FE: Push: order_updated
    FE->>FE: Update UI in real-time
```

---

## Summary Tables

### API Authorization Matrix

| Endpoint | Guest | User | Admin |
|----------|-------|------|-------|
| GET /products | ✅ | ✅ | ✅ |
| POST /products | ❌ | ❌ | ✅ |
| GET /orders | ❌ | Own | All |
| POST /orders | ✅ | ✅ | ✅ |
| POST /bookings/guest | ✅ | ✅ | ✅ |
| GET /bookings | ❌ | Own | All |

### Status Flow

| Entity | Status Flow |
|--------|-------------|
| Order | `pending` → `confirmed` → `processing` → `shipped` → `delivered` |
| Booking | `pending` → `confirmed` → `completed` / `cancelled` |
| Review | `pending` → `approved` / `rejected` |
| Product | `draft` → `active` / `inactive` |

---

*Diagrams created with Mermaid.js*
*To view these diagrams, use a Markdown viewer that supports Mermaid*
