# Audio Tài Lộc - Frontend

Frontend application cho hệ thống quản lý dịch vụ âm thanh Audio Tài Lộc, được xây dựng với Next.js 15, TypeScript và Tailwind CSS.

## 🚀 Tính năng

### Trang chủ
- Hero section với thông tin giới thiệu
- Danh sách dịch vụ nổi bật
- Testimonials từ khách hàng
- Form liên hệ

### Dịch vụ
- Danh sách tất cả dịch vụ với bộ lọc
- Trang chi tiết dịch vụ
- Tìm kiếm và phân loại dịch vụ
- Chọn hạng mục dịch vụ

### Đặt lịch
- Form đặt lịch dịch vụ
- Chọn thời gian và địa điểm
- Tính toán giá dịch vụ
- Xác nhận đặt lịch

### Tài khoản người dùng
- Đăng ký/Đăng nhập
- Quản lý thông tin cá nhân
- Lịch sử đặt lịch
- Theo dõi trạng thái dịch vụ

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Date/Time**: React Datepicker
- **Maps**: React Google Maps (tùy chọn)

## 📁 Cấu trúc thư mục

```
frontend/
├── app/                    # Next.js 15 App Router (pages & routing)
│   ├── (auth)/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── services/          # Services pages
│   │   ├── page.tsx       # Services list
│   │   └── [slug]/        # Service detail
│   ├── booking/           # Booking page
│   ├── account/           # User account
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── ...
├── lib/                  # Utilities and configurations
│   ├── api-client.ts     # API client
│   ├── utils.ts          # Utility functions
│   ├── i18n.ts           # Internationalization
│   ├── seo.ts            # SEO utilities
│   └── performance.ts    # Performance monitoring
├── store/                # State management
│   └── auth.ts           # Authentication store
├── hooks/                # Custom React hooks
├── public/               # Static assets
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind v4 config
├── next.config.js        # Next.js 15 config
├── postcss.config.js     # PostCSS config
└── README.md             # Documentation
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Cấu hình environment
Tạo file `.env.local` trong thư mục gốc:
```env
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
NEXT_PUBLIC_APP_NAME=Audio Tài Lộc
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Chạy development server
```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build production
```bash
npm run build
npm start
```

## 📱 Responsive Design

Ứng dụng được thiết kế responsive với các breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter
- **Headings**: Font weight 600-700
- **Body**: Font weight 400-500

### Components
- Buttons với các variants: primary, secondary, outline
- Cards với shadow và border radius
- Forms với validation
- Loading states và animations

## 🔐 Authentication

Sử dụng JWT tokens với Zustand store:
- Login/Register forms
- Token persistence trong localStorage
- Auto logout khi token hết hạn
- Protected routes

## 📊 API Integration

Tích hợp với backend API thông qua:
- Axios client với interceptors
- TypeScript interfaces cho type safety
- Error handling và loading states
- Request/response caching

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t audiotailoc-frontend .
docker run -p 3000:3000 audiotailoc-frontend
```

## 🔧 Development

### Code Style
- ESLint configuration
- Prettier formatting
- TypeScript strict mode

### Git Hooks
- Pre-commit hooks với linting
- Commit message conventions

### Performance
- Image optimization với Next.js Image
- Code splitting tự động
- Lazy loading components
- Bundle analysis

## 📈 Analytics & Monitoring

- Google Analytics integration
- Error tracking
- Performance monitoring
- User behavior analytics

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](../LICENSE) để biết thêm chi tiết.

## 📞 Support

- **Email**: support@audiotailoc.com
- **Documentation**: [docs.audiotailoc.com](https://docs.audiotailoc.com)
- **Issues**: [GitHub Issues](https://github.com/audiotailoc/frontend/issues)
