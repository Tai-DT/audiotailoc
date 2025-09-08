// Common Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'STAFF';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  category: ServiceCategory;
  type: ServiceType;
  basePriceCents: number;
  estimatedDuration: number; // in minutes
  isActive: boolean;
  isPopular?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'AUDIO_EQUIPMENT'
  | 'HOME_THEATER'
  | 'PROFESSIONAL_SOUND'
  | 'LIGHTING'
  | 'CONSULTATION'
  | 'MAINTENANCE'
  | 'OTHER';

export type ServiceType = 
  | 'AUDIO_EQUIPMENT'
  | 'HOME_THEATER'
  | 'PROFESSIONAL_SOUND'
  | 'LIGHTING'
  | 'CONSULTATION'
  | 'MAINTENANCE'
  | 'OTHER';

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  category: string;
  price: number;
  comparePrice?: number;
  isActive: boolean;
  inStock: boolean;
  stockQuantity: number;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  createdAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED' 
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

// Address Types
export interface Address {
  id?: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  ward: string;
  district: string;
  province: string;
  postalCode?: string;
  isDefault?: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  id: string;
  service: Service;
  customer: User;
  scheduledDate: string;
  status: BookingStatus;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// Search Types
export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: [number, number];
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}
