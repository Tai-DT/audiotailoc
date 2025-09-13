# Audio Tài Lộc - Frontend

Frontend của ứng dụng thương mại điện tử Audio Tài Lộc, được xây dựng với Next.js 15, TypeScript và Tailwind CSS.

## 🚀 Tính năng

### 🏠 Trang chủ
- Hero section với thông tin chính
- Sản phẩm nổi bật
- Dịch vụ chuyên nghiệp
- Dự án tiêu biểu
- Đánh giá khách hàng
- Newsletter đăng ký

### 🛍️ E-commerce
- Danh sách sản phẩm với bộ lọc nâng cao
- Chi tiết sản phẩm
- Giỏ hàng
- Đơn hàng
- Thanh toán

### 🔧 Dịch vụ
- Danh sách dịch vụ
- Đặt lịch dịch vụ
- Quản lý kỹ thuật viên

### 📊 Admin Dashboard
- Tổng quan dashboard
- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý khách hàng
- Analytics & Báo cáo
- Quản lý nội dung

## 🛠️ Tech Stack

- **Framework**: Next.js 15 với App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18.x trở lên
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### Cấu hình môi trường

Tạo file `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME="Audio Tài Lộc"
NEXT_PUBLIC_APP_DESCRIPTION="Thiết bị âm thanh chuyên nghiệp"

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Chạy ứng dụng

```bash
# Development
npm run dev
# hoặc
yarn dev

# Build production
npm run build
# hoặc
yarn build

# Start production
npm run start
# hoặc
yarn start
```

## 📁 Cấu trúc thư mục

```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── products/          # Product pages
│   ├── services/          # Service pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── admin/            # Admin dashboard components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   ├── providers/        # Context providers
│   └── ui/               # UI components (shadcn/ui)
├── lib/                   # Utilities and configurations
│   ├── api.ts            # API client configuration
│   ├── hooks/            # Custom React hooks
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔗 Kết nối Backend

Frontend được thiết kế để kết nối với backend API của Audio Tài Lộc:

- **Base URL**: `http://localhost:3010/api/v1` (development)
- **Production URL**: `https://backend-audiotailoc-f6b75c2cc1ea.herokuapp.com/api/v1`

### API Endpoints chính:

- **Products**: `/catalog/products`
- **Categories**: `/catalog/categories`
- **Orders**: `/orders`
- **Cart**: `/cart`
- **Services**: `/services`
- **Admin Dashboard**: `/admin/*`
- **Analytics**: `/analytics/*`

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- High contrast mode

### Performance
- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading

## 🔧 Development

### Code Style
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Consistent naming conventions

### Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Linting
```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Docker
```bash
# Build image
docker build -t audiotailoc-frontend .

# Run container
docker run -p 3000:3000 audiotailoc-frontend
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📞 Support

- **Documentation**: Xem thư mục `docs/`
- **Issues**: Tạo issue trên GitHub
- **Contact**: dev@audiotailoc.com

## 📄 License

Copyright © 2024 Audio Tài Lộc. All rights reserved.