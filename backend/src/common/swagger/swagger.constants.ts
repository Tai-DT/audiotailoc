/**
 * Common HTTP status codes và responses cho documentation
 */
export const ApiResponses = {
  // Success responses
  OK: {
    status: 200,
    description: 'Request completed successfully',
  },
  CREATED: {
    status: 201,
    description: 'Resource created successfully',
  },
  NO_CONTENT: {
    status: 204,
    description: 'Request completed successfully with no content',
  },

  // Client error responses
  BAD_REQUEST: {
    status: 400,
    description: 'Invalid request parameters or body',
  },
  UNAUTHORIZED: {
    status: 401,
    description: 'Authentication required or invalid credentials',
  },
  FORBIDDEN: {
    status: 403,
    description: 'Access denied - insufficient permissions',
  },
  NOT_FOUND: {
    status: 404,
    description: 'Requested resource not found',
  },
  CONFLICT: {
    status: 409,
    description: 'Resource already exists or conflict with current state',
  },
  VALIDATION_ERROR: {
    status: 422,
    description: 'Request validation failed',
  },
  RATE_LIMITED: {
    status: 429,
    description: 'Too many requests - rate limit exceeded',
  },

  // Server error responses
  INTERNAL_ERROR: {
    status: 500,
    description: 'Internal server error',
  },
  SERVICE_UNAVAILABLE: {
    status: 503,
    description: 'Service temporarily unavailable',
  },
};

/**
 * Common query parameters cho list endpoints
 */
export const CommonQueryParams = {
  PAGE: {
    name: 'page',
    required: false,
    description: 'Page number (starts from 1)',
    example: 1,
    schema: { type: 'integer', minimum: 1, default: 1 },
  },
  PAGE_SIZE: {
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
    example: 10,
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
  },
  SEARCH: {
    name: 'q',
    required: false,
    description: 'Search query string',
    example: 'bluetooth headphones',
    schema: { type: 'string' },
  },
  SORT_BY: {
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
    example: 'createdAt',
    schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'name', 'price'] },
  },
  SORT_ORDER: {
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    example: 'desc',
    schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
  },
};

/**
 * Security schemes cho documentation
 */
export const SecuritySchemes = {
  JWT: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT access token (without "Bearer" prefix)',
    in: 'header',
  },
  API_KEY: {
    type: 'apiKey',
    name: 'X-API-Key',
    in: 'header',
    description: 'API Key for server-to-server communication',
  },
};

/**
 * Example data cho documentation
 */
export const ExampleData = {
  USER: {
    id: 'user_clp123456789',
    email: 'nguyen.van.a@example.com',
    name: 'Nguyễn Văn A',
    role: 'user',
    isVerified: true,
    phone: '+84901234567',
    createdAt: '2025-08-31T15:30:00.000Z',
    lastLoginAt: '2025-08-31T22:57:59.000Z',
  },
  PRODUCT: {
    id: 'prod_clp123456789',
    name: 'Tai nghe Bluetooth Sony WH-1000XM5',
    slug: 'tai-nghe-bluetooth-sony-wh-1000xm5',
    description: 'Tai nghe chống ồn hàng đầu với công nghệ V1 và driver 30mm',
    priceCents: 8500000, // 8,500,000 VND
    imageUrl: 'https://audiotailoc.com/images/sony-wh-1000xm5.jpg',
    categoryId: 'cat_headphones',
    featured: true,
    inStock: true,
    specifications: {
      brand: 'Sony',
      model: 'WH-1000XM5',
      type: 'Over-ear',
      connectivity: 'Bluetooth 5.2, 3.5mm',
      batteryLife: '30 hours',
      weight: '250g',
      noiseCancellation: true,
      warranty: '12 months',
    },
    images: [
      'https://audiotailoc.com/images/sony-wh-1000xm5-1.jpg',
      'https://audiotailoc.com/images/sony-wh-1000xm5-2.jpg',
      'https://audiotailoc.com/images/sony-wh-1000xm5-3.jpg',
    ],
    createdAt: '2025-08-31T10:00:00.000Z',
    updatedAt: '2025-08-31T22:57:59.000Z',
  },
  CATEGORY: {
    id: 'cat_headphones',
    name: 'Tai nghe',
    slug: 'tai-nghe',
    description: 'Tai nghe cao cấp: Bluetooth, có dây, gaming, studio',
    imageUrl: 'https://audiotailoc.com/images/categories/headphones.jpg',
    productCount: 127,
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  ORDER: {
    id: 'order_clp123456789',
    orderNumber: 'ATL-2025-001234',
    userId: 'user_clp123456789',
    status: 'confirmed',
    totalCents: 17000000, // 17,000,000 VND
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '+84901234567',
      email: 'nguyen.van.a@example.com',
      address: '123 Đường Nguyễn Huệ',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'Thành phố Hồ Chí Minh',
      postalCode: '70000',
      country: 'Vietnam',
    },
    items: [
      {
        productId: 'prod_clp123456789',
        name: 'Tai nghe Bluetooth Sony WH-1000XM5',
        sku: 'SONY-WH1000XM5-BLK',
        quantity: 2,
        unitPriceCents: 8500000,
        totalCents: 17000000,
        imageUrl: 'https://audiotailoc.com/images/sony-wh-1000xm5.jpg',
      },
    ],
    paymentMethod: 'vnpay',
    paymentStatus: 'paid',
    shippingMethod: 'standard',
    shippingCents: 0, // Free shipping
    taxCents: 0,
    discountCents: 0,
    createdAt: '2025-08-31T20:15:30.000Z',
    updatedAt: '2025-08-31T22:57:59.000Z',
  },
  CART: {
    id: 'cart_clp123456789',
    userId: 'user_clp123456789',
    items: [
      {
        productId: 'prod_clp123456789',
        name: 'Tai nghe Bluetooth Sony WH-1000XM5',
        quantity: 1,
        unitPriceCents: 8500000,
        totalCents: 8500000,
        imageUrl: 'https://audiotailoc.com/images/sony-wh-1000xm5.jpg',
      },
      {
        productId: 'prod_clp987654321',
        name: 'Loa Bluetooth Marshall Acton III',
        quantity: 1,
        unitPriceCents: 6500000,
        totalCents: 6500000,
        imageUrl: 'https://audiotailoc.com/images/marshall-acton-iii.jpg',
      },
    ],
    totalCents: 15000000,
    itemCount: 2,
    createdAt: '2025-08-31T18:30:00.000Z',
    updatedAt: '2025-08-31T22:45:00.000Z',
  },
  PAYMENT_INTENT: {
    id: 'pi_clp123456789',
    amount: 8500000,
    currency: 'VND',
    status: 'succeeded',
    paymentMethod: 'vnpay',
    orderId: 'order_clp123456789',
    metadata: {
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyen.van.a@example.com',
      orderNumber: 'ATL-2025-001234',
    },
    createdAt: '2025-08-31T20:15:30.000Z',
    completedAt: '2025-08-31T20:16:45.000Z',
  },
};

