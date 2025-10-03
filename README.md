# 🎵 Audio Tài Lộc

Hệ thống thương mại điện tử chuyên nghiệp cho thiết bị âm thanh và dịch vụ lắp đặt.

## 🌟 Tổng quan

Audio Tài Lộc là platform toàn diện cung cấp:
- **E-commerce**: Mua bán thiết bị âm thanh
- **Service Booking**: Đặt lịch lắp đặt, bảo trì
- **Project Portfolio**: Showcase các dự án đã thực hiện
- **Customer Support**: Chat real-time, FAQ, support

## 🏗️ Kiến trúc hệ thống

```
audiotailoc/
├── frontend/          # Next.js 15 - Website chính
├── dashboard/         # Next.js 15 - Admin panel  
├── backend/          # NestJS - API server
├── image-processor/   # Node.js - Image processing
└── mcp-servers/      # MCP integration servers
```

## 🚀 Tech Stack

### Frontend (Customer)
- **Framework**: Next.js 15.5.4 + React 18.3.1
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State**: React Query + Zustand
- **Payment**: PayOS integration
- **Maps**: Goong Maps API

### Dashboard (Admin)
- **Framework**: Next.js 15.5.2 + React 19.1.0
- **UI**: Tailwind CSS + shadcn/ui
- **Real-time**: Socket.IO
- **Images**: Cloudinary integration

### Backend (API)
- **Framework**: NestJS 10.4.0
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT + bcrypt
- **Cache**: Redis
- **Monitoring**: Winston logging + Pino

### Infrastructure
- **Deployment**: Vercel (Frontend) + Heroku (Backend)
- **Database**: PostgreSQL (Heroku)
- **CDN**: Cloudinary
- **Domain**: audiotailoc.com

## 📦 Quick Start

### Prerequisites
- Node.js 20.x or later
- PostgreSQL database
- Redis (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/audiotailoc.git
cd audiotailoc

# Install all dependencies
npm run install:all

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.template frontend/.env.local
cp dashboard/.env.example dashboard/.env.local

# Setup database
cd backend
npx prisma migrate dev
npm run seed

# Start development servers
npm run dev:all
```

### Development Scripts

```bash
# Start all services
npm run dev:all

# Start individual services
npm run dev:backend    # Port 3010
npm run dev:frontend   # Port 3000  
npm run dev:dashboard  # Port 3001

# Build for production
npm run build:all

# Type checking
npm run type-check:all

# Linting
npm run lint:all
```

## 🌐 Live URLs

### Production
- **Website**: https://audiotailoc.com
- **Dashboard**: https://admin.audiotailoc.com
- **API**: https://api.audiotailoc.com

### Development
- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3001
- **Backend**: http://localhost:3010
- **API Docs**: http://localhost:3010/docs

## 🔐 Environment Configuration

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/audiotailoc"

# JWT Secrets
JWT_ACCESS_SECRET="your-secure-jwt-access-secret"
JWT_REFRESH_SECRET="your-secure-jwt-refresh-secret"

# Payment
PAYOS_API_KEY="your-payos-api-key"
PAYOS_CHECKSUM_KEY="your-payos-checksum-key"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3010/api/v1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Payment
PAYOS_PARTNER_CODE="your-partner-code"
PAYOS_API_KEY="your-api-key"
PAYOS_CHECKSUM_KEY="your-checksum-key"

# Maps
NEXT_PUBLIC_GOONG_API_KEY="your-goong-api-key"
```

### Dashboard (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3010/api/v1"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# Admin
NEXT_PUBLIC_ADMIN_API_KEY="your-admin-api-key"
```

## 📚 Documentation

- **API Documentation**: `backend/README.md`
- **Frontend Guide**: `frontend/README.md`
- **Dashboard Guide**: `dashboard/README.md`
- **Deployment**: `docs/DEPLOYMENT.md`
- **Security**: `backend/scripts/generate-secure-env.js`

## 🔧 Scripts & Tools

### Backend
```bash
cd backend
npm run dev              # Development server
npm run build           # Production build
npm run start           # Production server
npm run typecheck       # TypeScript check
npm run lint            # ESLint
npm run test            # Jest tests
npx prisma studio       # Database GUI
```

### Frontend
```bash
cd frontend
npm run dev             # Development server
npm run build          # Production build
npm run start          # Production server
npm run lint           # ESLint
```

### Dashboard
```bash
cd dashboard
npm run dev            # Development server (port 3001)
npm run build         # Production build
npm run start         # Production server
```

## 🚀 Deployment

### Quick Deploy
```bash
# Build all projects
npm run build:all

# Deploy to Vercel (Frontend & Dashboard)
npm run deploy:frontend
npm run deploy:dashboard

# Deploy to Heroku (Backend)
npm run deploy:backend
```

### Manual Deployment

See individual README files in each folder for detailed deployment instructions.

## 🛡️ Security

### Environment Security
- Use strong JWT secrets (64+ characters)
- Never commit real credentials to Git
- Use different secrets for dev/staging/production
- Generate secure environment variables:

```bash
cd backend
node scripts/generate-secure-env.js
```

### Security Features
- JWT authentication
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Monitoring

### Health Checks
- **Backend**: `/api/v1/health`
- **Database**: Prisma connection monitoring
- **Redis**: Connection status

### Logging
- Application logs: Winston + Pino
- Error tracking: Console & file logging
- Performance monitoring: Built-in metrics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Update documentation as needed

## 📞 Support

- **Email**: support@audiotailoc.com
- **Documentation**: See individual project READMEs
- **Issues**: Create GitHub issues for bugs/features

## 📄 License

Copyright © 2024 Audio Tài Lộc. All rights reserved.

---

**🎯 Built with modern web technologies for professional audio equipment business**