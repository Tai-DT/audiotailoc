# 🏗️ Sơ Đồ Kiến Trúc - Audio Tài Lộc

## 📊 Sơ Đồ Tổng Quan Hệ Thống

```mermaid
graph TB
    subgraph "Frontend Applications"
        A[Frontend - React/Next.js]
        B[Dashboard - React/Next.js]
    end
    
    subgraph "Backend API"
        C[Authentication API]
        D[Product API]
        E[Order API]
        F[Payment API]
        G[Service API]
        H[Chat API]
        I[Analytics API]
        J[System API]
    end
    
    subgraph "External Services"
        K[Payment Gateways]
        L[Email Service]
        M[File Storage]
        N[AI Service]
        O[Maps Service]
        P[Search Engine]
    end
    
    subgraph "Database & Cache"
        Q[PostgreSQL]
        R[Redis Cache]
        S[Meilisearch]
    end
    
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    A --> H
    
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    B --> J
    
    F --> K
    H --> L
    D --> M
    H --> N
    A --> O
    A --> P
    
    C --> Q
    D --> Q
    E --> Q
    F --> Q
    G --> Q
    H --> Q
    I --> Q
    J --> Q
    
    C --> R
    D --> R
    E --> R
    F --> R
    G --> R
    H --> R
    I --> R
    J --> R
    
    P --> S
```

## 🎨 Sơ Đồ Kiến Trúc Frontend

```mermaid
graph TB
    subgraph "Frontend Architecture"
        subgraph "Public Pages"
            A1[Homepage]
            A2[Product Catalog]
            A3[Product Details]
            A4[Service Listing]
            A5[Service Details]
            A6[Content Pages]
            A7[Portfolio/Projects]
        end
        
        subgraph "User Portal"
            B1[Authentication]
            B2[Shopping Cart]
            B3[Order Management]
            B4[Booking Management]
            B5[User Profile]
        end
        
        subgraph "Interactive Features"
            C1[Live Chat]
            C2[Search Engine]
            C3[Maps Integration]
            C4[Notifications]
            C5[AI Chat Assistant]
        end
        
        subgraph "Shared Components"
            D1[Navigation]
            D2[Footer]
            D3[Forms]
            D4[UI Components]
            D5[Loading States]
        end
    end
    
    A1 --> D1
    A2 --> D1
    A3 --> D1
    A4 --> D1
    A5 --> D1
    A6 --> D1
    A7 --> D1
    
    B1 --> D3
    B2 --> D3
    B3 --> D3
    B4 --> D3
    B5 --> D3
    
    C1 --> D4
    C2 --> D4
    C3 --> D4
    C4 --> D4
    C5 --> D4
    
    D1 --> D2
    D3 --> D5
    D4 --> D5
```

## 🖥️ Sơ Đồ Kiến Trúc Dashboard

```mermaid
graph TB
    subgraph "Dashboard Architecture"
        subgraph "Overview & Analytics"
            A1[Dashboard Overview]
            A2[Sales Analytics]
            A3[Customer Analytics]
            A4[Product Analytics]
            A5[Performance Metrics]
        end
        
        subgraph "Management Modules"
            B1[User Management]
            B2[Product Management]
            B3[Order Management]
            B4[Service Management]
            B5[Technician Management]
        end
        
        subgraph "Content Management"
            C1[Page Management]
            C2[Media Management]
            C3[SEO Management]
            C4[Translation Management]
        end
        
        subgraph "System Management"
            D1[Configuration]
            D2[Health Monitoring]
            D3[Backup Management]
            D4[Log Management]
            D5[Maintenance Mode]
        end
        
        subgraph "Communication"
            E1[Chat Management]
            E2[Notification System]
            E3[Customer Support]
            E4[Email Campaigns]
        end
    end
    
    A1 --> A2
    A1 --> A3
    A1 --> A4
    A1 --> A5
    
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    
    C1 --> C2
    C2 --> C3
    C3 --> C4
    
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> D5
    
    E1 --> E2
    E2 --> E3
    E3 --> E4
```

## 🔄 Sơ Đồ Luồng Dữ Liệu

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant D as Database
    participant C as Cache
    participant E as External Services
    
    U->>F: Access Frontend
    F->>B: GET /catalog/products
    B->>C: Check cache
    alt Cache hit
        C->>B: Return cached data
    else Cache miss
        B->>D: Query products
        D->>B: Return products
        B->>C: Store in cache
    end
    B->>F: Return products
    F->>U: Display products
    
    U->>F: Add to cart
    F->>B: POST /cart/user/items
    B->>D: Update cart
    D->>B: Confirm update
    B->>F: Return cart
    F->>U: Update cart display
    
    U->>F: Checkout
    F->>B: POST /checkout/create-order
    B->>D: Create order
    B->>E: Create payment intent
    E->>B: Return payment URL
    B->>F: Return payment info
    F->>U: Redirect to payment
