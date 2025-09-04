# Audio Tài Lộc Admin Dashboard

A comprehensive, enterprise-grade admin dashboard for managing the Audio Tài Lộc e-commerce platform with real-time monitoring, advanced management features, and professional UI/UX.

## 🚀 Features Overview

### ✅ **Core Dashboard Features**
- **Modern React/Next.js Architecture** - App Router, TypeScript, Tailwind CSS
- **Real-time Data Updates** - WebSocket integration for live metrics
- **Responsive Design** - Mobile-first, tablet, and desktop optimized
- **Dark/Light Mode** - System preference detection with manual toggle
- **Professional UI** - Clean, modern interface with Framer Motion animations
- **Role-based Access** - Admin, manager, and user permission levels

### ✅ **Management Modules**

#### 📊 **Overview Dashboard**
- System health indicators
- Key performance metrics
- Recent activities feed
- Quick action buttons
- Real-time notifications

#### 🔍 **Monitoring & Analytics**
- **Performance Monitoring** - CPU, Memory, Response Time charts
- **System Health** - Service status, uptime, resource usage
- **Real-time Metrics** - Live data updates every 5 seconds
- **Historical Data** - 1h, 6h, 24h time range selection

#### 📚 **API Documentation**
- **Interactive Swagger UI** - Multi-version API docs (v1, v1.1, v2)
- **Version Management** - Side-by-side version comparison
- **Testing Interface** - Built-in API testing tools
- **Documentation Search** - Quick endpoint lookup

#### 🔄 **Backup & Recovery**
- **Automated Backups** - Schedule management and monitoring
- **Point-in-Time Recovery** - Restore to specific timestamps
- **Backup Analytics** - Success rates, storage usage, history
- **Cross-region Support** - Multi-location backup management

#### 👥 **User Management**
- **User Database** - View, search, filter users
- **User Analytics** - Registration trends, activity metrics
- **Role Management** - Admin, user, manager permissions
- **User Actions** - Edit, suspend, delete users
- **Security Features** - Login history, password management

#### 📦 **Product Management**
- **Product Catalog** - Complete inventory management
- **Stock Monitoring** - Low stock alerts, out-of-stock tracking
- **Category Management** - Product organization and tagging
- **Product Analytics** - Sales performance, ratings, reviews
- **Bulk Operations** - Mass updates, imports, exports

#### 🛒 **Order Management**
- **Order Processing** - Complete order lifecycle management
- **Payment Tracking** - Payment status, gateway integration
- **Shipping Management** - Logistics and delivery tracking
- **Order Analytics** - Revenue trends, conversion rates
- **Customer Service** - Order modifications, refunds

#### 🔒 **Security Management**
- **Security Monitoring** - Real-time threat detection
- **Access Control** - User permissions and authentication
- **Security Events** - Failed logins, suspicious activities
- **IP Management** - Blacklist/whitelist management
- **Security Reports** - Compliance and audit reports

#### ⚙️ **System Management**
- **Service Monitoring** - Application and system services
- **Resource Usage** - CPU, memory, disk, network monitoring
- **Process Management** - Service start/stop/restart
- **System Logs** - Centralized logging and log analysis
- **Configuration** - System settings and environment management

## 🏗️ **Technical Architecture**

### **Frontend Stack**
```typescript
// Core Technologies
Next.js 14          // React framework with App Router
TypeScript          // Type-safe development
Tailwind CSS        // Utility-first CSS framework
Framer Motion       // Animation library

// Data Management
TanStack Query      // Data fetching and caching
SWR                 // React hooks for data fetching
Socket.io Client    // Real-time WebSocket communication

// UI Components
Headless UI         // Accessible UI components
Heroicons           // SVG icon library
Chart.js            // Data visualization
React Hot Toast     // Notification system
```