/**
 * Common error examples
 */
export const ErrorExamples = {
  VALIDATION: {
    success: false,
    message: 'Validation failed',
    errorCode: 'VALIDATION_ERROR',
    errors: [
      'Email must be a valid email address',
      'Password must be at least 6 characters long',
      'Name is required',
    ],
    timestamp: '2025-08-31T22:57:59.000Z',
    requestId: 'req_clp123456789',
    path: '/api/v1/auth/register',
  },
  UNAUTHORIZED: {
    success: false,
    message: 'Authentication required',
    errorCode: 'UNAUTHORIZED',
    timestamp: '2025-08-31T22:57:59.000Z',
    requestId: 'req_clp123456789',
    path: '/api/v1/users/profile',
  },
  FORBIDDEN: {
    success: false,
    message: 'Access denied - Admin privileges required',
    errorCode: 'FORBIDDEN',
    timestamp: '2025-08-31T22:57:59.000Z',
    requestId: 'req_clp123456789',
    path: '/api/v1/admin/dashboard',
  },
  NOT_FOUND: {
    success: false,
    message: 'Product not found',
    errorCode: 'NOT_FOUND',
    timestamp: '2025-08-31T22:57:59.000Z',
    requestId: 'req_clp123456789',
    path: '/api/v1/catalog/products/invalid_id',
  },
  RATE_LIMITED: {
    success: false,
    message: 'Too many requests - please try again later',
    errorCode: 'RATE_LIMITED',
    retryAfter: 900, // seconds
    timestamp: '2025-08-31T22:57:59.000Z',
    requestId: 'req_clp123456789',
  },
};

