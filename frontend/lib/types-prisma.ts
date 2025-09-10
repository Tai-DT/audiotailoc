// TypeScript types aligned with Prisma schema for Audio Tài Lộc Frontend

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  parent?: Category;
  children?: Category[];
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number; // Price in VND
  priceCents: number; // Deprecated, kept for compatibility
  originalPrice?: number; // Original price in VND
  originalPriceCents?: number; // Deprecated, kept for compatibility
  imageUrl?: string;
  images?: string[]; // JSON array of image URLs
  categoryId?: string;
  brand?: string;
  model?: string;
  sku?: string;
  specifications?: Record<string, any>; // JSON specifications
  features?: string;
  warranty?: string;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  tags?: string;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  
  featured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  category?: Category;
  reviews?: ProductReview[];
  inventory?: Inventory;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  product: Product;
}

export interface Cart {
  id: string;
  userId?: string;
  guestId?: string;
  status: string;
  expiresAt?: Date;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  status: string;
  shippingAddress?: string;
  shippingCoordinates?: string;
  promotionCode?: string;
  items: OrderItem[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
  user: User;
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
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  intentId?: string;
  provider: string;
  amountCents: number;
  status: string;
  transactionId?: string;
  metadata?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  priceCents: number;
  durationMinutes?: number;
  imageUrl?: string;
  categoryId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: ServiceCategory;
  bookings?: ServiceBooking[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  services?: Service[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceBooking {
  id: string;
  userId: string;
  serviceId: string;
  scheduledAt: Date;
  status: string;
  notes?: string;
  totalCents: number;
  user: User;
  service: Service;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  user: User;
  product: Product;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  url?: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface CheckoutFormData {
  shippingAddress: string;
  phone: string;
  notes?: string;
  paymentMethod: string;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// UI State types
export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error?: string;
  total: number;
}

export interface AuthState {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

export interface ProductState {
  products: Product[];
  currentProduct?: Product;
  categories: Category[];
  filters: ProductFilters;
  isLoading: boolean;
  error?: string;
}

// Utility types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