### **Component Architecture**
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Overview dashboard
│   ├── monitoring/        # System monitoring
│   ├── api-docs/          # API documentation viewer
│   ├── backup/            # Backup management
│   ├── users/             # User management
│   ├── products/          # Product management
│   ├── orders/            # Order management
│   ├── security/          # Security management
│   ├── system/            # System management
│   └── [other]/           # Additional pages
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   │   ├── Sidebar.tsx   # Navigation sidebar
│   │   ├── Header.tsx    # Top header with notifications
│   │   └── DashboardLayout.tsx
│   ├── dashboard/        # Dashboard widgets
│   │   ├── MetricCard.tsx
│   │   ├── PerformanceChart.tsx
│   │   ├── SystemHealth.tsx
│   │   └── RecentActivity.tsx
│   └── ui/               # Base UI components
├── contexts/             # React contexts
│   └── DashboardContext.tsx
├── providers/            # Provider components
│   ├── QueryProvider.tsx # TanStack Query provider
│   └── ThemeProvider.tsx # Theme management
├── hooks/                # Custom hooks
└── utils/                # Utility functions
```

## 🚀 **Getting Started**

### **Prerequisites**
```bash
Node.js 18+          # JavaScript runtime
npm 9+               # Package manager
Git                   # Version control
```

### **Installation**
```bash
# Clone repository
git clone https://github.com/audiotailoc/dashboard.git
cd dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment
nano .env.local
```

### **Environment Configuration**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v2
NEXT_PUBLIC_API_DOCS_URL=http://localhost:3001/docs/v2
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Features
ENABLE_REALTIME=true
ENABLE_NOTIFICATIONS=true
ENABLE_CHARTS=true
CHART_UPDATE_INTERVAL=5000

# Security
NODE_ENV=development
```

### **Development**
```bash
# Start development server
npm run dev

# Open dashboard
open http://localhost:3000

# View API endpoints
curl http://localhost:3001/api/v2/health
```

### **Production Build**
```bash
# Create production build
npm run build

# Start production server
npm start

# Or use PM2
pm2 start npm --name "audiotailoc-dashboard" -- start
```

## 📱 **Dashboard Pages**

### **Navigation Structure**
```
🏠 Overview          - System metrics and key indicators
📊 Monitoring       - Performance and system health
📚 API Docs         - Interactive API documentation
🔄 Backup           - Backup and recovery management
👥 Users            - User management and analytics
📦 Products         - Product catalog and inventory
🛒 Orders           - Order processing and tracking
🔒 Security         - Security monitoring and events
⚙️ System          - System services and resources
📝 Logs            - System logs and audit trails
```

### **Page Features**

#### **Overview Dashboard**
- Real-time system metrics
- Key performance indicators
- Recent activities timeline
- Quick action shortcuts
- Notification center

#### **Monitoring Pages**
- Performance charts (CPU, Memory, Network)
- System health indicators
- Service status monitoring
- Real-time metrics dashboard
- Historical data analysis

#### **Management Interfaces**
- **Users**: CRUD operations, role management, analytics
- **Products**: Inventory management, categories, analytics
- **Orders**: Order lifecycle, payment tracking, fulfillment
- **Security**: Threat monitoring, access control, reports
- **System**: Service management, resource monitoring, logs

## 🔧 **API Integration**

### **Backend Connection**
```typescript
// API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const API_DOCS_URL = process.env.NEXT_PUBLIC_API_DOCS_URL

// Example API calls
const fetchSystemHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/shutdown/health`)
  return response.json()
}

const fetchUsers = async (params) => {
  const query = new URLSearchParams(params)
  const response = await fetch(`${API_BASE_URL}/users?${query}`)
  return response.json()
}
```

### **Real-time Updates**
```typescript
// WebSocket connection for real-time data
import { io } from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_WS_URL)

socket.on('system-metrics', (data) => {
  // Update dashboard with real-time metrics
  updateMetrics(data)
})

socket.on('notification', (notification) => {
  // Show real-time notifications
  showNotification(notification)
})
```

### **Data Fetching**
```typescript
// Using TanStack Query for data management
import { useQuery, useMutation } from '@tanstack/react-query'

const { data: users, isLoading } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => fetchUsers(filters),
  refetchInterval: 30000, // Refetch every 30 seconds
})