// Cart examples
export const CartExamples = {
  EMPTY_CART: {
    id: 'cart_guest_abc123',
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  GUEST_CART: {
    id: 'cart_guest_abc123',
    items: [
      {
        id: 'item_1',
        productId: 'prod_speaker_001',
        product: {
          id: 'prod_speaker_001',
          name: 'Loa karaoke Audio Tài Lộc Pro-3000',
          price: 12900000,
          image: 'https://example.com/images/speaker-pro-3000.jpg',
        },
        quantity: 2,
        unitPrice: 12900000,
        totalPrice: 25800000,
      },
      {
        id: 'item_2',
        productId: 'prod_mic_002',
        product: {
          id: 'prod_mic_002',
          name: 'Mic không dây Audio Tài Lộc WM-200',
          price: 1200000,
          image: 'https://example.com/images/mic-wm-200.jpg',
        },
        quantity: 1,
        unitPrice: 1200000,
        totalPrice: 1200000,
      },
    ],
    totalQuantity: 3,
    totalPrice: 27000000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T01:30:00Z',
  },
  USER_CART: {
    id: 'cart_user_def456',
    userId: 'user_nguyenvana',
    items: [
      {
        id: 'item_3',
        productId: 'prod_speaker_001',
        product: {
          id: 'prod_speaker_001',
          name: 'Loa karaoke Audio Tài Lộc Pro-3000',
          price: 12900000,
          image: 'https://example.com/images/speaker-pro-3000.jpg',
        },
        quantity: 1,
        unitPrice: 12900000,
        totalPrice: 12900000,
      },
    ],
    totalQuantity: 1,
    totalPrice: 12900000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T02:00:00Z',
  },
  ADD_TO_CART: {
    productId: 'prod_speaker_001',
    quantity: 2,
  },
  UPDATE_CART_ITEM: {
    quantity: 3,
  },
};

// Order examples
export const OrderExamples = {
  ORDER_PENDING: {
    id: 'order_ORD001',
    status: 'pending',
    totalAmount: 27000000,
    items: [
      {
        id: 'item_1',
        productId: 'prod_speaker_001',
        productName: 'Loa karaoke Audio Tài Lộc Pro-3000',
        quantity: 2,
        unitPrice: 12900000,
        totalPrice: 25800000,
      },
      {
        id: 'item_2',
        productId: 'prod_mic_002',
        productName: 'Mic không dây Audio Tài Lộc WM-200',
        quantity: 1,
        unitPrice: 1200000,
        totalPrice: 1200000,
      },
    ],
    customer: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
    },
    shippingAddress: {
      address: '123 Đường Âm Thanh, Quận Tân Bình, TP.HCM',
      ward: 'Phường 1',
      district: 'Quận Tân Bình',
      city: 'TP.HCM',
      postalCode: '70000',
    },
    notes: 'Giao hàng trong giờ hành chính',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  ORDER_CONFIRMED: {
    id: 'order_ORD002',
    status: 'confirmed',
    totalAmount: 12900000,
    items: [
      {
        id: 'item_3',
        productId: 'prod_speaker_001',
        productName: 'Loa karaoke Audio Tài Lộc Pro-3000',
        quantity: 1,
        unitPrice: 12900000,
        totalPrice: 12900000,
      },
    ],
    customer: {
      name: 'Trần Thị B',
      phone: '0907654321',
      email: 'tranthib@example.com',
    },
    shippingAddress: {
      address: '456 Phố Karaoke, Quận 1, TP.HCM',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP.HCM',
      postalCode: '70000',
    },
    paymentMethod: 'cash_on_delivery',
    estimatedDelivery: '2024-01-05T00:00:00Z',
    createdAt: '2024-01-02T09:30:00Z',
    updatedAt: '2024-01-02T14:00:00Z',
  },
  CREATE_ORDER: {
    items: [
      {
        productId: 'prod_speaker_001',
        quantity: 2,
      },
      {
        productId: 'prod_mic_002',
        quantity: 1,
      },
    ],
    shippingAddress: '123 Đường Âm Thanh, Quận Tân Bình, TP.HCM',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    customerEmail: 'nguyenvana@example.com',
    notes: 'Giao hàng trong giờ hành chính',
  },
};

// Payment examples
export const PaymentExamples = {
  PAYMENT_METHODS: [
    {
      id: 'VNPAY',
      name: 'VNPAY',
      description: 'Thanh toán qua VNPAY',
      logo: '/images/payment/vnpay.png',
      enabled: true,
      fees: '2.5%',
      minAmount: 10000,
      maxAmount: 500000000,
    },
    {
      id: 'MOMO',
      name: 'MoMo',
      description: 'Thanh toán qua MoMo',
      logo: '/images/payment/momo.png',
      enabled: true,
      fees: '2.0%',
      minAmount: 10000,
      maxAmount: 50000000,
    },
    {
      id: 'PAYOS',
      name: 'PayOS',
      description: 'Thanh toán qua PayOS',
      logo: '/images/payment/payos.png',
      enabled: true,
      fees: '1.8%',
      minAmount: 10000,
      maxAmount: 200000000,
    },
  ],
  PAYMENT_INTENT: {
    id: 'intent_abc123',
    orderId: 'order_ORD001',
    provider: 'VNPAY',
    amount: 27000000,
    currency: 'VND',
    status: 'pending',
    paymentUrl: 'https://vnpay.vn/payment/abc123',
    idempotencyKey: 'unique_key_abc123',
    returnUrl: 'https://audiotailoc.com/checkout/success',
    createdAt: '2024-01-01T10:00:00Z',
    expiresAt: '2024-01-01T10:15:00Z',
  },
  CREATE_INTENT: {
    orderId: 'order_ORD001',
    provider: 'VNPAY',
    idempotencyKey: 'unique_key_abc123',
    returnUrl: 'https://audiotailoc.com/checkout/success',
  },
  PAYMENT_SUCCESS: {
    id: 'payment_pay123',
    orderId: 'order_ORD001',
    provider: 'VNPAY',
    amount: 27000000,
    currency: 'VND',
    status: 'completed',
    transactionId: 'vnp_txn_456789',
    paidAt: '2024-01-01T10:05:00Z',
    bankCode: 'TECHCOMBANK',
    bankTranNo: 'TCB_20240101_123456',
  },
  REFUND_REQUEST: {
    paymentId: 'payment_pay123',
    amountCents: 1000000, // 10,000 VND (in cents)
    reason: 'Khách hàng yêu cầu đổi trả sản phẩm',
  },
  REFUND_RESPONSE: {
    id: 'refund_ref123',
    paymentId: 'payment_pay123',
    orderId: 'order_ORD001',
    amount: 1000000,
    currency: 'VND',
    status: 'processing',
    reason: 'Khách hàng yêu cầu đổi trả sản phẩm',
    createdAt: '2024-01-01T15:30:00Z',
    estimatedCompletionAt: '2024-01-08T00:00:00Z',
  },
};

// User examples
export const UserExamples = {
  USER_PROFILE: {
    id: 'user_nguyenvana',
    email: 'nguyenvana@example.com',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    role: 'USER',
    avatar: 'https://example.com/avatars/nguyenvana.jpg',
    address: {
      street: '123 Đường Âm Thanh',
      ward: 'Phường 1',
      district: 'Quận Tân Bình',
      city: 'TP.HCM',
      postalCode: '70000',
    },
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    },
    stats: {
      totalOrders: 15,
      totalSpent: 89500000,
      averageOrderValue: 5966667,
      favoriteCategory: 'Loa karaoke',
    },
    createdAt: '2023-06-15T09:30:00Z',
    updatedAt: '2024-01-01T14:20:00Z',
    lastLoginAt: '2024-01-01T08:45:00Z',
  },
  ADMIN_USER: {
    id: 'user_admin001',
    email: 'admin@audiotailoc.com',
    name: 'Quản trị viên',
    phone: '0909876543',
    role: 'ADMIN',
    avatar: 'https://example.com/avatars/admin.jpg',
    permissions: [
      'users:read',
      'users:write',
      'orders:read',
      'orders:write',
      'products:read',
      'products:write',
      'analytics:read',
    ],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    lastLoginAt: '2024-01-01T09:00:00Z',
  },
  CREATE_USER: {
    email: 'tranthib@example.com',
    password: 'securepassword123',
    name: 'Trần Thị B',
    phone: '0907654321',
    role: 'USER',
  },
  UPDATE_USER: {
    name: 'Trần Thị Bình',
    phone: '0907654322',
  },
  USER_STATS: {
    totalUsers: 1250,
    activeUsers: 890,
    newUsersThisMonth: 65,
    usersByRole: {
      USER: 1230,
      ADMIN: 20,
    },
    usersByStatus: {
      active: 890,
      inactive: 360,
    },
    topLocations: [
      { city: 'TP.HCM', count: 456 },
      { city: 'Hà Nội', count: 234 },
      { city: 'Đà Nẵng', count: 123 },
    ],
    growthRate: 5.2, // percentage
  },
  ACTIVITY_STATS: {
    period: '30 days',
    dailyActiveUsers: [
      { date: '2024-01-01', count: 45 },
      { date: '2024-01-02', count: 52 },
      { date: '2024-01-03', count: 38 },
    ],
    loginsByHour: {
      '08': 23,
      '09': 45,
      '10': 67,
      '11': 54,
      '12': 43,
      '13': 38,
      '14': 56,
      '15': 62,
      '16': 48,
      '17': 39,
      '18': 67,
      '19': 78,
      '20': 89,
      '21': 65,
      '22': 34,
    },
    averageSessionDuration: '12 minutes',
    topActions: [
      { action: 'view_product', count: 2345 },
      { action: 'add_to_cart', count: 456 },
      { action: 'checkout', count: 123 },
      { action: 'search', count: 789 },
    ],
  },
};

