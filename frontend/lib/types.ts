// Common types for the Audio Tài Lộc frontend

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  priceCents: number;
  originalPriceCents?: number;
  imageUrl?: string;
  images?: string[];
  categoryId?: string;
  brand?: string;
  model?: string;
  sku?: string;
  specifications?: ProductSpecification[];
  features?: string[];
  warranty?: string;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  tags?: string[];
  
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  
  featured: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  category?: Category;
  reviews?: ProductReview[];
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  parent?: Category;
  children?: Category[];
  products?: Product[];
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  
  product: Product;
}

export interface Cart {
  id: string;
  userId?: string;
  guestId?: string;
  status: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  
  items: CartItem[];
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  shippingAddress?: string;
  promotionCode?: string;
  createdAt: string;
  updatedAt: string;
  
  user: User;
  items: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  unitPrice?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  
  product: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  amountCents: number;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  priceType: 'FIXED' | 'RANGE' | 'NEGOTIABLE' | 'CONTACT';
  duration: number;
  typeId?: string;
  images?: string[];
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  features?: string[];
  requirements?: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  
  serviceType?: ServiceType;
}

export interface ServiceType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  
  services?: Service[];
}

export interface ServiceBooking {
  id: string;
  userId: string;
  serviceId: string;
  technicianId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledAt?: string;
  notes?: string;
  estimatedCosts?: number;
  actualCosts?: number;
  createdAt: string;
  updatedAt: string;
  
  user: User;
  service: Service;
}

export interface ProductReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  
  user: User;
  product: Product;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  buttonLabel?: string;
  page: string;
  position: number;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  client?: string;
  category?: string;
  technologies?: string[];
  features?: string[];
  images?: string[];
  thumbnailImage?: string;
  coverImage?: string;
  youtubeVideoId?: string;
  demoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface DashboardOverview {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    newUsers: number;
    newOrders: number;
    pendingOrders: number;
    lowStockProducts: number;
  };
  recentActivities: {
    orders: Order[];
    users: User[];
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface SalesAnalytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowth: number;
  topSellingProducts: Product[];
  salesByPeriod: Array<{
    period: string;
    sales: number;
    orders: number;
  }>;
  salesByCategory: Record<string, number>;
  conversionRate: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  customerSegments: Record<string, number>;
  topCustomers: User[];
  churnRate: number;
  retentionRate: number;
}

export interface InventoryAnalytics {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  inventoryTurnover: number;
  stockValue: number;
  slowMovingItems: Product[];
  fastMovingItems: Product[];
  stockMovement: Array<{
    date: string;
    stockIn: number;
    stockOut: number;
  }>;
}

export interface BusinessKPIs {
  revenue: {
    current: number;
    target: number;
    growth: number;
  };
  orders: {
    current: number;
    target: number;
    growth: number;
  };
  customers: {
    acquisition: number;
    retention: number;
    satisfaction: number;
  };
  operational: {
    fulfillmentTime: number;
    returnRate: number;
    supportTickets: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface ProductForm {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  priceCents: number;
  originalPriceCents?: number;
  imageUrl?: string;
  images?: string[];
  categoryId?: string;
  brand?: string;
  model?: string;
  sku?: string;
  specifications?: ProductSpecification[];
  features?: string[];
  warranty?: string;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  featured: boolean;
  isActive: boolean;
}

export interface CategoryForm {
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
}

export interface ServiceForm {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  priceType: 'FIXED' | 'RANGE' | 'NEGOTIABLE' | 'CONTACT';
  duration: number;
  typeId?: string;
  images?: string[];
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  features?: string[];
  requirements?: string[];
}

export interface ServiceBookingForm {
  serviceId: string;
  scheduledAt?: string;
  notes?: string;
  estimatedCosts?: number;
}

// Filter and search types
export interface ProductFilters {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  brand?: string;
  featured?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  tags?: string;
  sortBy?: 'createdAt' | 'name' | 'price' | 'updatedAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface OrderFilters {
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'totalCents' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ServiceFilters {
  q?: string;
  typeId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: 'createdAt' | 'name' | 'price' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}