const updateUser = useMutation({
  mutationFn: (userData) => updateUserAPI(userData),
  onSuccess: () => {
    // Invalidate and refetch users
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }
})
```

## 🎨 **UI/UX Features**

### **Design System**
- **Consistent Typography** - Inter font family
- **Color Scheme** - Professional blue/indigo palette
- **Spacing System** - 4px grid system
- **Component Library** - Reusable UI components

### **Interactive Elements**
- **Hover Effects** - Subtle animations on interaction
- **Loading States** - Skeleton screens and spinners
- **Error Boundaries** - Graceful error handling
- **Toast Notifications** - User feedback system

### **Responsive Design**
- **Mobile First** - Optimized for all screen sizes
- **Tablet Support** - Dedicated tablet layouts
- **Desktop Enhancement** - Full desktop experience

### **Accessibility**
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - ARIA labels and roles
- **Color Contrast** - WCAG compliant colors
- **Focus Management** - Proper focus indicators

## 📊 **Analytics & Reporting**

### **Built-in Analytics**
- **User Analytics** - Registration trends, activity metrics
- **Product Analytics** - Sales performance, popular items
- **Order Analytics** - Revenue trends, conversion rates
- **System Analytics** - Performance metrics, error rates

### **Custom Reports**
- **Date Range Selection** - Flexible time periods
- **Export Options** - PDF, Excel, CSV formats
- **Scheduled Reports** - Automated report generation
- **Dashboard Widgets** - Customizable metric cards

## 🔐 **Security Features**

### **Authentication & Authorization**
- **JWT Integration** - Secure token management
- **Role-based Access** - Admin, manager, user roles
- **Session Management** - Secure session handling
- **Password Policies** - Strong password requirements

### **Security Monitoring**
- **Real-time Alerts** - Suspicious activity detection
- **Audit Logs** - Complete user action tracking
- **IP Monitoring** - Geographic and IP-based analysis
- **Security Reports** - Compliance and vulnerability reports

## 🚀 **Deployment**

### **Docker Configuration**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### **Environment Setup**
```yaml
# docker-compose.yml
version: '3.8'
services:
  dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.audiotailoc.com/api/v2
      - NEXT_PUBLIC_API_DOCS_URL=https://api.audiotailoc.com/docs/v2
      - NEXT_PUBLIC_WS_URL=wss://api.audiotailoc.com
    depends_on:
      - api

  api:
    image: audiotaloc/api:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