// File examples
export const FileExamples = {
  UPLOADED_FILE: {
    id: 'file_abc123',
    filename: 'product-image.jpg',
    originalName: 'loa-karaoke-pro-3000.jpg',
    mimeType: 'image/jpeg',
    size: 2048576, // 2MB in bytes
    url: 'https://cdn.audiotailoc.com/uploads/products/file_abc123.jpg',
    thumbnailUrl: 'https://cdn.audiotailoc.com/uploads/products/thumbs/file_abc123_thumb.jpg',
    type: 'product-image',
    metadata: {
      width: 1920,
      height: 1080,
      format: 'JPEG',
      colorSpace: 'sRGB',
    },
    uploadedBy: 'user_admin001',
    associatedWith: {
      type: 'product',
      id: 'prod_speaker_001',
    },
    storage: {
      provider: 'aws-s3',
      bucket: 'audiotailoc-assets',
      key: 'uploads/products/file_abc123.jpg',
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  USER_AVATAR: {
    id: 'file_avatar456',
    filename: 'avatar.jpg',
    originalName: 'my-photo.jpg',
    mimeType: 'image/jpeg',
    size: 512000, // 500KB
    url: 'https://cdn.audiotailoc.com/uploads/avatars/file_avatar456.jpg',
    thumbnailUrl: 'https://cdn.audiotailoc.com/uploads/avatars/thumbs/file_avatar456_thumb.jpg',
    type: 'user-avatar',
    metadata: {
      width: 400,
      height: 400,
      format: 'JPEG',
      colorSpace: 'sRGB',
    },
    uploadedBy: 'user_nguyenvana',
    associatedWith: {
      type: 'user',
      id: 'user_nguyenvana',
    },
    createdAt: '2024-01-01T09:30:00Z',
    updatedAt: '2024-01-01T09:30:00Z',
  },
  MULTIPLE_FILES: [
    {
      id: 'file_doc001',
      filename: 'manual.pdf',
      originalName: 'huong-dan-su-dung-loa.pdf',
      mimeType: 'application/pdf',
      size: 1024000, // 1MB
      url: 'https://cdn.audiotailoc.com/uploads/documents/file_doc001.pdf',
      type: 'document',
    },
    {
      id: 'file_img002',
      filename: 'gallery-1.jpg',
      originalName: 'san-pham-trong-su-dung.jpg',
      mimeType: 'image/jpeg',
      size: 1536000, // 1.5MB
      url: 'https://cdn.audiotailoc.com/uploads/gallery/file_img002.jpg',
      type: 'gallery-image',
    },
  ],
  FILE_STATS: {
    totalFiles: 2456,
    totalSize: '15.6 GB',
    filesByType: {
      'product-image': 1234,
      'user-avatar': 890,
      document: 234,
      'gallery-image': 98,
    },
    storageUsage: {
      used: '15.6 GB',
      limit: '100 GB',
      percentage: 15.6,
    },
    recentUploads: 45,
    popularTypes: [
      { type: 'image/jpeg', count: 1456 },
      { type: 'image/png', count: 567 },
      { type: 'application/pdf', count: 234 },
    ],
  },
};

// Admin examples
export const AdminExamples = {
  DASHBOARD_OVERVIEW: {
    overview: {
      totalUsers: 1250,
      totalProducts: 456,
      totalOrders: 2890,
      totalRevenue: 156789000000, // 1,567,890,000 VND in cents
      newUsers: 65,
      newOrders: 145,
      pendingOrders: 23,
      lowStockProducts: 8,
    },
    recentActivities: {
      orders: [
        {
          id: 'order_ORD123',
          totalAmount: 27000000,
          status: 'pending',
          createdAt: '2024-01-01T10:30:00Z',
          user: {
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
          },
        },
      ],
      users: [
        {
          id: 'user_abc123',
          name: 'Trần Thị B',
          email: 'tranthib@example.com',
          createdAt: '2024-01-01T09:15:00Z',
        },
      ],
    },
    period: {
      startDate: '2023-12-02T00:00:00Z',
      endDate: '2024-01-01T23:59:59Z',
    },
  },
  BULK_ACTION_REQUEST: {
    action: 'activate',
    ids: ['user_123', 'user_456', 'user_789'],
    type: 'users',
  },
  BULK_ACTION_RESPONSE: {
    success: true,
    message: 'Bulk action completed successfully',
    processed: 3,
    failed: 0,
    results: [
      { id: 'user_123', status: 'success' },
      { id: 'user_456', status: 'success' },
      { id: 'user_789', status: 'success' },
    ],
  },
  SYSTEM_STATUS: {
    status: 'healthy',
    uptime: '15 days, 6 hours, 23 minutes',
    version: '1.0.0',
    environment: 'production',
    database: {
      status: 'connected',
      responseTime: '12ms',
      connections: {
        active: 5,
        max: 100,
      },
    },
    cache: {
      status: 'connected',
      hitRate: '94.5%',
      memoryUsage: '256MB / 1GB',
    },
    storage: {
      used: '15.6GB',
      available: '84.4GB',
      percentage: 15.6,
    },
  },
};

// Inventory examples
export const InventoryExamples = {
  INVENTORY_LIST: {
    success: true,
    data: {
      items: [
        {
          id: 'inv_001',
          productId: 'prod_speaker_001',
          productName: 'Loa Karaoke SONY Pro X1',
          sku: 'SONY-PRO-X1',
          currentStock: 45,
          reservedStock: 8,
          availableStock: 37,
          lowStockThreshold: 10,
          status: 'in_stock',
          lastRestocked: '2024-01-01T10:00:00Z',
          movements: [
            {
              type: 'restock',
              quantity: 50,
              date: '2024-01-01T10:00:00Z',
              note: 'Nhập kho từ nhà cung cấp SONY',
            },
            {
              type: 'sale',
              quantity: -5,
              date: '2024-01-02T14:30:00Z',
              note: 'Bán cho khách hàng Nguyễn Văn A',
            },
          ],
        },
        {
          id: 'inv_002',
          productId: 'prod_mic_002',
          productName: 'Micro không dây Shure SM58',
          sku: 'SHURE-SM58-WL',
          currentStock: 8,
          reservedStock: 3,
          availableStock: 5,
          lowStockThreshold: 10,
          status: 'low_stock',
          alert: 'Cần nhập thêm hàng',
          lastRestocked: '2023-12-28T09:00:00Z',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 156,
        totalPages: 8,
      },
      summary: {
        totalProducts: 156,
        lowStockProducts: 12,
        outOfStockProducts: 3,
        totalValue: 567890000000,
      },
    },
  },
  INVENTORY_ADJUSTMENT: {
    success: true,
    data: {
      id: 'inv_001',
      productId: 'prod_speaker_001',
      adjustments: {
        stockDelta: 20,
        reservedDelta: -2,
        previousStock: 45,
        newStock: 65,
        previousReserved: 8,
        newReserved: 6,
      },
      reason: 'Nhập hàng từ nhà cung cấp',
      adjustedBy: 'admin_user123',
      adjustedAt: '2024-01-01T15:30:00Z',
    },
    message: 'Inventory adjusted successfully',
  },
  LOW_STOCK_ALERT: {
    success: true,
    data: {
      alertProducts: [
        {
          productId: 'prod_mic_002',
          productName: 'Micro không dây Shure SM58',
          currentStock: 8,
          lowStockThreshold: 10,
          recommendedRestock: 25,
          supplier: 'Shure Vietnam',
          lastOrder: '2023-12-28T09:00:00Z',
        },
        {
          productId: 'prod_cable_003',
          productName: 'Cáp âm thanh XLR 5m',
          currentStock: 5,
          lowStockThreshold: 15,
          recommendedRestock: 50,
          supplier: 'Audio Tech VN',
          lastOrder: '2023-12-25T14:00:00Z',
        },
      ],
      totalAlerts: 12,
      urgentAlerts: 3,
    },
  },
};

// Notification examples
export const NotificationExamples = {
  NOTIFICATION_LIST: {
    success: true,
    data: {
      notifications: [
        {
          id: 'notif_001',
          type: 'order_update',
          title: 'Đơn hàng đã được xác nhận',
          message: 'Đơn hàng #ATL-2025-001234 của bạn đã được xác nhận và đang chuẩn bị giao.',
          priority: 'medium',
          isRead: false,
          userId: 'user_nguyenvana',
          data: {
            orderId: 'order_ATL001234',
            orderStatus: 'confirmed',
          },
          createdAt: '2024-01-01T10:30:00Z',
          readAt: null,
        },
        {
          id: 'notif_002',
          type: 'promotion',
          title: 'Khuyến mãi đặc biệt dành cho bạn!',
          message: 'Giảm 20% cho tất cả loa karaoke Sony. Áp dụng đến hết ngày 31/01/2024.',
          priority: 'low',
          isRead: true,
          userId: 'user_nguyenvana',
          data: {
            promotionCode: 'SONY20',
            validUntil: '2024-01-31T23:59:59Z',
          },
          createdAt: '2024-01-01T09:00:00Z',
          readAt: '2024-01-01T10:15:00Z',
        },
        {
          id: 'notif_003',
          type: 'system',
          title: 'Bảo trì hệ thống',
          message: 'Hệ thống sẽ bảo trì từ 02:00-04:00 ngày 02/01/2024. Cảm ơn sự thông cảm!',
          priority: 'high',
          isRead: false,
          userId: null, // Broadcast notification
          data: {
            maintenanceStart: '2024-01-02T02:00:00Z',
            maintenanceEnd: '2024-01-02T04:00:00Z',
          },
          createdAt: '2024-01-01T08:00:00Z',
          readAt: null,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 45,
        totalPages: 3,
      },
      summary: {
        total: 45,
        unread: 23,
        byType: {
          order_update: 15,
          promotion: 12,
          system: 8,
          payment: 6,
          shipping: 4,
        },
      },
    },
  },
  SEND_NOTIFICATION: {
    success: true,
    data: {
      id: 'notif_004',
      type: 'custom',
      title: 'Thông báo từ admin',
      message: 'Chúc mừng bạn đã trở thành khách hàng VIP!',
      priority: 'medium',
      recipients: ['user_nguyenvana', 'user_tranthib'],
      scheduledAt: '2024-01-01T15:00:00Z',
      status: 'sent',
      deliveryStats: {
        sent: 2,
        delivered: 2,
        failed: 0,
      },
    },
    message: 'Notification sent successfully',
  },
  NOTIFICATION_PREFERENCES: {
    success: true,
    data: {
      userId: 'user_nguyenvana',
      preferences: {
        email: {
          enabled: true,
          types: ['order_update', 'payment', 'system'],
        },
        push: {
          enabled: true,
          types: ['order_update', 'promotion', 'system'],
        },
        sms: {
          enabled: false,
          types: ['order_update'],
        },
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
        timezone: 'Asia/Ho_Chi_Minh',
      },
      language: 'vi',
      updatedAt: '2024-01-01T10:00:00Z',
    },
  },
};

// Marketing examples
export const MarketingExamples = {
  CAMPAIGNS_LIST: {
    success: true,
    data: {
      campaigns: [
        {
          id: 'camp_001',
          name: 'Khuyến mãi Tết 2024',
          type: 'seasonal',
          status: 'active',
          description: 'Giảm giá đặc biệt cho dịp Tết Nguyên đán',
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-02-15T23:59:59Z',
          budget: 50000000, // 500M VND
          spent: 15000000, // 150M VND
          targeting: {
            ageRange: '25-45',
            location: ['TP.HCM', 'Hà Nội', 'Đà Nẵng'],
            interests: ['karaoke', 'âm nhạc', 'giải trí'],
          },
          offers: [
            {
              type: 'percentage',
              value: 20,
              category: 'Loa karaoke',
              conditions: 'Đơn hàng từ 5 triệu',
            },
            {
              type: 'fixed_amount',
              value: 500000,
              category: 'Micro',
              conditions: 'Mua kèm loa',
            },
          ],
          performance: {
            impressions: 125000,
            clicks: 8500,
            conversions: 234,
            revenue: 45600000,
            ctr: 6.8,
            conversionRate: 2.75,
            roas: 3.04,
          },
        },
        {
          id: 'camp_002',
          name: 'Flash Sale Cuối Tuần',
          type: 'flash_sale',
          status: 'scheduled',
          description: 'Sale nhanh 48h cho sản phẩm hot',
          startDate: '2024-01-06T09:00:00Z',
          endDate: '2024-01-07T21:00:00Z',
          budget: 20000000,
          targeting: {
            segment: 'loyal_customers',
            purchaseHistory: 'last_6_months',
          },
          offers: [
            {
              type: 'percentage',
              value: 35,
              products: ['prod_speaker_001', 'prod_mic_002'],
              conditions: 'Số lượng có hạn',
            },
          ],
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 12,
        totalPages: 1,
      },
      summary: {
        totalCampaigns: 12,
        activeCampaigns: 8,
        totalBudget: 250000000,
        totalSpent: 89000000,
        averageRoas: 2.85,
      },
    },
  },
  CAMPAIGN_ANALYTICS: {
    success: true,
    data: {
      campaignId: 'camp_001',
      period: {
        start: '2024-01-15T00:00:00Z',
        end: '2024-01-31T23:59:59Z',
      },
      metrics: {
        reach: 85000,
        impressions: 125000,
        clicks: 8500,
        ctr: 6.8,
        conversions: 234,
        conversionRate: 2.75,
        revenue: 45600000,
        roas: 3.04,
        costPerClick: 1765,
        costPerConversion: 64103,
      },
      topProducts: [
        {
          productId: 'prod_speaker_001',
          productName: 'Loa Karaoke SONY Pro X1',
          clicks: 2340,
          conversions: 89,
          revenue: 18900000,
        },
        {
          productId: 'prod_mic_002',
          productName: 'Micro không dây Shure SM58',
          clicks: 1890,
          conversions: 67,
          revenue: 12300000,
        },
      ],
      audienceInsights: {
        demographics: {
          age: {
            '25-34': 45,
            '35-44': 32,
            '45-54': 18,
            '55+': 5,
          },
          gender: {
            male: 68,
            female: 32,
          },
        },
        geography: {
          'TP.HCM': 42,
          'Hà Nội': 28,
          'Đà Nẵng': 15,
          Khác: 15,
        },
      },
    },
  },
  PROMOTIONS_LIST: {
    success: true,
    data: {
      promotions: [
        {
          id: 'promo_001',
          code: 'SONY20',
          name: 'Giảm 20% loa Sony',
          type: 'percentage',
          value: 20,
          status: 'active',
          usageLimit: 100,
          usedCount: 67,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
          conditions: {
            minOrderValue: 5000000,
            categories: ['Loa karaoke'],
            brands: ['Sony'],
          },
          applicableProducts: 45,
          totalSavings: 23400000,
        },
        {
          id: 'promo_002',
          code: 'FREESHIP',
          name: 'Miễn phí vận chuyển',
          type: 'free_shipping',
          status: 'active',
          usageLimit: null,
          usedCount: 234,
          conditions: {
            minOrderValue: 3000000,
          },
        },
      ],
      summary: {
        totalPromotions: 8,
        activePromotions: 5,
        totalSavings: 89500000,
        totalUsage: 456,
      },
    },
  },
};

// Search examples
export const SearchExamples = {
  BASIC_SEARCH: {
    success: true,
    data: {
      products: [
        {
          id: 'prod_speaker_001',
          name: 'Loa Karaoke SONY Pro X1',
          description: 'Loa karaoke chuyên nghiệp với âm thanh cực hay',
          price: 12900000,
          discountPrice: 10320000,
          category: 'Loa karaoke',
          brand: 'Sony',
          imageUrl: 'https://cdn.audiotailoc.com/products/sony-pro-x1.jpg',
          rating: 4.8,
          reviewCount: 234,
          inStock: true,
          featured: true,
          relevanceScore: 0.95,
        },
        {
          id: 'prod_mic_002',
          name: 'Micro không dây Shure SM58',
          description: 'Micro karaoke không dây chất lượng cao',
          price: 4500000,
          discountPrice: null,
          category: 'Micro',
          brand: 'Shure',
          imageUrl: 'https://cdn.audiotailoc.com/products/shure-sm58.jpg',
          rating: 4.9,
          reviewCount: 189,
          inStock: true,
          featured: false,
          relevanceScore: 0.87,
        },
      ],
      services: [
        {
          id: 'serv_001',
          name: 'Lắp đặt hệ thống karaoke tại nhà',
          description: 'Dịch vụ lắp đặt và cài đặt hệ thống karaoke chuyên nghiệp',
          price: 2000000,
          category: 'Lắp đặt',
          rating: 4.7,
          relevanceScore: 0.76,
        },
      ],
      total: 3,
      query: 'loa karaoke',
      searchTime: '45ms',
      suggestions: ['loa sony', 'loa bluetooth', 'karaoke gia đình'],
    },
  },
  PRODUCT_SEARCH: {
    success: true,
    data: {
      products: [
        {
          id: 'prod_speaker_001',
          name: 'Loa Karaoke SONY Pro X1',
          sku: 'SONY-PRO-X1',
          description: 'Loa karaoke chuyên nghiệp với công suất 500W',
          price: 12900000,
          discountPrice: 10320000,
          discountPercent: 20,
          category: {
            id: 'cat_speakers',
            name: 'Loa karaoke',
            slug: 'loa-karaoke',
          },
          brand: 'Sony',
          specifications: {
            power: '500W',
            frequency: '50Hz - 20kHz',
            connectivity: ['Bluetooth', 'USB', 'AUX'],
          },
          images: [
            'https://cdn.audiotailoc.com/products/sony-pro-x1-1.jpg',
            'https://cdn.audiotailoc.com/products/sony-pro-x1-2.jpg',
          ],
          rating: 4.8,
          reviewCount: 234,
          inStock: true,
          stockCount: 45,
          featured: true,
          tags: ['karaoke', 'bluetooth', 'chuyên nghiệp'],
          createdAt: '2023-12-01T10:00:00Z',
        },
      ],
      filters: {
        categories: [
          { id: 'cat_speakers', name: 'Loa karaoke', count: 145 },
          { id: 'cat_mics', name: 'Micro', count: 89 },
        ],
        brands: [
          { name: 'Sony', count: 67 },
          { name: 'Shure', count: 45 },
        ],
        priceRanges: [
          { min: 0, max: 5000000, count: 78 },
          { min: 5000000, max: 10000000, count: 156 },
          { min: 10000000, max: 20000000, count: 89 },
        ],
      },
      pagination: {
        page: 1,
        limit: 20,
        total: 234,
        totalPages: 12,
      },
      sorting: {
        sortBy: 'relevance',
        sortOrder: 'desc',
        availableSort: ['relevance', 'price', 'rating', 'newest'],
      },
      searchTime: '78ms',
    },
  },
  SEARCH_SUGGESTIONS: {
    success: true,
    data: {
      suggestions: [
        {
          text: 'loa karaoke sony',
          type: 'product',
          count: 67,
          category: 'Loa karaoke',
        },
        {
          text: 'micro không dây',
          type: 'product',
          count: 89,
          category: 'Micro',
        },
        {
          text: 'hệ thống karaoke gia đình',
          type: 'service',
          count: 23,
          category: 'Dịch vụ',
        },
        {
          text: 'loa bluetooth',
          type: 'product',
          count: 156,
          category: 'Loa karaoke',
        },
        {
          text: 'phụ kiện karaoke',
          type: 'product',
          count: 234,
          category: 'Phụ kiện',
        },
      ],
      trending: ['loa karaoke sony', 'micro shure', 'dây kết nối', 'âm ly karaoke', 'loa sub'],
      recent: ['loa bluetooth', 'micro không dây', 'cáp audio'],
    },
  },
};

// AI examples
export const AIExamples = {
  AI_RECOMMENDATION: {
    success: true,
    data: {
      recommendations: [
        {
          productId: 'prod_speaker_001',
          name: 'Loa Karaoke SONY Pro X1',
          price: 12900000,
          discountPrice: 10320000,
          reason: 'Dựa trên lịch sử mua hàng và sở thích âm nhạc',
          confidence: 0.92,
          category: 'Loa karaoke',
          rating: 4.8,
          imageUrl: 'https://cdn.audiotailoc.com/products/sony-pro-x1.jpg',
        },
        {
          productId: 'prod_mic_002',
          name: 'Micro không dây Shure SM58',
          price: 4500000,
          reason: 'Kết hợp hoàn hảo với loa đã xem',
          confidence: 0.87,
          category: 'Micro',
          rating: 4.9,
          imageUrl: 'https://cdn.audiotailoc.com/products/shure-sm58.jpg',
        },
      ],
      algorithm: 'collaborative_filtering',
      generatedAt: '2024-01-01T10:00:00Z',
      userId: 'user_nguyenvana',
    },
  },
  CHAT_RESPONSE: {
    success: true,
    data: {
      response:
        'Dựa trên ngân sách 15 triệu của bạn, tôi recommend bộ loa karaoke SONY Pro X1 (10.3 triệu sau giảm giá) kết hợp với micro Shure SM58 (4.5 triệu). Tổng cộng khoảng 14.8 triệu, vừa đúng ngân sách và chất lượng rất tốt cho karaoke gia đình.',
      suggestions: [
        {
          productId: 'prod_speaker_001',
          name: 'Loa Karaoke SONY Pro X1',
          price: 10320000,
        },
        {
          productId: 'prod_mic_002',
          name: 'Micro không dây Shure SM58',
          price: 4500000,
        },
      ],
      conversationId: 'conv_abc123',
      responseTime: '1.2s',
      confidence: 0.89,
    },
  },
  SMART_SEARCH: {
    success: true,
    data: {
      query: 'loa karaoke cho phòng 30m2 ngân sách 10 triệu',
      interpretedIntent: {
        productType: 'loa karaoke',
        roomSize: '30m2',
        budget: 10000000,
        purpose: 'karaoke gia đình',
      },
      recommendations: [
        {
          productId: 'prod_speaker_003',
          name: 'Loa Karaoke Yamaha KS-15',
          price: 9500000,
          suitabilityScore: 0.95,
          reasons: [
            'Phù hợp với phòng 30m2',
            'Trong ngân sách 10 triệu',
            'Chất lượng âm thanh tốt cho karaoke',
          ],
        },
      ],
      alternatives: [
        {
          productId: 'prod_speaker_001',
          name: 'Loa Karaoke SONY Pro X1',
          price: 10320000,
          note: 'Vượt ngân sách 320k nhưng chất lượng cao hơn',
        },
      ],
      processingTime: '850ms',
    },
  },
};

// Booking examples
export const BookingExamples = {
  BOOKING_LIST: {
    success: true,
    data: {
      bookings: [
        {
          id: 'book_001',
          type: 'installation',
          status: 'confirmed',
          title: 'Lắp đặt hệ thống karaoke gia đình',
          description: 'Lắp đặt bộ loa Sony Pro X1 + micro Shure SM58',
          customer: {
            id: 'user_nguyenvana',
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            email: 'nguyenvana@example.com',
          },
          technician: {
            id: 'tech_001',
            name: 'Trần Văn B',
            phone: '0907654321',
            rating: 4.8,
          },
          address: {
            street: '123 Nguyễn Văn Linh',
            ward: 'Phường 10',
            district: 'Quận 7',
            city: 'TP.HCM',
            coordinates: {
              lat: 10.7329,
              lng: 106.7192,
            },
          },
          scheduledDate: '2024-01-05T09:00:00Z',
          estimatedDuration: 180, // minutes
          services: [
            {
              id: 'serv_install_001',
              name: 'Lắp đặt hệ thống âm thanh',
              price: 2000000,
              duration: 120,
            },
            {
              id: 'serv_setup_001',
              name: 'Cài đặt và test âm thanh',
              price: 500000,
              duration: 60,
            },
          ],
          totalPrice: 2500000,
          equipment: [
            {
              productId: 'prod_speaker_001',
              name: 'Loa Karaoke SONY Pro X1',
              quantity: 1,
              serialNumber: 'SONY-001-2024',
            },
            {
              productId: 'prod_mic_002',
              name: 'Micro không dây Shure SM58',
              quantity: 2,
              serialNumbers: ['SHURE-001-2024', 'SHURE-002-2024'],
            },
          ],
          notes: 'Khách hàng yêu cầu test kỹ trước khi hoàn thành',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-02T14:30:00Z',
        },
        {
          id: 'book_002',
          type: 'maintenance',
          status: 'pending',
          title: 'Bảo trì định kỳ hệ thống karaoke',
          description: 'Kiểm tra và bảo trì hệ thống đã lắp 6 tháng trước',
          customer: {
            id: 'user_tranthib',
            name: 'Trần Thị B',
            phone: '0902345678',
          },
          scheduledDate: '2024-01-08T14:00:00Z',
          estimatedDuration: 90,
          services: [
            {
              id: 'serv_maint_001',
              name: 'Kiểm tra tổng thể hệ thống',
              price: 800000,
              duration: 60,
            },
            {
              id: 'serv_clean_001',
              name: 'Vệ sinh thiết bị',
              price: 300000,
              duration: 30,
            },
          ],
          totalPrice: 1100000,
          maintenanceType: 'routine',
          lastMaintenance: '2023-07-01T10:00:00Z',
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 156,
        totalPages: 8,
      },
      summary: {
        totalBookings: 156,
        pendingBookings: 23,
        confirmedBookings: 89,
        completedBookings: 44,
        todayBookings: 8,
      },
    },
  },
  CREATE_BOOKING: {
    success: true,
    data: {
      id: 'book_003',
      bookingNumber: 'ATL-BOOK-240101-003',
      type: 'installation',
      status: 'pending',
      customer: {
        name: 'Lê Văn C',
        phone: '0903456789',
        email: 'levanc@example.com',
      },
      requestedDate: '2024-01-10T10:00:00Z',
      estimatedPrice: 3000000,
      services: ['Lắp đặt hệ thống karaoke premium'],
      autoAssignment: true,
      expectedResponse: '24 hours',
      createdAt: '2024-01-01T15:00:00Z',
    },
    message: 'Booking created successfully. Our team will contact you within 24 hours.',
  },
  BOOKING_SCHEDULE: {
    success: true,
    data: {
      date: '2024-01-05',
      technicians: [
        {
          id: 'tech_001',
          name: 'Trần Văn B',
          skills: ['installation', 'maintenance'],
          rating: 4.8,
          workload: 75,
          schedule: [
            {
              timeSlot: '09:00-12:00',
              bookingId: 'book_001',
              status: 'confirmed',
              customer: 'Nguyễn Văn A',
              service: 'Lắp đặt hệ thống karaoke',
            },
            {
              timeSlot: '14:00-16:00',
              bookingId: 'book_004',
              status: 'confirmed',
              customer: 'Phạm Thị D',
              service: 'Bảo trì định kỳ',
            },
          ],
          availableSlots: ['16:30-18:00'],
        },
        {
          id: 'tech_002',
          name: 'Lê Thành C',
          skills: ['maintenance', 'repair'],
          rating: 4.6,
          workload: 50,
          availableSlots: ['09:00-12:00', '14:00-17:00'],
        },
      ],
      summary: {
        totalBookings: 8,
        availableTechnicians: 5,
        utilizationRate: 62.5,
      },
    },
  },
};

// Customer examples
export const CustomerExamples = {
  CUSTOMER_PROFILE: {
    success: true,
    data: {
      id: 'user_nguyenvana',
      profile: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        dateOfBirth: '1985-05-15',
        gender: 'male',
        avatar: 'https://cdn.audiotailoc.com/avatars/user_nguyenvana.jpg',
      },
      address: {
        primary: {
          street: '123 Nguyễn Văn Linh',
          ward: 'Phường 10',
          district: 'Quận 7',
          city: 'TP.HCM',
          postalCode: '70000',
          isDefault: true,
        },
        shipping: [
          {
            id: 'addr_001',
            name: 'Nhà riêng',
            street: '123 Nguyễn Văn Linh',
            ward: 'Phường 10',
            district: 'Quận 7',
            city: 'TP.HCM',
          },
        ],
      },
      preferences: {
        categories: ['Loa karaoke', 'Micro'],
        brands: ['Sony', 'Shure'],
        priceRange: {
          min: 5000000,
          max: 20000000,
        },
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      },
      loyaltyProgram: {
        tier: 'Gold',
        points: 2850,
        benefits: ['Giảm 10%', 'Freeship', 'Bảo hành mở rộng'],
      },
      statistics: {
        totalOrders: 8,
        totalSpent: 45600000,
        averageOrderValue: 5700000,
        favoriteCategory: 'Loa karaoke',
      },
    },
  },
  CUSTOMER_INSIGHTS: {
    success: true,
    data: {
      segment: 'High Value Customer',
      lifetimeValue: 78500000,
      predictedNextPurchase: '2024-02-15T10:00:00Z',
      recommendations: [
        {
          type: 'product',
          productId: 'prod_cable_003',
          reason: 'Phụ kiện bổ sung cho hệ thống hiện tại',
          confidence: 0.87,
        },
      ],
      behaviorPatterns: {
        preferredShoppingTime: 'weekend_morning',
        seasonalTrends: ['Tết', 'Black Friday'],
        brandLoyalty: 'high',
      },
    },
  },
};

// Pages examples
export const PagesExamples = {
  PAGES_LIST: {
    success: true,
    data: {
      pages: [
        {
          id: 'page_001',
          title: 'Giới thiệu Audio Tài Lộc',
          slug: 'gioi-thieu',
          type: 'static',
          status: 'published',
          content: {
            summary: 'Chuyên cung cấp thiết bị âm thanh karaoke chất lượng cao...',
          },
          seo: {
            metaTitle: 'Giới thiệu Audio Tài Lộc - Chuyên gia thiết bị karaoke',
            metaDescription:
              'Tìm hiểu về Audio Tài Lộc - đơn vị hàng đầu cung cấp thiết bị âm thanh karaoke chất lượng cao.',
          },
          createdAt: '2023-01-15T10:00:00Z',
          views: 15650,
          featured: true,
        },
        {
          id: 'page_002',
          title: 'Hướng dẫn sử dụng loa karaoke',
          slug: 'huong-dan-su-dung-loa-karaoke',
          type: 'guide',
          status: 'published',
          category: {
            id: 'cat_guides',
            name: 'Hướng dẫn sử dụng',
          },
          tags: ['loa karaoke', 'hướng dẫn'],
          readingTime: 8,
          views: 8920,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 78,
        totalPages: 4,
      },
    },
  },
};

// Monitoring examples
export const MonitoringExamples = {
  HEALTH_CHECK: {
    success: true,
    data: {
      status: 'healthy',
      timestamp: '2024-01-01T10:00:00Z',
      uptime: 864000,
      version: '1.0.0',
      environment: 'production',
      components: {
        database: {
          status: 'healthy',
          responseTime: '12ms',
          connections: {
            active: 5,
            max: 100,
          },
        },
        redis: {
          status: 'healthy',
          responseTime: '3ms',
          memory: {
            used: '256MB',
            max: '1GB',
          },
        },
        storage: {
          status: 'healthy',
          disk: {
            used: '15.6GB',
            available: '84.4GB',
          },
        },
      },
    },
  },
};