```

## 🔐 Sơ Đồ Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant D as Database
    
    U->>F: Login form
    F->>B: POST /auth/login
    B->>D: Verify credentials
    D->>B: User data
    B->>B: Generate JWT tokens
    B->>F: Return tokens
    F->>F: Store tokens
    F->>U: Redirect to dashboard
    
    U->>F: Access protected route
    F->>F: Check token validity
    alt Token valid
        F->>U: Allow access
    else Token expired
        F->>B: POST /auth/refresh
        B->>B: Verify refresh token
        B->>F: New access token
        F->>U: Allow access
    else Token invalid
        F->>U: Redirect to login
    end
```

## 🛒 Sơ Đồ Shopping Cart Flow

```mermaid
flowchart TD
    A[User browses products] --> B{User logged in?}
    B -->|Yes| C[Add to user cart]
    B -->|No| D[Add to guest cart]
    
    C --> E[POST /cart/user/items]
    D --> F[POST /cart/guest/:guestId/items]
    
    E --> G[Update user cart in DB]
    F --> H[Update guest cart in cache]
    
    G --> I[Return updated cart]
    H --> I
    
    I --> J[Display cart summary]
    J --> K{Proceed to checkout?}
    
    K -->|Yes| L[Checkout process]
    K -->|No| A
    
    L --> M{User logged in?}
    M -->|Yes| N[Use user cart]
    M -->|No| O[Convert guest to user cart]
    
    N --> P[Create order]
    O --> P
    P --> Q[Payment processing]
    Q --> R[Order confirmation]
```

## 📊 Sơ Đồ Analytics Dashboard

```mermaid
graph LR
    subgraph "Data Sources"
        A1[Orders]
        A2[Users]
        A3[Products]
        A4[Payments]
        A5[Bookings]
    end
    
    subgraph "Analytics Engine"
        B1[Data Processing]
        B2[Real-time Analytics]
        B3[Report Generation]
        B4[Alert System]
    end
    
    subgraph "Dashboard Views"
        C1[Sales Overview]
        C2[Customer Analytics]
        C3[Product Performance]
        C4[Revenue Trends]
        C5[System Health]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    A5 --> B1
    
    B1 --> B2
    B2 --> B3
    B3 --> B4
    
    B2 --> C1
    B2 --> C2
    B2 --> C3
    B2 --> C4
    B2 --> C5
```

## 🔧 Sơ Đồ System Architecture

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[NGINX Load Balancer]
    end
    
    subgraph "Application Layer"
        API1[API Server 1]
        API2[API Server 2]
        API3[API Server 3]
    end
    
    subgraph "Database Layer"
        DB1[(Primary DB)]
        DB2[(Replica DB)]
        DB3[(Replica DB)]
    end
    
    subgraph "Cache Layer"
        REDIS1[Redis Cache 1]
        REDIS2[Redis Cache 2]
    end
    
    subgraph "Storage Layer"
        STORAGE1[File Storage]
        STORAGE2[Backup Storage]
    end
    
    subgraph "External Services"
        EXT1[Payment Gateway]
        EXT2[Email Service]
        EXT3[AI Service]
        EXT4[Maps Service]
    end
    
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> DB1
    API2 --> DB1
    API3 --> DB1
    
    DB1 --> DB2
    DB1 --> DB3
    
    API1 --> REDIS1
    API2 --> REDIS1
    API3 --> REDIS1
    
    REDIS1 --> REDIS2
    
    API1 --> STORAGE1
    API2 --> STORAGE1
    API3 --> STORAGE1
    
    STORAGE1 --> STORAGE2
    
    API1 --> EXT1
    API1 --> EXT2
    API1 --> EXT3
    API1 --> EXT4
```

## 🚀 Sơ Đồ Deployment Pipeline

```mermaid
graph LR
    subgraph "Development"
        A1[Code Development]
        A2[Unit Testing]
        A3[Code Review]
    end
    
    subgraph "CI/CD Pipeline"
        B1[Build Process]
        B2[Integration Testing]
        B3[Security Scan]
        B4[Performance Testing]
    end
    
    subgraph "Staging"
        C1[Staging Deployment]
        C2[QA Testing]
        C3[User Acceptance]
    end
    
    subgraph "Production"
        D1[Production Deployment]
        D2[Health Monitoring]
        D3[Performance Monitoring]
        D4[Error Tracking]
    end
    
    A1 --> A2
    A2 --> A3
    A3 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D1
    D1 --> D2
    D2 --> D3
    D3 --> D4
```

---

## 📋 Sử Dụng Sơ Đồ

### Để xem sơ đồ trong GitHub:
1. Mở file `.md` trong GitHub
2. Sơ đồ Mermaid sẽ tự động render

### Để xem sơ đồ trong VS Code:
1. Cài đặt extension "Mermaid Preview"
2. Mở file `.md`
3. Sử dụng command "Mermaid: Open Preview"

### Để export sơ đồ:
1. Sử dụng Mermaid CLI
2. Export thành PNG, SVG, hoặc PDF
3. Sử dụng trong documentation

---

*Các sơ đồ này cung cấp cái nhìn trực quan về kiến trúc hệ thống Audio Tài Lộc.*


