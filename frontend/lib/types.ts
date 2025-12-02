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
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  address?: string;
  dateOfBirth?: string;
  gender?: string;
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
  specifications?: ProductSpecification[] | Record<string, string>;
  features?: string[] | string;
  warranty?: string;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  tags?: string[];

  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;

  featured?: boolean;
  isActive: boolean;
  viewCount?: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  category?: Category;
  reviews?: ProductReview[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  canonicalUrl?: string;
  description?: string;
  imageUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaTitle?: string;
  parent?: Category;
  children?: Category[];
  products?: Product[];
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

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number; // This is BigInt in Prisma but we'll use number in TypeScript
  createdAt: string;
  updatedAt: string;
  product?: Product;
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

  // SEO properties
  seoTitle?: string;
  metaTitle?: string;
  seoDescription?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;

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
  images?: string[];
  isVerified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  upvotes: number;
  downvotes: number;
  response?: string;
  helpfulCount?: number;
  createdAt: string;
  updatedAt: string;

  user?: User;
  product?: Product;
  userName?: string;
  productName?: string;
  reportCount?: number;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  categories?: Category[];
  products?: Product[];
  customerSegments?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
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
  secondaryButtonLabel?: string;
  secondaryButtonUrl?: string;
  page: string;
  position: number;
  locale?: string;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
  stats?: string;
  isDeleted: boolean;
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
  featured?: boolean;
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

  // For reviews endpoint specifically
  reviews?: T[];
  stats?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  };
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

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  viewCount: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAuthor {
  id: string;
  name?: string | null;
  email: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  parent?: BlogCategory | null;
  children?: BlogCategory[];
  _count?: {
    articles: number;
    children: number;
  };
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  categoryId: string;
  authorId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  tags?: string[];
  canonicalUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: BlogCategory;
  author?: BlogAuthor;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedBlogResponse<T> {
  data: T[];
  pagination: PaginationMeta;
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


export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  createdAt: string;
  product?: Product;
}

export interface CreateWishlistItemDto {
  productId: string;
}