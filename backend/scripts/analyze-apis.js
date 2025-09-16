const fs = require('fs');
const path = require('path');

// Định nghĩa các loại API
const API_TYPES = {
  PUBLIC: 'public',
  AUTHENTICATED: 'authenticated', 
  ADMIN: 'admin',
  GUEST: 'guest'
};

// Định nghĩa các module chính
const MODULES = {
  AUTH: 'Authentication',
  USERS: 'User Management',
  CATALOG: 'Product Catalog',
  CART: 'Shopping Cart',
  ORDERS: 'Order Management',
  PAYMENTS: 'Payment Processing',
  SERVICES: 'Service Management',
  BOOKINGS: 'Booking System',
  TECHNICIANS: 'Technician Management',
  CHAT: 'Live Chat',
  AI: 'AI Integration',
  SEARCH: 'Search Engine',
  MAPS: 'Maps Integration',
  FILES: 'File Management',
  NOTIFICATIONS: 'Notifications',
  ANALYTICS: 'Analytics',
  ADMIN: 'Admin Dashboard',
  SYSTEM: 'System Management',
  HEALTH: 'Health Monitoring',
  I18N: 'Internationalization',
  SEO: 'SEO Management',
  PAGES: 'Content Pages',
  PROJECTS: 'Portfolio Projects',
  BACKUP: 'Backup & Recovery'
};