```

### **Nginx Configuration**
```nginx
# nginx.conf
server {
    listen 80;
    server_name dashboard.audiotailoc.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API proxy for development
    location /api/ {
        proxy_pass https://api.audiotailoc.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📈 **Performance Optimization**

### **Code Splitting**
```typescript
// Dynamic imports for better performance
const MonitoringPage = dynamic(() => import('@/app/monitoring/page'), {
  loading: () => <div>Loading...</div>,
})

const UserManagement = dynamic(() => import('@/components/UserManagement'), {
  loading: () => <SkeletonLoader />,
})
```

### **Image Optimization**
```typescript
import Image from 'next/image'

<Image
  src="/dashboard-image.jpg"
  alt="Dashboard"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>
```

### **Caching Strategies**
```typescript
// API response caching
const { data } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => fetchUsers(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
})

// Static generation for static pages
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ]
}
```

## 🔧 **Customization**

### **Theme Customization**
```typescript
// Custom theme in tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-brand-color',
        secondary: '#your-secondary-color',
      },
      fontFamily: {
        sans: ['Your Font', 'Inter', 'system-ui'],
      },
    },
  },
}
```

### **Component Customization**
```typescript
// Custom metric card
const CustomMetricCard = ({ title, value, icon, trend }) => (
  <div className="custom-metric-card">
    <div className="icon">{icon}</div>
    <div className="content">
      <h3>{title}</h3>
      <p className="value">{value}</p>
      <span className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
        {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
      </span>
    </div>
  </div>
)
```

## 📚 **Documentation**

### **Built-in Help**
- **Interactive Tooltips** - Context-sensitive help
- **User Guides** - Step-by-step instructions
- **Video Tutorials** - Visual learning resources
- **FAQ Section** - Common questions and answers

### **Developer Resources**
- **API Documentation** - Complete API reference
- **SDK Documentation** - Integration guides
- **Webhook Documentation** - Event handling guides
- **Migration Guides** - Version upgrade instructions

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### **Development Guidelines**
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations
- Test on multiple browsers and devices
- Follow accessibility guidelines

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- **Documentation**: https://docs.audiotailoc.com/dashboard
- **Issues**: https://github.com/audiotailoc/dashboard/issues
- **Email**: support@audiotailoc.com

---

---

## 🔗 **Backend Integration Setup**

### **Đã tích hợp dữ liệu thật từ Backend API**

Dashboard này đã được cấu hình để kết nối và sử dụng dữ liệu trực tiếp từ backend Audio Tài Lộc.

#### **API Endpoints được sử dụng:**

```typescript
// Dashboard Stats
GET /api/v1/admin/dashboard          // Thống kê tổng quan
GET /api/v1/analytics/sales          // Dữ liệu bán hàng
GET /api/v1/analytics/products       // Phân tích sản phẩm
GET /api/v1/analytics/customers      // Phân tích khách hàng

// Products Management
GET /api/v1/catalog/products         // Danh sách sản phẩm
GET /api/v1/catalog/search           // Tìm kiếm sản phẩm
POST /api/v1/catalog/products        // Tạo sản phẩm
PATCH /api/v1/catalog/products/:id   // Cập nhật sản phẩm
DELETE /api/v1/catalog/products/:id  // Xóa sản phẩm

// Orders Management
GET /api/v1/orders                   // Danh sách đơn hàng
GET /api/v1/orders/:id               // Chi tiết đơn hàng
PATCH /api/v1/orders/:id/status/:status // Cập nhật trạng thái

// Users Management
GET /api/v1/admin/users              // Danh sách người dùng
GET /api/v1/auth/me                  // Thông tin user hiện tại
```

#### **Cách chạy với dữ liệu thật:**

##### **1. Docker Compose (Khuyến nghị)**
```bash
# Từ thư mục root của project
docker-compose up --build

# Services sẽ chạy trên:
# - Dashboard: http://localhost:3000
# - Backend API: http://localhost:3010
# - Database: localhost:5432
# - Redis: localhost:6379
# - Meilisearch: localhost:7700
```

##### **2. Chạy riêng lẻ**

**Bước 1: Khởi động Backend**
```bash
cd backend
npm install
npm run start:dev
# Backend sẽ chạy trên http://localhost:3010
```

**Bước 2: Cấu hình Dashboard**
```bash
cd dashboard
npm install
npm run setup  # Tạo file .env.local
```

**Bước 3: Khởi động Dashboard**
```bash
npm run dev
# Dashboard sẽ chạy trên http://localhost:3000
```

#### **Cấu hình Environment**

File `.env.local` đã được tạo với:

```bash
# API Configuration - UPDATED FOR BACKEND INTEGRATION
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3010

# Features
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_CHART_UPDATE_INTERVAL=5000

# Security
NEXT_PUBLIC_NODE_ENV=development

# Application
NEXT_PUBLIC_APP_NAME=Audio Tài Lộc Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### **Real-time Features**

Dashboard hỗ trợ real-time updates qua WebSocket:

```typescript
// WebSocket Events
socket.on('dashboard.update', (data) => {
  // Cập nhật dashboard stats
});

socket.on('order.created', (data) => {
  // Thông báo đơn hàng mới
});

socket.on('user.registered', (data) => {
  // Thông báo user mới
});
```

#### **Authentication**

- Sử dụng JWT token từ backend
- Tự động refresh token
- Role-based access control
- Secure cookie storage

### **🎯 Tính năng chính đã hoàn thành:**

✅ **Real API Integration** - Sử dụng dữ liệu thật từ backend
✅ **Real-time Updates** - WebSocket và live notifications
✅ **Interactive Charts** - Biểu đồ từ dữ liệu backend
✅ **Complete CRUD** - Đầy đủ chức năng quản lý
✅ **Error Handling** - Xử lý lỗi và loading states
✅ **Responsive Design** - Tối ưu cho mọi thiết bị
✅ **Security** - JWT auth và role-based access

### **🚨 Troubleshooting**

#### **Lỗi kết nối API**
```bash
# Kiểm tra backend
curl http://localhost:3010/api/v1/health

# Kiểm tra environment
cat dashboard/.env.local
```

#### **Lỗi WebSocket**
- Kiểm tra console browser
- Đảm bảo backend có WebSocket enabled
- Verify WebSocket URL trong .env.local

#### **Lỗi Authentication**
- Clear cookies và đăng nhập lại
- Kiểm tra JWT token validity
- Verify backend auth endpoints

### **📞 Support**

Nếu gặp vấn đề:
1. Kiểm tra browser console
2. Verify backend services đang chạy
3. Check environment configuration
4. Xem API docs tại http://localhost:3010/docs

---

**🎊 Dashboard Audio Tài Lộc đã sẵn sàng với dữ liệu thật từ backend!**