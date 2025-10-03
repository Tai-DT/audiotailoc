# Audio Tài Lộc - Dashboard

Hệ thống quản lý dành cho Admin của Audio Tài Lộc.

## ✨ Tính năng

- 📊 **Dashboard Analytics**: Thống kê tổng quan doanh thu, đơn hàng
- 👥 **User Management**: Quản lý khách hàng và tài khoản
- 📦 **Product Management**: Quản lý sản phẩm và danh mục
- 🎯 **Project Portfolio**: Quản lý dự án và portfolio
- 🛠️ **Service Management**: Quản lý dịch vụ và đặt lịch
- 📧 **Message Center**: Chat với khách hàng real-time
- 🎨 **Content Management**: Banner, settings, SEO

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **State**: React Query + Zustand
- **Forms**: React Hook Form + Zod
- **Auth**: JWT Authentication
- **Real-time**: Socket.IO
- **Images**: Cloudinary
- **Maps**: Goong Maps

## 📦 Installation

### Prerequisites
- Node.js 20.x or later
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your config

# Run development server
npm run dev
```

### Environment Variables

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Optional: Admin API Key
NEXT_PUBLIC_ADMIN_API_KEY=your_admin_key
```

## 🖥️ Development

```bash
# Development server (port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📁 Project Structure

```
dashboard/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # Reusable components
├── lib/                  # Utilities & services
├── types/               # TypeScript types
└── hooks/              # Custom React hooks
```

## 🔐 Authentication

Dashboard requires admin authentication:

1. Login with admin credentials
2. JWT token stored in localStorage
3. Protected routes check authentication
4. Admin role verification on API calls

## 🌐 Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

## 📞 Support

- **Backend API**: `http://localhost:3010/api/v1/docs`
- **Integration Guide**: See `INTEGRATION.md`
- **Cloudinary Setup**: See `README_CLOUDINARY.md`

---

**🎯 Powered by Audio Tài Lộc Backend APIs**