// Phân tích API endpoints
const API_ANALYSIS = {
  // Authentication Module
  auth: {
    name: MODULES.AUTH,
    endpoints: [
      { method: 'POST', path: '/auth/register', type: API_TYPES.PUBLIC, description: 'User registration', rateLimit: '3/min' },
      { method: 'POST', path: '/auth/login', type: API_TYPES.PUBLIC, description: 'User login', rateLimit: '5/min' },
      { method: 'POST', path: '/auth/refresh', type: API_TYPES.PUBLIC, description: 'Refresh access token', rateLimit: '10/min' },
      { method: 'GET', path: '/auth/me', type: API_TYPES.AUTHENTICATED, description: 'Get current user profile' }
    ],
    features: ['JWT Authentication', 'Rate Limiting', 'Password Security', 'Session Management']
  },

  // User Management Module
  users: {
    name: MODULES.USERS,
    endpoints: [
      { method: 'GET', path: '/users', type: API_TYPES.ADMIN, description: 'List all users' },
      { method: 'GET', path: '/users/profile', type: API_TYPES.AUTHENTICATED, description: 'Get user profile' },
      { method: 'GET', path: '/users/:id', type: API_TYPES.AUTHENTICATED, description: 'Get user by ID' },
      { method: 'POST', path: '/users', type: API_TYPES.ADMIN, description: 'Create new user' },
      { method: 'PUT', path: '/users/:id', type: API_TYPES.AUTHENTICATED, description: 'Update user' },
      { method: 'DELETE', path: '/users/:id', type: API_TYPES.ADMIN, description: 'Delete user' },
      { method: 'GET', path: '/users/stats/overview', type: API_TYPES.ADMIN, description: 'User statistics overview' },
      { method: 'GET', path: '/users/stats/activity', type: API_TYPES.ADMIN, description: 'User activity statistics' }
    ],
    features: ['User CRUD', 'Role Management', 'Profile Management', 'User Analytics']
  },

  // Product Catalog Module
  catalog: {
    name: MODULES.CATALOG,
    endpoints: [
      { method: 'GET', path: '/catalog/products', type: API_TYPES.PUBLIC, description: 'List products' },
      { method: 'GET', path: '/catalog/products/:id', type: API_TYPES.PUBLIC, description: 'Get product details' },
      { method: 'GET', path: '/catalog/categories', type: API_TYPES.PUBLIC, description: 'List categories' },
      { method: 'GET', path: '/catalog/categories/:id', type: API_TYPES.PUBLIC, description: 'Get category details' },
      { method: 'POST', path: '/catalog/products', type: API_TYPES.ADMIN, description: 'Create product' },
      { method: 'PUT', path: '/catalog/products/:id', type: API_TYPES.ADMIN, description: 'Update product' },
      { method: 'DELETE', path: '/catalog/products/:id', type: API_TYPES.ADMIN, description: 'Delete product' }
    ],
    features: ['Product Management', 'Category Management', 'Inventory Tracking', 'Product Search']
  },

  // Shopping Cart Module
  cart: {
    name: MODULES.CART,
    endpoints: [
      { method: 'GET', path: '/cart/user', type: API_TYPES.AUTHENTICATED, description: 'Get user cart' },
      { method: 'POST', path: '/cart/user/items', type: API_TYPES.AUTHENTICATED, description: 'Add item to user cart' },
      { method: 'PUT', path: '/cart/user/items/:id', type: API_TYPES.AUTHENTICATED, description: 'Update cart item' },
      { method: 'DELETE', path: '/cart/user/items/:id', type: API_TYPES.AUTHENTICATED, description: 'Remove cart item' },
      { method: 'DELETE', path: '/cart/user', type: API_TYPES.AUTHENTICATED, description: 'Clear user cart' },
      { method: 'POST', path: '/cart/guest', type: API_TYPES.GUEST, description: 'Create guest cart' },
      { method: 'GET', path: '/cart/guest/:guestId', type: API_TYPES.GUEST, description: 'Get guest cart' },
      { method: 'POST', path: '/cart/guest/:guestId/items', type: API_TYPES.GUEST, description: 'Add item to guest cart' }
    ],
    features: ['User Cart', 'Guest Cart', 'Cart Persistence', 'Cart Analytics']
  },

  // Order Management Module
  orders: {
    name: MODULES.ORDERS,
    endpoints: [
      { method: 'GET', path: '/orders', type: API_TYPES.ADMIN, description: 'List all orders' },
      { method: 'GET', path: '/orders/:id', type: API_TYPES.AUTHENTICATED, description: 'Get order details' },
      { method: 'PATCH', path: '/orders/:id/status/:status', type: API_TYPES.ADMIN, description: 'Update order status' },
      { method: 'POST', path: '/checkout/create-order', type: API_TYPES.AUTHENTICATED, description: 'Create new order' }
    ],
    features: ['Order Management', 'Order Tracking', 'Status Updates', 'Order History']
  },

  // Payment Processing Module
  payments: {
    name: MODULES.PAYMENTS,
    endpoints: [
      { method: 'POST', path: '/payments/intents', type: API_TYPES.AUTHENTICATED, description: 'Create payment intent' },
      { method: 'POST', path: '/payments/refunds', type: API_TYPES.ADMIN, description: 'Create refund' },
      { method: 'GET', path: '/payments/vnpay/callback', type: API_TYPES.PUBLIC, description: 'VNPAY payment callback' },
      { method: 'GET', path: '/payments/momo/callback', type: API_TYPES.PUBLIC, description: 'MOMO payment callback' },
      { method: 'GET', path: '/payments/payos/callback', type: API_TYPES.PUBLIC, description: 'PayOS payment callback' },
      { method: 'POST', path: '/payments/vnpay/webhook', type: API_TYPES.PUBLIC, description: 'VNPAY webhook' },
      { method: 'POST', path: '/payments/momo/webhook', type: API_TYPES.PUBLIC, description: 'MOMO webhook' },
      { method: 'POST', path: '/payments/payos/webhook', type: API_TYPES.PUBLIC, description: 'PayOS webhook' }
    ],
    features: ['Multi-payment Gateway', 'Payment Intents', 'Webhooks', 'Refunds', 'Payment Security']
  },

  // Service Management Module
  services: {
    name: MODULES.SERVICES,
    endpoints: [
      { method: 'GET', path: '/services', type: API_TYPES.PUBLIC, description: 'List services' },
      { method: 'GET', path: '/services/categories', type: API_TYPES.PUBLIC, description: 'List service categories' },
      { method: 'GET', path: '/services/types', type: API_TYPES.PUBLIC, description: 'List service types' },
      { method: 'POST', path: '/services', type: API_TYPES.ADMIN, description: 'Create service' },
      { method: 'PUT', path: '/services/:id', type: API_TYPES.ADMIN, description: 'Update service' },
      { method: 'DELETE', path: '/services/:id', type: API_TYPES.ADMIN, description: 'Delete service' }
    ],
    features: ['Service Management', 'Service Categories', 'Service Types', 'Service Booking']
  },

  // Booking System Module
  bookings: {
    name: MODULES.BOOKINGS,
    endpoints: [
      { method: 'GET', path: '/bookings', type: API_TYPES.AUTHENTICATED, description: 'List bookings' },
      { method: 'POST', path: '/bookings', type: API_TYPES.AUTHENTICATED, description: 'Create booking' },
      { method: 'PUT', path: '/bookings/:id', type: API_TYPES.AUTHENTICATED, description: 'Update booking' },
      { method: 'DELETE', path: '/bookings/:id', type: API_TYPES.ADMIN, description: 'Cancel booking' }
    ],
    features: ['Booking Management', 'Schedule Management', 'Booking Confirmation', 'Booking History']
  },

  // Technician Management Module
  technicians: {
    name: MODULES.TECHNICIANS,
    endpoints: [
      { method: 'GET', path: '/technicians', type: API_TYPES.PUBLIC, description: 'List technicians' },
      { method: 'GET', path: '/technicians/:id', type: API_TYPES.PUBLIC, description: 'Get technician details' },
      { method: 'GET', path: '/technicians/:id/workload', type: API_TYPES.ADMIN, description: 'Get technician workload' },
      { method: 'POST', path: '/technicians', type: API_TYPES.ADMIN, description: 'Create technician' },
      { method: 'PUT', path: '/technicians/:id', type: API_TYPES.ADMIN, description: 'Update technician' },
      { method: 'DELETE', path: '/technicians/:id', type: API_TYPES.ADMIN, description: 'Delete technician' },
      { method: 'PUT', path: '/technicians/:id/schedule', type: API_TYPES.ADMIN, description: 'Update technician schedule' }
    ],
    features: ['Technician Management', 'Workload Tracking', 'Schedule Management', 'Technician Profiles']
  },

  // Live Chat Module
  chat: {
    name: MODULES.CHAT,
    endpoints: [
      { method: 'GET', path: '/chat/sessions', type: API_TYPES.ADMIN, description: 'List chat sessions' },
      { method: 'GET', path: '/chat/sessions/:id', type: API_TYPES.ADMIN, description: 'Get chat session' },
      { method: 'POST', path: '/chat/sessions/:id/messages', type: API_TYPES.ADMIN, description: 'Post message to session' },
      { method: 'PATCH', path: '/chat/sessions/:id/escalate', type: API_TYPES.ADMIN, description: 'Escalate chat session' },
      { method: 'PATCH', path: '/chat/sessions/:id/close', type: API_TYPES.ADMIN, description: 'Close chat session' },
      { method: 'GET', path: '/chat/sessions/:id/analytics', type: API_TYPES.ADMIN, description: 'Get session analytics' },
      { method: 'GET', path: '/chat/stats', type: API_TYPES.ADMIN, description: 'Get chat statistics' }
    ],
    features: ['Real-time Chat', 'Session Management', 'AI Integration', 'Chat Analytics', 'Escalation System']
  },

  // AI Integration Module
  ai: {
    name: MODULES.AI,
    endpoints: [
      { method: 'POST', path: '/ai/chat', type: API_TYPES.AUTHENTICATED, description: 'Chat with AI' },
      { method: 'GET', path: '/ai/search', type: API_TYPES.PUBLIC, description: 'AI-powered search' }
    ],
    features: ['AI Chat', 'Semantic Search', 'Query Enhancement', 'AI Responses']
  },

  // Search Engine Module
  search: {
    name: MODULES.SEARCH,
    endpoints: [
      { method: 'GET', path: '/search/products', type: API_TYPES.PUBLIC, description: 'Search products' },
      { method: 'GET', path: '/search/global', type: API_TYPES.PUBLIC, description: 'Global search' },
      { method: 'GET', path: '/search/suggestions', type: API_TYPES.PUBLIC, description: 'Search suggestions' },
      { method: 'GET', path: '/search/popular', type: API_TYPES.PUBLIC, description: 'Popular searches' },
      { method: 'GET', path: '/search/history', type: API_TYPES.AUTHENTICATED, description: 'User search history' },
      { method: 'GET', path: '/search/filters', type: API_TYPES.PUBLIC, description: 'Available search filters' },
      { method: 'POST', path: '/search/admin/reindex', type: API_TYPES.ADMIN, description: 'Reindex search data' }
    ],
    features: ['Full-text Search', 'Search Suggestions', 'Search History', 'Search Analytics', 'Meilisearch Integration']
  },

  // Maps Integration Module
  maps: {
    name: MODULES.MAPS,
    endpoints: [
      { method: 'GET', path: '/maps/geocode', type: API_TYPES.PUBLIC, description: 'Geocode address' },
      { method: 'GET', path: '/maps/directions', type: API_TYPES.PUBLIC, description: 'Get directions' },
      { method: 'GET', path: '/maps/reverse', type: API_TYPES.PUBLIC, description: 'Reverse geocoding' },
      { method: 'GET', path: '/maps/place-detail', type: API_TYPES.PUBLIC, description: 'Get place details' }
    ],
    features: ['Geocoding', 'Directions', 'Reverse Geocoding', 'Place Details', 'Goong Maps Integration']
  },

  // File Management Module
  files: {
    name: MODULES.FILES,
    endpoints: [
      { method: 'POST', path: '/files/upload', type: API_TYPES.AUTHENTICATED, description: 'Upload file' },
      { method: 'GET', path: '/files', type: API_TYPES.ADMIN, description: 'List files' },
      { method: 'DELETE', path: '/files/:id', type: API_TYPES.ADMIN, description: 'Delete file' }
    ],
    features: ['File Upload', 'File Management', 'Cloudinary Integration', 'Image Processing']
  },

  // Notifications Module
  notifications: {
    name: MODULES.NOTIFICATIONS,
    endpoints: [
      { method: 'POST', path: '/notifications', type: API_TYPES.ADMIN, description: 'Create notification' },
      { method: 'GET', path: '/notifications/pending', type: API_TYPES.ADMIN, description: 'Get pending notifications' },
      { method: 'PATCH', path: '/notifications/:id/read', type: API_TYPES.AUTHENTICATED, description: 'Mark notification as read' },
      { method: 'PATCH', path: '/notifications/read-all', type: API_TYPES.AUTHENTICATED, description: 'Mark all notifications as read' },
      { method: 'GET', path: '/notifications/stats', type: API_TYPES.ADMIN, description: 'Get notification statistics' }
    ],
    features: ['Multi-channel Notifications', 'Email Notifications', 'Push Notifications', 'SMS Notifications', 'WebSocket Notifications']
  },

  // Analytics Module
  analytics: {
    name: MODULES.ANALYTICS,
    endpoints: [
      { method: 'GET', path: '/analytics/dashboard', type: API_TYPES.ADMIN, description: 'Analytics dashboard' },
      { method: 'GET', path: '/analytics/sales', type: API_TYPES.ADMIN, description: 'Sales analytics' },
      { method: 'GET', path: '/analytics/customers', type: API_TYPES.ADMIN, description: 'Customer analytics' },
      { method: 'GET', path: '/analytics/products', type: API_TYPES.ADMIN, description: 'Product analytics' }
    ],
    features: ['Real-time Analytics', 'Sales Analytics', 'Customer Analytics', 'Product Analytics', 'Performance Metrics']
  },

  // Admin Dashboard Module
  admin: {
    name: MODULES.ADMIN,
    endpoints: [
      { method: 'GET', path: '/admin/dashboard', type: API_TYPES.ADMIN, description: 'Admin dashboard overview' },
      { method: 'GET', path: '/admin/stats/users', type: API_TYPES.ADMIN, description: 'User statistics' },
      { method: 'GET', path: '/admin/stats/orders', type: API_TYPES.ADMIN, description: 'Order statistics' },
      { method: 'GET', path: '/admin/stats/products', type: API_TYPES.ADMIN, description: 'Product statistics' },
      { method: 'POST', path: '/admin/bulk-action', type: API_TYPES.ADMIN, description: 'Perform bulk actions' },
      { method: 'GET', path: '/admin/system/status', type: API_TYPES.ADMIN, description: 'System status' },
      { method: 'GET', path: '/admin/logs/activity', type: API_TYPES.ADMIN, description: 'Activity logs' }
    ],
    features: ['Dashboard Overview', 'Statistics', 'Bulk Actions', 'System Monitoring', 'Activity Logs']
  },

  // System Management Module
  system: {
    name: MODULES.SYSTEM,
    endpoints: [
      { method: 'GET', path: '/admin/system/config', type: API_TYPES.ADMIN, description: 'Get system configs' },
      { method: 'GET', path: '/admin/system/config/:key', type: API_TYPES.ADMIN, description: 'Get specific config' },
      { method: 'POST', path: '/admin/system/config', type: API_TYPES.ADMIN, description: 'Create system config' },
      { method: 'PUT', path: '/admin/system/config/:key', type: API_TYPES.ADMIN, description: 'Update system config' },
      { method: 'DELETE', path: '/admin/system/config/:key', type: API_TYPES.ADMIN, description: 'Delete system config' },
      { method: 'GET', path: '/admin/system/info', type: API_TYPES.ADMIN, description: 'System information' },
      { method: 'GET', path: '/admin/system/logs', type: API_TYPES.ADMIN, description: 'System logs' },
      { method: 'POST', path: '/admin/system/maintenance', type: API_TYPES.ADMIN, description: 'Toggle maintenance mode' },
      { method: 'GET', path: '/admin/system/maintenance/status', type: API_TYPES.ADMIN, description: 'Maintenance status' }
    ],
    features: ['System Configuration', 'Dynamic Settings', 'Maintenance Mode', 'System Monitoring', 'Log Management']
  },

  // Health Monitoring Module
  health: {
    name: MODULES.HEALTH,
    endpoints: [
      { method: 'GET', path: '/health', type: API_TYPES.PUBLIC, description: 'Basic health check' },
      { method: 'GET', path: '/health/detailed', type: API_TYPES.ADMIN, description: 'Detailed health check' },
      { method: 'GET', path: '/health/database', type: API_TYPES.ADMIN, description: 'Database health' },
      { method: 'GET', path: '/health/redis', type: API_TYPES.ADMIN, description: 'Redis health' },
      { method: 'GET', path: '/health/external', type: API_TYPES.ADMIN, description: 'External services health' },
      { method: 'GET', path: '/health/performance', type: API_TYPES.ADMIN, description: 'Performance metrics' },
      { method: 'GET', path: '/health/security', type: API_TYPES.ADMIN, description: 'Security status' },
      { method: 'GET', path: '/health/backup', type: API_TYPES.ADMIN, description: 'Backup status' }
    ],
    features: ['Health Monitoring', 'Database Health', 'Redis Health', 'External Services Health', 'Performance Metrics', 'Security Status']
  },

  // Internationalization Module
  i18n: {
    name: MODULES.I18N,
    endpoints: [
      { method: 'GET', path: '/i18n/languages', type: API_TYPES.PUBLIC, description: 'Get supported languages' },
      { method: 'GET', path: '/i18n/translations/common', type: API_TYPES.PUBLIC, description: 'Get common translations' },
      { method: 'GET', path: '/i18n/translations/products', type: API_TYPES.PUBLIC, description: 'Get product translations' },
      { method: 'GET', path: '/i18n/products/:id', type: API_TYPES.PUBLIC, description: 'Get localized product' },
      { method: 'GET', path: '/i18n/categories/:id', type: API_TYPES.PUBLIC, description: 'Get localized category' },
      { method: 'GET', path: '/i18n/pages/:slug', type: API_TYPES.PUBLIC, description: 'Get localized page' },
      { method: 'GET', path: '/i18n/projects/:slug', type: API_TYPES.PUBLIC, description: 'Get localized project' }
    ],
    features: ['Multi-language Support', 'Translation Management', 'Localized Content', 'Language Detection']
  },

  // SEO Management Module
  seo: {
    name: MODULES.SEO,
    endpoints: [
      { method: 'GET', path: '/seo/sitemap.xml', type: API_TYPES.PUBLIC, description: 'Generate sitemap' },
      { method: 'GET', path: '/seo/robots.txt', type: API_TYPES.PUBLIC, description: 'Robots.txt file' },
      { method: 'GET', path: '/seo/product/:id', type: API_TYPES.PUBLIC, description: 'Product SEO data' },
      { method: 'GET', path: '/seo/category/:id', type: API_TYPES.PUBLIC, description: 'Category SEO data' },
      { method: 'GET', path: '/seo/page/:slug', type: API_TYPES.PUBLIC, description: 'Page SEO data' },
      { method: 'GET', path: '/seo/project/:slug', type: API_TYPES.PUBLIC, description: 'Project SEO data' },
      { method: 'GET', path: '/seo/home', type: API_TYPES.PUBLIC, description: 'Homepage SEO data' }
    ],
    features: ['Sitemap Generation', 'Meta Tags', 'SEO Optimization', 'Search Engine Optimization']
  },

  // Content Pages Module
  pages: {
    name: MODULES.PAGES,
    endpoints: [
      { method: 'GET', path: '/pages', type: API_TYPES.PUBLIC, description: 'List pages' },
      { method: 'GET', path: '/pages/:slug', type: API_TYPES.PUBLIC, description: 'Get page by slug' },
      { method: 'POST', path: '/pages', type: API_TYPES.ADMIN, description: 'Create page' },
      { method: 'PUT', path: '/pages/:slug', type: API_TYPES.ADMIN, description: 'Update page' },
      { method: 'DELETE', path: '/pages/:slug', type: API_TYPES.ADMIN, description: 'Delete page' }
    ],
    features: ['Content Management', 'Page Management', 'SEO Integration', 'Content Publishing']
  },

  // Portfolio Projects Module
  projects: {
    name: MODULES.PROJECTS,
    endpoints: [
      { method: 'GET', path: '/projects', type: API_TYPES.PUBLIC, description: 'List projects' },
      { method: 'GET', path: '/projects/:slug', type: API_TYPES.PUBLIC, description: 'Get project by slug' },
      { method: 'POST', path: '/projects', type: API_TYPES.ADMIN, description: 'Create project' },
      { method: 'PUT', path: '/projects/:slug', type: API_TYPES.ADMIN, description: 'Update project' },
      { method: 'DELETE', path: '/projects/:slug', type: API_TYPES.ADMIN, description: 'Delete project' }
    ],
    features: ['Portfolio Management', 'Project Showcase', 'Image Management', 'Project Categories']
  },

  // Backup & Recovery Module
  backup: {
    name: MODULES.BACKUP,
    endpoints: [
      { method: 'POST', path: '/backup/create', type: API_TYPES.ADMIN, description: 'Create backup' },
      { method: 'GET', path: '/backup/list', type: API_TYPES.ADMIN, description: 'List backups' },
      { method: 'POST', path: '/backup/restore/:id', type: API_TYPES.ADMIN, description: 'Restore backup' },
      { method: 'DELETE', path: '/backup/:id', type: API_TYPES.ADMIN, description: 'Delete backup' }
    ],
    features: ['Automated Backups', 'Backup Management', 'Data Recovery', 'Backup Scheduling']
  }
};

