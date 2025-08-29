# Audio Tài Lọc Dashboard

A comprehensive dashboard for monitoring and visualizing the Audio Tài Lọc e-commerce platform, built with Next.js and integrated with the NestJS backend.

## 🚀 Features

### 📊 Real-time Data Visualization
- **Product Analytics**: Top products by views, price distribution, product listings
- **Category Insights**: Distribution charts, category statistics, revenue tracking
- **System Health**: Backend status, response times, error monitoring
- **AI Features**: Active AI capabilities, model status, feature tracking

### 🔗 Backend Integration
- Direct API integration with NestJS backend (port 3010)
- Real-time data fetching from multiple endpoints:
  - `/api/v1/health` - System health monitoring
  - `/api/v1/catalog/products` - Product data and analytics
  - `/api/v1/catalog/categories` - Category distribution
  - `/api/v1/ai/capabilities` - AI features status

### 📈 Interactive Charts
- Bar charts for product views and price ranges
- Pie charts for category distribution
- Responsive design with Recharts library
- Real-time data updates with refresh functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: NestJS (external API)
- **Database**: PostgreSQL (via backend)

## 📁️ Project Structure

```
dashboard/
├── app/
│   └── dashboard/
│       └── page.tsx          # Main dashboard page
├── components/
│   └── Dashboard.tsx         # Dashboard component with charts
├── test-backend.js           # API connectivity test script
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend server running on `http://localhost:3010`
- Database seeded with sample data

### Installation

1. **Navigate to dashboard directory:**
   ```bash
   cd dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Test backend connectivity:**
   ```bash
   node test-backend.js
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000/dashboard`

## 🔍 API Testing

Before starting the dashboard, ensure your backend is running and accessible:

```bash
# Test all dashboard endpoints
node test-backend.js
```

This script will:
- ✅ Test all required API endpoints
- 📊 Show data availability
- 🚨 Report any connectivity issues
- 📋 Provide dashboard readiness status

## 📊 Dashboard Sections

### 1. Products Tab
- **Top Products by Views**: Bar chart showing most viewed products
- **Product List**: Scrollable list of all products with pricing and view counts
- **Featured Products**: Highlighted products with special badges

### 2. Categories Tab
- **Category Distribution**: Pie chart showing product distribution across categories
- **Category Statistics**: Detailed stats including views and revenue per category
- **Color-coded Visualization**: Each category has a unique color for easy identification

### 3. Analytics Tab
- **Price Range Distribution**: Bar chart showing products grouped by price ranges
- **System Health Metrics**: Real-time backend performance indicators
- **Error Monitoring**: System error tracking and reporting

### 4. AI Features Tab
- **Active AI Capabilities**: List of enabled AI features
- **Model Information**: Available AI models and their status
- **Feature Status**: Active/inactive status for each AI capability

## 🔄 Data Refresh

The dashboard includes a refresh button to update data in real-time:
- Click the "Làm mới" (Refresh) button in the header
- All charts and metrics will update with the latest backend data
- API status indicators show connection health

## 🎨 Customization

### Adding New Metrics
1. Add new API endpoint to the data fetching logic in `page.tsx`
2. Create new chart components in `Dashboard.tsx`
3. Update the TypeScript interfaces for type safety

### Styling
- Uses Tailwind CSS for responsive design
- Shadcn/ui components for consistent UI
- Custom color schemes for charts and indicators

## 🚨 Troubleshooting

### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:3010/api/v1/health

# Test specific endpoints
curl http://localhost:3010/api/v1/catalog/products
```

### Common Issues
1. **Backend not running**: Start the NestJS server on port 3010
2. **Database not seeded**: Run database migrations and seed scripts
3. **CORS issues**: Ensure backend allows requests from dashboard origin
4. **Data not loading**: Check network tab for API errors

### Error Messages
- "Failed to fetch data": Backend server not accessible
- "HTTP 404": API endpoint not found
- "HTTP 500": Backend server error

## 📈 Performance

- **Lazy Loading**: Components load data on demand
- **Caching**: API responses are cached during session
- **Responsive**: Optimized for desktop and mobile devices
- **Real-time Updates**: Manual refresh for latest data

## 🤝 Contributing

1. Test your changes with `node test-backend.js`
2. Ensure all API endpoints are working
3. Add new features with proper TypeScript types
4. Update documentation for any new functionality

## 📜 License

This project is part of the Audio Tài Lọc platform. See main project LICENSE file for details.

## 🆘 Support

For issues related to:
- **Dashboard**: Check this README and test script
- **Backend APIs**: Refer to backend documentation at `/docs`
- **Database**: Check backend logs and database status
- **General**: Create an issue in the main repository

---

**Dashboard URL**: `http://localhost:3000/dashboard`
**Backend API**: `http://localhost:3010/api/v1`
**Test Script**: `node test-backend.js`