// Tạo báo cáo phân tích
function generateAnalysisReport() {
  console.log('🔍 PHÂN TÍCH API ENDPOINTS - AUDIO TÀI LỘC BACKEND\n');
  console.log('=' .repeat(80));

  // Thống kê tổng quan
  let totalEndpoints = 0;
  let publicEndpoints = 0;
  let authenticatedEndpoints = 0;
  let adminEndpoints = 0;
  let guestEndpoints = 0;

  Object.values(API_ANALYSIS).forEach(module => {
    module.endpoints.forEach(endpoint => {
      totalEndpoints++;
      switch (endpoint.type) {
        case API_TYPES.PUBLIC:
          publicEndpoints++;
          break;
        case API_TYPES.AUTHENTICATED:
          authenticatedEndpoints++;
          break;
        case API_TYPES.ADMIN:
          adminEndpoints++;
          break;
        case API_TYPES.GUEST:
          guestEndpoints++;
          break;
      }
    });
  });

  console.log('\n📊 THỐNG KÊ TỔNG QUAN:');
  console.log(`   Tổng số endpoints: ${totalEndpoints}`);
  console.log(`   Public endpoints: ${publicEndpoints}`);
  console.log(`   Authenticated endpoints: ${authenticatedEndpoints}`);
  console.log(`   Admin endpoints: ${adminEndpoints}`);
  console.log(`   Guest endpoints: ${guestEndpoints}`);
  console.log(`   Số module: ${Object.keys(API_ANALYSIS).length}`);

  // Phân tích từng module
  console.log('\n📋 PHÂN TÍCH CHI TIẾT THEO MODULE:\n');

  Object.entries(API_ANALYSIS).forEach(([key, module]) => {
    console.log(`🔹 ${module.name.toUpperCase()}`);
    console.log(`   Endpoints: ${module.endpoints.length}`);
    console.log(`   Features: ${module.features.join(', ')}`);
    
    module.endpoints.forEach(endpoint => {
      const typeIcon = {
        [API_TYPES.PUBLIC]: '🌐',
        [API_TYPES.AUTHENTICATED]: '🔐',
        [API_TYPES.ADMIN]: '👑',
        [API_TYPES.GUEST]: '👤'
      }[endpoint.type];
      
      console.log(`     ${typeIcon} ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
    });
    console.log('');
  });

  // Tạo sơ đồ chức năng cho Frontend
  console.log('🎨 SƠ ĐỒ CHỨC NĂNG CHO FRONTEND:\n');
  console.log('=' .repeat(80));

  const frontendModules = {
    'Public Pages': [
      'Homepage',
      'Product Catalog',
      'Product Details',
      'Service Listing',
      'Service Details',
      'About Us',
      'Contact',
      'Portfolio/Projects',
      'Blog/Pages'
    ],
    'User Features': [
      'User Registration',
      'User Login',
      'User Profile',
      'Shopping Cart',
      'Order History',
      'Booking Management',
      'Live Chat',
      'Search & Filter'
    ],
    'E-commerce': [
      'Product Browsing',
      'Product Search',
      'Shopping Cart',
      'Checkout Process',
      'Payment Integration',
      'Order Tracking',
      'Order History'
    ],
    'Service Booking': [
      'Service Browsing',
      'Service Booking',
      'Booking Calendar',
      'Technician Selection',
      'Booking Confirmation',
      'Booking History'
    ],
    'Interactive Features': [
      'Live Chat Support',
      'AI Chat Assistant',
      'Search Suggestions',
      'Maps Integration',
      'File Upload',
      'Notifications'
    ]
  };

  Object.entries(frontendModules).forEach(([category, features]) => {
    console.log(`📱 ${category}:`);
    features.forEach(feature => {
      console.log(`   • ${feature}`);
    });
    console.log('');
  });

  // Tạo sơ đồ chức năng cho Dashboard
  console.log('📊 SƠ ĐỒ CHỨC NĂNG CHO DASHBOARD:\n');
  console.log('=' .repeat(80));

  const dashboardModules = {
    'Overview & Analytics': [
      'Dashboard Overview',
      'Sales Analytics',
      'Customer Analytics',
      'Product Analytics',
      'Performance Metrics',
      'Real-time Statistics'
    ],
    'User Management': [
      'User List',
      'User Details',
      'User Statistics',
      'User Activity',
      'Role Management',
      'User Permissions'
    ],
    'Product Management': [
      'Product Catalog',
      'Product Creation',
      'Product Editing',
      'Category Management',
      'Inventory Management',
      'Product Analytics'
    ],
    'Order Management': [
      'Order List',
      'Order Details',
      'Order Status Management',
      'Order Analytics',
      'Payment Management',
      'Refund Processing'
    ],
    'Service Management': [
      'Service Catalog',
      'Service Creation',
      'Service Categories',
      'Technician Management',
      'Booking Management',
      'Schedule Management'
    ],
    'Content Management': [
      'Page Management',
      'Project Portfolio',
      'SEO Management',
      'Content Publishing',
      'Media Management',
      'Translation Management'
    ],
    'System Management': [
      'System Configuration',
      'Health Monitoring',
      'Backup Management',
      'Log Management',
      'Security Settings',
      'Maintenance Mode'
    ],
    'Communication': [
      'Live Chat Management',
      'Notification Management',
      'Email Campaigns',
      'Customer Support',
      'Chat Analytics',
      'Message History'
    ],
    'Marketing & SEO': [
      'Campaign Management',
      'SEO Optimization',
      'Analytics Dashboard',
      'Performance Tracking',
      'Marketing ROI',
      'Customer Segmentation'
    ]
  };

  Object.entries(dashboardModules).forEach(([category, features]) => {
    console.log(`🖥️  ${category}:`);
    features.forEach(feature => {
      console.log(`   • ${feature}`);
    });
    console.log('');
  });

  // Tạo file JSON cho frontend/dashboard
  const frontendData = {
    modules: frontendModules,
    apiEndpoints: API_ANALYSIS,
    statistics: {
      totalEndpoints,
      publicEndpoints,
      authenticatedEndpoints,
      adminEndpoints,
      guestEndpoints,
      totalModules: Object.keys(API_ANALYSIS).length
    }
  };

  const dashboardData = {
    modules: dashboardModules,
    apiEndpoints: Object.fromEntries(
      Object.entries(API_ANALYSIS).filter(([key, module]) => 
        module.endpoints.some(endpoint => endpoint.type === API_TYPES.ADMIN)
      )
    ),
    statistics: {
      totalEndpoints,
      publicEndpoints,
      authenticatedEndpoints,
      adminEndpoints,
      guestEndpoints,
      totalModules: Object.keys(API_ANALYSIS).length
    }
  };

  // Lưu file JSON
  fs.writeFileSync('frontend-features.json', JSON.stringify(frontendData, null, 2));
  fs.writeFileSync('dashboard-features.json', JSON.stringify(dashboardData, null, 2));

  console.log('💾 Đã tạo file JSON:');
  console.log('   • frontend-features.json - Dữ liệu cho Frontend');
  console.log('   • dashboard-features.json - Dữ liệu cho Dashboard');
  console.log('\n🎉 Phân tích hoàn tất!');
}

// Chạy phân tích
generateAnalysisReport();


